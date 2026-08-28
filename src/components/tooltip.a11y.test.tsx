import { cleanup, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '../../dev/a11y/axe';
import { expectFocusOn, keyboard } from '../../dev/a11y/keyboard';
import { ignoreLogs } from '../../dev/tests';
import Box from '../box';
import Button from './button';
import Tooltip from './tooltip';

/**
 * The second keyboard template — the hard case, and the honest one.
 *
 * Tooltip today is a *positioning* primitive: it puts a portal where its anchor is, and leaves
 * every part of the tooltip pattern (the trigger, when to show, the role, the description wiring,
 * Escape) to the consumer. So the tests that pass here assert only what the component actually
 * promises, and the rest of the APG pattern is written down as `it.todo` — the contract A3 has to
 * satisfy — plus one test that pins today's gap so it cannot be closed silently.
 *
 * Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/
 */
describe('Tooltip accessibility', () => {
  ignoreLogs();

  afterEach(() => {
    cleanup();
  });

  // How the docs show it: the consumer owns the trigger and the open state.
  function TooltipExample() {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Box>
          <Button onClick={() => setOpen((value) => !value)}>Delete</Button>
          {open && <Tooltip p={2}>Deletes the row</Tooltip>}
        </Box>
        <Button>After</Button>
      </>
    );
  }

  const trigger = () => screen.getByRole('button', { name: 'Delete' });

  describe('Keyboard', () => {
    it('opens from the keyboard when the trigger is a button', async () => {
      const user = keyboard();
      render(<TooltipExample />);

      await user.pressTab();
      expectFocusOn(trigger());
      await user.press('Enter');

      expect(screen.getByText('Deletes the row')).toBeInTheDocument();
    });

    it('leaves focus on the trigger — the portal never steals it', async () => {
      const user = keyboard();
      render(<TooltipExample />);
      await user.pressTab();
      await user.press('Enter');

      expectFocusOn(trigger());
    });

    it('adds nothing to the tab order, so Tab still reaches the next control', async () => {
      const user = keyboard();
      render(<TooltipExample />);
      await user.pressTab();
      await user.press('Enter');

      await user.pressTab();

      expectFocusOn(screen.getByRole('button', { name: 'After' }));
    });
  });

  describe('Semantics', () => {
    it('renders its content into the portal container, outside the trigger', async () => {
      const user = keyboard();
      const { container } = render(<TooltipExample />);
      await user.click(trigger());

      const content = screen.getByText('Deletes the row');
      expect(document.getElementById('crono-box')).toContainElement(content);
      expect(container).not.toContainElement(content);
    });

    it('has no axe violations', async () => {
      const user = keyboard();
      render(<TooltipExample />);
      await user.click(trigger());

      await expectNoAxeViolations(document.body);
    });

    /**
     * Deliberately asserts the *absence* of the pattern. axe cannot see a missing role, so without
     * this the gap would be invisible to CI; when A3 wires the tooltip up, this test fails and is
     * replaced by the todos below. Same self-cleaning contract as the known-violations ledger.
     */
    it('does not implement the tooltip pattern yet (A3 owns this)', async () => {
      const user = keyboard();
      render(<TooltipExample />);
      await user.click(trigger());

      expect(screen.queryByRole('tooltip')).toBeNull();
      expect(trigger()).not.toHaveAttribute('aria-describedby');
    });

    // A3 — the APG contract this component has to meet.
    it.todo('renders role="tooltip" and points the trigger at it with aria-describedby');
    it.todo('shows on trigger focus as well as hover, after the delay');
    it.todo('dismisses on Escape while the trigger keeps focus');
    it.todo('stays open while the pointer moves onto the tooltip itself (WCAG 1.4.13)');
  });
});
