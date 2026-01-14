import { useCallback, useRef, useState } from 'react';
import Box from '../../../box';
import GridModel from '../models/gridModel';
import DataGridBody from './dataGridBody';
import DataGridEmptyColumns from './dataGridEmptyColumns';
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

  const hasVisibleColumns = grid.columns.value.userVisibleLeafs.length > 0;

  if (!hasVisibleColumns) {
    return <DataGridEmptyColumns />;
  }

  return (
    <Box overflowX="scroll" style={{ willChange: 'scroll-position' }} props={{ onScroll: handleScroll }}>
      <DataGridHeader grid={grid} />

      <DataGridBody grid={grid} scrollTop={scrollTop} />
    </Box>
  );
}

(DataGridContent as React.FunctionComponent).displayName = 'DataGridContent';
