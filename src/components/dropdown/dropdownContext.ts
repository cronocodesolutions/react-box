import { createContext, useContext } from 'react';
import { BoxProps } from '../../box';
import { ClassNameType } from '../../core/classNames';

export interface DropdownItemProps<TVal = unknown> extends BoxProps {
  value: TVal;
  onClick?(e: React.MouseEvent): void;
}

export interface DropdownContextValue<TVal = unknown> {
  valueToUse: TVal[];
  multiple: boolean;
  variant: ClassNameType;
  showCheckbox: boolean;
  itemSelectHandler: (e: React.MouseEvent, ...items: React.ReactElement<DropdownItemProps<TVal>>[]) => void;
  getItemText: (item: React.ReactElement) => string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DropdownContext = createContext<DropdownContextValue<any> | null>(null);

export function useDropdownContext<TVal>(): DropdownContextValue<TVal> {
  const ctx = useContext(DropdownContext);
  if (!ctx) throw new Error('Dropdown sub-components must be used within Dropdown');
  return ctx;
}

export default DropdownContext;
