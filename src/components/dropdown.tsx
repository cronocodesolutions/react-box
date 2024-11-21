import { forwardRef, Ref, useCallback, useEffect, useMemo, useRef, useState, Children } from 'react';
import Box, { BoxProps } from '../box';
import Tooltip from './tooltip';
import BaseSvg from './baseSvg';
import useVisibility from '../hooks/useVisibility';
import Textbox from './textbox';
import Flex from './flex';
import Button from './button';

interface DropdownItemProps<TVal> extends BoxProps {
  value: TVal;
  onClick?: (e: React.MouseEvent) => void;
}

interface Props<TVal> extends BoxProps {
  name?: string;
  children: React.ReactElement<DropdownItemProps<TVal>> | Array<React.ReactElement<DropdownItemProps<TVal>>>;
  isSearchable?: boolean;
  searchPlaceholder?: string;
  onChange?: (value: TVal) => void;
  defaultValue?: TVal | Array<TVal>;
  multiple?: boolean;
}

function DropdownImpl<TVal>(props: Props<TVal>, ref: Ref<HTMLInputElement>): React.ReactNode {
  const { children, name, isSearchable, searchPlaceholder, onChange, defaultValue, multiple } = props;

  const allKids = useMemo(() => (Array.isArray(children) ? children : [children]), [children]);
  const [search, setSearch] = useState<string>('');

  const kids = useMemo(() => {
    return allKids.filter((x) => {
      if ((x.type as any)?.componentName !== 'DropdownItem') return false;

      if (isSearchable && search) {
        const text = searchItemText(x);

        return text.toLowerCase().includes(search.toLowerCase());
      }

      return true;
    });
  }, [isSearchable, search, allKids]);

  const nullItem = useMemo(
    () => allKids.find((x) => (x.type as any)?.componentName === 'DropdownNullItem'),
    [isSearchable, search, allKids],
  );

  const noItems = useMemo(() => allKids.find((x) => (x.type as any)?.componentName === 'DropdownNoItems'), [isSearchable, search, allKids]);
  const [selectedValues, setSelectedValues] = useState(Array.isArray(defaultValue) ? defaultValue : defaultValue ? [defaultValue] : []);

  const [isOpen, setOpen, refToUse] = useVisibility();
  const searchBoxRef = useRef<HTMLInputElement>(null);
  const displayButtonRef = useRef<HTMLButtonElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  const [openPosition, setOpenPosition] = useState(0);
  const openUp = useMemo(() => openPosition > window.innerHeight / 2, [openPosition]);

  const openDropdownHandler = useCallback(() => {
    setOpen((prev) => !prev);
  }, [setOpen]);

  const kidClickHandler = useCallback(
    (e: React.MouseEvent, kid: React.ReactElement<DropdownItemProps<TVal>>) => {
      setSelectedValues((prev) => {
        if (multiple) {
          const values = prev.filter((value) => value !== kid.props.value);

          return values.length < prev.length ? values : [...values, kid.props.value];
        } else {
          return [kid.props.value];
        }
      });

      kid.props.onClick?.(e);
      onChange?.(kid.props.value);

      if (multiple) {
        e.stopPropagation();
      } else {
        setOpen(false);
        setTimeout(() => displayButtonRef.current?.focus(), 0);
      }
    },
    [multiple, setSelectedValues],
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

  const display = useMemo(() => {
    const selectedKids = kids.filter((k) => selectedValues.includes(k.props.value));

    if (multiple && selectedKids.length > 1) {
      return selectedKids.map((x) => searchItemText(x)).join(', ');
    }

    const selectedKid = selectedKids.at(0);

    return (
      (selectedKid?.props.children as React.ReactElement<DropdownItemProps<TVal>>) ??
      selectedKid?.props.value ??
      nullItem?.props.children ?? <Box height={5} />
    );
  }, [multiple, kids, nullItem, selectedValues]);

  return (
    <Box ref={refToUse} width="fit-content">
      {selectedValues.map((x) => (
        <Textbox key={JSON.stringify(x)} ref={ref} name={name} type="hidden" value={JSON.stringify(x) ?? ''} />
      ))}

      <Button ref={displayButtonRef} component="dropdown" {...props} props={{ onMouseDown: openDropdownHandler }}>
        {isSearchable && (
          <Textbox
            display={isOpen && isSearchable ? 'block' : 'none'}
            clean
            flex1
            width={1}
            lineHeight={20}
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
        <Flex display={isOpen && isSearchable ? 'none' : 'flex'} textWrap="nowrap" overflow="hidden" textOverflow="ellipsis">
          {display}
        </Flex>
        <Box>
          <BaseSvg viewBox="0 0 10 6" width="0.6rem" rotate={isOpen ? 180 : 0}>
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
          </BaseSvg>
        </Box>
      </Button>
      {isOpen && (
        <Tooltip ref={itemsRef} bottom={openUp ? 13 : undefined} onPositionChange={(data) => setOpenPosition(data.top)}>
          {(kids.length > 0 || nullItem || noItems) && (
            <Box component="dropdown.items">
              {nullItem && kids.length > 0 && <DropdownNullItem {...nullItem.props} onClick={(e) => setSelectedValues([])} />}
              {kids.map((kid) => (
                <DropdownItem
                  key={kid.props.value?.toString()}
                  {...kid.props}
                  selected={selectedValues.includes(kid.props.value)}
                  onClick={(e) => kidClickHandler(e, kid)}
                />
              ))}
              {kids.length === 0 && noItems}
            </Box>
          )}
        </Tooltip>
      )}
    </Box>
  );
}

function DropdownItem<TVal>(props: DropdownItemProps<TVal>) {
  const { onClick, ...restProps } = props;

  return <Button component="dropdown.item" {...restProps} props={{ onMouseDown: onClick }} />;
}
(DropdownItem as any).componentName = 'DropdownItem';

function DropdownNullItem<TVal>(props: Omit<DropdownItemProps<TVal>, 'value'>) {
  const { onClick, ...restProps } = props;

  return <Button component="dropdown.nullItem" {...restProps} props={{ onMouseDown: props.onClick }} />;
}
(DropdownNullItem as any).componentName = 'DropdownNullItem';

function DropdownNoItems<TVal>(props: Omit<DropdownItemProps<TVal>, 'value'>) {
  const { onClick, ...restProps } = props;

  return <Box component="dropdown.noItems" {...restProps} />;
}
(DropdownNoItems as any).componentName = 'DropdownNoItems';

function DropdownDisplay<TVal>(props: DropdownItemProps<TVal>) {
  const { onClick, ...restProps } = props;

  return <Box component="dropdown.display" {...restProps} props={{ onMouseDown: props.onClick }} />;
}
(DropdownDisplay as any).componentName = 'DropdownDisplay';

type DropdownType = typeof DropdownImpl & {
  Item: typeof DropdownItem;
  NullItem: typeof DropdownNullItem;
  NoItems: typeof DropdownNoItems;
};

const Dropdown = forwardRef(DropdownImpl) as unknown as DropdownType;
Dropdown.Item = DropdownItem;
Dropdown.NullItem = DropdownNullItem;
Dropdown.NoItems = DropdownNoItems;

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

export default Dropdown;
