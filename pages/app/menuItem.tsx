import React from 'react';
import { NavLink } from 'react-router-dom';
import { BoxStyleProps } from '../../src/types';
import Flex from '../../src/components/flex';

interface Props extends BoxStyleProps {
  children: React.ReactNode;
  to: string;
}
export default function MenuItem(props: Props) {
  const { to } = props;

  return (
    <NavLink to={to}>
      {({ isActive }) => (
        <Flex
          gap={2}
          my={1}
          bgColor={isActive ? 'violet-100' : undefined}
          color={isActive ? 'violet-800' : undefined}
          cursor={isActive ? 'default' : 'pointer'}
          py={3}
          px={6}
          borderRadius={1}
          transition="none"
          hover={{ bgColor: 'violet-100', color: 'violet-800' }}
          {...props}
        />
      )}
    </NavLink>
  );
}
