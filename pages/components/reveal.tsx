import { motion } from 'framer-motion';
import { ReactNode, useState } from 'react';
import { hasHydrated } from '../app/hydration';

interface Props {
  children: ReactNode;
  /** Seconds before this block starts, for staggering several of them down a page. */
  delay?: number;
  /** Pixels to rise from. */
  y?: number;
}

/**
 * The entrance fade the docs pages wrap their content in. On the first paint there is nothing to
 * reveal: the HTML is prerendered, so the content is already on screen and starting it at `opacity: 0`
 * would hide the whole page until React took over. Only a mount after hydration — a client-side
 * navigation — animates.
 */
export default function Reveal({ children, delay = 0, y = 20 }: Props) {
  const [animate] = useState(hasHydrated);

  return (
    <motion.div initial={animate ? { opacity: 0, y } : false} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.3 }}>
      {children}
    </motion.div>
  );
}
