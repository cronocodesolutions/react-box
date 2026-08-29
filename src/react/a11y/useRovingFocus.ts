import { useCallback, useRef, useState } from 'react';
import { useLatest } from './callbacks';
import useControllableState, { ChangeDetails, ChangeHandler } from './useControllableState';

export type RovingFocusReason = 'keyboard' | 'typeahead' | 'focus' | 'programmatic';

export type RovingOrientation = 'vertical' | 'horizontal' | 'both';

/** How long a typeahead buffer stays open, per APG. */
const TYPEAHEAD_TIMEOUT = 1000;

/** Rows a PageUp/PageDown moves when the caller names no page size. */
const DEFAULT_PAGE_SIZE = 10;

/** A position in grid mode. Both are `-1` when nothing is active. */
export interface RovingCell {
  row: number;
  column: number;
}

export interface RovingFocusOptions {
  /** How many items there are right now — rows, in grid mode. A filtered list may change this. */
  count: number;
  /**
   * Turns the list into a grid and `count` into a count of rows: this is how many cells the row
   * at `row` holds. A number when every row holds the same, a function when they do not — a group
   * row spanning its columns holds fewer cells than the rows underneath it.
   *
   * Grid mode moves in two axes and, per APG's grid pattern, never wraps: an arrow at an edge
   * leaves focus where it is. Home/End go to the row's ends, Ctrl+Home/Ctrl+End to the grid's
   * first and last cell, and PageUp/PageDown move `pageSize` rows at a time.
   */
  columns?: number | ((row: number) => number);
  /** Rows a PageUp/PageDown moves. Default 10. Grid mode only. */
  pageSize?: number;
  /** The starting column, when the caller wants one other than the first. Grid mode only. */
  defaultActiveColumn?: number;
  /** The active cell moved. Grid mode only — `onActiveIndexChange` still reports the row. */
  onActiveCellChange?: ChangeHandler<RovingCell, RovingFocusReason>;
  /** Which arrow keys navigate. Default `vertical`. Ignored in grid mode, which uses both axes. */
  orientation?: RovingOrientation;
  /** Wrap around at the ends. Default true. */
  loop?: boolean;
  activeIndex?: number;
  defaultActiveIndex?: number;
  onActiveIndexChange?: ChangeHandler<number, RovingFocusReason>;
  /** Disabled items are skipped by every movement, as APG requires. */
  isDisabled?: (index: number) => boolean;
  /** An item's text. Supplying it turns on typeahead. */
  textOf?: (index: number) => string;
  /**
   * Move real DOM focus onto the active item. Default true — the roving-tabindex pattern.
   *
   * `false` is the other half of the APG list patterns: focus stays where it is (a combobox's
   * trigger, say) and the active item is named by `aria-activedescendant` instead. The hook still
   * tracks the index and hands back the element; what it does not do is take focus.
   */
  focusItems?: boolean;
  /** Enter, and Space when no typeahead buffer is open. */
  onSelect?: (index: number, event: React.KeyboardEvent) => void;
}

export interface RovingFocusItemProps {
  ref: (element: HTMLElement | null) => void;
  tabIndex?: number;
  onFocus?: () => void;
}

export interface RovingFocus {
  /** Clamped to the current `count`; `-1` when nothing is active. The row, in grid mode. */
  activeIndex: number;
  /** The active cell's column, clamped to its row's width. `-1` outside grid mode. */
  activeColumn: number;
  setActiveIndex: (index: number, details: ChangeDetails<RovingFocusReason>) => void;
  /** Grid mode: move both axes at once. Out-of-range values are clamped, never rejected. */
  setActiveCell: (row: number, column: number, details: ChangeDetails<RovingFocusReason>) => void;
  /** Put this on the element that has focus: the list in roving-tabindex, the trigger otherwise. */
  onKeyDown: (event: React.KeyboardEvent) => void;
  itemProps: (index: number) => RovingFocusItemProps;
  /** Grid mode's `itemProps`: the roving tabindex and the ref for one cell. */
  cellProps: (row: number, column: number) => RovingFocusItemProps;
  /**
   * The active item's element — for `aria-activedescendant`, or to scroll it into view.
   *
   * `null` in grid mode whenever the active cell is not rendered, which a virtualized grid is full
   * of: bring the row into view first, then read this again on the render that follows.
   */
  activeItem: () => HTMLElement | null;
}

