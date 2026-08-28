import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import useDismiss, { DismissOptions, DismissReason } from './useDismiss';

describe('useDismiss', () => {
  afterEach(() => {
    cleanup();
  });

  type Dismissed = (reason: DismissReason) => void;

  /** A popup and its trigger, both counted as inside — the shape every consumer of this has. */
  function Layer(props: {
    name: string;
    onDismiss: Dismissed;
    enabled?: boolean;
    options?: Partial<DismissOptions>;
    children?: React.ReactNode;
  }) {
    const trigger = useRef<HTMLButtonElement>(null);
    const popup = useRef<HTMLDivElement>(null);

    useDismiss({
      enabled: props.enabled ?? true,
      inside: [trigger, popup],
      onDismiss: (reason) => props.onDismiss(reason),
      ...props.options,
    });

    return (
      <>
        <button ref={trigger}>{props.name} trigger</button>
        <div ref={popup} data-testid={`${props.name} popup`}>
          {props.children}
        </div>
      </>
    );
  }

  const outside = () => screen.getByTestId('outside');

  function renderLayer(props: Omit<Parameters<typeof Layer>[0], 'name'>) {
    return render(
      <>
        <Layer name="menu" {...props} />
        <div data-testid="outside">elsewhere on the page</div>
      </>,
    );
  }

  it('dismisses on Escape', () => {
    const onDismiss = vi.fn();
    renderLayer({ onDismiss });

    fireEvent.keyDown(document.body, { key: 'Escape' });

    expect(onDismiss).toHaveBeenCalledWith('escape');
  });

  it('dismisses on a pointer press outside', () => {
    const onDismiss = vi.fn();
    renderLayer({ onDismiss });

    fireEvent.pointerDown(outside());

    expect(onDismiss).toHaveBeenCalledWith('outside-pointer');
  });

  it('ignores a press inside the popup', () => {
    const onDismiss = vi.fn();
    renderLayer({ onDismiss });

    fireEvent.pointerDown(screen.getByTestId('menu popup'));

    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('ignores a press on the trigger, which owns the toggle', () => {
    const onDismiss = vi.fn();
    renderLayer({ onDismiss });

    fireEvent.pointerDown(screen.getByRole('button', { name: 'menu trigger' }));

    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('ignores a press on something rendered inside the popup', () => {
    const onDismiss = vi.fn();
    renderLayer({ onDismiss, children: <button>Copy</button> });

    fireEvent.pointerDown(screen.getByRole('button', { name: 'Copy' }));

    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('leaves an Escape a consumer already handled alone', () => {
    const onDismiss = vi.fn();
    renderLayer({ onDismiss });

    // What clearing a search box inside the popup looks like from here: a handler on the element
    // the key was pressed in, which runs before the document listener this hook installs.
    document.body.addEventListener('keydown', (event) => event.preventDefault(), { once: true });
    fireEvent.keyDown(document.body, { key: 'Escape' });

    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('ignores other keys', () => {
    const onDismiss = vi.fn();
    renderLayer({ onDismiss });

    fireEvent.keyDown(document.body, { key: 'Enter' });

    expect(onDismiss).not.toHaveBeenCalled();
  });

  describe('switched off', () => {
    it('listens for nothing while disabled', () => {
      const onDismiss = vi.fn();
      renderLayer({ onDismiss, enabled: false });

      fireEvent.keyDown(document.body, { key: 'Escape' });
      fireEvent.pointerDown(outside());

      expect(onDismiss).not.toHaveBeenCalled();
    });

    it('drops its listeners when it unmounts', () => {
      const onDismiss = vi.fn();
      const { unmount } = renderLayer({ onDismiss });

      unmount();
      fireEvent.keyDown(document.body, { key: 'Escape' });

      expect(onDismiss).not.toHaveBeenCalled();
    });

    it('can turn off one half and keep the other', () => {
      const onDismiss = vi.fn();
      renderLayer({ onDismiss, options: { escapeKey: false } });

      fireEvent.keyDown(document.body, { key: 'Escape' });
      expect(onDismiss).not.toHaveBeenCalled();

      fireEvent.pointerDown(outside());
      expect(onDismiss).toHaveBeenCalledWith('outside-pointer');
    });

    it('can turn off outside presses and keep Escape', () => {
      const onDismiss = vi.fn();
      renderLayer({ onDismiss, options: { outsidePointer: false } });

      fireEvent.pointerDown(outside());
      expect(onDismiss).not.toHaveBeenCalled();

      fireEvent.keyDown(document.body, { key: 'Escape' });
      expect(onDismiss).toHaveBeenCalledWith('escape');
    });
  });

  describe('layers', () => {
    function renderNested(onOuter: Dismissed, onInner: Dismissed, innerOpen = true) {
      return render(
        <>
          <Layer name="dialog" onDismiss={onOuter}>
            {innerOpen && <Layer name="select" onDismiss={onInner} />}
          </Layer>
          <div data-testid="outside">elsewhere on the page</div>
        </>,
      );
    }

    it('gives Escape to the innermost layer only', () => {
      const onOuter = vi.fn();
      const onInner = vi.fn();
      renderNested(onOuter, onInner);

      fireEvent.keyDown(document.body, { key: 'Escape' });

      expect(onInner).toHaveBeenCalledWith('escape');
      expect(onOuter).not.toHaveBeenCalled();
    });

    it('hands Escape back to the outer layer once the inner one is gone', () => {
      const onOuter = vi.fn();
      const onInner = vi.fn();
      const { rerender } = renderNested(onOuter, onInner);

      rerender(
        <>
          <Layer name="dialog" onDismiss={onOuter} />
          <div data-testid="outside">elsewhere on the page</div>
        </>,
      );
      fireEvent.keyDown(document.body, { key: 'Escape' });

      expect(onOuter).toHaveBeenCalledWith('escape');
    });

    it('dismisses both when the press is outside both', () => {
      const onOuter = vi.fn();
      const onInner = vi.fn();
      renderNested(onOuter, onInner);

      fireEvent.pointerDown(outside());

      expect(onInner).toHaveBeenCalledWith('outside-pointer');
      expect(onOuter).toHaveBeenCalledWith('outside-pointer');
    });

    it('dismisses only the inner one when the press is in the outer', () => {
      const onOuter = vi.fn();
      const onInner = vi.fn();
      renderNested(onOuter, onInner);

      fireEvent.pointerDown(screen.getByRole('button', { name: 'dialog trigger' }));

      expect(onInner).toHaveBeenCalledWith('outside-pointer');
      expect(onOuter).not.toHaveBeenCalled();
    });
  });
});
