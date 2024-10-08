import { forwardRef, Ref, useCallback, useState } from 'react';
import Box, { BoxProps } from '../box';
import Tooltip from './tooltip';
import BaseSvg from './baseSvg';
import Flex from './flex';

interface DropdownItemProps extends BoxProps {
  value: string | number;
  label?: string;
  onClick?: () => void;
}

interface Props extends BoxProps {
  children: React.ReactElement<DropdownItemProps> | Array<React.ReactElement<DropdownItemProps>>;
}

function DropdownParent(props: Props, ref: Ref<HTMLDivElement>): React.ReactNode {
  const { children } = props;

  const kids = (Array.isArray(children) ? children : [children]).filter((x) => (x.type as any)?.componentName === 'DropdownItem');

  const [selectedKid, setSelectedKid] = useState<Maybe<React.ReactElement<DropdownItemProps>>>(kids?.[0]);

  const [open, setOpen] = useState(false);
  const clickHandler = useCallback(() => {
    setOpen((prev) => !prev);
  }, [setOpen]);

  const kidClickHandler = useCallback((kid: React.ReactElement<DropdownItemProps>) => {
    setSelectedKid(kid);
    setOpen(false);

    kid.props.onClick?.();
  }, []);

  return (
    <Box ref={ref} width="fit-content" userSelect="none" props={{ tabIndex: 0 }}>
      <Flex component="dropdown" gap={2} jc="space-between" {...props} props={{ onMouseDown: clickHandler, onBlur: () => setOpen(false) }}>
        {selectedKid?.props.label ?? (selectedKid?.props.children as React.ReactElement<DropdownItemProps>) ?? selectedKid?.props.value}
        <BaseSvg viewBox="0 0 10 6" width="0.6rem">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
        </BaseSvg>
      </Flex>
      {open && (
        <Tooltip>
          <Box component="dropdown.items">
            {kids.map((kid) => (
              <DropdownItem key={kid.props.value} {...kid.props} onClick={() => kidClickHandler(kid)} />
            ))}
          </Box>
        </Tooltip>
      )}
    </Box>
  );
}

function DropdownItem(props: DropdownItemProps) {
  return <Box component="dropdown.item" {...props} props={{ onClick: props.onClick, tabIndex: 0 }} />;
}
(DropdownItem as any).componentName = 'DropdownItem';

type DropdownType = typeof DropdownParent & {
  Item: typeof DropdownItem;
};

const Dropdown = forwardRef(DropdownParent) as unknown as DropdownType;
Dropdown.Item = DropdownItem;

export default Dropdown;
