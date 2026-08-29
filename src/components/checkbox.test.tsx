import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { ignoreLogs } from '../../dev/tests';
import Checkbox from './checkbox';

/**
 * The API around the control — the label it renders and the mixed state it reports.
 * `checkbox.a11y.test.tsx` owns the pattern a user meets.
 */
describe('Checkbox', () => {
  ignoreLogs();

  afterEach(() => {
    cleanup();
  });

  const checkbox = () => screen.getByRole('checkbox') as HTMLInputElement;

  it('renders a bare input when there is no label, so nothing wraps what a consumer laid out', () => {
    const { container } = render(<Checkbox name="terms" />);

    expect(container.querySelector('label')).toBeNull();
    expect(container.firstElementChild).toBe(checkbox());
  });

  it('wraps the input in the label that names it', () => {
    render(<Checkbox name="terms" label="Accept the terms" />);

    expect(screen.getByRole('checkbox', { name: 'Accept the terms' })).toBe(checkbox());
    expect(checkbox().closest('label')).not.toBeNull();
  });

  it('toggles when the label text is clicked, since the label is the one the input is inside', () => {
    render(<Checkbox name="terms" label="Accept the terms" />);

    fireEvent.click(screen.getByText('Accept the terms'));

    expect(checkbox().checked).toBe(true);
  });

  it('styles the label element through labelProps without touching the box itself', () => {
    render(<Checkbox name="terms" label="Accept" labelProps={{ gap: 4 }} />);

    const label = checkbox().closest('label')!;

    expect(label.className).not.toBe(checkbox().className);
    expect(label.className).toContain('gap-4');
  });

  it('sets the indeterminate property and reports the mixed state to assistive technology', () => {
    render(<Checkbox name="terms" indeterminate />);

    expect(checkbox().indeterminate).toBe(true);
    expect(checkbox().getAttribute('aria-checked')).toBe('mixed');
  });

  it('drops both again when the flag goes away', () => {
    const { rerender } = render(<Checkbox name="terms" indeterminate />);

    rerender(<Checkbox name="terms" indeterminate={false} />);

    expect(checkbox().indeterminate).toBe(false);
    expect(checkbox().getAttribute('aria-checked')).toBeNull();
  });

  it('reads the state out of the tuple form, where it arrives beside the styles for it', () => {
    render(<Checkbox name="terms" indeterminate={[true, { opacity: 0.6 }]} />);

    expect(checkbox().indeterminate).toBe(true);
  });

  it('styles the mixed state without entering it when the tuple says false', () => {
    render(<Checkbox name="terms" indeterminate={[false, { opacity: 0.6 }]} />);

    expect(checkbox().indeterminate).toBe(false);
    expect(checkbox().getAttribute('aria-checked')).toBeNull();
  });

  // The types only allow a boolean or the tuple, so this is what a JavaScript consumer can still
  // reach: bare styles where the state belongs. `Boolean(styles)` is `true`, which would have
  // pinned the control in the mixed state it was only meant to describe.
  it('does not become indeterminate because a JS caller passed styles alone', () => {
    render(<Checkbox name="terms" {...({ indeterminate: { opacity: 0.6 } } as Record<string, unknown>)} />);

    expect(checkbox().indeterminate).toBe(false);
    expect(checkbox().getAttribute('aria-checked')).toBeNull();
  });
});
