import { forwardRef, FunctionComponent, ReactElement, Ref, RefAttributes, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BoxProps } from '../box';
import useVisibility from '../hooks/useVisibility';
import { BoxStyleProps, ComponentsAndVariants } from '../types';
import BaseSvg from './baseSvg';
import Button from './button';
import DropdownContext, { DropdownItemProps } from './dropdown/dropdownContext';
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
  isSearchable?: boolean;
  searchPlaceholder?: string;
  hideIcon?: boolean;
  /** Show checkbox for each item in multiple selection mode */
  showCheckbox?: boolean;
  /** BoxProps applied to the opened items container (dropdown.items) */
  itemsProps?: BoxStyleProps;
  /** BoxProps applied to the chevron icon container (dropdown.icon) */
  iconProps?: BoxStyleProps;
  onChange?: (value: TVal | undefined, values: TVal[]) => void;
}

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
  const [search, setSearch] = useState<string>('');

  const [isOpen, setOpen, refToUse] = useVisibility<HTMLButtonElement>();
  const searchBoxRef = useRef<HTMLInputElement>(null);

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

  const filteredItems = useMemo<React.ReactElement<DropdownItemProps<TVal>>[]>(() => {
    return items.filter((x) => {
      if (isSearchable && search) {
        return getItemText(x).toLowerCase().includes(search.toLowerCase());
      }

      return true;
    });
  }, [isSearchable, search, items, getItemText]);

  const unselectItem = useMemo(() => allKids.find((x) => (x.type as FunctionComponent)?.displayName === 'DropdownUnselect'), [allKids]);
  const selectAllItem = useMemo(() => allKids.find((x) => (x.type as FunctionComponent)?.displayName === 'DropdownSelectAll'), [allKids]);
  const emptyItem = useMemo(() => allKids.find((x) => (x.type as FunctionComponent)?.displayName === 'DropdownEmptyItem'), [allKids]);
  const displayItem = useMemo(() => allKids.find((x) => (x.type as FunctionComponent)?.displayName === 'DropdownDisplay'), [allKids]);

  const display = useMemo(() => {
    if (isOpen && isSearchable) return null;

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
  }, [multiple, filteredItems, valueToUse, unselectItem, isOpen, isSearchable, displayItem, getItemText]);

  const itemSelectHandler = useCallback(
    (e: React.MouseEvent, ...kids: React.ReactElement<DropdownItemProps<TVal>>[]) => {
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

      if (multiple) {
        e.stopPropagation();

        setTimeout(() => searchBoxRef.current?.focus(), 0);
      } else {
        setOpen(false);
        setTimeout(() => refToUse.current?.focus(), 0);
      }
    },
    [multiple, valueToUse, setSelectedValues, onChange, setOpen, refToUse],
  );

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchBoxRef.current?.focus();
      }, 0);
    } else {
      setSearch('');
    }
  }, [isOpen]);

  const toggleOpen = useCallback(() => setOpen((prev) => !prev), [setOpen]);

  const showSelectAll = !!(selectAllItem && multiple && filteredItems.length > valueToUse.length);
  const showUnselect = !!(unselectItem && filteredItems.length > 0 && !showSelectAll);

  const contextValue = useMemo(
    () => ({ valueToUse, multiple, variant: restProps.variant, showCheckbox, itemSelectHandler, getItemText }),
    [valueToUse, multiple, restProps.variant, showCheckbox, itemSelectHandler, getItemText],
  );

  return (
    <DropdownContext.Provider value={contextValue}>
      <Button
        ref={refToUse}
        onClick={toggleOpen}
        component="dropdown"
        props={{ tabIndex: 0, ...tagProps }}
        position="relative"
        pr={!hideIcon ? 6 : undefined}
        minWidth={isOpen && isSearchable ? 36 : undefined}
        width="fit-content"
        {...restProps}
      >
        {valueToUse.map((x) => {
          const serialized = JSON.stringify(x);
          return <Textbox key={serialized} ref={ref} name={name} type="hidden" value={serialized ?? ''} />;
        })}
        {isSearchable && isOpen && (
          <DropdownSearch search={search} onSearchChange={setSearch} searchPlaceholder={searchPlaceholder} searchBoxRef={searchBoxRef} />
        )}
        {display ?? '\u00A0'}
        {!hideIcon && (
          <Flex component="dropdown.icon" {...iconProps}>
            <BaseSvg viewBox="0 0 10 6" width="0.6rem" rotate={isOpen ? 180 : 0}>
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
            </BaseSvg>
          </Flex>
        )}
        {isOpen && (
          <DropdownItems<TVal>
            filteredItems={filteredItems}
            items={items}
            unselectItem={unselectItem}
            selectAllItem={selectAllItem}
            emptyItem={emptyItem}
            showUnselect={showUnselect}
            showSelectAll={showSelectAll}
            buttonRef={refToUse}
            itemsProps={itemsProps}
          />
        )}
      </Button>
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
Dropdown.Item = withName('DropdownItem');
Dropdown.Unselect = withName('DropdownUnselect');
Dropdown.SelectAll = withName('DropdownSelectAll');
Dropdown.EmptyItem = withName('DropdownEmptyItem');
Dropdown.Display = withName('DropdownDisplay');
(Dropdown as React.FunctionComponent).displayName = 'Dropdown';

export default Dropdown;
