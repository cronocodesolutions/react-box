import { ReactNode } from 'react';
import Box from '../../src/box';
import { useIsRealMount } from '../app/hydration';

interface Props {
  children: ReactNode;
  /** Seconds before this block starts, for staggering several of them down a page. */
  delay?: number;
  /** How far to rise from, on the ÷4 scale — 5 is 20px. */
  y?: number;
  /** How far to slide in from, on the same scale. For a panel that swaps sideways rather than a page. */
  x?: number;
}

/**
 * The entrance fade the docs pages wrap their content in — `startingStyle`, so it is a rule rather than
 * a library. On the first paint there is nothing to reveal: the HTML is prerendered, so the content is
 * already on screen and starting it at `opacity: 0` would hide the whole page until React took over.
 * Only a mount after hydration — a client-side navigation — animates, which is what the guard is for.
 */
export default function Reveal({ children, delay = 0, y = 5, x = 0 }: Props) {
  const animate = useIsRealMount();

  return (
    <Box
      startingStyle={animate ? { opacity: 0, translateY: y, translateX: x } : undefined}
      transitionDuration={300}
      transitionDelay={delay * 1000}
      transitionTimingFunction="ease-out"
    >
      {children}
    </Box>
  );
}
