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

import Box, { BoxProps } from '../box';
import { DataGridProps, GridDefinition } from './dataGrid/dataGridContract';
import Grid from './grid';
import useGridData2 from './dataGrid/useGridData2';
import Flex from './flex';
import DataGridCell2 from './dataGrid/dataGridCell2';
import DataGridPagination from './dataGrid/dataGridPagination';
import { useCallback, useMemo, useState } from 'react';
import useGrid from './dataGrid/useGrid';
import DataGridCell from './dataGrid/dataGridCell';
import DataGridHeaderCell from './dataGrid/dataGridHeaderCell';
import { DEFAULT_REM_DIVIDER } from '../core/boxConstants';
import FnUtils from '../utils/fn/fnUtils';
import Row from './dataGrid/models/row';

interface Props<TRow> extends DataGridProps<TRow>, BoxProps {
  data: TRow[];
  def: GridDefinition<TRow>;
}

export default function DataGrid<TRow extends {}>(props: DataGridProps<TRow>) {
  const grid = useGrid(props);
  const rowHeight = DEFAULT_REM_DIVIDER * grid.defaultHeight;
  const [scrollTop, setScrollTop] = useState(0);

  const skipRows = Math.floor(scrollTop / rowHeight);
  const take = 10;

  const rows = useMemo(() => {
    return grid.rows.value.map((row) => (
      <Box key={row.rowKey} className="grid-row" display="contents">
        {grid.leafs.value.map((c) => (
          <DataGridCell key={c.key} row={row} column={c} />
        ))}
      </Box>
    ));
  }, [grid.rows.value]);

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
      <Box overflow="auto" height={112}>
        <Grid style={{ gridTemplateColumns: grid.gridTemplateColumns.value }}>
          {grid.headers.value.map((c) => (
            <DataGridHeaderCell key={c.key} column={c} />
          ))}

          {rows}
        </Grid>
      </Box>
    </Box>
  );
}

function VirtualizedList<TRow>({
  items,
  itemHeight,
  containerHeight,
}: {
  items: JSX.Element[];
  itemHeight: number;
  containerHeight: number;
}) {
  const [scrollTop, setScrollTop] = useState(0);
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(startIndex + Math.ceil(containerHeight / itemHeight), items.length);
  const visibleItems = items.slice(startIndex, endIndex);
  const invisibleItemsHeight = (startIndex + visibleItems.length - endIndex) * itemHeight;
  const handleScroll = useCallback(
    FnUtils.throttle((event: React.UIEvent) => {
      setScrollTop(event.currentTarget.scrollTop);
    }, 50),
    [setScrollTop],
  );

  return (
    <Box style={{ height: `${containerHeight}px`, overflowY: 'scroll' }} props={{ onScroll: handleScroll }}>
      <Box style={{ height: `${items.length * itemHeight}px` }}>
        <Box
          style={{
            position: 'relative',
            height: `${visibleItems.length * itemHeight}px`,
            top: `${startIndex * itemHeight}px`,
          }}
        >
          {visibleItems}
        </Box>
        <div style={{ height: `${invisibleItemsHeight}px` }} />
      </Box>
    </Box>
  );

  return (
    <Box style={{ height: `${containerHeight}px`, overflowY: 'scroll' }} props={{ onScroll: handleScroll }}>
      <div style={{ height: `${items.length * itemHeight}px` }}>
        <div
          style={{
            position: 'relative',
            height: `${visibleItems.length * itemHeight}px`,
            top: `${startIndex * itemHeight}px`,
          }}
        >
          {visibleItems}
        </div>
        <div style={{ height: `${invisibleItemsHeight}px` }} />
      </div>
    </Box>
  );
}
