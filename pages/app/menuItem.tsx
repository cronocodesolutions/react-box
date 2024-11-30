import React from 'react';
import { NavLink } from 'react-router-dom';
import { BoxStyleProps } from '../../src/types';
import Flex from '../../src/components/flex';
import { BaseSvgProps } from '../../src/components/baseSvg';
import Box from '../../src/box';

interface Props extends BoxStyleProps {
  children: React.ReactNode;
  to: string;
  Icon?: React.ComponentType<BaseSvgProps>;
}
export default function MenuItem(props: Props) {
  const { to, Icon, children, ...restProps } = props;

  return (
    <NavLink to={to}>
      {({ isActive }) => (
        <Flex
          pl={10}
          userSelect="none"
          gap={2}
          my={1}
          ai="center"
          bgColor={isActive ? 'violet-100' : undefined}
          color={isActive ? 'violet-800' : undefined}
          cursor={isActive ? 'default' : 'pointer'}
          p={3}
          borderRadius={1}
          transition="none"
          hover={{ bgColor: 'violet-100', color: 'violet-800' }}
          {...restProps}
        >
          {Icon && <Icon />}
          {children}
        </Flex>
      )}
    </NavLink>
  );
}
