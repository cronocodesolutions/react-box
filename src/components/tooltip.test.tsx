import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ignoreLogs } from '../../dev/tests';
import Button from './button';
import Flex from './flex';
import Tooltip, { TooltipReason } from './tooltip';

/**
 * The API around the pattern — the parts a consumer wires up rather than the parts a screen reader
 * sees. `tooltip.a11y.test.tsx` owns the pattern itself.
 */
describe('Tooltip', () => {
  ignoreLogs();

  afterEach(() => {
    cleanup();
  });

  const trigger = () => screen.getByRole('button', { name: 'Delete' });
  const tooltip = () => screen.queryByRole('tooltip');

  function renderTooltip(props: Partial<React.ComponentProps<typeof Tooltip>> = {}) {
    return render(
      <Tooltip content="Deletes the row" openDelay={0} closeDelay={0} {...props}>
        {(bag) => <Button {...bag}>Delete</Button>}
      </Tooltip>,
    );
  }

  it('renders nothing but the trigger while it is closed', () => {
    renderTooltip();

    expect(trigger()).toBeInTheDocument();
    expect(tooltip()).toBeNull();
  });

  it('opens uncontrolled, and starts open with defaultOpen', () => {
    renderTooltip({ defaultOpen: true });

    expect(tooltip()).not.toBeNull();
  });

  it('never opens without content, however hard it is asked', () => {
    renderTooltip({ content: undefined, defaultOpen: true });

    expect(tooltip()).toBeNull();
    // And nothing is left pointing at the element that was never rendered.
    expect(trigger()).not.toHaveAttribute('aria-describedby');
  });

  it('obeys a controlled open prop and does not fight it', () => {
    const onOpenChange = vi.fn();
    renderTooltip({ open: false, onOpenChange });

    fireEvent.pointerOver(trigger());

    // The handler hears about the request; the DOM stays where the consumer put it.
    expect(onOpenChange).toHaveBeenCalledWith(true, expect.objectContaining({ reason: 'hover' }));
    expect(tooltip()).toBeNull();
  });

  it('reports why it changed, every time', () => {
    const reasons: TooltipReason[] = [];
    renderTooltip({ onOpenChange: (_open, details) => reasons.push(details.reason) });

    fireEvent.pointerOver(trigger());
    fireEvent.pointerOut(trigger());
    fireEvent.focus(trigger());
    fireEvent.keyDown(document, { key: 'Escape' });
    fireEvent.blur(trigger());
    fireEvent.pointerOver(trigger());

    expect(reasons).toEqual(['hover', 'pointer-leave', 'focus', 'escape', 'hover']);
  });

  it('does not report a close it never made', () => {
    const onOpenChange = vi.fn();
    renderTooltip({ onOpenChange });

    // Blur with the tooltip already closed: two dismissal paths for one popup is normal, and the
    // consumer should not hear about the second one.
    fireEvent.blur(trigger());

    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('styles the bubble with Box props and keeps the consumer own attributes', () => {
    renderTooltip({ defaultOpen: true, id: 'delete-tip', bgColor: 'red-500', props: { dir: 'rtl' } });

    const bubble = screen.getByRole('tooltip');
    expect(bubble).toHaveAttribute('id', 'delete-tip');
    expect(bubble).toHaveAttribute('dir', 'rtl');
    expect(trigger()).toHaveAttribute('aria-describedby', 'delete-tip');
  });

  it('adds nothing to the layout around the trigger when it opens', () => {
    // The bubble is positioned against the trigger's own box. Measuring a placeholder instead —
    // which is what the underlying layer does when it has no anchor — would put a real `<div>` in
    // this flex row: everything after it shifts by one `gap`, and the tooltip lands beside the
    // button rather than under it.
    const { container } = render(
      <Flex gap={4}>
        <Tooltip content="Deletes the row" openDelay={0}>
          {(bag) => <Button {...bag}>Delete</Button>}
        </Tooltip>
        <Button>After</Button>
      </Flex>,
    );
    const row = container.firstElementChild!;
    const before = row.childElementCount;

    fireEvent.pointerOver(trigger());

    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    expect(row.childElementCount).toBe(before);
  });

  it('leaves no timer behind when it unmounts mid-delay', () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });

    try {
      const { unmount } = renderTooltip({ openDelay: 500 });
      fireEvent.pointerOver(trigger());
      unmount();

      expect(vi.getTimerCount()).toBe(0);
    } finally {
      vi.useRealTimers();
    }
  });
});
