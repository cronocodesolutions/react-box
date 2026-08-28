import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ignoreLogs } from '../../dev/tests';
import Overlay from './overlay';

/**
 * The positioning primitive on its own — what `Tooltip`, `Dropdown` and the DataGrid menu all
 * stand on. It had no tests of its own while it was called `Tooltip`, which is part of why the
 * split was worth doing: the layer and the pattern fail in completely different ways.
 */
describe('Overlay', () => {
  ignoreLogs();

  afterEach(() => {
    cleanup();
  });

  const portal = () => document.getElementById('crono-box');

  it('renders its children into the portal container, not where it was declared', () => {
    const { container } = render(<Overlay>anywhere</Overlay>);

    const content = screen.getByText('anywhere');
    expect(portal()).toContainElement(content);
    expect(container).not.toContainElement(content);
  });

  it('carries no ARIA of its own — the pattern belongs to whatever is rendered into it', () => {
    render(<Overlay>anywhere</Overlay>);

    expect(screen.getByText('anywhere').closest('[role]')).toBeNull();
  });

  it('translates to the position it measured', () => {
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({ top: 40, left: 12, width: 200 } as DOMRect);

    try {
      render(<Overlay adjustTranslateY="8px">anywhere</Overlay>);

      const positioned = screen.getByText('anywhere').parentElement!;
      expect(positioned.style.transform).toBe('translate3d(calc(12px + 0px),calc(40px + 8px), 0)');
    } finally {
      vi.restoreAllMocks();
    }
  });

  it('takes the measured width by default, and leaves it alone when asked not to', () => {
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({ top: 0, left: 0, width: 200 } as DOMRect);

    try {
      const { rerender } = render(<Overlay>anywhere</Overlay>);
      expect(screen.getByText('anywhere').parentElement!.style.width).toBe('200px');

      rerender(<Overlay matchWidth={false}>anywhere</Overlay>);
      expect(screen.getByText('anywhere').parentElement!.style.width).toBe('');
    } finally {
      vi.restoreAllMocks();
    }
  });

  it('reports the position it measured, so a caller can decide to open the other way', () => {
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({ top: 40, left: 12, width: 0 } as DOMRect);
    const onPositionChange = vi.fn();

    try {
      render(<Overlay onPositionChange={onPositionChange}>anywhere</Overlay>);

      expect(onPositionChange).toHaveBeenCalledWith({ top: 40, left: 12, windowScrollX: 0, windowScrollY: 0 });
    } finally {
      vi.restoreAllMocks();
    }
  });
});