/** Keeps a coordinate inside `[0, max]`. `max` below zero means there is nowhere to be. */
function clamp(value: number, max: number): number {
  return max < 0 ? -1 : Math.max(0, Math.min(value, max));
}

/** The next selectable index in a direction, or `-1` when there is none. */
function step(from: number, delta: number, count: number, loop: boolean, isDisabled?: (index: number) => boolean): number {
  if (count === 0) return -1;

  let index = from;

  for (let taken = 0; taken < count; taken++) {
    index += delta;

    if (index < 0 || index >= count) {
      if (!loop) return -1;
      index = ((index % count) + count) % count;
    }

    if (!isDisabled?.(index)) return index;
  }

  return -1;
}

/** The first (`delta: 1`) or last (`delta: -1`) selectable index. */
function edge(delta: number, count: number, isDisabled?: (index: number) => boolean): number {
  return step(delta === 1 ? -1 : count, delta, count, false, isDisabled);
}

/**
 * The item a typeahead buffer points at.
 *
 * A buffer of one character — or of the same character repeated, which is how a user cycles
 * through the items sharing a first letter — searches from *after* the current item. A longer
 * buffer is a real prefix and searches from the current item, so typing further letters narrows
 * onto the item already found instead of skipping past it.
 */
function typeaheadTarget(
  query: string,
  from: number,
  count: number,
  textOf: (index: number) => string,
  isDisabled?: (index: number) => boolean,
): number {
  if (count === 0) return -1;

  const chars = [...query];
  const repeated = chars.every((char) => char === chars[0]);
  const needle = (repeated ? chars[0] : query).toLowerCase();
  const start = repeated ? from + 1 : from;

  for (let offset = 0; offset < count; offset++) {
    const index = (((start + offset) % count) + count) % count;

    if (isDisabled?.(index)) continue;
    if (textOf(index).trim().toLowerCase().startsWith(needle)) return index;
  }

  return -1;
}

function isPrintable(event: React.KeyboardEvent): boolean {
  return event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey;
}

/**
 * Arrow-key navigation over a list: the movement half of every APG list pattern (listbox, menu,
 * tabs, radio group), with the two focus strategies those patterns use between them.
 *
 * What it owns: which item is active, how the arrow keys, Home/End and typeahead move it, and
 * which items are skipped. What it leaves to the caller: the roles and the ARIA. That split is
 * deliberate — a listbox and a menu navigate identically and are named completely differently, so
 * a hook that supplied both would be wrong for one of them.
 *
 * `columns` turns the same movement into APG's grid pattern: two axes, no wrapping at the edges,
 * Ctrl+Home/End for the corners and PageUp/PageDown by the page. A grid is the one list pattern
 * whose rows may hold different numbers of cells, so `columns` may be a function of the row.
 */
