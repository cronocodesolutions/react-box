import { ReactNode } from 'react';
import Box from '../../src/box';
import { useIsRealMount } from '../app/hydration';

interface Props {
  children: ReactNode;
  /** The angle the arriving icon turns from. */
  rotate?: -45 | -90 | -135;
  /** The size it grows from, unitless. */
  scale?: number;
}

/**
 * One icon replacing another: give it a `key` and the arriving icon animates in. Deliberately no exit —
 * a `<Presence>` here would hold two icons inside one button for the length of a fade, and the outgoing
 * one has nowhere to go. Gated on hydration like every other entrance on this site, so the icon the
 * prerendered page is already showing does not spin on arrival.
 */
export default function IconSwap({ children, rotate, scale }: Props) {
  const animate = useIsRealMount();

  return (
    <Box startingStyle={animate ? { opacity: 0, rotate, scale } : undefined} transitionDuration={150}>
      {children}
    </Box>
  );
}
