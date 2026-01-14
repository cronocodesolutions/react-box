import { useLayoutEffect, useRef } from 'react';
import Box from '../box';
import DataGridBottomBar from './dataGrid/components/dataGridBottomBar';
import DataGridContent from './dataGrid/components/dataGridContent';
import DataGridTopBar from './dataGrid/components/dataGridTopBar';
import { DataGridProps } from './dataGrid/contracts/dataGridContract';
import useGrid from './dataGrid/useGrid';

export default function DataGrid<TRow extends object>(props: DataGridProps<TRow>) {
  const grid = useGrid(props);
  const containerRef = useRef<HTMLDivElement>(null);

  // Track container width for flexible column sizing
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? 0;
      grid.setContainerWidth(width);
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [grid]);

  console.debug('\x1b[36m%s\x1b[0m', '[react-box]: DataGrid render');

  return (
    <Box ref={containerRef} component="datagrid" style={grid.sizes.value} props={{ role: 'presentation' }}>
      {grid.props.def.topBar && <DataGridTopBar grid={grid} />}

      <DataGridContent grid={grid} />

      {grid.props.def.bottomBar && <DataGridBottomBar grid={grid} />}
    </Box>
  );
}

(DataGrid as React.FunctionComponent).displayName = 'DataGrid';
