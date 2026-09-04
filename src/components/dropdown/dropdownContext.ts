import { createContext, useContext } from 'react';
import { BoxProps } from '../../box';
import { ClassNameType } from '../../core';

export interface DropdownItemProps<TVal = unknown> extends BoxProps {
  value: TVal;
  onClick?(e: React.MouseEvent): void;
}

/**
 * A row of the open listbox, in the order the keyboard walks them. "Clear" and "Select all" are rows
 * rather than decorations beside the list, so they carry `role="option"` too. One array up front is what
 * makes an index mean the same thing to the roving-focus hook, to `aria-activedescendant` and to the markup.
 */
export type DropdownRow<TVal = unknown> =
  | { kind: 'unselect'; element: React.ReactElement<{ props?: object }> }
  | { kind: 'selectAll'; element: React.ReactElement<{ props?: object }> }
  | { kind: 'item'; element: React.ReactElement<DropdownItemProps<TVal>> };

export interface DropdownContextValue<TVal = unknown> {
  valueToUse: TVal[];
  multiple: boolean;
  variant: ClassNameType;
  showCheckbox: boolean;
  /** Choose the row at `index` — the one path a click and an Enter both take. */
  selectRow: (index: number, event: React.SyntheticEvent) => void;
  /** The id `aria-activedescendant` names when the keyboard is on the row at `index`. */
  optionId: (index: number) => string;
  /** The row the keyboard is on, or `-1` when it is on none of them. */
  activeIndex: number;
  /** Collects a row's element, so the active one can be named and scrolled to. */
  rowRef: (index: number) => (element: HTMLElement | null) => void;
  /** Whether a row is a disabled option: skipped by the arrows, and inert to a click. */
  isRowDisabled: (index: number) => boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DropdownContext = createContext<DropdownContextValue<any> | null>(null);

export function useDropdownContext<TVal>(): DropdownContextValue<TVal> {
  const ctx = useContext(DropdownContext);
  if (!ctx) throw new Error('Dropdown sub-components must be used within Dropdown');
  return ctx;
}

export default DropdownContext;
