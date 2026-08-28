import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '../../dev/a11y/axe';
import { expectFocusOn, keyboard } from '../../dev/a11y/keyboard';
import { ignoreLogs } from '../../dev/tests';
import Button from './button';
import Checkbox from './checkbox';
import { Label } from './semantics';

/**
 * The template for a keyboard-interaction test — the shape A3–A7 copy.
 *
 * Checkbox is the easy case on purpose: it renders a real `<input type="checkbox">`, so the
 * browser already supplies the APG checkbox pattern (focusable, Space toggles, submits with the
 * form) and there is something passing to assert. What the `it.todo`s below name is the rest of
 * the pattern the component still leaves to the consumer; A4 turns each of them into a real test.
 *
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

    // A4 — the gaps. Each becomes a real test when the component closes it.
    it.todo('labels itself from a `label` prop instead of leaving htmlFor/id to the consumer');
    it.todo('reports aria-checked="mixed" when indeterminate, not just the DOM property');
    it.todo('renders as role="switch" with Space/Enter toggling, via the new Switch component');
  });
});
