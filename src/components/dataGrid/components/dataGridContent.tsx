import { useCallback, useRef, useState } from 'react';
import Box from '../../../box';
import GridNavigationContext from '../gridNavigationContext';
import GridModel from '../models/gridModel';
import useGridNavigation from '../useGridNavigation';
import DataGridBody from './dataGridBody';
import DataGridEmptyColumns from './dataGridEmptyColumns';
import DataGridHeader from './dataGridHeader';
import DataGridLoader from './dataGridLoader';

interface Props<TRow> {
  grid: GridModel<TRow>;
}

export default function DataGridContent<TRow>(props: Props<TRow>) {
  const { grid } = props;

  const scrollerRef = useRef<HTMLDivElement>(null);
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

  // A keyboard jump writes the scroll position straight through, ahead of the animation frame the
  // pointer path can afford: the row has to be rendered by the time focus goes looking for it.
  const navigation = useGridNavigation({ grid, scrollerRef, scrollTop, onScrollTo: setScrollTop });

  if (!grid.hasVisibleColumns) {
    return <DataGridEmptyColumns grid={grid} />;
  }

  return (
    <GridNavigationContext.Provider value={navigation}>
      <Box
        ref={scrollerRef}
        component={`${grid.componentName}.content` as never}
        overflowX="scroll"
        style={{ willChange: 'scroll-position' }}
        props={{
          role: 'grid',
          'aria-rowcount': navigation.rowCount,
          'aria-colcount': navigation.columnCount,
          'aria-multiselectable': grid.props.def.rowSelection ? true : undefined,
          'aria-labelledby': grid.props.def.title ? grid.titleId : undefined,
          'aria-busy': grid.props.loading ? true : undefined,
          onScroll: handleScroll,
          onKeyDown: navigation.onKeyDown,
        }}
      >
        <DataGridHeader grid={grid} />

        {grid.props.loading && <DataGridLoader grid={grid} />}

        <DataGridBody grid={grid} scrollTop={scrollTop} />
      </Box>
    </GridNavigationContext.Provider>
  );
}

(DataGridContent as React.FunctionComponent).displayName = 'DataGridContent';
