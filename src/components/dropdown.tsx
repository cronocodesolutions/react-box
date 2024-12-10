import { forwardRef, Ref, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Box, { BoxProps } from '../box';
import Textbox from './textbox';
import Flex from './flex';
import useVisibility from '../hooks/useVisibility';
import BaseSvg from './baseSvg';
import Tooltip from './tooltip';
import Button from './button';

interface Props<TVal> extends BoxProps {
  name?: string;
  defaultValue?: TVal | TVal[];
  multiple?: boolean;
  isSearchable?: boolean;
  searchPlaceholder?: string;
  onChange?: (value: Maybe<TVal>, values: TVal[]) => void;
}

function DropdownImpl<TVal>(props: Props<TVal>, ref: Ref<HTMLInputElement>): React.ReactNode {
  const { name, defaultValue, multiple, isSearchable, searchPlaceholder, children, onChange, ...restProps } = props;

  const [selectedValues, setSelectedValues] = useState(Array.isArray(defaultValue) ? defaultValue : defaultValue ? [defaultValue] : []);
  const [search, setSearch] = useState<string>('');

  const [isOpen, setOpen, refToUse] = useVisibility<HTMLButtonElement>();
  const searchBoxRef = useRef<HTMLInputElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  const [openPosition, setOpenPosition] = useState(0);
  const openUp = useMemo(() => openPosition > window.innerHeight / 2, [openPosition]);
  const translateY = useMemo(() => {
    if (!openUp) return 0;

    return refToUse.current?.getBoundingClientRect().height ?? 0;
  }, [openUp, refToUse]);

  const allKids = useMemo<DropdownKidType[]>(() => (Array.isArray(children) ? children : [children]), [children]);
  const items = useMemo(() => allKids.filter((x) => x.type?.componentName === 'DropdownItem'), [allKids]);
  const filteredItems = useMemo<React.ReactElement<DropdownItemProps<TVal>>[]>(() => {
    return items.filter((x) => {
      if (isSearchable && search) {
        const text = searchItemText(x);

        return text.toLowerCase().includes(search.toLowerCase());
      }

      return true;
    });
  }, [isSearchable, search, allKids]);

  const unselectItem = useMemo(() => allKids.find((x) => x.type?.componentName === 'DropdownUnselect'), [allKids]);
  const selectAllItem = useMemo(() => allKids.find((x) => x.type?.componentName === 'DropdownSelectAll'), [allKids]);
  const emptyItem = useMemo(() => allKids.find((x) => x.type?.componentName === 'DropdownEmptyItem'), [allKids]);
  const displayItem = useMemo(() => allKids.find((x) => x.type?.componentName === 'DropdownDisplay'), [allKids]);

  const display = useMemo(() => {
    if (displayItem) return displayItem.props.children(selectedValues);

    const selectedKids = filteredItems.filter((k) => selectedValues.includes(k.props.value));

    if (multiple && selectedKids.length > 1) {
      return selectedKids.map((x) => searchItemText(x)).join(', ');
    }

    const selectedKid = selectedKids.at(0);

    return (selectedKid?.props.children as React.ReactElement<DropdownItemProps<TVal>>) ?? selectedKid?.props.value;
  }, [multiple, filteredItems, selectedValues]);

  const itemMouseDownHandler = useCallback(
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
          const values = selectedValues.filter((value) => value !== kid.props.value);

          if (values.length === selectedValues.length) {
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
    [multiple, selectedValues, setSelectedValues],
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

  const showSelectAll = selectAllItem && multiple && filteredItems.length > selectedValues.length;
  const showUnselect = unselectItem && filteredItems.length > 0 && !showSelectAll;

  return (
    <Box width="fit-content">
      {selectedValues.map((x) => (
        <Textbox key={JSON.stringify(x)} ref={ref} name={name} type="hidden" value={JSON.stringify(x) ?? ''} />
      ))}
      <Button ref={refToUse} component="dropdown" {...restProps} props={{ onMouseDown: () => setOpen((prev) => !prev), tabIndex: 0 }}>
        {isSearchable && (
          <Textbox
            display={isOpen && isSearchable ? 'block' : 'none'}
            clean
            flex1
            width={1}
            minHeight={5}
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            ref={searchBoxRef}
            props={{
              onMouseDown: (e) => {
                if (isOpen && isSearchable) {
                  e.stopPropagation();
                }
              },
            }}
          />
        )}
        <Flex component="dropdown.display" display={isOpen && isSearchable ? 'none' : 'flex'} flex1 minHeight={5}>
          {display}
        </Flex>
        <Box>
          <BaseSvg viewBox="0 0 10 6" width="0.6rem" rotate={isOpen ? 180 : 0}>
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
          </BaseSvg>
        </Box>
      </Button>

      {isOpen && (
        <Tooltip
          ref={itemsRef}
          top={openUp ? undefined : 0}
          bottom={openUp ? 2 : undefined}
          style={{ transform: `translateY(-${translateY}px)` }}
          onPositionChange={(data) => setOpenPosition(data.top - window.scrollY)}
        >
          {(filteredItems.length > 0 || emptyItem) && (
            <Box component="dropdown.items">
              {showUnselect && (
                <Box
                  component="dropdown.unselect"
                  selected={selectedValues.length === 0}
                  {...unselectItem.props}
                  props={{ onMouseDown: (e) => itemMouseDownHandler(e) }}
                />
              )}
              {showSelectAll && (
                <Box
                  component="dropdown.selectAll"
                  {...selectAllItem.props}
                  props={{ onMouseDown: (e) => itemMouseDownHandler(e, ...items) }}
                />
              )}
              {filteredItems.map((item) => {
                const { value, ...itemProps } = item.props;

                return (
                  <Box
                    key={value as React.Key}
                    component="dropdown.item"
                    theme={multiple ? 'multiple' : 'single'}
                    selected={selectedValues.includes(value)}
                    {...itemProps}
                    props={{ onMouseDown: (e) => itemMouseDownHandler(e, item) }}
                  />
                );
              })}

              {filteredItems.length === 0 && emptyItem && <Box component="dropdown.emptyItem" {...emptyItem.props} />}
            </Box>
          )}
        </Tooltip>
      )}
    </Box>
  );
}

type ChildrenName = 'DropdownItem' | 'DropdownUnselect' | 'DropdownEmptyItem' | 'DropdownDisplay' | 'DropdownSelectAll';

interface DropdownItemProps<TVal> extends BoxProps {
  value: TVal;
}

interface DropdownDisplayProps<TVal> extends Omit<BoxProps, 'children'> {
  children: (selectedValues: TVal[]) => React.ReactNode;
}

type DropdownKidType = React.ReactElement<any, ((props: any) => React.ReactNode) & { componentName: ChildrenName }>;

interface DropdownType {
  <TVal>(props: Props<TVal>, ref: Ref<HTMLInputElement>): React.ReactNode;
  Item: <TVal>(props: DropdownItemProps<TVal>) => React.ReactNode;
  Unselect: (props: BoxProps) => React.ReactNode;
  SelectAll: (props: BoxProps) => React.ReactNode;
  EmptyItem: (props: BoxProps) => React.ReactNode;
  Display: <TVal>(props: DropdownDisplayProps<TVal>) => React.ReactNode;
}

function withName<TProps>(name: ChildrenName) {
  const fn = (_props: TProps) => null;
  fn.componentName = name;
  return fn;
}

const Dropdown = forwardRef(DropdownImpl) as unknown as DropdownType;
Dropdown.Item = withName('DropdownItem');
Dropdown.Unselect = withName('DropdownUnselect');
Dropdown.SelectAll = withName('DropdownSelectAll');
Dropdown.EmptyItem = withName('DropdownEmptyItem');
Dropdown.Display = withName('DropdownDisplay');

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
