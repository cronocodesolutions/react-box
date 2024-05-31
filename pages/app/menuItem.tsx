import React from 'react';
import Box from '../../src/box';
import { NavLink } from 'react-router-dom';
import { BoxStyleProps } from '../../src/core/types';

interface Props extends BoxStyleProps {
  children: React.ReactNode;
  to: string;
}
export default function MenuItem(props: Props) {
  const { children, to } = props;

  return (
    <NavLink to={to}>
      {({ isActive }) => (
        <Box
          my={1}
          bgColor={isActive ? 'violetLight' : undefined}
          color={isActive ? 'violet' : undefined}
          cursor={isActive ? 'default' : 'pointer'}
          py={2}
          px={6}
          borderRadius={1}
          transition="none"
          hover={{ bgColor: 'violetLight', color: 'violet' }}
          {...props}
        />
      )}
    </NavLink>
  );
}
