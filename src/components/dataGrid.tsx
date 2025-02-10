// ❌ simple table column definitions + data[]
// ❌ hover row styles
// ❌ horizontal scroll for headers + rows
// ❌ vertical scroll rows only
// ❌ column sorting
// ❌ pagination
// ❌ resize column
// ❌ pin (left/right)
// ❌ multi-level headers
// ❌ grouping
// ❌ select row checkbox
// ❌ filters
// ❌ empty table
// ❌ column sorting by type

// datagrid container

import Box from '../box';
import { DataGridProps } from './dataGrid/dataGridContract';
import Grid from './grid';
import { useCallback, useMemo, useState } from 'react';
import useGrid from './dataGrid/useGrid';
import DataGridCell from './dataGrid/dataGridCell';
import DataGridHeaderCell from './dataGrid/dataGridHeaderCell';
import { DEFAULT_REM_DIVIDER } from '../core/boxConstants';
import FnUtils from '../utils/fn/fnUtils';

export default function DataGrid<TRow extends {}>(props: DataGridProps<TRow>) {
  const grid = useGrid(props);

  const rows = useMemo(() => {
    return grid.rows.value.map((row) => (
      <Box key={row.rowKey} className={`grid-row ${row.rowKey}`} display="contents">
        {grid.leafs.value.map((c) => (
          <DataGridCell key={c.key} row={row} column={c} />
        ))}
      </Box>
    ));
  }, [grid.rows.value]);

  const rowHeight = DEFAULT_REM_DIVIDER * grid.defaultCellHeight;

  console.log('render');

  return (
    <Box
      component="dataGrid"
      b={1}
      borderRadius={1}
      bgColor="gray-100"
      {...props}
      // style={sizes}
    >
      <Box p={3} bb={1}>
        {/* {grid.groupColumns.length > 0 ? grid.groupColumns.join(' > ') : 'No grouping'} */}
        {'No grouping'}
      </Box>
      <Box overflowX="scroll">
        <Grid style={{ gridTemplateColumns: grid.gridTemplateColumns.value }}>
          {grid.headers.value.map((c) => (
            <DataGridHeaderCell key={c.key} column={c} />
          ))}
        </Grid>

        <DataGridRows
          rows={rows}
          rowHeight={rowHeight}
          containerHeight={rowHeight * 10}
          gridTemplateColumns={grid.gridTemplateColumns.value}
        />

        <Box>footer</Box>
      </Box>
    </Box>
  );
}

interface DataGridRowsProps {
  rows: JSX.Element[];
  rowHeight: number;
  containerHeight: number;
  gridTemplateColumns: string;
}

function DataGridRows(props: DataGridRowsProps) {
  const { rows, rowHeight, containerHeight, gridTemplateColumns } = props;
  const [scrollTop, setScrollTop] = useState(0);
  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - 5);
  const endIndex = Math.min(startIndex + Math.ceil(containerHeight / rowHeight) + 10, rows.length);
  const visibleItems = rows.slice(startIndex, endIndex);

  const handleScroll = useCallback(
    FnUtils.throttle((event: React.UIEvent) => {
      setScrollTop((event.target as HTMLDivElement).scrollTop);
    }, 200),
    [setScrollTop],
  );

  console.log('render - DataGridRows');

  return (
    <Box height={120} overflowY="scroll" width="fit-content" props={{ onScroll: handleScroll }}>
      <Box
        style={{
          height: `${rows.length * rowHeight}px`,
        }}
      >
        <Grid
          transition="none"
          style={{
            transform: `translateY(${startIndex * rowHeight}px)`,
            gridTemplateColumns,
          }}
        >
          {visibleItems}
        </Grid>
      </Box>
    </Box>
  );
}
