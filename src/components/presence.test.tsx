import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Box from '../box';
import Presence from './presence';

/**
 * The exit half. happy-dom resolves a class rule into `getComputedStyle`, so `transitionDuration` on the
 * child is a real duration here — which is what the wait is measured from. Nothing else about a
 * transition exists in this environment, so the timeline itself belongs in a browser.
 */
describe('Presence', () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  const node = () => screen.queryByTestId('node');

  function renderPresence(present: boolean, duration?: number) {
    return render(
      <Presence present={present}>
        {(presence) => (
          <Box
            ref={presence.ref}
            transitionDuration={duration}
            opacity={presence.present ? 1 : 0}
            props={{ ...presence.props, 'data-testid': 'node' }}
          />
        )}
      </Presence>,
    );
  }

  it('renders nothing until it is present', () => {
    renderPresence(false);

    expect(node()).toBeNull();
  });

  it('marks the child open while it is present', () => {
    renderPresence(true, 200);

    expect(node()).toHaveAttribute('data-state', 'open');
  });

  it('unmounts in the same commit when the child declares no exit', () => {
    const { rerender } = renderPresence(true);
    rerender(
      <Presence present={false}>{(presence) => <Box ref={presence.ref} props={{ ...presence.props, 'data-testid': 'node' }} />}</Presence>,
    );

    expect(node()).toBeNull();
  });

  it('holds the child for as long as its own CSS says the exit takes', () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    const { rerender } = renderPresence(true, 200);

    rerender(
      <Presence present={false}>
        {(presence) => <Box ref={presence.ref} transitionDuration={200} opacity={0} props={{ ...presence.props, 'data-testid': 'node' }} />}
      </Presence>,
    );

    // Still there, and already telling the styles which way it is going.
    expect(node()).toHaveAttribute('data-state', 'closed');

    act(() => vi.advanceTimersByTime(100));
    expect(node()).not.toBeNull();

    // 200ms plus the frame of head-room the timer is given.
    act(() => vi.advanceTimersByTime(150));
    expect(node()).toBeNull();
  });

  it('cancels the exit when it is asked back mid-flight', () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    const { rerender } = renderPresence(true, 200);

    rerender(
      <Presence present={false}>
        {(presence) => <Box ref={presence.ref} transitionDuration={200} opacity={0} props={{ ...presence.props, 'data-testid': 'node' }} />}
      </Presence>,
    );
    act(() => vi.advanceTimersByTime(100));

    rerender(
      <Presence present>
        {(presence) => <Box ref={presence.ref} transitionDuration={200} opacity={1} props={{ ...presence.props, 'data-testid': 'node' }} />}
      </Presence>,
    );

    expect(node()).toHaveAttribute('data-state', 'open');
    // The timer the exit had started is gone with it, so it cannot unmount a child that came back.
    expect(vi.getTimerCount()).toBe(0);

    act(() => vi.advanceTimersByTime(500));
    expect(node()).toHaveAttribute('data-state', 'open');
  });

  it('leaves no timer behind when it unmounts mid-exit', () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    const { rerender, unmount } = renderPresence(true, 200);

    rerender(
      <Presence present={false}>
        {(presence) => <Box ref={presence.ref} transitionDuration={200} opacity={0} props={{ ...presence.props, 'data-testid': 'node' }} />}
      </Presence>,
    );
    unmount();

    expect(vi.getTimerCount()).toBe(0);
  });
});
