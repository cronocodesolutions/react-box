import { useCallback, useRef } from 'react';
import useControllableState, { ChangeDetails, ChangeHandler } from './useControllableState';

export type RovingFocusReason = 'keyboard' | 'typeahead' | 'focus' | 'programmatic';

export type RovingOrientation = 'vertical' | 'horizontal' | 'both';

/** How long a typeahead buffer stays open, per APG. */
const TYPEAHEAD_TIMEOUT = 1000;

export interface RovingFocusOptions {
  /** How many items there are right now. A filtered list may change this between renders. */
  count: number;
  /** Which arrow keys navigate. Default `vertical`. */
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
  /** Clamped to the current `count`; `-1` when nothing is active. */
  activeIndex: number;
  setActiveIndex: (index: number, details: ChangeDetails<RovingFocusReason>) => void;
  /** Put this on the element that has focus: the list in roving-tabindex, the trigger otherwise. */
  onKeyDown: (event: React.KeyboardEvent) => void;
  itemProps: (index: number) => RovingFocusItemProps;
  /** The active item's element — for `aria-activedescendant`, or to scroll it into view. */
  activeItem: () => HTMLElement | null;
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
 */
export default function useRovingFocus(options: RovingFocusOptions): RovingFocus {
  const {
    count,
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

  const items = useRef<(HTMLElement | null)[]>([]);
  const itemRefs = useRef(new Map<number, (element: HTMLElement | null) => void>());
  const typeahead = useRef({ query: '', at: 0 });

  const focusItem = useCallback((index: number) => {
    items.current[index]?.focus();
  }, []);

  const activeItem = useCallback(() => items.current[activeIndex] ?? null, [activeIndex]);

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

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.defaultPrevented) return;

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
    [activeIndex, count, focusItem, focusItems, isDisabled, loop, onSelect, orientation, setIndex, textOf],
  );

  return { activeIndex, setActiveIndex: setIndex, onKeyDown, itemProps, activeItem };
}
