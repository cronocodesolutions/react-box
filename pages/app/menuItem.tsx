import React from 'react';
import Box from '../../src/box';
import { NavLink } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
  to: string;
}
export default function MenuItem(props: Props) {
  const { children, to } = props;

  return (
    <NavLink to={to}>
      <Box p={2} bgColor="blue6">
        {children}
      </Box>
    </NavLink>
  );
}
