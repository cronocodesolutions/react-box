import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../../dev/a11y/axe';
import { expectFocusOn, keyboard } from '../../dev/a11y/keyboard';
import { ignoreLogs } from '../../dev/tests';
import Button from './button';
import Tooltip from './tooltip';

/**
 * The APG tooltip, end to end: https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/
 *
 * Three of these come from WCAG 1.4.13 rather than APG — dismissible, hoverable, persistent. They are the
 * ones every hand-rolled tooltip fails, and none is visible to axe: a tooltip that vanishes when you
 * reach for it has perfect markup right up to the moment it disappears.
 */
describe('Tooltip accessibility', () => {
  ignoreLogs();

  afterEach(() => {
    vi.useRealTimers();
    cleanup();
  });

  // Instant open/close, so the tests that are about the *pattern* are not also about the clock.
  // The delays get their own tests below, on fake timers.
  function TooltipExample(props: { openDelay?: number; closeDelay?: number }) {
    const { openDelay = 0, closeDelay = 0 } = props;

    return (
      <>
        <Tooltip content="Deletes the row for good" openDelay={openDelay} closeDelay={closeDelay}>
          {(trigger) => <Button {...trigger}>Delete</Button>}
        </Tooltip>
        <Button>After</Button>
      </>
    );
  }

  const trigger = () => screen.getByRole('button', { name: 'Delete' });
  const tooltip = () => screen.queryByRole('tooltip');

  describe('Semantics', () => {
    it('renders role="tooltip" and points the trigger at it with aria-describedby', async () => {
      const user = keyboard();
      render(<TooltipExample />);
      await user.hover(trigger());

      const bubble = screen.getByRole('tooltip');
      expect(bubble).toHaveTextContent('Deletes the row for good');
      expect(trigger()).toHaveAttribute('aria-describedby', bubble.id);
      // What the whole wiring is for: the trigger reads as "Delete, Deletes the row for good".
      expect(trigger()).toHaveAccessibleDescription('Deletes the row for good');
    });

    it('describes nothing while it is closed', () => {
      render(<TooltipExample />);

      expect(tooltip()).toBeNull();
      expect(trigger()).not.toHaveAttribute('aria-describedby');
    });

    it('renders its content into the portal container, outside the trigger', async () => {
      const user = keyboard();
      const { container } = render(<TooltipExample />);
      await user.hover(trigger());

      const bubble = screen.getByRole('tooltip');
      expect(document.getElementById('crono-box')).toContainElement(bubble);
      expect(container).not.toContainElement(bubble);
    });

    it('has no axe violations, open or closed', async () => {
      const user = keyboard();
      render(<TooltipExample />);

      await expectNoAxeViolations(document.body);

      await user.hover(trigger());
      await expectNoAxeViolations(document.body);
    });
  });

  describe('Keyboard', () => {
    it('shows on trigger focus as well as hover, and without waiting for the delay', async () => {
      const user = keyboard();
      render(<TooltipExample openDelay={10_000} />);

      await user.pressTab();

      expectFocusOn(trigger());
      expect(tooltip()).not.toBeNull();
    });

    it('dismisses on Escape while the trigger keeps focus', async () => {
      const user = keyboard();
      render(<TooltipExample />);
      await user.pressTab();

      await user.press('Escape');

      await waitFor(() => expect(tooltip()).toBeNull());
      expectFocusOn(trigger());
    });

    it('stays dismissed while the pointer sits still, and comes back once it leaves and returns', async () => {
      const user = keyboard();
      render(<TooltipExample />);
      await user.hover(trigger());

      await user.press('Escape');
      await waitFor(() => expect(tooltip()).toBeNull());

      // Still hovering: re-showing here would trap the user in the tooltip they just dismissed.
      await user.hover(trigger());
      expect(tooltip()).toBeNull();

      await user.unhover(trigger());
      await user.hover(trigger());
      expect(tooltip()).not.toBeNull();
    });

    it('closes when focus moves on', async () => {
      const user = keyboard();
      render(<TooltipExample />);
      await user.pressTab();

      await user.pressTab();

      await waitFor(() => expect(tooltip()).toBeNull());
    });

    it('adds nothing to the tab order, so Tab still reaches the next control', async () => {
      const user = keyboard();
      render(<TooltipExample />);
      await user.pressTab();

      await user.pressTab();

      expectFocusOn(screen.getByRole('button', { name: 'After' }));
    });
  });

  describe('Pointer (WCAG 1.4.13)', () => {
    // fireEvent, not user-event: user-event schedules its own work on timers, and these three
    // tests are precisely about what the clock does. React synthesizes `onPointerEnter` from
    // `pointerover`, which is why these are `pointerOver`/`pointerOut` and not `pointerEnter`.
    const advance = (ms: number) => act(() => void vi.advanceTimersByTime(ms));

    function renderWithFakeTimers(ui: React.ReactElement) {
      vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });

      return render(ui);
    }

    it('opens on hover only after the delay has passed', () => {
      renderWithFakeTimers(<TooltipExample openDelay={500} closeDelay={150} />);

      fireEvent.pointerOver(trigger());
      advance(499);
      expect(tooltip()).toBeNull();

      advance(1);
      expect(tooltip()).not.toBeNull();
    });

    it('never opens when the pointer passes straight over the trigger', () => {
      renderWithFakeTimers(<TooltipExample openDelay={500} closeDelay={150} />);

      fireEvent.pointerOver(trigger());
      advance(200);
      fireEvent.pointerOut(trigger());
      advance(1000);

      expect(tooltip()).toBeNull();
    });

    it('stays open while the pointer moves onto the tooltip itself', () => {
      renderWithFakeTimers(<TooltipExample openDelay={0} closeDelay={150} />);
      fireEvent.pointerOver(trigger());

      // The gap between the trigger and the bubble is what the grace period is for: leaving the
      // trigger starts a close that arriving on the bubble has to cancel.
      fireEvent.pointerOut(trigger());
      advance(100);
      fireEvent.pointerOver(screen.getByRole('tooltip'));
      advance(1000);

      expect(tooltip()).not.toBeNull();

      fireEvent.pointerOut(screen.getByRole('tooltip'));
      advance(150);

      // Closed, but still mounted: <Presence> holds the bubble for the transition it measured.
      advance(300);
      expect(tooltip()).toBeNull();
    });

    it('is persistent — it never hides itself on a timer', () => {
      renderWithFakeTimers(<TooltipExample openDelay={0} closeDelay={150} />);
      fireEvent.pointerOver(trigger());

      advance(60_000);

      expect(tooltip()).not.toBeNull();
    });
  });
});
