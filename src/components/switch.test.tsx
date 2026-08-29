import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { expectFocusOn, keyboard } from '../../dev/a11y/keyboard';
import { ignoreLogs } from '../../dev/tests';
import Button from './button';
import Form from './form';
import Switch from './switch';

/**
 * A switch is a checkbox wearing a different role, so most of what is asserted here is that the
 * native control underneath survived: focus, Space, `name`/`value` in a submitted form. What is
 * genuinely new is the role and Enter.
 *
 * Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/switch/
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

  it('reports its change to onChange like any other control', async () => {
    const onChange = vi.fn();
    const user = keyboard();
    render(<Switch name="notify" label="Email notifications" onChange={onChange} />);
    await user.pressTab();

    await user.press(' ');

    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
