import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '../../dev/a11y/axe';
import { expectFocusOn, keyboard } from '../../dev/a11y/keyboard';
import { ignoreLogs } from '../../dev/tests';
import Button from './button';
import Dropdown from './dropdown';

/**
 * The APG select-only combobox keyboard map, key by key.
 *
 * Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
 *
 * | Key                   | Closed                                   | Open                                    |
 * | --------------------- | ---------------------------------------- | --------------------------------------- |
 * | Down / Up             | opens, on the selection or an end         | moves the highlight, wrapping            |
 * | Alt + Down            | opens, moving nothing                     | —                                        |
 * | Alt + Up              | —                                         | chooses the highlight and closes         |
 * | Enter / Space         | opens on the selection                    | chooses the highlight                    |
 * | Home / End            | opens at an end                           | jumps to an end                          |
 * | printable character   | opens at the first match                  | typeahead                                |
 * | Escape                | —                                         | closes, changing nothing                 |
 * | Tab                   | leaves the control                        | chooses the highlight, then leaves       |
 *
 * The assertions are about two things at once: what the *highlight* is, which lives in
 * `aria-activedescendant` because DOM focus never enters the popup, and where DOM focus actually
 * is, which for this pattern is the trigger from the first keystroke to the last.
 */
describe('Dropdown accessibility', () => {
  ignoreLogs();

  afterEach(() => {
    cleanup();
  });

  const renderDropdown = (props?: Omit<Parameters<typeof Dropdown<string>>[0], 'children'>) =>
    render(
      <>
        <Button>Before</Button>
        <Dropdown<string> label="Fruit" {...props}>
          <Dropdown.Item value="a">Apple</Dropdown.Item>
          <Dropdown.Item value="b">Banana</Dropdown.Item>
          <Dropdown.Item value="c">Cherry</Dropdown.Item>
        </Dropdown>
        <Button>After</Button>
      </>,
    );

  const trigger = () => screen.getByRole('combobox');
  const options = () => screen.queryAllByRole('option');
  const isOpen = () => trigger().getAttribute('aria-expanded') === 'true';

  /** The option the highlight is on — read the way a screen reader reads it. */
  const highlighted = () => {
    const id = trigger().getAttribute('aria-activedescendant');

    return id ? document.getElementById(id)?.textContent : undefined;
  };

  const selected = () =>
    options()
      .filter((option) => option.getAttribute('aria-selected') === 'true')
      .map((option) => option.textContent);

  describe('Keyboard — closed', () => {
    it('is one tab stop, reached with a single Tab', async () => {
      const user = keyboard();
      renderDropdown();

      await user.pressTab();
      await user.pressTab();

      expectFocusOn(trigger());
    });

    it('opens on Down, with the highlight on the selected option', async () => {
      const user = keyboard();
      renderDropdown({ defaultValue: 'b' });
      await user.pressTab();
      await user.pressTab();

      await user.pressArrow('Down');

      expect(isOpen()).toBe(true);
      expect(highlighted()).toBe('Banana');
    });

    it('opens on Down at the first option when nothing is selected', async () => {
      const user = keyboard();
      renderDropdown();
      await user.pressTab();
      await user.pressTab();

      await user.pressArrow('Down');

      expect(highlighted()).toBe('Apple');
    });

    it('opens on Up at the last option when nothing is selected', async () => {
      const user = keyboard();
      renderDropdown();
      await user.pressTab();
      await user.pressTab();

      await user.pressArrow('Up');

      expect(highlighted()).toBe('Cherry');
    });

    it('opens on Enter, and the keystroke does not toggle it straight back shut', async () => {
      const user = keyboard();
      renderDropdown();
      await user.pressTab();
      await user.pressTab();

      await user.press('Enter');

      expect(isOpen()).toBe(true);
      expect(options()).toHaveLength(3);
    });

    it('opens on Space', async () => {
      const user = keyboard();
      renderDropdown();
      await user.pressTab();
      await user.pressTab();

      await user.press(' ');

      expect(isOpen()).toBe(true);
    });

    it('opens at an end on Home and End, ignoring the selection', async () => {
      const user = keyboard();
      renderDropdown({ defaultValue: 'b' });
      await user.pressTab();
      await user.pressTab();

      await user.press('End');
      expect(highlighted()).toBe('Cherry');

      await user.press('Escape');
      await user.press('Home');
      expect(highlighted()).toBe('Apple');
    });

    it('opens on a printable character with the first match already highlighted', async () => {
      const user = keyboard();
      renderDropdown();
      await user.pressTab();
      await user.pressTab();

      await user.type('c');

      expect(isOpen()).toBe(true);
      expect(highlighted()).toBe('Cherry');
    });
  });

  describe('Keyboard — open', () => {
    /** Open with the pointer, then drive with the keyboard: the case a mouse user falls into. */
    const openWithArrow = async (user: ReturnType<typeof keyboard>) => {
      await user.pressTab();
      await user.pressTab();
      await user.pressArrow('Down');
    };

    it('moves the highlight with Down and Up, wrapping at both ends', async () => {
      const user = keyboard();
      renderDropdown();
      await openWithArrow(user);

      await user.pressArrow('Down');
      expect(highlighted()).toBe('Banana');

      await user.pressArrow('Up');
      expect(highlighted()).toBe('Apple');

      await user.pressArrow('Up');
      expect(highlighted()).toBe('Cherry');
    });

    it('jumps to the ends with Home and End', async () => {
      const user = keyboard();
      renderDropdown();
      await openWithArrow(user);

      await user.press('End');
      expect(highlighted()).toBe('Cherry');

      await user.press('Home');
      expect(highlighted()).toBe('Apple');
    });

    const renderBerries = () =>
      render(
        <Dropdown<string> label="Fruit">
          <Dropdown.Item value="a">Apple</Dropdown.Item>
          <Dropdown.Item value="b">Banana</Dropdown.Item>
          <Dropdown.Item value="bl">Blueberry</Dropdown.Item>
        </Dropdown>,
      );

    it('narrows on what has been typed so far, not on the last letter alone', async () => {
      const user = keyboard();
      renderBerries();
      await user.pressTab();
      await user.pressArrow('Down');

      await user.type('bl');

      expect(highlighted()).toBe('Blueberry');
    });

    it('cycles through the options sharing a letter when that letter is repeated', async () => {
      const user = keyboard();
      renderBerries();
      await user.pressTab();
      await user.pressArrow('Down');

      await user.type('b');
      expect(highlighted()).toBe('Banana');

      await user.type('b');
      expect(highlighted()).toBe('Blueberry');
    });

    it('chooses the highlighted option on Enter and closes', async () => {
      const user = keyboard();
      renderDropdown();
      await openWithArrow(user);
      await user.pressArrow('Down');

      await user.press('Enter');

      expect(isOpen()).toBe(false);
      expect(trigger().textContent).toContain('Banana');
      expectFocusOn(trigger());
    });

    it('chooses on Space too', async () => {
      const user = keyboard();
      renderDropdown();
      await openWithArrow(user);

      await user.press(' ');

      expect(isOpen()).toBe(false);
      expect(trigger().textContent).toContain('Apple');
    });

    it('chooses and closes on Alt+Up', async () => {
      const user = keyboard();
      renderDropdown();
      await openWithArrow(user);
      await user.pressArrow('Down');

      await user.press('Alt>');
      await user.pressArrow('Up');
      await user.press('/Alt');

      expect(isOpen()).toBe(false);
      expect(trigger().textContent).toContain('Banana');
    });

    it('closes on Escape without changing the selection, leaving focus on the trigger', async () => {
      const user = keyboard();
      renderDropdown({ defaultValue: 'a' });
      await openWithArrow(user);
      await user.pressArrow('Down');

      await user.press('Escape');

      expect(isOpen()).toBe(false);
      expect(trigger().textContent).toContain('Apple');
      expectFocusOn(trigger());
    });

    it('chooses the highlighted option on Tab and then leaves the control', async () => {
      const user = keyboard();
      renderDropdown();
      await openWithArrow(user);
      await user.pressArrow('Down');

      await user.pressTab();

      expect(isOpen()).toBe(false);
      expect(trigger().textContent).toContain('Banana');
      expectFocusOn(screen.getByRole('button', { name: 'After' }));
    });

    it('never moves DOM focus into the popup', async () => {
      const user = keyboard();
      renderDropdown();
      await openWithArrow(user);

      await user.pressArrow('Down');
      expectFocusOn(trigger());

      await user.press('End');
      expectFocusOn(trigger());
    });

    it('skips a disabled option rather than stopping on it, and will not choose one', async () => {
      const user = keyboard();
      render(
        <Dropdown<string> label="Fruit">
          <Dropdown.Item value="a">Apple</Dropdown.Item>
          <Dropdown.Item value="b" disabled>
            Banana
          </Dropdown.Item>
          <Dropdown.Item value="c">Cherry</Dropdown.Item>
        </Dropdown>,
      );
      await user.pressTab();
      await user.pressArrow('Down');

      await user.pressArrow('Down');

      expect(highlighted()).toBe('Cherry');
      expect(screen.getByText('Banana').getAttribute('aria-disabled')).toBe('true');
    });
  });

  describe('Keyboard — multiple selection', () => {
    const renderMultiple = () =>
      render(
        <Dropdown<string> label="Toppings" multiple>
          <Dropdown.Item value="a">Apple</Dropdown.Item>
          <Dropdown.Item value="b">Banana</Dropdown.Item>
        </Dropdown>,
      );

    it('toggles with Enter and stays open, so more than one can be chosen', async () => {
      const user = keyboard();
      renderMultiple();
      await user.pressTab();
      await user.pressArrow('Down');

      await user.press('Enter');
      expect(isOpen()).toBe(true);
      expect(selected()).toEqual(['Apple']);

      await user.pressArrow('Down');
      await user.press('Enter');
      expect(selected()).toEqual(['Apple', 'Banana']);

      await user.press('Enter');
      expect(selected()).toEqual(['Apple']);
    });

    it('says so, so a screen reader announces more than one may be chosen', async () => {
      const user = keyboard();
      renderMultiple();
      await user.pressTab();
      await user.pressArrow('Down');

      expect(screen.getByRole('listbox').getAttribute('aria-multiselectable')).toBe('true');
    });
  });

  describe('Semantics', () => {
    it('names the control, and says what it is', () => {
      renderDropdown({ defaultValue: 'a' });

      const combobox = screen.getByRole('combobox', { name: 'Fruit' });
      expect(combobox).toBeInTheDocument();
      expect(combobox.getAttribute('aria-expanded')).toBe('false');
      // Nothing to control while it is closed — a dangling reference is worse than no reference.
      expect(combobox.getAttribute('aria-controls')).toBeNull();
    });

    it('points aria-controls at the listbox it opens', async () => {
      const user = keyboard();
      renderDropdown();
      await user.pressTab();
      await user.pressTab();
      await user.pressArrow('Down');

      expect(document.getElementById(trigger().getAttribute('aria-controls')!)).toBe(screen.getByRole('listbox'));
    });

    it('marks the chosen option as selected, and only that one', async () => {
      const user = keyboard();
      renderDropdown({ defaultValue: 'b' });
      await user.pressTab();
      await user.pressTab();
      await user.pressArrow('Down');

      expect(selected()).toEqual(['Banana']);
    });

    it('makes the clear and select-all rows options too, so the arrows reach them', async () => {
      const user = keyboard();
      render(
        <Dropdown<string> label="Fruit" defaultValue="a">
          <Dropdown.Unselect>None</Dropdown.Unselect>
          <Dropdown.Item value="a">Apple</Dropdown.Item>
          <Dropdown.Item value="b">Banana</Dropdown.Item>
        </Dropdown>,
      );
      await user.pressTab();
      await user.pressArrow('Down');

      expect(options().map((option) => option.textContent)).toEqual(['None', 'Apple', 'Banana']);

      await user.press('Home');
      expect(highlighted()).toBe('None');

      await user.press('Enter');
      expect(isOpen()).toBe(false);
      expect(selected()).toEqual([]);
    });

    it('has no axe violations, open or closed', async () => {
      const user = keyboard();
      const { container } = renderDropdown({ defaultValue: 'a' });

      await expectNoAxeViolations(container);

      await user.pressTab();
      await user.pressTab();
      await user.pressArrow('Down');

      await expectNoAxeViolations(document.body);
    });
  });

  describe('The searchable mode is not this pattern (A6)', () => {
    /**
     * Bug #47, pinned. A5 turned the trigger into a `role="combobox"`, and a combobox is one of
     * the roles that *may* contain a focusable descendant — so axe's `nested-interactive` stopped
     * firing on the search box nested inside the trigger without anything about it changing.
     *
     * The editable combobox puts `role="combobox"` on the input itself, which removes the nesting
     * as a side effect. This test fails the moment A6 does that, which is the point of it.
     */
    it('still renders the search input inside the trigger', async () => {
      const user = keyboard();
      renderDropdown({ isSearchable: true, searchPlaceholder: 'Search' });
      await user.pressTab();
      await user.pressTab();
      await user.pressArrow('Down');

      const search = screen.getByPlaceholderText('Search');
      expect(trigger().contains(search)).toBe(true);
      expect(search.getAttribute('role')).toBeNull();
    });

    it('names the highlighted option on the search box, which is what holds focus there', async () => {
      const user = keyboard();
      renderDropdown({ isSearchable: true, searchPlaceholder: 'Search' });
      await user.pressTab();
      await user.pressTab();
      await user.pressArrow('Down');

      const search = screen.getByPlaceholderText('Search');
      expect(trigger().getAttribute('aria-activedescendant')).toBeNull();
      expect(document.getElementById(search.getAttribute('aria-activedescendant')!)?.textContent).toBe('Apple');
    });
  });
});
