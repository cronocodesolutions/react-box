import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { expectFocusOn, keyboard } from '../../../dev/a11y/keyboard';
import useRovingFocus, { RovingFocusOptions } from './useRovingFocus';

describe('useRovingFocus', () => {
  afterEach(() => {
    cleanup();
  });

  const names = ['Ada', 'Grace', 'Alan', 'Anita'];

  type ListProps = Partial<RovingFocusOptions> & { items?: string[] };

  /** The roving-tabindex half of the APG list patterns: DOM focus moves with the active item. */
  function List({ items = names, ...options }: ListProps) {
    const roving = useRovingFocus({ count: items.length, ...options });

    return (
      <>
        <button>Before</button>
        <ul onKeyDown={roving.onKeyDown}>
          {items.map((item, index) => (
            <li key={item}>
              <button {...roving.itemProps(index)}>{item}</button>
            </li>
          ))}
        </ul>
        <button>After</button>
        <output data-testid="active">{roving.activeIndex}</output>
      </>
    );
  }

  /** The other half: focus stays on the trigger and the active item is named by ARIA. */
  function Combobox({ items = names, ...options }: ListProps) {
    const roving = useRovingFocus({ count: items.length, focusItems: false, ...options });

    return (
      <>
        <button
          role="combobox"
          aria-expanded
          aria-controls="options"
          aria-activedescendant={roving.activeIndex === -1 ? undefined : `option-${roving.activeIndex}`}
          onKeyDown={roving.onKeyDown}
        >
          Pick a name
        </button>
        <ul id="options" role="listbox">
          {items.map((item, index) => (
            <li key={item} id={`option-${index}`} role="option" aria-selected={index === roving.activeIndex} {...roving.itemProps(index)}>
              {item}
            </li>
          ))}
        </ul>
      </>
    );
  }

  const item = (name: string) => screen.getByRole('button', { name });
  const activeIndex = () => Number(screen.getByTestId('active').textContent);

  /** Tab past the leading button, onto whichever item is currently the list's single tab stop. */
  async function tabIntoList(user: ReturnType<typeof keyboard>) {
    await user.pressTab();
    await user.pressTab();
  }

  describe('arrow keys', () => {
    it('moves focus and the active index to the next item', async () => {
      const user = keyboard();
      render(<List />);
      await tabIntoList(user);

      await user.pressArrow('Down');

      expectFocusOn(item('Grace'));
      expect(activeIndex()).toBe(1);
    });

    it('moves back to the previous item', async () => {
      const user = keyboard();
      render(<List defaultActiveIndex={2} />);
      await tabIntoList(user);

      await user.pressArrow('Up');

      expectFocusOn(item('Grace'));
    });

    it('wraps around the ends', async () => {
      const user = keyboard();
      render(<List defaultActiveIndex={3} />);
      await tabIntoList(user);

      await user.pressArrow('Down');

      expectFocusOn(item('Ada'));
    });

    it('stops at the ends when loop is off', async () => {
      const user = keyboard();
      render(<List defaultActiveIndex={3} loop={false} />);
      await tabIntoList(user);

      await user.pressArrow('Down');

      expectFocusOn(item('Anita'));
    });

    it('skips disabled items', async () => {
      const user = keyboard();
      render(<List isDisabled={(index) => index === 1} />);
      await tabIntoList(user);

      await user.pressArrow('Down');

      expectFocusOn(item('Alan'));
    });

    it('goes nowhere when every other item is disabled', async () => {
      const user = keyboard();
      render(<List isDisabled={(index) => index !== 0} />);
      await tabIntoList(user);

      await user.pressArrow('Down');

      expectFocusOn(item('Ada'));
    });

    it('takes Left and Right when the list is horizontal, and leaves Down alone', async () => {
      const user = keyboard();
      render(<List orientation="horizontal" />);
      await tabIntoList(user);

      await user.pressArrow('Down');
      expectFocusOn(item('Ada'));

      await user.pressArrow('Right');
      expectFocusOn(item('Grace'));

      await user.pressArrow('Left');
      expectFocusOn(item('Ada'));
    });

    it('takes all four when the list is a grid', async () => {
      const user = keyboard();
      render(<List orientation="both" />);
      await tabIntoList(user);

      await user.pressArrow('Right');
      expectFocusOn(item('Grace'));

      await user.pressArrow('Up');
      expectFocusOn(item('Ada'));
    });
  });

  describe('Home and End', () => {
    it('jumps to the first and last items', async () => {
      const user = keyboard();
      render(<List defaultActiveIndex={1} />);
      await tabIntoList(user);

      await user.press('End');
      expectFocusOn(item('Anita'));

      await user.press('Home');
      expectFocusOn(item('Ada'));
    });

    it('respects disabled items at the ends', async () => {
      const user = keyboard();
      render(<List defaultActiveIndex={1} isDisabled={(index) => index === 0 || index === 3} />);
      await tabIntoList(user);

      await user.press('End');
      expectFocusOn(item('Alan'));

      await user.press('Home');
      expectFocusOn(item('Grace'));
    });
  });

  describe('the tab order', () => {
    it('holds one tab stop, whichever item is active', async () => {
      const user = keyboard();
      render(<List defaultActiveIndex={2} />);

      await tabIntoList(user);

      expectFocusOn(item('Alan'));
      expect(item('Ada')).toHaveAttribute('tabindex', '-1');
      expect(item('Alan')).toHaveAttribute('tabindex', '0');
    });

    it('lets Tab out of the list in one press', async () => {
      const user = keyboard();
      render(<List />);
      await tabIntoList(user);

      await user.pressTab();

      expectFocusOn(screen.getByRole('button', { name: 'After' }));
    });

    it('follows focus that arrives some other way', async () => {
      const user = keyboard();
      render(<List />);

      await user.click(item('Alan'));

      expect(activeIndex()).toBe(2);
      expect(item('Alan')).toHaveAttribute('tabindex', '0');
    });
  });

  describe('typeahead', () => {
    const textOf = (index: number) => names[index];

    it('jumps to the item starting with the character typed', async () => {
      const user = keyboard();
      render(<List textOf={textOf} />);
      await tabIntoList(user);

      await user.type('g');

      expectFocusOn(item('Grace'));
    });

    it('cycles through the items sharing a first letter', async () => {
      const user = keyboard();
      render(<List textOf={textOf} />);
      await tabIntoList(user);

      await user.type('a');
      expectFocusOn(item('Alan'));

      await user.type('a');
      expectFocusOn(item('Anita'));

      await user.type('a');
      expectFocusOn(item('Ada'));
    });

    it('narrows on a longer prefix instead of hopping to the next match', async () => {
      const user = keyboard();
      render(<List textOf={textOf} />);
      await tabIntoList(user);

      await user.type('an');

      expectFocusOn(item('Anita'));
    });

    it('stays put when nothing matches', async () => {
      const user = keyboard();
      render(<List textOf={textOf} />);
      await tabIntoList(user);

      await user.type('z');

      expectFocusOn(item('Ada'));
    });

    it('does nothing at all without item text to search', async () => {
      const user = keyboard();
      render(<List />);
      await tabIntoList(user);

      await user.type('g');

      expectFocusOn(item('Ada'));
    });
  });

  describe('selection', () => {
    it('reports Enter on the active item', async () => {
      const onSelect = vi.fn();
      const user = keyboard();
      render(<List onSelect={onSelect} defaultActiveIndex={1} />);
      await tabIntoList(user);

      await user.press('Enter');

      expect(onSelect).toHaveBeenCalledWith(1, expect.objectContaining({ key: 'Enter' }));
    });

    it('reports Space too', async () => {
      const onSelect = vi.fn();
      const user = keyboard();
      render(<List onSelect={onSelect} />);
      await tabIntoList(user);

      await user.press(' ');

      expect(onSelect).toHaveBeenCalledWith(0, expect.objectContaining({ key: ' ' }));
    });

    it('gives Space to an open typeahead buffer instead — a search can contain one', async () => {
      const onSelect = vi.fn();
      const user = keyboard();
      render(<List items={['Ada Lovelace', 'Ada Byron']} textOf={(index) => ['Ada Lovelace', 'Ada Byron'][index]} onSelect={onSelect} />);
      await tabIntoList(user);

      await user.type('ada b');

      expect(onSelect).not.toHaveBeenCalled();
      expectFocusOn(item('Ada Byron'));
    });
  });

  describe('without moving focus', () => {
    it('tracks the active item for aria-activedescendant while focus stays on the trigger', async () => {
      const user = keyboard();
      render(<Combobox />);
      const trigger = screen.getByRole('combobox');

      await user.pressTab();
      await user.pressArrow('Down');

      expectFocusOn(trigger);
      expect(trigger).toHaveAttribute('aria-activedescendant', 'option-1');
      expect(screen.getByRole('option', { name: 'Grace' })).toHaveAttribute('aria-selected', 'true');
    });

    it('leaves the items out of the tab order', () => {
      render(<Combobox />);

      expect(screen.getByRole('option', { name: 'Ada' })).not.toHaveAttribute('tabindex');
    });

    it('hands back the active element, for scrolling it into view', async () => {
      const user = keyboard();
      const seen: (string | null)[] = [];

      function Watcher() {
        const roving = useRovingFocus({ count: names.length, focusItems: false });

        return (
          <>
            <button onKeyDown={roving.onKeyDown}>Trigger</button>
            <ul>
              {names.map((name, index) => (
                <li key={name} {...roving.itemProps(index)}>
                  {name}
                </li>
              ))}
            </ul>
            <button onClick={() => seen.push(roving.activeItem()?.textContent ?? null)}>Report</button>
          </>
        );
      }

      render(<Watcher />);
      await user.pressTab();
      await user.pressArrow('Down');
      await user.click(screen.getByRole('button', { name: 'Report' }));

      expect(seen).toEqual(['Grace']);
    });
  });

  describe('the active index', () => {
    it('stays where the consumer puts it when the consumer owns it', async () => {
      const onActiveIndexChange = vi.fn();
      const user = keyboard();
      render(<List activeIndex={2} onActiveIndexChange={onActiveIndexChange} />);
      await tabIntoList(user);

      await user.pressArrow('Down');

      expect(onActiveIndexChange).toHaveBeenCalledWith(3, expect.objectContaining({ reason: 'keyboard' }));
      expect(activeIndex()).toBe(2);
    });

    it('never points past the end of a list that shrank', () => {
      const { rerender } = render(<List defaultActiveIndex={3} />);

      rerender(<List items={['Ada', 'Grace']} defaultActiveIndex={3} />);

      expect(activeIndex()).toBe(1);
    });

    it('can be set outright, for opening a list on the selected item', async () => {
      const user = keyboard();

      function WithReset() {
        const roving = useRovingFocus({ count: names.length });

        return (
          <>
            <button onClick={() => roving.setActiveIndex(2, { reason: 'programmatic' })}>Open on Alan</button>
            <ul onKeyDown={roving.onKeyDown}>
              {names.map((name, index) => (
                <li key={name}>
                  <button {...roving.itemProps(index)}>{name}</button>
                </li>
              ))}
            </ul>
          </>
        );
      }

      render(<WithReset />);
      await user.click(screen.getByRole('button', { name: 'Open on Alan' }));

      expect(item('Alan')).toHaveAttribute('tabindex', '0');
    });
  });

  describe('grid mode', () => {
    /**
     * The second axis. Row 2 is deliberately narrower than the rest — a grid's rows are not all
     * the same width once a cell spans its neighbours, and the movement has to clamp rather than
     * land on a cell that is not there.
     */
    const widthOf = (row: number) => (row === 2 ? 1 : 3);

    function DataGridLike(options?: Partial<RovingFocusOptions>) {
      const roving = useRovingFocus({ count: 4, columns: widthOf, ...options });

      return (
        <>
          <button>Before</button>
          <div role="grid" onKeyDown={roving.onKeyDown}>
            {[0, 1, 2, 3].map((row) => (
              <div key={row} role="row">
                {Array.from({ length: widthOf(row) }, (_, column) => (
                  <div key={column} role="gridcell" {...roving.cellProps(row, column)}>
                    {`r${row}c${column}`}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <output data-testid="cell">{`${roving.activeIndex}:${roving.activeColumn}`}</output>
        </>
      );
    }

    const cell = (name: string) => screen.getByRole('gridcell', { name });
    const active = () => screen.getByTestId('cell').textContent;

    const tabIntoGrid = async (user: ReturnType<typeof keyboard>) => {
      await user.pressTab();
      await user.pressTab();
    };

    it('puts exactly one cell in the tab order', async () => {
      const user = keyboard();
      render(<DataGridLike />);

      await tabIntoGrid(user);

      expectFocusOn(cell('r0c0'));
      expect(cell('r0c1')).toHaveAttribute('tabindex', '-1');
    });

    it('moves in two axes', async () => {
      const user = keyboard();
      render(<DataGridLike />);

      await tabIntoGrid(user);
      await user.pressArrow('Right');
      expectFocusOn(cell('r0c1'));

      await user.pressArrow('Down');
      expectFocusOn(cell('r1c1'));

      await user.pressArrow('Left');
      expectFocusOn(cell('r1c0'));

      await user.pressArrow('Up');
      expectFocusOn(cell('r0c0'));
    });

    it('stops at the edges instead of wrapping, which is where a grid differs from a list', async () => {
      const user = keyboard();
      render(<DataGridLike />);

      await tabIntoGrid(user);
      await user.pressArrow('Left');
      expect(active()).toBe('0:0');

      await user.pressArrow('Up');
      expect(active()).toBe('0:0');

      await user.pressCtrl('End');
      await user.pressArrow('Right');
      expect(active()).toBe('3:2');

      await user.pressArrow('Down');
      expect(active()).toBe('3:2');
    });

    it('clamps the column to a row that holds fewer cells, and remembers the one asked for', async () => {
      const user = keyboard();
      render(<DataGridLike />);

      await tabIntoGrid(user);
      await user.press('End');
      expect(active()).toBe('0:2');

      // Row 2 has one cell, so the third column is not there to land on.
      await user.pressArrow('Down');
      await user.pressArrow('Down');
      expect(active()).toBe('2:0');

      // Past it, the column the user was in comes back rather than staying collapsed.
      await user.pressArrow('Down');
      expect(active()).toBe('3:2');
    });

    it('takes Home and End along the row, and Ctrl+Home/End to the corners', async () => {
      const user = keyboard();
      render(<DataGridLike />);

      await tabIntoGrid(user);
      await user.pressArrow('Down');
      await user.press('End');
      expect(active()).toBe('1:2');

      await user.press('Home');
      expect(active()).toBe('1:0');

      await user.pressCtrl('End');
      expect(active()).toBe('3:2');

      await user.pressCtrl('Home');
      expect(active()).toBe('0:0');
    });

    it('moves whole pages, clamped at both ends', async () => {
      const user = keyboard();
      render(<DataGridLike pageSize={2} />);

      await tabIntoGrid(user);
      await user.press('PageDown');
      expect(active()).toBe('2:0');

      await user.press('PageDown');
      expect(active()).toBe('3:0');

      await user.press('PageUp');
      expect(active()).toBe('1:0');

      await user.press('PageUp');
      expect(active()).toBe('0:0');
    });

    it('reports the cell it moved to, and why', async () => {
      const user = keyboard();
      const onActiveCellChange = vi.fn();
      render(<DataGridLike onActiveCellChange={onActiveCellChange} />);

      await tabIntoGrid(user);
      await user.pressArrow('Right');

      expect(onActiveCellChange).toHaveBeenCalledWith({ row: 0, column: 1 }, expect.objectContaining({ reason: 'keyboard' }));
    });

    it('follows focus into a cell, so a click carries on from where it landed', async () => {
      const user = keyboard();
      render(<DataGridLike />);

      await user.click(cell('r1c2'));

      expect(active()).toBe('1:2');
      expect(cell('r1c2')).toHaveAttribute('tabindex', '0');
    });
  });

  it('ignores a key another handler has already dealt with', async () => {
    const user = keyboard();

    function Guarded() {
      const roving = useRovingFocus({ count: names.length });

      return (
        <div onKeyDown={roving.onKeyDown}>
          <ul onKeyDown={(event) => event.preventDefault()}>
            {names.map((name, index) => (
              <li key={name}>
                <button {...roving.itemProps(index)}>{name}</button>
              </li>
            ))}
          </ul>
        </div>
      );
    }

    render(<Guarded />);
    await user.pressTab();
    await user.pressArrow('Down');

    expectFocusOn(item('Ada'));
  });
});
