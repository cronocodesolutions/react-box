import { forwardRef, FunctionComponent, ReactElement, Ref, RefAttributes, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Box, { BoxProps } from '../box';
import { useEventCallback } from '../react/a11y/callbacks';
import useDismiss from '../react/a11y/useDismiss';
import useFocusReturn from '../react/a11y/useFocusReturn';
import useIdentifier from '../react/a11y/useIdentifier';
import useRovingFocus from '../react/a11y/useRovingFocus';
import { useIsomorphicLayoutEffect } from '../react/effects';
import { BoxStyleProps, ComponentsAndVariants } from '../types';
import BaseSvg from './baseSvg';
import Button from './button';
import DropdownContext, { DropdownItemProps, DropdownRow } from './dropdown/dropdownContext';
import DropdownItems from './dropdown/dropdownItems';
import DropdownSearch from './dropdown/dropdownSearch';
import { searchItemText } from './dropdown/utils';
import Flex from './flex';
import Textbox from './textbox';

interface Props<TVal, TKey extends keyof ComponentsAndVariants = 'dropdown'> extends Omit<BoxProps<'button', TKey>, 'ref' | 'tag'> {
  name?: string;
  defaultValue?: TVal | TVal[];
  value?: TVal | TVal[];
  multiple?: boolean;
  /**
   * Turn the control into the APG *editable* combobox: a text field that filters the listbox.
   *
   * The field is the combobox — it carries the role, the ARIA and anything you pass in `props` —
   * so this is a different pattern from the select-only one rather than a decoration on top of it.
   * What changes for a keyboard: printable keys type instead of jumping to an option (there is no
   * typeahead, the visible field owns the keystrokes), Home/End and the left/right arrows move the
   * caret, and Escape closes the listbox before it clears the field.
   */
  isSearchable?: boolean;
  searchPlaceholder?: string;
  hideIcon?: boolean;
  /** Show checkbox for each item in multiple selection mode */
  showCheckbox?: boolean;
  /**
   * The dropdown's name, rendered above it and pointed at by `aria-labelledby`.
   *
   * A combobox is not named by what it contains — the text in the trigger is its *value*, and
   * accname does not read the contents of a combobox at all. Without a `label` (or an `aria-label`
   * of your own in `props`) the control has no accessible name, exactly like an `<input>` with
   * nothing but a placeholder.
   */
  label?: React.ReactNode;
  /** Styles for the wrapper the label and the trigger share. Only rendered when there is a label. */
  labelProps?: BoxProps<'div'>;
  /** BoxProps applied to the opened items container (dropdown.items) */
  itemsProps?: BoxStyleProps;
  /** BoxProps applied to the chevron icon container (dropdown.icon) */
  iconProps?: BoxStyleProps;
  onChange?: (value: TVal | undefined, values: TVal[]) => void;
}

/** A `disabled` that came from a caller as a state, not as the `[state, styles]` pseudo-class form. */
function isDisabledElement(element?: ReactElement): boolean {
  const flag = (element?.props as { disabled?: unknown } | undefined)?.disabled;

  return (Array.isArray(flag) ? flag[0] : flag) === true;
}

/** A key that types a character, as opposed to one that commands. Printables open the listbox. */
function isPrintable(event: React.KeyboardEvent): boolean {
  return event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey;
}

/**
 * The keys an editable combobox hands straight to its text field.
 *
 * Each of them also puts the highlight back on the field, which is what APG means by "moves visual
 * focus to the textbox": the caret has moved, so the option the arrows were on is no longer where
 * the user is.
 */
const TEXT_EDITING_KEYS = new Set([' ', 'Home', 'End', 'ArrowLeft', 'ArrowRight']);

/**
 * The APG combobox, in both of its shapes.
 *
 * Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
 *
 * ```tsx
 * <Dropdown<string> label="Fruit" defaultValue="apple" onChange={(value) => setFruit(value)}>
 *   <Dropdown.Item value="apple">Apple</Dropdown.Item>
 *   <Dropdown.Item value="banana">Banana</Dropdown.Item>
 * </Dropdown>
 * ```
 *
 * **Select-only** by default: a `<button>` that owns focus and a listbox it controls. DOM focus
 * never moves into the popup. That is the shape of this pattern rather than a shortcut: the
 * trigger keeps focus and names the highlighted option with `aria-activedescendant`, so one Tab
 * still enters and leaves the control, Escape has somewhere to return to for free, and the options
 * do not each become a tab stop. `useRovingFocus({ focusItems: false })` is the half of that hook
 * written for it.
 *
 * The keyboard map, closed: Down/Up/Enter/Space open — on the selected option when there is one,
 * otherwise the first or the last — Home and End open at an end, and a printable character opens
 * and jumps to the first match. Open: the arrows move the highlight, Home/End go to the ends,
 * typing searches, Enter and Space choose, Escape closes and changes nothing, and Tab chooses
 * before it leaves. `PageUp`/`PageDown` are the one part of the APG map left out — they are
 * optional there, and a second movement implementation beside the hook's would be the wrong place
 * for it.
 *
 * **Editable** with `isSearchable`: the trigger is a text field carrying `role="combobox"` and
 * `aria-autocomplete="list"`, and the listbox holds what that field has filtered down to. Focus
 * lives in the field from the first keystroke to the last, so the keys divide differently — the
 * printable ones type, Home/End and the left/right arrows move the caret and hand the highlight
 * back to the field, only Down/Up reach the listbox, and Escape closes the listbox before a second
 * Escape clears what was typed. Filtering never moves the highlight onto a suggestion; that is the
 * user's to do with an arrow, and it is the difference between list and inline autocomplete.
 *
 * What is deliberately *not* here is a name. See the `label` prop.
 */
function DropdownImpl<TVal>(props: Props<TVal>, ref: Ref<HTMLInputElement>): React.ReactNode {
  const {
    name,
    defaultValue,
    value,
    multiple = false,
    isSearchable,
    searchPlaceholder,
    children,
    hideIcon,
    showCheckbox = false,
    label,
    labelProps,
    itemsProps,
    iconProps,
    onChange,
    props: tagProps,
    ...restProps
  } = props;

  const [selectedValues, setSelectedValues] = useState(Array.isArray(defaultValue) ? defaultValue : defaultValue ? [defaultValue] : []);
  const isControlled = 'value' in props;
  const valueToUse = useMemo(
    () => (isControlled ? (Array.isArray(value) ? value : value ? [value] : []) : selectedValues),
    [isControlled, value, selectedValues],
  );

  /**
   * What has been typed into the field, or `null` for "nothing — it is showing the value".
   *
   * The two are genuinely different states: an empty string is a field the user emptied, which
   * matches everything and displays nothing, while `null` is a field that has gone back to
   * displaying what is selected.
   */
  const [search, setSearch] = useState<string | null>(null);

  const [isOpen, setOpen] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);
  // A callback rather than a ref object: the trigger is a `<button>` in one mode and a `<div>` in
  // the other, and one `RefObject<T>` cannot be handed to both.
  const setTriggerRef = useCallback((element: HTMLElement | null) => {
    triggerRef.current = element;
  }, []);
  const popupRef = useRef<HTMLDivElement>(null);
  const searchBoxRef = useRef<HTMLInputElement>(null);

  const identifier = useIdentifier('dropdown');
  const triggerId = restProps.id ?? `${identifier}-trigger`;
  const listboxId = `${identifier}-listbox`;
  const labelId = `${identifier}-label`;
  const hasLabel = label !== undefined && label !== null && label !== false;
  const optionId = useCallback((index: number) => `${identifier}-option-${index}`, [identifier]);

  /** Close the listbox, and let the field go back to the value — unless Escape said not to. */
  const close = useEventCallback((keepSearch = false) => {
    setOpen(false);
    if (!keepSearch) setSearch(null);
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allKids = useMemo<ReactElement<any, FunctionComponent>[]>(
    () => (Array.isArray(children) ? children : [children]).flatMap((x) => x).filter(Boolean),
    [children],
  );
  const items = useMemo(() => allKids.filter((x) => x.type?.displayName === 'DropdownItem'), [allKids]);
  const itemTextCache = useMemo(() => {
    const cache = new Map<React.ReactElement, string>();
    for (const item of items) {
      cache.set(item, searchItemText(item));
    }
    return cache;
  }, [items]);
  const getItemText = useCallback((item: React.ReactElement) => itemTextCache.get(item) ?? searchItemText(item), [itemTextCache]);

  const query = isSearchable ? (search ?? '') : '';

  const filteredItems = useMemo<React.ReactElement<DropdownItemProps<TVal>>[]>(() => {
    if (!query) return items;

    return items.filter((x) => getItemText(x).toLowerCase().includes(query.toLowerCase()));
  }, [query, items, getItemText]);

  const unselectItem = useMemo(() => allKids.find((x) => (x.type as FunctionComponent)?.displayName === 'DropdownUnselect'), [allKids]);
  const selectAllItem = useMemo(() => allKids.find((x) => (x.type as FunctionComponent)?.displayName === 'DropdownSelectAll'), [allKids]);
  const emptyItem = useMemo(() => allKids.find((x) => (x.type as FunctionComponent)?.displayName === 'DropdownEmptyItem'), [allKids]);
  const displayItem = useMemo(() => allKids.find((x) => (x.type as FunctionComponent)?.displayName === 'DropdownDisplay'), [allKids]);

  /**
   * The selection as text, when it has one — what an editable combobox puts in its field.
   *
   * A combobox is announced by its name and its *value*, and the value of an editable one is the
   * text in the field: leaving that blank while something is selected is how a screen-reader user
   * ends up hearing "Fruit, combobox, blank" with Apple chosen. A custom `Dropdown.Display` is the
   * case with no text form — arbitrary JSX cannot be a field's value — and there the field stays
   * empty, the display node keeps drawing the selection, and `aria-selected` on the options is
   * what carries it into the accessibility tree.
   */
  const selectionText = useMemo(() => {
    if (!isSearchable || displayItem) return '';

    return items
      .filter((item) => valueToUse.includes(item.props.value))
      .map((item) => getItemText(item))
      .join(', ');
  }, [isSearchable, displayItem, items, valueToUse, getItemText]);

  const showSelectAll = !!(selectAllItem && multiple && filteredItems.length > valueToUse.length);
  const showUnselect = !!(unselectItem && filteredItems.length > 0 && !showSelectAll);

  /** Every row of the open listbox in one array — see `DropdownRow`. Index is the shared language. */
  const rows = useMemo<DropdownRow<TVal>[]>(() => {
    const list: DropdownRow<TVal>[] = [];

    if (showUnselect && unselectItem) list.push({ kind: 'unselect', element: unselectItem });
    if (showSelectAll && selectAllItem) list.push({ kind: 'selectAll', element: selectAllItem });
    for (const item of filteredItems) list.push({ kind: 'item', element: item });

    return list;
  }, [showUnselect, unselectItem, showSelectAll, selectAllItem, filteredItems]);

  const isRowDisabled = useCallback((index: number) => isDisabledElement(rows[index]?.element), [rows]);
  const rowText = useCallback(
    (index: number) => {
      const row = rows[index];

      return row ? getItemText(row.element) : '';
    },
    [rows, getItemText],
  );

  const display = useMemo(() => {
    // In the editable pattern the field is what shows the selection, and two copies of it in one
    // box is one too many. The display node stands in only where the field cannot: while the
    // listbox is open — the query owns the field then — and when the selection has no text form.
    if (isSearchable && (isOpen || selectionText !== '')) return null;

    if (displayItem)
      return typeof displayItem.props.children === 'function' ? displayItem.props.children(valueToUse, isOpen) : displayItem.props.children;

    const selectedKids = filteredItems.filter((k) => valueToUse.includes(k.props.value));

    if (multiple && selectedKids.length > 1) {
      return selectedKids.map((x) => getItemText(x)).join(', ');
    }

    const selectedKid = selectedKids.at(0);

    return (
      (selectedKid?.props.children as React.ReactElement<DropdownItemProps<TVal>>) ??
      selectedKid?.props.value ??
      (multiple ? null : unselectItem?.props.children)
    );
  }, [multiple, filteredItems, valueToUse, unselectItem, isOpen, isSearchable, selectionText, displayItem, getItemText]);

  const applySelection = useCallback(
    (e: React.SyntheticEvent, ...kids: React.ReactElement<DropdownItemProps<TVal>>[]) => {
      // unselect all
      if (kids.length === 0) {
        setSelectedValues([]);
        onChange?.(undefined, []);
      }
      // select multiple
      else if (multiple && kids.length > 1) {
        const newValues = kids.map((k) => k.props.value);

        setSelectedValues(newValues);
        onChange?.(undefined, newValues);
      }
      // clicked one item
      else if (kids.length === 1) {
        const kid = kids[0];

        if (multiple) {
          const values = valueToUse.filter((value) => value !== kid.props.value);

          if (values.length === valueToUse.length) {
            values.push(kid.props.value);
          }

          setSelectedValues(values);
          onChange?.(kid.props.value, values);
        } else {
          setSelectedValues([kid.props.value]);
          onChange?.(kid.props.value, [kid.props.value]);
        }
      }

      // The popup is a React child of the trigger even though it renders through a portal, so a
      // click inside it bubbles to the trigger's own toggle. Stopping it here is what keeps
      // choosing an option from reopening the dropdown in the same gesture.
      e.stopPropagation();

      if (multiple) {
        // A row is not focusable, so pressing one drops focus to the body. The field has to take
        // it back, or the next keystroke of a search in progress goes nowhere.
        if (isSearchable) setTimeout(() => searchBoxRef.current?.focus(), 0);
      } else {
        close();
      }
    },
    [multiple, isSearchable, valueToUse, onChange, close],
  );

  /** Choosing a row, whichever kind it is — the one path a click and an Enter both take. */
  const selectRow = useEventCallback((index: number, event: React.SyntheticEvent) => {
    const row = rows[index];
    if (!row || isRowDisabled(index)) return;

    if (row.kind === 'unselect') applySelection(event);
    else if (row.kind === 'selectAll') applySelection(event, ...(items as React.ReactElement<DropdownItemProps<TVal>>[]));
    else applySelection(event, row.element);
  });

  const roving = useRovingFocus({
    count: rows.length,
    focusItems: false,
    defaultActiveIndex: -1,
    isDisabled: isRowDisabled,
    // Typeahead is the list's while the trigger holds the keystrokes. In searchable mode the
    // search box does, and a hidden second buffer racing the one the user can see is worse than
    // no typeahead at all.
    textOf: isSearchable ? undefined : rowText,
    onSelect: selectRow,
  });

  const setActiveIndex = roving.setActiveIndex;
  /** Hand the highlight back to the text field: no option is the one the arrows are on. */
  const clearHighlight = useCallback(
    (event?: React.SyntheticEvent) => setActiveIndex(-1, { reason: 'programmatic', event }),
    [setActiveIndex],
  );

  useDismiss({
    enabled: isOpen,
    // The trigger counts as inside: a press on an open dropdown's own button has to reach its
    // toggle, not be read as a press outside and dismissed and reopened in one gesture.
    inside: [triggerRef, popupRef],
    // Escape keeps what has been typed, which is what makes a *second* Escape the key that clears
    // the field — the editable combobox's two-step dismissal. Every other way of closing puts the
    // field back to the value, since a query left behind would be describing a filter that is no
    // longer applied to anything.
    onDismiss: (reason) => close(reason === 'escape'),
  });

  // Focus lands back on the trigger only when a close left it nowhere — clicking an option drops
  // it to the body. Escape never moved it, and Tab moved it on purpose; neither is taken back.
  useFocusReturn({ enabled: isOpen, returnTo: isSearchable ? searchBoxRef : triggerRef });

  useEffect(() => {
    // Opening from a keystroke leaves focus where it already is; opening from a press on the
    // shell's own padding does not, and the field is where the keys have to arrive either way.
    if (isOpen) searchBoxRef.current?.focus();
  }, [isOpen]);

  const activeIndex = roving.activeIndex;
  const activeItem = roving.activeItem;
  useIsomorphicLayoutEffect(() => {
    if (!isOpen || activeIndex === -1) return;

    // A highlight the user cannot see is not a highlight. `nearest` so a list that already shows
    // the option does not jump.
    activeItem()?.scrollIntoView?.({ block: 'nearest' });
  }, [isOpen, activeIndex, activeItem]);

  /** The first row the arrows may land on, from either end. */
  const edgeIndex = (from: 'first' | 'last'): number => {
    const delta = from === 'first' ? 1 : -1;

    for (let index = from === 'first' ? 0 : rows.length - 1; index >= 0 && index < rows.length; index += delta) {
      if (!isRowDisabled(index)) return index;
    }

    return -1;
  };

  /** Where the highlight lands when the listbox opens: on what is selected, or at the end implied. */
  const indexOnOpen = (fallback: 'first' | 'last' | 'none'): number => {
    const selected = rows.findIndex((row) => row.kind === 'item' && valueToUse.includes(row.element.props.value));
    if (selected !== -1 && !isRowDisabled(selected)) return selected;

    return fallback === 'none' ? -1 : edgeIndex(fallback);
  };

  const openAt = (index: number, event: React.SyntheticEvent) => {
    setOpen(true);
    roving.setActiveIndex(index, { reason: 'programmatic', event });
  };

  const toggleOpen = useEventCallback((event: React.MouseEvent) => {
    if (isOpen) close();
    else openAt(indexOnOpen('none'), event);
  });

  /** A press in the text field opens the listbox and never closes it — see `DropdownSearch`. */
  const openFromField = useEventCallback((event: React.MouseEvent) => {
    if (!isOpen) openAt(indexOnOpen('none'), event);
  });

  const handleSearchChange = useEventCallback((next: string) => {
    setSearch(next);
    // Typing into a closed combobox is a request to see what it matches.
    if (!isOpen) setOpen(true);
    // Filtering must not carry the highlight with it: APG keeps visual focus in the field while
    // the user types, and an index into a list that has just changed points at the wrong option.
    clearHighlight();
  });

  const handleClosedKeyDown = (event: React.KeyboardEvent) => {
    const { key } = event;

    if (isSearchable) {
      // The field owns every key that types or moves a caret; only the two that command the
      // listbox are taken, and a printable character reaches it through `onChange` instead.
      if (key === 'ArrowDown' || key === 'ArrowUp') {
        event.preventDefault();
        openAt(indexOnOpen(key === 'ArrowUp' ? 'last' : event.altKey ? 'none' : 'first'), event);
        return;
      }

      // APG: Escape dismisses the listbox — and with no listbox to dismiss, clears the field.
      if (key === 'Escape') setSearch('');

      return;
    }

    if (key === 'ArrowDown' || key === 'Enter' || key === ' ') {
      // Without this the browser activates the button on its own straight afterwards, and the
      // click that follows would toggle the listbox back shut in the same keystroke.
      event.preventDefault();
      openAt(indexOnOpen(event.altKey ? 'none' : 'first'), event);
      return;
    }

    if (key === 'ArrowUp') {
      event.preventDefault();
      openAt(indexOnOpen('last'), event);
      return;
    }

    if (key === 'Home' || key === 'End') {
      event.preventDefault();
      openAt(edgeIndex(key === 'Home' ? 'first' : 'last'), event);
      return;
    }

    if (isPrintable(event)) {
      setOpen(true);
      // The row list does not depend on the popup being on screen, so the same typeahead that
      // moves the highlight while open can decide where it starts.
      roving.onKeyDown(event);
    }
  };

  const handleKeyDown = useEventCallback((event: React.KeyboardEvent) => {
    tagProps?.onKeyDown?.(event as React.KeyboardEvent<HTMLButtonElement>);
    if (event.defaultPrevented) return;

    if (!isOpen) {
      handleClosedKeyDown(event);
      return;
    }

    // Escape is not handled here on purpose: `useDismiss` owns it, and it owns it for the whole
    // page at once. A dropdown open inside a dialog must close the dropdown and leave the dialog
    // alone, and only the layer registry knows which of the two is innermost.

    if (event.key === 'Tab') {
      // APG: Tab commits the highlighted option and then leaves. No `preventDefault` — moving on
      // is the whole point of the key.
      if (!multiple && roving.activeIndex !== -1) selectRow(roving.activeIndex, event);
      close();
      return;
    }

    if (event.altKey && event.key === 'ArrowUp') {
      event.preventDefault();
      if (roving.activeIndex !== -1) selectRow(roving.activeIndex, event);
      close();
      return;
    }

    if (isSearchable && TEXT_EDITING_KEYS.has(event.key)) {
      clearHighlight(event);
      return;
    }

    roving.onKeyDown(event);
  });

  const hasPopup = rows.length > 0 || !!emptyItem;
  const activeOptionId = isOpen && activeIndex !== -1 && hasPopup ? optionId(activeIndex) : undefined;

  // `roving.itemProps` rather than `roving` itself: the hook's object is new on every render, and
  // a context value that changes with it re-renders every option in the list for nothing.
  const rovingItemProps = roving.itemProps;
  const contextValue = useMemo(
    () => ({
      valueToUse,
      multiple,
      variant: restProps.variant,
      showCheckbox,
      selectRow,
      optionId,
      activeIndex,
      rowRef: (index: number) => rovingItemProps(index).ref,
      isRowDisabled,
    }),
    [valueToUse, multiple, restProps.variant, showCheckbox, selectRow, optionId, activeIndex, rovingItemProps, isRowDisabled],
  );

  /** What makes this a combobox, on the button or on the field that replaces it. */
  const comboboxProps = {
    'aria-expanded': isOpen,
    'aria-controls': isOpen && hasPopup ? listboxId : undefined,
    // Where the keyboard is, on whichever element holds focus.
    'aria-activedescendant': activeOptionId,
    'aria-labelledby': hasLabel ? labelId : undefined,
    ...tagProps,
    onKeyDown: handleKeyDown,
  };

  const hiddenValues = valueToUse.map((x) => {
    const serialized = JSON.stringify(x);

    return <Textbox key={serialized} ref={ref} name={name} type="hidden" value={serialized ?? ''} />;
  });

  const icon = !hideIcon && (
    <Flex component="dropdown.icon" {...iconProps}>
      <BaseSvg viewBox="0 0 10 6" width="0.6rem" rotate={isOpen ? 180 : 0}>
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
      </BaseSvg>
    </Flex>
  );

  const popup = isOpen && hasPopup && (
    <DropdownItems<TVal>
      rows={rows}
      emptyItem={emptyItem}
      triggerRef={triggerRef}
      popupRef={popupRef}
      listboxId={listboxId}
      labelledBy={hasLabel ? labelId : triggerId}
      itemsProps={itemsProps}
    />
  );

  const trigger = isSearchable ? (
    // Not a button: the combobox is the field inside it, and a focusable element inside a button
    // is the whole of bug #47. The shell is a shape to hang the border and the chevron on — its
    // `focus` styles are `:focus-within`, so it still lights up when the field has focus.
    <Box
      ref={setTriggerRef}
      component="dropdown"
      props={{ onClick: toggleOpen }}
      position="relative"
      pr={!hideIcon ? 6 : undefined}
      minWidth={isOpen ? 36 : undefined}
      width="fit-content"
      {...restProps}
      id={undefined}
    >
      {hiddenValues}
      <DropdownSearch
        id={triggerId}
        value={search ?? selectionText}
        onValueChange={handleSearchChange}
        placeholder={isOpen ? searchPlaceholder : undefined}
        inputRef={searchBoxRef}
        comboboxProps={comboboxProps}
        onOpen={openFromField}
      />
      {/* The field is absolutely positioned over the shell, so nothing it contains reaches the
          flow — and the shell has to be given both its width and its height by something that
          does. The same text, invisible: `visibility` keeps the space and keeps the copy out of
          the accessibility tree, where the field's own value already says it. A no-break space
          when there is no text, because a plain one collapses away under `white-space: nowrap`
          and leaves no line box at all — which is a shell 20px shorter than the one beside it. */}
      {display ?? (
        <Box tag="span" visibility="hidden">
          {selectionText || '\u00A0'}
        </Box>
      )}
      {icon}
      {popup}
    </Box>
  ) : (
    <Button
      ref={setTriggerRef}
      onClick={toggleOpen}
      component="dropdown"
      // A dropdown inside a form is not its submit button, which is what an untyped one defaults to.
      type="button"
      props={{ tabIndex: 0, role: 'combobox', ...comboboxProps }}
      position="relative"
      pr={!hideIcon ? 6 : undefined}
      width="fit-content"
      {...restProps}
      id={triggerId}
    >
      {hiddenValues}
      {/* A no-break space, not a plain one: a lone space collapses away under the component's
          `white-space: nowrap`, and with nothing else in the flow — a `multiple` dropdown with
          nothing selected — the control loses its line box and stands 20px shorter than its
          neighbours. Written as an escape so it cannot be typed away again. */}
      {display ?? '\u00A0'}
      {icon}
      {popup}
    </Button>
  );

  return (
    <DropdownContext.Provider value={contextValue}>
      {hasLabel ? (
        <Flex d="column" gap={1} width="fit-content" {...labelProps}>
          <Box tag="span" id={labelId}>
            {label}
          </Box>
          {trigger}
        </Flex>
      ) : (
        trigger
      )}
    </DropdownContext.Provider>
  );
}

type ChildrenName = 'DropdownItem' | 'DropdownUnselect' | 'DropdownEmptyItem' | 'DropdownDisplay' | 'DropdownSelectAll';

interface DropdownDisplayProps<TVal> extends Omit<BoxProps, 'children'> {
  children: ((selectedValues: TVal[], isOpen: boolean) => React.ReactNode) | React.ReactNode;
}

interface DropdownType {
  <TVal>(props: Props<TVal> & RefAttributes<HTMLInputElement>): React.ReactNode;
  Item: <TVal>(props: DropdownItemProps<TVal>) => React.ReactNode;
  Unselect: (props: BoxProps) => React.ReactNode;
  SelectAll: (props: BoxProps) => React.ReactNode;
  EmptyItem: (props: BoxProps) => React.ReactNode;
  Display: <TVal>(props: DropdownDisplayProps<TVal>) => React.ReactNode;
}

function withName<TProps>(name: ChildrenName) {
  const fn: FunctionComponent<TProps> = (_props: TProps) => null;
  fn.displayName = name;
  return fn;
}

const Dropdown = forwardRef(DropdownImpl) as unknown as DropdownType;
Dropdown.Item = withName('DropdownItem') as DropdownType['Item'];
Dropdown.Unselect = withName('DropdownUnselect') as DropdownType['Unselect'];
Dropdown.SelectAll = withName('DropdownSelectAll') as DropdownType['SelectAll'];
Dropdown.EmptyItem = withName('DropdownEmptyItem') as DropdownType['EmptyItem'];
Dropdown.Display = withName('DropdownDisplay') as DropdownType['Display'];
(Dropdown as React.FunctionComponent).displayName = 'Dropdown';

export default Dropdown;
