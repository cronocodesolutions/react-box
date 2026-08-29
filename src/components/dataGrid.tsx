import { useLayoutEffect, useRef } from 'react';
import Box from '../box';
import DataGridBottomBar from './dataGrid/components/dataGridBottomBar';
import DataGridContent from './dataGrid/components/dataGridContent';
import DataGridTopBar from './dataGrid/components/dataGridTopBar';
import { DataGridProps } from './dataGrid/contracts/dataGridContract';
import useGrid from './dataGrid/useGrid';
import VisuallyHidden from './visuallyHidden';

export default function DataGrid<TRow extends object>(props: DataGridProps<TRow>) {
  const grid = useGrid(props);
  const containerRef = useRef<HTMLDivElement>(null);

  // Track container width for flexible column sizing, and expose the container element so
  // the resize drag can write width CSS variables straight to it (no React re-render per move).
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    grid.setSizingElement(el);

    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? 0;
      grid.setContainerWidth(width);
    });

    observer.observe(el);
    return () => {
      observer.disconnect();
      grid.setSizingElement(null);
    };
  }, [grid]);

  return (
    <Box ref={containerRef} component={grid.componentName as never} style={grid.sizes.value}>
      {grid.props.def.topBar && <DataGridTopBar grid={grid} />}

      <DataGridContent grid={grid} />

      {grid.props.def.bottomBar && <DataGridBottomBar grid={grid} />}

      {/* Selecting a row changes a checkbox somewhere off in the grid and nothing else: without a
          live region the count is invisible unless you go looking for it. */}
      <VisuallyHidden props={{ role: 'status' }}>{grid.selectionAnnouncement}</VisuallyHidden>
    </Box>
  );
}

(DataGrid as React.FunctionComponent).displayName = 'DataGrid';
