import React from 'react';
import Box from '../../src/box';
import { NavLink } from 'react-router-dom';
import { BoxStyles } from '../../src/types';

interface Props extends BoxStyles {
  children: React.ReactNode;
  to: string;
}
export default function MenuItem(props: Props) {
  const { children, to } = props;

  return (
    <NavLink to={to}>
      {({ isActive }) => (
        <Box
          my={2}
          bgColor={isActive ? 'violetLight' : undefined}
          bgColorH="violetLight"
          color={isActive ? 'violet' : undefined}
          colorH="violet"
          cursor={isActive ? 'default' : 'pointer'}
          py={3}
          px={6}
          borderRadius={1}
          transition="none"
          {...props}
        />
      )}
    </NavLink>
  );
}