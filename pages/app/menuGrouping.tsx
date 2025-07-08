import React, { useState } from 'react';
import Box, { BoxProps } from '../../src/box';
import { BaseSvgProps } from '../../src/components/baseSvg';
import Flex from '../../src/components/flex';
import ExpandIcon from '../../src/icons/expandIcon';

interface Props extends BoxProps {
  label: string;
  Icon: React.ComponentType<BaseSvgProps>;
  defaultState?: 'open' | 'closed';
}

export default function MenuGrouping(props: Props) {
  const { Icon, children, label, defaultState = 'open', ...restProps } = props;

  const [open, setOpen] = useState(defaultState);

  return (
    <Box userSelect="none">
      <Flex
        my={1}
        ai="center"
        jc="space-between"
        cursor={'pointer'}
        p={3}
        borderRadius={1}
        transition="none"
        hover={{ bgColor: 'violet-100', color: 'violet-800' }}
        {...restProps}
        props={{
          onClick: (e) => {
            e.stopPropagation();
            setOpen(open === 'closed' ? 'open' : 'closed');
          },
        }}
      >
        <Flex gap={2} ai="center" flex1>
          <Icon />
          <Box>{label}</Box>
        </Flex>
        <ExpandIcon width="14px" rotate={open === 'open' ? 0 : -90} />
      </Flex>
      {open === 'open' && <Box>{children}</Box>}
    </Box>
  );
}
