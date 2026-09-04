import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { expectFocusOn, keyboard } from '../../dev/a11y/keyboard';
import { ignoreLogs } from '../../dev/tests';
import Button from './button';
import Form from './form';
import Switch from './switch';

/**
 * A switch is a checkbox wearing a different role, so most of this asserts that the native control
 * underneath survived — focus, Space, `name`/`value` in a submitted form. The role and Enter are what is
 * new. Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/switch/
 */
describe('Switch', () => {
  ignoreLogs();

  afterEach(() => {
    cleanup();
  });

  const control = () => screen.getByRole('switch') as HTMLInputElement;

  it('exposes the switch role with its label', () => {
    render(<Switch name="notify" label="Email notifications" />);

    expect(screen.getByRole('switch', { name: 'Email notifications' })).toBe(control());
  });

  it('is a real checkbox input underneath, so a form still submits it', () => {
    const onSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => event.preventDefault());
    render(
      <Form onSubmit={onSubmit}>
        <Switch name="notify" value="on" label="Email notifications" defaultChecked />
        <Button type="submit">Save</Button>
      </Form>,
    );

    expect(control().type).toBe('checkbox');
    expect(new FormData(control().form!).get('notify')).toBe('on');
  });

  it('takes focus from Tab and toggles on Space, as the platform supplies it', async () => {
    const user = keyboard();
    render(<Switch name="notify" label="Email notifications" />);

    await user.pressTab();
    expectFocusOn(control());

    await user.press(' ');
    expect(control().checked).toBe(true);

    await user.press(' ');
    expect(control().checked).toBe(false);
  });

  it('toggles on Enter, which a native checkbox ignores', async () => {
    const user = keyboard();
    render(<Switch name="notify" label="Email notifications" />);
    await user.pressTab();

    await user.press('Enter');

    expect(control().checked).toBe(true);
  });

  it('does not submit the form it is in when Enter toggles it', async () => {
    const onSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => event.preventDefault());
    const user = keyboard();
    render(
      <Form onSubmit={onSubmit}>
        <Switch name="notify" label="Email notifications" />
      </Form>,
    );
    await user.pressTab();

    await user.press('Enter');

    expect(control().checked).toBe(true);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('still calls a key handler the consumer passed', async () => {
    const onKeyDown = vi.fn();
    const user = keyboard();
    render(<Switch name="notify" label="Email notifications" props={{ onKeyDown }} />);
    await user.pressTab();

    await user.press('Enter');

    expect(onKeyDown).toHaveBeenCalled();
    expect(control().checked).toBe(true);
  });

  it('leaves Enter alone when that handler already claimed it', async () => {
    const user = keyboard();
    render(<Switch name="notify" label="Email notifications" props={{ onKeyDown: (event) => event.preventDefault() }} />);
    await user.pressTab();

    await user.press('Enter');

    expect(control().checked).toBe(false);
  });

  // The thumb travels on `checked: { before: { translateX: 4 } }` in the `switch` component style,
  // which is a pseudo-element nested inside a pseudo-class — the combination that used to be
  // assembled as `::before:checked`, invalid CSS the browser throws the whole rule away for. The
  // class was on the element and the switch simply did not move; see `pseudoElements.test.ts`.
  it('moves its thumb on :checked — the rule reaches the stylesheet, with ::before last', () => {
    render(<Switch name="notify" label="Email notifications" />);

    const css = (document.getElementById('box-kite-styles') as HTMLStyleElement | null)?.textContent ?? '';

    expect(css).toContain(':checked::before{--boxTranslateX:1rem;translate:var(--boxTranslateX, 0) var(--boxTranslateY, 0)}');
    expect(css).not.toContain('::before:checked');
  });

  // The thumb is a `::before`, and the component no longer declares its `content`: a generated element
  // gets an empty one from the engine, which is the whole reason the box exists to be moved.
  it('gets the content its thumb needs without the component asking for it', () => {
    render(<Switch name="notify" label="Email notifications" />);

    const css = (document.getElementById('box-kite-styles') as HTMLStyleElement | null)?.textContent ?? '';

    expect(css).toContain("::before{content:''}");
  });

  it('stops the thumb travelling when the user asked for less motion', () => {
    render(<Switch name="notify" label="Email notifications" />);

    const css = (document.getElementById('box-kite-styles') as HTMLStyleElement | null)?.textContent ?? '';

    // The library-wide default (`--transitionTime: 0s`) cannot reach a component that named its
    // own 150ms, so the switch opts out by name — for the track and for the thumb.
    expect(css).toContain('@media (prefers-reduced-motion: reduce){:root{--transitionTime: 0s;--svgTransitionTime: 0s;}}');
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)\{\.\S+\{transition-property:none\}\}/);
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)\{\.\S+::before\{transition-property:none\}\}/);
  });

  it('says on and off in system colours, where the palette is gone', () => {
    render(<Switch name="notify" label="Email notifications" />);

    const css = (document.getElementById('box-kite-styles') as HTMLStyleElement | null)?.textContent ?? '';

    // Forced colours flatten indigo and gray to the same fill, so the two states read identically and
    // the white thumb can vanish into the track. `ButtonText` on `ButtonFace`, inverted when checked.
    expect(css).toMatch(/@media \(forced-colors: active\)\{\.\S+\{background-color:ButtonFace\}\}/);
    expect(css).toMatch(/@media \(forced-colors: active\)\{\.\S+:checked\{background-color:ButtonText\}\}/);
    expect(css).toMatch(/@media \(forced-colors: active\)\{\.\S+:checked::before\{background-color:ButtonFace\}\}/);
  });

  it('reports its change to onChange like any other control', async () => {
    const onChange = vi.fn();
    const user = keyboard();
    render(<Switch name="notify" label="Email notifications" onChange={onChange} />);
    await user.pressTab();

    await user.press(' ');

    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
