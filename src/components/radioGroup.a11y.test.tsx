import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '../../dev/a11y/axe';
import { expectFocusOn, keyboard } from '../../dev/a11y/keyboard';
import { ignoreLogs } from '../../dev/tests';
import Button from './button';
import RadioGroup from './radioGroup';

/**
 * The APG radio-group keyboard map, key by key.
 *
 * Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/radio/
 *
 * | Key                    | What must happen                                          |
 * | ---------------------- | --------------------------------------------------------- |
 * | Tab                    | one stop for the whole group, landing on the checked radio |
 * | Down / Right           | next radio, selecting it as focus arrives; wraps           |
 * | Up / Left              | previous radio, same; wraps                                |
 * | Space                  | selects the focused radio (the platform's own)             |
 * | Tab again              | leaves the group entirely, not radio by radio              |
 *
 * Selection follows focus here, unlike a listbox: APG says a radio group moves and chooses in one
 * keystroke, which is why every arrow assertion checks `checked` as well as focus.
 */
describe('RadioGroup accessibility', () => {
  ignoreLogs();

  afterEach(() => {
    cleanup();
  });

  const renderGroup = (defaultValue?: string) =>
    render(
      <>
        <Button>Before</Button>
        <RadioGroup label="Plan" name="plan" defaultValue={defaultValue}>
          <RadioGroup.Item value="free" label="Free" />
          <RadioGroup.Item value="pro" label="Pro" />
          <RadioGroup.Item value="team" label="Team" />
        </RadioGroup>
        <Button>After</Button>
      </>,
    );

  const radios = () => screen.getAllByRole('radio') as HTMLInputElement[];
  const checkedValues = () =>
    radios()
      .filter((radio) => radio.checked)
      .map((radio) => radio.value);

  describe('Keyboard', () => {
    it('takes one Tab to reach the group, landing on the checked radio', async () => {
      const user = keyboard();
      renderGroup('pro');

      await user.pressTab();
      await user.pressTab();

      expectFocusOn(radios()[1]);
    });

    it('takes one more Tab to leave it, not one per radio', async () => {
      const user = keyboard();
      renderGroup('free');
      await user.pressTab();
      await user.pressTab();

      await user.pressTab();

      expectFocusOn(screen.getByRole('button', { name: 'After' }));
    });

    it('moves to the next radio on Down and on Right, choosing it on the way', async () => {
      const user = keyboard();
      renderGroup('free');
      await user.pressTab();
      await user.pressTab();

      await user.pressArrow('Down');
      expectFocusOn(radios()[1]);
      expect(checkedValues()).toEqual(['pro']);

      await user.pressArrow('Right');
      expectFocusOn(radios()[2]);
      expect(checkedValues()).toEqual(['team']);
    });

    it('moves to the previous radio on Up and on Left', async () => {
      const user = keyboard();
      renderGroup('team');
      await user.pressTab();
      await user.pressTab();

      await user.pressArrow('Up');
      expectFocusOn(radios()[1]);
      expect(checkedValues()).toEqual(['pro']);

      await user.pressArrow('Left');
      expectFocusOn(radios()[0]);
      expect(checkedValues()).toEqual(['free']);
    });

    it('wraps around at both ends', async () => {
      const user = keyboard();
      renderGroup('free');
      await user.pressTab();
      await user.pressTab();

      await user.pressArrow('Up');
      expectFocusOn(radios()[2]);
      expect(checkedValues()).toEqual(['team']);

      await user.pressArrow('Down');
      expectFocusOn(radios()[0]);
      expect(checkedValues()).toEqual(['free']);
    });

    it('skips a disabled radio rather than stopping on it', async () => {
      const user = keyboard();
      render(
        <RadioGroup label="Plan" name="plan" defaultValue="free">
          <RadioGroup.Item value="free" label="Free" />
          <RadioGroup.Item value="pro" label="Pro" disabled />
          <RadioGroup.Item value="team" label="Team" />
        </RadioGroup>,
      );
      await user.pressTab();

      await user.pressArrow('Down');

      expectFocusOn(radios()[2]);
      expect(checkedValues()).toEqual(['team']);
    });

    it('selects the focused radio on Space, as the platform does', async () => {
      const user = keyboard();
      renderGroup();
      await user.pressTab();
      await user.pressTab();

      await user.press(' ');

      expect(checkedValues()).toEqual(['free']);
    });

    it('leaves keys it does not own alone', async () => {
      const user = keyboard();
      renderGroup('free');
      await user.pressTab();
      await user.pressTab();

      await user.press('Escape');

      expectFocusOn(radios()[0]);
      expect(checkedValues()).toEqual(['free']);
    });
  });

  describe('Semantics', () => {
    it('names the group, and every radio in it', () => {
      renderGroup('free');

      expect(screen.getByRole('radiogroup', { name: 'Plan' })).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: 'Free' })).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: 'Pro' })).toBeInTheDocument();
    });

    it('has no axe violations', async () => {
      const { container } = renderGroup('free');

      await expectNoAxeViolations(container);
    });
  });
});
