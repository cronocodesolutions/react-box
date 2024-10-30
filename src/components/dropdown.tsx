import { forwardRef, Ref, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Box, { BoxProps } from '../box';
import Tooltip from './tooltip';
import BaseSvg from './baseSvg';
import useVisibility from '../hooks/useVisibility';
import Textbox from './textbox';
import Flex from './flex';
import Button from './button';

interface DropdownItemProps<TVal> extends BoxProps {
  value: TVal;
  onClick?: () => void;
}

interface Props<TVal> extends BoxProps {
  name?: string;
  children: React.ReactElement<DropdownItemProps<TVal>> | Array<React.ReactElement<DropdownItemProps<TVal>>>;
  isSearchable?: boolean;
  searchPlaceholder?: string;
  onChange?: (value: TVal) => void;
  selectedValue?: TVal;
}

function DropdownImpl<TVal>(props: Props<TVal>, ref: Ref<HTMLDivElement>): React.ReactNode {
  const { children, name, isSearchable, searchPlaceholder, onChange, selectedValue } = props;

  const [search, setSearch] = useState<string>('');
  const kids = useMemo(() => {
    const arr = Array.isArray(children) ? children : [children];

    return arr.filter((x) => {
      if ((x.type as any)?.componentName !== 'DropdownItem') return false;

      if (isSearchable && search) {
        const text = searchItemText(x);

        return text.toLowerCase().includes(search.toLowerCase());
      }

      return true;
    });
  }, [isSearchable, search, children]);
  const [selectedKid, setSelectedKid] = useState<Maybe<React.ReactElement<DropdownItemProps<TVal>>>>(
    kids.find((k) => k.props.value === selectedValue) ?? kids?.[0],
  );
  const [isOpen, setOpen, refToUse] = useVisibility();
  const searchBoxRef = useRef<HTMLInputElement>(null);

  const openDropdownHandler = useCallback(() => {
    setOpen((prev) => !prev);
  }, [setOpen]);

  const kidClickHandler = useCallback((kid: React.ReactElement<DropdownItemProps<TVal>>) => {
    setSelectedKid(kid);
    setOpen(false);

    kid.props.onClick?.();

    onChange?.(kid.props.value);

    setTimeout(() => searchBoxRef.current?.focus(), 10);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchBoxRef.current?.focus(), 0);
    } else {
      setSearch('');
    }
  }, [isOpen]);

  return (
    <Box ref={refToUse} width="fit-content" userSelect="none">
      <Textbox name={name} type="hidden" value={selectedKid?.props?.toString()} />

      <Button component="dropdown" {...props} props={{ onMouseDown: openDropdownHandler, tabIndex: 0 }}>
        {isOpen && isSearchable ? (
          <Textbox
            clean
            flex1
            width={1}
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
        ) : (
          <Flex>{(selectedKid?.props.children as React.ReactElement<DropdownItemProps<TVal>>) ?? selectedKid?.props.value}</Flex>
        )}
        <BaseSvg viewBox="0 0 10 6" width="0.6rem" rotate={isOpen ? 180 : 0}>
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
        </BaseSvg>
      </Button>
      {isOpen && (
        <Tooltip>
          <Box component="dropdown.items">
            {kids.map((kid, index) => (
              <DropdownItem key={kid.props.value?.toString()} {...kid.props} onClick={() => kidClickHandler(kid)} />
            ))}
            {kids.length === 0 && (
              <Box p={2} color="gray-500" userSelect="none" props={{ onMouseDown: (e) => e.stopPropagation() }}>
                No options
              </Box>
            )}
          </Box>
        </Tooltip>
      )}
    </Box>
  );
}

function DropdownItem<TVal>(props: DropdownItemProps<TVal>) {
  return <Button component="dropdown.item" {...props} props={{ onMouseDown: props.onClick }} />;
}
(DropdownItem as any).componentName = 'DropdownItem';

function DropdownDisplay<TVal>(props: DropdownItemProps<TVal>) {
  return <Box component="dropdown.display" {...props} props={{ onMouseDown: props.onClick }} />;
}
(DropdownDisplay as any).componentName = 'DropdownDisplay';

type DropdownType = typeof DropdownImpl & {
  Item: typeof DropdownItem;
};

const Dropdown = forwardRef(DropdownImpl) as unknown as DropdownType;
Dropdown.Item = DropdownItem;

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