export default function useRovingFocus(options: RovingFocusOptions): RovingFocus {
  const {
    count,
    columns,
    pageSize = DEFAULT_PAGE_SIZE,
    defaultActiveColumn = 0,
    onActiveCellChange,
    orientation = 'vertical',
    loop = true,
    activeIndex: controlledIndex,
    defaultActiveIndex = 0,
    onActiveIndexChange,
    isDisabled,
    textOf,
    focusItems = true,
    onSelect,
  } = options;

  const [rawIndex, setIndex] = useControllableState<number, RovingFocusReason>({
    value: controlledIndex,
    defaultValue: defaultActiveIndex,
    onChange: onActiveIndexChange,
  });

  // A list that shrinks — a search filtering it — must not leave the active index past its end.
  const activeIndex = Math.min(rawIndex, count - 1);

  const isGrid = columns !== undefined;
  const widthOf = useCallback((row: number) => (typeof columns === 'function' ? columns(row) : (columns ?? 0)), [columns]);

  /**
   * The column the user last *asked* for, which is not always one the current row has: moving down
   * through a group row that spans its columns, or a detail row that is a single cell, must not
   * collapse the position permanently into column 0. The clamp below is a view of it, so the
   * column comes back on the far side.
   */
  const [rawColumn, setRawColumn] = useState(defaultActiveColumn);
  const activeColumn = isGrid && activeIndex >= 0 ? clamp(rawColumn, widthOf(activeIndex) - 1) : -1;

  const items = useRef<(HTMLElement | null)[]>([]);
  const itemRefs = useRef(new Map<number, (element: HTMLElement | null) => void>());
  const cells = useRef(new Map<string, HTMLElement>());
  const cellRefs = useRef(new Map<string, (element: HTMLElement | null) => void>());
  const typeahead = useRef({ query: '', at: 0 });

  const focusItem = useCallback((index: number) => {
    items.current[index]?.focus();
  }, []);

  /**
   * True only while the hook is moving focus itself.
   *
   * `focus()` fires synchronously, so the `onFocus` a move causes runs before the state it set has
   * been committed — and it would report the cell it landed on as a fresh request, throwing away
   * the column the user actually asked for on the way through a narrow row.
   */
  const movingFocus = useRef(false);

  const focusCell = useCallback((row: number, column: number) => {
    movingFocus.current = true;
    cells.current.get(`${row}:${column}`)?.focus();
    movingFocus.current = false;
  }, []);

  const activeItem = useCallback(
    () => (isGrid ? (cells.current.get(`${activeIndex}:${activeColumn}`) ?? null) : (items.current[activeIndex] ?? null)),
    [activeColumn, activeIndex, isGrid],
  );

  // Read at call time so the setter below can stay stable while still refusing a move that
  // resolves to the cell already active.
  const activeCell = useLatest<RovingCell>({ row: activeIndex, column: activeColumn });
  const desiredColumn = useLatest(rawColumn);
  const cellChange = useLatest(onActiveCellChange);
  const width = useLatest(widthOf);

  const setActiveCell = useCallback(
    (row: number, column: number, details: ChangeDetails<RovingFocusReason>): RovingCell => {
      const targetRow = clamp(row, count - 1);
      const desired = Math.max(0, column);
      const targetColumn = targetRow < 0 ? -1 : clamp(desired, width.current(targetRow) - 1);
      const current = activeCell.current;

      if (targetRow === current.row && targetColumn === current.column) return current;

      setIndex(targetRow, details);
      setRawColumn(desired);
      cellChange.current?.({ row: targetRow, column: targetColumn }, details);

      return { row: targetRow, column: targetColumn };
    },
    [activeCell, cellChange, count, setIndex, width],
  );

  const cellProps = useCallback(
    (row: number, column: number): RovingFocusItemProps => {
      const key = `${row}:${column}`;

      if (!cellRefs.current.has(key)) {
        // One callback ref per cell, as in `itemProps` — but dropped again when the cell unmounts,
        // because a virtualized grid scrolls through far more cells than it ever has on screen.
        cellRefs.current.set(key, (element: HTMLElement | null) => {
          if (element) {
            cells.current.set(key, element);
          } else {
            cells.current.delete(key);
            cellRefs.current.delete(key);
          }
        });
      }

      return {
        ref: cellRefs.current.get(key)!,
        tabIndex: row === activeIndex && column === activeColumn ? 0 : -1,
        // Focus events bubble, so this also fires for a widget inside the cell — which is right:
        // clicking into a filter box makes that cell the one the arrow keys carry on from.
        onFocus: () => {
          if (movingFocus.current) return;

          setActiveCell(row, column, { reason: 'focus' });
        },
      };
    },
    [activeColumn, activeIndex, setActiveCell],
  );

  const itemProps = useCallback(
    (index: number): RovingFocusItemProps => {
      if (!itemRefs.current.has(index)) {
        // One callback ref per index, kept for the life of the hook: a fresh function on every
        // render makes React detach and reattach every item on every render, which loses focus.
        itemRefs.current.set(index, (element: HTMLElement | null) => {
          items.current[index] = element;
        });
      }

      return {
        ref: itemRefs.current.get(index)!,
        // Roving tabindex: exactly one item is in the tab order, so Tab enters and leaves the list
        // in one press instead of walking through every option in it.
        tabIndex: focusItems ? (index === activeIndex ? 0 : -1) : undefined,
        onFocus: focusItems ? () => setIndex(index, { reason: 'focus' }) : undefined,
      };
    },
    [activeIndex, focusItems, setIndex],
  );

  const onGridKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const { row, column } = activeCell.current;
      // Sideways moves start from the column that is really there; downward ones from the column
      // the user asked for, which is what carries a position past a row too narrow to hold it.
      const desired = desiredColumn.current;

      // Every key below is one the grid consumes whether or not it has anywhere to go: an arrow
      // at the last row must not fall through to the page and scroll it instead.
      const move = (targetRow: number, targetColumn: number) => {
        event.preventDefault();
        const moved = setActiveCell(targetRow, targetColumn, { reason: 'keyboard', event });
        if (focusItems) focusCell(moved.row, moved.column);
      };

      const toEnd = Number.MAX_SAFE_INTEGER;

      switch (event.key) {
        case 'ArrowRight':
          return move(row, column + 1);
        case 'ArrowLeft':
          return move(row, column - 1);
        case 'ArrowDown':
          return move(row + 1, desired);
        case 'ArrowUp':
          return move(row - 1, desired);
        case 'Home':
          return event.ctrlKey || event.metaKey ? move(0, 0) : move(row, 0);
        case 'End':
          return event.ctrlKey || event.metaKey ? move(count - 1, toEnd) : move(row, toEnd);
        case 'PageDown':
          return move(row + pageSize, desired);
        case 'PageUp':
          return move(row - pageSize, desired);
      }
    },
    [activeCell, count, desiredColumn, focusCell, focusItems, pageSize, setActiveCell],
  );

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.defaultPrevented) return;

      if (isGrid) {
        onGridKeyDown(event);
        return;
      }

      const vertical = orientation !== 'horizontal';
      const horizontal = orientation !== 'vertical';
      const buffer = typeahead.current;
      const bufferIsOpen = buffer.query !== '' && event.timeStamp - buffer.at < TYPEAHEAD_TIMEOUT;

      const move = (target: number, reason: RovingFocusReason) => {
        if (target === -1 || target === activeIndex) return;

        event.preventDefault();
        setIndex(target, { reason, event });
        if (focusItems) focusItem(target);
      };

      if ((event.key === 'ArrowDown' && vertical) || (event.key === 'ArrowRight' && horizontal)) {
        move(step(activeIndex, 1, count, loop, isDisabled), 'keyboard');
        return;
      }

      if ((event.key === 'ArrowUp' && vertical) || (event.key === 'ArrowLeft' && horizontal)) {
        move(step(activeIndex, -1, count, loop, isDisabled), 'keyboard');
        return;
      }

      if (event.key === 'Home') {
        move(edge(1, count, isDisabled), 'keyboard');
        return;
      }

      if (event.key === 'End') {
        move(edge(-1, count, isDisabled), 'keyboard');
        return;
      }

      // Space belongs to the typeahead while a buffer is open — someone searching for "New York"
      // means the space between the words, not "choose whatever is highlighted".
      if (event.key === 'Enter' || (event.key === ' ' && !(bufferIsOpen && textOf))) {
        if (!onSelect || activeIndex === -1) return;

        event.preventDefault();
        onSelect(activeIndex, event);
        return;
      }

      if (textOf && isPrintable(event)) {
        buffer.query = bufferIsOpen ? buffer.query + event.key : event.key;
        buffer.at = event.timeStamp;

        move(typeaheadTarget(buffer.query, activeIndex, count, textOf, isDisabled), 'typeahead');
      }
    },
    [activeIndex, count, focusItem, focusItems, isDisabled, isGrid, loop, onGridKeyDown, onSelect, orientation, setIndex, textOf],
  );

  return { activeIndex, activeColumn, setActiveIndex: setIndex, setActiveCell, onKeyDown, itemProps, cellProps, activeItem };
}
