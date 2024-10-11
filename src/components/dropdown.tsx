import { forwardRef, Ref, useCallback, useState } from 'react';
import Box, { BoxProps } from '../box';
import Tooltip from './tooltip';
import BaseSvg from './baseSvg';
import Flex from './flex';
import useVisibility from '../hooks/useVisibility';
import Textbox from './textbox';

interface DropdownItemProps extends BoxProps {
  value: string | number;
  label?: string;
  onClick?: () => void;
}

interface Props extends BoxProps {
  name?: string;
  children: React.ReactElement<DropdownItemProps> | Array<React.ReactElement<DropdownItemProps>>;
}

function DropdownImpl(props: Props, ref: Ref<HTMLSelectElement>): React.ReactNode {
  const { children, name } = props;

  const kids = (Array.isArray(children) ? children : [children]).filter((x) => (x.type as any)?.componentName === 'DropdownItem');

  const [selectedKid, setSelectedKid] = useState<Maybe<React.ReactElement<DropdownItemProps>>>(kids?.[0]);

  const [open, setOpen, refToUse] = useVisibility();

  const clickHandler = useCallback(() => {
    setOpen((prev) => !prev);
  }, [setOpen]);

  const kidClickHandler = useCallback((kid: React.ReactElement<DropdownItemProps>) => {
    setSelectedKid(kid);
    setOpen(false);

    kid.props.onClick?.();
  }, []);

  return (
    <Box ref={refToUse} width="fit-content" userSelect="none" props={{ tabIndex: 0 }}>
      <Textbox name={name} type="hidden" value={selectedKid?.props.value} />
      <Flex component="dropdown" gap={2} jc="space-between" {...props} props={{ onMouseDown: clickHandler, onBlur: () => setOpen(false) }}>
        {selectedKid?.props.label ?? (selectedKid?.props.children as React.ReactElement<DropdownItemProps>) ?? selectedKid?.props.value}
        <BaseSvg viewBox="0 0 10 6" width="0.6rem" rotate={open ? 180 : 0}>
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
            style={{ transition: 'none' }}
          />
        </BaseSvg>
      </Flex>
      {open && (
        <Tooltip>
          {/* <Box overflow="hidden"> */}
          <Box component="dropdown.items">
            {kids.map((kid) => (
              <DropdownItem key={kid.props.value} {...kid.props} onClick={() => kidClickHandler(kid)} />
            ))}
          </Box>
          {/* </Box> */}
        </Tooltip>
      )}
    </Box>
  );
}

function DropdownItem(props: DropdownItemProps) {
  return <Box component="dropdown.item" {...props} props={{ onClick: props.onClick, tabIndex: 0 }} />;
}
(DropdownItem as any).componentName = 'DropdownItem';

type DropdownType = typeof DropdownImpl & {
  Item: typeof DropdownItem;
};

const Dropdown = forwardRef(DropdownImpl) as unknown as DropdownType;
Dropdown.Item = DropdownItem;

export default Dropdown;
