import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '../../dev/a11y/axe';
import { expectFocusOn, keyboard } from '../../dev/a11y/keyboard';
import { ignoreLogs } from '../../dev/tests';
import Button from './button';
import Dropdown from './dropdown';

/**
 * The APG select-only combobox keyboard map, key by key — the tests below name what each one does.
 * Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
 *
 * Two things are asserted at once: the *highlight*, which lives in `aria-activedescendant` because DOM
 * focus never enters the popup, and DOM focus, which stays on the trigger from first keystroke to last.
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
      // Once the popup has actually left: while it animates out its rows are still in the tree, and
      // the Unselect row reads as the selected one whenever nothing is chosen.
      await waitFor(() => expect(selected()).toEqual([]));
    });

    it('holds a no-break space when it has nothing to show, so it keeps its line box', () => {
      render(
        <Dropdown<string> label="Toppings" multiple>
          <Dropdown.Item value="a">Apple</Dropdown.Item>
        </Dropdown>,
      );

      // `multiple` with nothing chosen displays nothing at all, and a plain space would collapse
      // away under `white-space: nowrap` — leaving no line box, and a control 20px shorter than
      // the ones beside it. Nothing a test can measure: jsdom computes no layout.
      expect(trigger().textContent).toBe('\u00A0');
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

  /**
   * The APG *editable* combobox: the same listbox reached from a text field, so the keys divide differently
   * (printable ones type, only Down/Up reach the list, Escape closes before it clears).
   *
   * The field *is* the combobox, so what matters is that DOM focus never leaves it and that
   * `aria-activedescendant` — the only thing telling a screen reader where the arrows are — is on it.
   */
  describe('Keyboard — editable (isSearchable)', () => {
    const renderSearchable = (props?: Omit<Parameters<typeof Dropdown<string>>[0], 'children'>) =>
      render(
        <>
          <Button>Before</Button>
          <Dropdown<string> label="Fruit" isSearchable searchPlaceholder="Search" {...props}>
            <Dropdown.Item value="a">Apple</Dropdown.Item>
            <Dropdown.Item value="b">Banana</Dropdown.Item>
            <Dropdown.Item value="bl">Blueberry</Dropdown.Item>
          </Dropdown>
          <Button>After</Button>
        </>,
      );

    const field = () => trigger() as HTMLInputElement;

    /** Tab into the control — one press past the button before it, because it is one tab stop. */
    const tabIn = async (user: ReturnType<typeof keyboard>) => {
      await user.pressTab();
      await user.pressTab();
    };

    it('is the field itself that carries the combobox, so nothing focusable sits inside another', () => {
      renderSearchable();

      const combobox = screen.getByRole('combobox', { name: 'Fruit' });
      expect(combobox.tagName).toBe('INPUT');
      // Bug #47: the search box used to render inside the trigger `<button>`.
      expect(combobox.closest('button')).toBeNull();
      expect(combobox.getAttribute('aria-autocomplete')).toBe('list');
    });

    it('is one tab stop, and keeps focus in the field the whole way through', async () => {
      const user = keyboard();
      renderSearchable();

      await tabIn(user);
      expectFocusOn(field());

      await user.pressArrow('Down');
      expectFocusOn(field());

      await user.type('ban');
      expectFocusOn(field());
    });

    it('opens on Down with the highlight on the first option, and on Up at the last', async () => {
      const user = keyboard();
      renderSearchable();
      await tabIn(user);

      await user.pressArrow('Down');
      expect(isOpen()).toBe(true);
      expect(highlighted()).toBe('Apple');

      await user.press('Escape');
      await user.pressArrow('Up');
      expect(highlighted()).toBe('Blueberry');
    });

    it('opens on Alt+Down without highlighting anything', async () => {
      const user = keyboard();
      renderSearchable();
      await tabIn(user);

      await user.press('Alt>');
      await user.pressArrow('Down');
      await user.press('/Alt');

      expect(isOpen()).toBe(true);
      expect(highlighted()).toBeUndefined();
    });

    it('types into the field, which opens the listbox and filters it', async () => {
      const user = keyboard();
      renderSearchable();
      await tabIn(user);

      await user.type('bl');

      expect(isOpen()).toBe(true);
      expect(field().value).toBe('bl');
      expect(options().map((option) => option.textContent)).toEqual(['Blueberry']);
    });

    it('leaves the highlight where it is — on nothing — while the filtering happens', async () => {
      const user = keyboard();
      renderSearchable();
      await tabIn(user);
      await user.pressArrow('Down');
      expect(highlighted()).toBe('Apple');

      await user.type('b');

      // APG list autocomplete: the suggestions change, visual focus stays in the textbox. An index
      // kept across a filter would also be pointing at a different option than it was.
      expect(highlighted()).toBeUndefined();

      await user.pressArrow('Down');
      expect(highlighted()).toBe('Banana');
    });

    it('types a space instead of choosing, since the field owns the printable keys', async () => {
      const user = keyboard();
      renderSearchable();
      await tabIn(user);
      await user.pressArrow('Down');

      await user.press(' ');

      expect(isOpen()).toBe(true);
      expect(field().value).toBe(' ');
    });

    it('hands the highlight back to the field on Home, End and the left/right arrows', async () => {
      const user = keyboard();
      renderSearchable();
      await tabIn(user);

      for (const key of ['Home', 'End'] as const) {
        await user.pressArrow('Down');
        expect(highlighted()).toBe('Apple');
        await user.press(key);
        expect(highlighted()).toBeUndefined();
        expect(isOpen()).toBe(true);
      }

      for (const direction of ['Left', 'Right'] as const) {
        await user.pressArrow('Down');
        expect(highlighted()).toBe('Apple');
        await user.pressArrow(direction);
        expect(highlighted()).toBeUndefined();
        expect(isOpen()).toBe(true);
      }
    });

    it('chooses the highlighted option on Enter and puts it in the field', async () => {
      const user = keyboard();
      renderSearchable();
      await tabIn(user);
      await user.pressArrow('Down');
      await user.pressArrow('Down');

      await user.press('Enter');

      expect(isOpen()).toBe(false);
      expect(field().value).toBe('Banana');
      expectFocusOn(field());
    });

    it('does nothing on Enter while the highlight is still on the field', async () => {
      const user = keyboard();
      renderSearchable();
      await tabIn(user);
      await user.type('ba');

      await user.press('Enter');

      expect(isOpen()).toBe(true);
      expect(selected()).toEqual([]);
    });

    it('closes on Escape keeping what was typed, and clears the field on a second Escape', async () => {
      const user = keyboard();
      renderSearchable();
      await tabIn(user);
      await user.type('ba');

      await user.press('Escape');
      expect(isOpen()).toBe(false);
      expect(field().value).toBe('ba');

      await user.press('Escape');
      expect(field().value).toBe('');
    });

    it('puts the field back to the value when a click outside closes it', async () => {
      const user = keyboard();
      renderSearchable({ defaultValue: 'a' });
      await tabIn(user);
      await user.type('zzz');

      await user.click(screen.getByRole('button', { name: 'Before' }));

      expect(isOpen()).toBe(false);
      // A query left in the field would be describing a filter that is no longer applied.
      expect(field().value).toBe('Apple');
    });

    it('chooses the highlighted option on Tab and then leaves the control', async () => {
      const user = keyboard();
      renderSearchable();
      await tabIn(user);
      await user.pressArrow('Down');

      await user.pressTab();

      expect(isOpen()).toBe(false);
      expect(field().value).toBe('Apple');
      expectFocusOn(screen.getByRole('button', { name: 'After' }));
    });

    it('shows the selection as the field value, which is what a combobox is announced by', () => {
      renderSearchable({ defaultValue: 'b' });

      expect(field().value).toBe('Banana');
    });

    it('keeps the value in the flow as well, so the box does not collapse around a field it cannot see', () => {
      renderSearchable({ defaultValue: 'b' });

      // The field is absolutely positioned and reaches neither the shell's width nor its height.
      // The same text, hidden from the accessibility tree, is what the box is actually sized by.
      const spacer = screen.getByText('Banana');
      expect(spacer.tagName).toBe('SPAN');
      expect(spacer).not.toBe(field());
    });

    it('holds a no-break space when there is no value, so an empty field still has a line box', () => {
      renderSearchable();

      // A plain space collapses away under `white-space: nowrap` and leaves no line box at all,
      // which is a control 20px shorter than the one next to it the moment it is opened.
      const shell = field().parentElement!.parentElement!;
      expect(shell.querySelector('span')?.textContent).toBe('\u00A0');
    });

    it('names the listbox and points aria-controls at it from the field', async () => {
      const user = keyboard();
      renderSearchable();
      await tabIn(user);
      await user.pressArrow('Down');

      expect(document.getElementById(field().getAttribute('aria-controls')!)).toBe(screen.getByRole('listbox'));
    });

    it('has no axe violations, closed or filtering', async () => {
      const user = keyboard();
      const { container } = renderSearchable({ defaultValue: 'a' });

      await expectNoAxeViolations(container);

      await tabIn(user);
      await user.type('b');

      await expectNoAxeViolations(document.body);
    });
  });
});
