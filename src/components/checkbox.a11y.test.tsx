import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '../../dev/a11y/axe';
import { expectFocusOn, keyboard } from '../../dev/a11y/keyboard';
import { ignoreLogs } from '../../dev/tests';
import Button from './button';
import Checkbox from './checkbox';
import { Label } from './semantics';
import Switch from './switch';

/**
 * The template for a keyboard-interaction test — the shape A3–A7 copy. Checkbox is the easy case on
 * purpose: a real `<input type="checkbox">` already supplies the APG pattern, so what is asserted is the
 * rest of the contract A4 closed — the component labels itself and reports the mixed state.
 * Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/
 */
describe('Checkbox accessibility', () => {
  ignoreLogs();

  afterEach(() => {
    cleanup();
  });

  const renderCheckbox = () =>
    render(
      <>
        <Label props={{ htmlFor: 'terms' }}>Accept the terms</Label>
        <Checkbox name="terms" id="terms" />
        <Button>After</Button>
      </>,
    );

  const checkbox = () => screen.getByRole('checkbox');

  describe('Keyboard', () => {
    it('takes focus from Tab, in document order', async () => {
      const user = keyboard();
      renderCheckbox();

      await user.pressTab();

      expectFocusOn(checkbox());
    });

    it('toggles on Space and back off again', async () => {
      const user = keyboard();
      renderCheckbox();
      await user.pressTab();

      await user.press(' ');
      expect(checkbox()).toBeChecked();

      await user.press(' ');
      expect(checkbox()).not.toBeChecked();
    });

    it('does not trap focus — Tab moves on, Shift+Tab comes back', async () => {
      const user = keyboard();
      renderCheckbox();
      await user.pressTab();

      await user.pressTab();
      expectFocusOn(screen.getByRole('button'));

      await user.pressShiftTab();
      expectFocusOn(checkbox());
    });

    it('is reachable by clicking its label, as a native checkbox is', async () => {
      const user = keyboard();
      renderCheckbox();

      await user.click(screen.getByText('Accept the terms'));

      expect(checkbox()).toBeChecked();
    });
  });

  describe('Semantics', () => {
    it('exposes the checkbox role with its label', async () => {
      renderCheckbox();

      expect(screen.getByRole('checkbox', { name: 'Accept the terms' })).toBeTruthy();
    });

    it('has no axe violations when a label is wired up', async () => {
      const { container } = renderCheckbox();

      await expectNoAxeViolations(container);
    });

    it('labels itself from a `label` prop instead of leaving htmlFor/id to the consumer', async () => {
      const { container } = render(<Checkbox name="terms" label="Accept the terms" />);

      expect(screen.getByRole('checkbox', { name: 'Accept the terms' })).toBeTruthy();
      await expectNoAxeViolations(container);
    });

    it('reports aria-checked="mixed" when indeterminate, not just the DOM property', async () => {
      const { container } = render(<Checkbox name="terms" label="Select all" indeterminate />);

      const control = screen.getByRole('checkbox', { name: 'Select all' }) as HTMLInputElement;

      expect(control.indeterminate).toBe(true);
      expect(control.getAttribute('aria-checked')).toBe('mixed');
      await expectNoAxeViolations(container);
    });

    it('renders as role="switch" with Space/Enter toggling, via the new Switch component', async () => {
      const user = keyboard();
      const { container } = render(<Switch name="notify" label="Email notifications" />);

      const control = screen.getByRole('switch', { name: 'Email notifications' }) as HTMLInputElement;
      await expectNoAxeViolations(container);

      await user.pressTab();
      await user.press(' ');
      expect(control.checked).toBe(true);

      await user.press('Enter');
      expect(control.checked).toBe(false);
    });
  });
});
