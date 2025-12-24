import { useCallback, useRef, useState } from 'react';
import Box from '../../../box';
import GridModel from '../models/gridModel';
import DataGridBody from './dataGridBody';
import DataGridHeader from './dataGridHeader';

interface Props<TRow> {
  grid: GridModel<TRow>;
}

export default function DataGridContent<TRow>(props: Props<TRow>) {
  const { grid } = props;

  const [scrollTop, setScrollTop] = useState(0);
  const rafRef = useRef<number | null>(null);

  const handleScroll = useCallback((event: React.UIEvent) => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      setScrollTop((event.target as HTMLDivElement).scrollTop);
      rafRef.current = null;
    });
  }, []);

  return (
    <Box overflowX="scroll" style={{ willChange: 'scroll-position' }} props={{ onScroll: handleScroll }}>
      <DataGridHeader grid={grid} />

      <DataGridBody grid={grid} scrollTop={scrollTop} />
    </Box>
  );
}

(DataGridContent as React.FunctionComponent).displayName = 'DataGridContent';
