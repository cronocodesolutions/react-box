import { forwardRef, FunctionComponent, ReactElement, Ref, RefAttributes, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Box, { BoxProps } from '../box';
import useVisibility from '../hooks/useVisibility';
import { ComponentsAndVariants } from '../types';
import BaseSvg from './baseSvg';
import Button from './button';
import Checkbox from './checkbox';
import Flex from './flex';
import Textbox from './textbox';
import Tooltip from './tooltip';

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
    showCheckbox,
    onChange,
    props: tagProps,
    ...restProps
  } = props;

  const compact = restProps.variant === 'compact';
  const [selectedValues, setSelectedValues] = useState(Array.isArray(defaultValue) ? defaultValue : defaultValue ? [defaultValue] : []);
  const valueToUse = 'value' in props ? (Array.isArray(value) ? value : value ? [value] : []) : selectedValues;
  const [search, setSearch] = useState<string>('');

  const [isOpen, setOpen, refToUse] = useVisibility<HTMLButtonElement>();
  const searchBoxRef = useRef<HTMLInputElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  const [optionsPosition, setOptionsPosition] = useState<{ top: number; scrollY: number }>({ top: 0, scrollY: 0 });
  const openUp = useMemo(
    () => optionsPosition.top - optionsPosition.scrollY > window.innerHeight / 2,
    [optionsPosition.top, optionsPosition.scrollY],
  );
  const btnSize = useMemo(() => {
    return refToUse.current?.getBoundingClientRect();
  }, [refToUse.current]);

  const translateY = useMemo(() => {
    if (openUp) return 0;

    return btnSize?.height ?? 0;
  }, [openUp, btnSize]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allKids = useMemo<ReactElement<any, FunctionComponent>[]>(
    () => (Array.isArray(children) ? children : [children]).flatMap((x) => x),
    [children],
  );
  const items = useMemo(() => allKids.filter((x) => x.type?.displayName === 'DropdownItem'), [allKids]);
  const filteredItems = useMemo<React.ReactElement<DropdownItemProps<TVal>>[]>(() => {
    return items.filter((x) => {
      if (isSearchable && search) {
        const text = searchItemText(x);

        return text.toLowerCase().includes(search.toLowerCase());
      }

      return true;
    });
  }, [isSearchable, search, allKids]);

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
      return selectedKids.map((x) => searchItemText(x)).join(', ');
    }

    const selectedKid = selectedKids.at(0);

    return (
      (selectedKid?.props.children as React.ReactElement<DropdownItemProps<TVal>>) ??
      selectedKid?.props.value ??
      (multiple ? null : unselectItem?.props.children)
    );
  }, [multiple, filteredItems, valueToUse, unselectItem, isOpen]);

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
    [multiple, valueToUse, setSelectedValues],
  );

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchBoxRef.current?.focus();
        itemsRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' });
      }, 0);
    } else {
      setSearch('');
    }
  }, [isOpen]);

  const showSelectAll = selectAllItem && multiple && filteredItems.length > valueToUse.length;
  const showUnselect = unselectItem && filteredItems.length > 0 && !showSelectAll;

  return (
    <Button
      ref={refToUse}
      onClick={() => setOpen((prev) => !prev)}
      component="dropdown"
      props={{ tabIndex: 0, ...tagProps }}
      position="relative"
      pr={!hideIcon ? 6 : undefined}
      minWidth={isOpen && isSearchable ? 36 : undefined}
      width="fit-content"
      {...restProps}
    >
      {valueToUse.map((x) => (
        <Textbox key={JSON.stringify(x)} ref={ref} name={name} type="hidden" value={JSON.stringify(x) ?? ''} />
      ))}
      {isSearchable && isOpen && (
        <Flex ai="center" position="absolute" inset={0} p={3}>
          <Textbox
            clean
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            ref={searchBoxRef}
            color="currentColor"
            width="fit"
            props={{
              onClick: (e) => {
                if (isOpen && isSearchable) {
                  e.stopPropagation();
                }
              },
            }}
          />
        </Flex>
      )}
      {display ?? '\u00A0'}
      {!hideIcon && (
        <Flex component="dropdown.icon">
          <BaseSvg viewBox="0 0 10 6" width="0.6rem" rotate={isOpen ? 180 : 0}>
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
          </BaseSvg>
        </Flex>
      )}
      <Box position="absolute" inset={0}>
        {isOpen && (
          <Tooltip
            ref={itemsRef}
            minWidth="fit-content"
            style={{ transform: openUp ? `translateY(calc(-100% - 2px))` : `translateY(${translateY}px)` }}
            onPositionChange={(data) => setOptionsPosition({ top: data.top, scrollY: data.windowScrollY })}
          >
            {(filteredItems.length > 0 || emptyItem) && (
              <Box component="dropdown.items">
                {showUnselect && (
                  <Box
                    component="dropdown.unselect"
                    variant={{ compact }}
                    selected={valueToUse.length === 0}
                    {...{ ...unselectItem.props, props: { ...unselectItem.props.props, onClick: (e) => itemSelectHandler(e) } }}
                  />
                )}
                {showSelectAll && (
                  <Box
                    component="dropdown.selectAll"
                    variant={{ compact }}
                    {...{
                      ...selectAllItem.props,
                      props: { ...selectAllItem.props.props, onClick: (e) => itemSelectHandler(e, ...items) },
                    }}
                  />
                )}
                {filteredItems.map((item) => {
                  const { value, onClick, children: itemChildren, ...itemProps } = item.props;
                  const isSelected = valueToUse.includes(value);

                  return (
                    <Box
                      key={value as React.Key}
                      component="dropdown.item"
                      variant={{ multiple, compact }}
                      selected={isSelected}
                      {...{
                        ...itemProps,
                        children:
                          showCheckbox && multiple ? (
                            <>
                              <Checkbox readOnly checked={isSelected} mr={2} />
                              {itemChildren}
                            </>
                          ) : (
                            itemChildren
                          ),
                        props: {
                          ...itemProps.props,
                          'aria-selected': isSelected,
                          onClick: (e) => {
                            onClick?.(e);
                            itemSelectHandler(e, item);
                          },
                        },
                      }}
                    />
                  );
                })}

                {filteredItems.length === 0 && emptyItem && (
                  <Box component="dropdown.emptyItem" variant={{ compact }} {...emptyItem.props} />
                )}
              </Box>
            )}
          </Tooltip>
        )}
      </Box>
    </Button>
  );
}

type ChildrenName = 'DropdownItem' | 'DropdownUnselect' | 'DropdownEmptyItem' | 'DropdownDisplay' | 'DropdownSelectAll';

interface DropdownItemProps<TVal> extends BoxProps {
  value: TVal;
  onClick?(e: React.MouseEvent): void;
}

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

function searchItemText(item: React.ReactElement): string {
  if (item === null || item === undefined) return '';

  if (typeof item === 'object') {
    const children = item.props?.children;

    if (children === null || children === undefined) return '';

    if (typeof children === 'object') {
      const arr: React.ReactElement[] = Array.isArray(children) ? children : [children];

      return arr.map((i) => searchItemText(i)).join('');
    }

    return children.toString();
  }

  return (item as string).toString();
}
