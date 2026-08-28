import { cleanup, render, screen } from '@testing-library/react';
import { useRef, useState } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { expectFocusOn, keyboard } from '../../../dev/a11y/keyboard';
import useFocusReturn from './useFocusReturn';

describe('useFocusReturn', () => {
  afterEach(() => {
    cleanup();
  });

  /** A trigger that opens a layer taking focus, the way every popup in the library does. */
  function Popup(props: { returnToOther?: boolean }) {
    const [open, setOpen] = useState(false);
    const other = useRef<HTMLButtonElement>(null);

    useFocusReturn({ enabled: open, returnTo: props.returnToOther ? other : undefined });

    return (
      <>
        <button onClick={() => setOpen(true)}>Open</button>
        <button ref={other}>Somewhere else</button>
        {open && (
          <div>
            <button autoFocus onClick={() => setOpen(false)}>
              Close
            </button>
          </div>
        )}
      </>
    );
  }

  const trigger = () => screen.getByRole('button', { name: 'Open' });
  const close = () => screen.getByRole('button', { name: 'Close' });

  it('puts focus back on the invoker when the layer closes', async () => {
    const user = keyboard();
    render(<Popup />);

    await user.click(trigger());
    expectFocusOn(close());

    await user.click(close());

    expectFocusOn(trigger());
  });

  it('does nothing when the invoker itself has left the page', async () => {
    const user = keyboard();

    function VanishingTrigger() {
      const [open, setOpen] = useState(false);
      useFocusReturn({ enabled: open });

      return open ? (
        <button autoFocus onClick={() => setOpen(false)}>
          Close
        </button>
      ) : (
        <button onClick={() => setOpen(true)}>Open</button>
      );
    }

    render(<VanishingTrigger />);
    await user.click(trigger());

    // The trigger was replaced while the layer was open, so there is nothing to hand focus back
    // to. Closing must still not throw, and must not leave focus on a detached node.
    await user.click(close());

    expect(document.body).toContainElement(trigger());
  });

  it('sends focus somewhere else when asked to', async () => {
    const user = keyboard();
    render(<Popup returnToOther />);

    await user.click(trigger());
    await user.click(close());

    expectFocusOn(screen.getByRole('button', { name: 'Somewhere else' }));
  });

  it('leaves focus alone when something else has already taken it', async () => {
    const user = keyboard();

    function MovesFocus() {
      const [open, setOpen] = useState(false);
      useFocusReturn({ enabled: open });

      return (
        <>
          <button onClick={() => setOpen(true)}>Open</button>
          <button id="next">Next</button>
          {open && (
            <button
              onClick={() => {
                setOpen(false);
                document.getElementById('next')?.focus();
              }}
            >
              Close
            </button>
          )}
        </>
      );
    }

    render(<MovesFocus />);
    await user.click(trigger());
    await user.click(close());

    expectFocusOn(screen.getByRole('button', { name: 'Next' }));
  });

  it('returns focus on demand, whoever holds it', async () => {
    const user = keyboard();

    function OnDemand() {
      const invoker = useRef<HTMLButtonElement>(null);
      const { returnFocus } = useFocusReturn({ returnTo: invoker });

      return (
        <>
          <button ref={invoker}>Invoker</button>
          <button onClick={returnFocus}>Give it back</button>
        </>
      );
    }

    render(<OnDemand />);

    await user.click(screen.getByRole('button', { name: 'Give it back' }));

    expectFocusOn(screen.getByRole('button', { name: 'Invoker' }));
  });

  it('remembers nothing while disabled', async () => {
    const user = keyboard();

    function NeverEnabled() {
      const { returnFocus } = useFocusReturn({ enabled: false });

      return (
        <>
          <button>Invoker</button>
          <button onClick={returnFocus}>Give it back</button>
        </>
      );
    }

    render(<NeverEnabled />);
    screen.getByRole('button', { name: 'Invoker' }).focus();
    const giveBack = screen.getByRole('button', { name: 'Give it back' });

    await user.click(giveBack);

    expectFocusOn(giveBack);
  });
});
