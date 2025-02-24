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
import { forwardRef, Ref, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import useGrid from './dataGrid/useGrid';
import DataGridCell from './dataGrid/dataGridCell';
import DataGridHeaderCell from './dataGrid/dataGridHeaderCell';
import { DEFAULT_REM_DIVIDER } from '../core/boxConstants';
import FnUtils from '../utils/fn/fnUtils';
import GridModel from './dataGrid/models/grid';

export default function DataGrid<TRow extends {}>(props: DataGridProps<TRow>) {
  const grid = useGrid(props);

  const headers = useMemo(() => {
    return grid.headerRows.value.map((row) => {
      return row.map((cell) => {
        return <DataGridHeaderCell key={cell.uniqueKey} column={cell} />;
      });
    });
  }, [grid.headerRows.value]);

  const sizes = useMemo(() => {
    console.log('render - sizes');

    return grid.flatColumns.value.reduce<Record<string, string>>((acc, c) => {
      const { inlineWidth } = c;
      if (typeof inlineWidth === 'number') {
        acc[c.widthVarName] = `${c.inlineWidth}px`;
      }

      if (c.pin === 'LEFT') {
        acc[c.leftVarName] = `${c.left}px`;
      }

      if (c.pin === 'RIGHT') {
        acc[c.rightVarName] = `${c.right}px`;
      }

      return acc;
    }, {});
  }, [grid.flatColumns.value]);

  const rowsRef = useRef<DataGridRowsRef>(null);
  const handleScroll = useCallback(
    FnUtils.throttle((event: React.UIEvent) => {
      rowsRef.current?.setScrollTop((event.target as HTMLDivElement).scrollTop);
    }, 200),
    [rowsRef.current],
  );

  console.log('render - data grid');

  return (
    <Box component="dataGrid" b={1} overflow="hidden" borderRadius={1} style={sizes}>
      <Box p={3} bb={1}>
        {/* {grid.groupColumns.length > 0 ? grid.groupColumns.join(' > ') : 'No grouping'} */}
        {'No grouping'}
      </Box>
      <Box overflowX="scroll" props={{ onScroll: handleScroll }}>
        <Grid
          width="max-content"
          minWidth="fit"
          userSelect={grid.isResizeMode ? 'none' : undefined}
          style={{ gridTemplateColumns: grid.gridTemplateColumns.value }}
          position="sticky"
          top={0}
          zIndex={1}
        >
          {headers}
        </Grid>

        <Rows ref={rowsRef} grid={grid} />
      </Box>
      <Box p={3} bgColor="gray-200">
        Rows: {grid.rows.value.length}
      </Box>
    </Box>
  );
}

interface DataGridRowsProps<TRow> {
  grid: GridModel<TRow>;
}

export interface DataGridRowsRef {
  setScrollTop(value: number): void;
}

const visibleRows = 10;
const rowsOffset = 15;

function DataGridRows<TRow>(props: DataGridRowsProps<TRow>, ref: Ref<DataGridRowsRef>) {
  const { grid } = props;

  const rowHeight = DEFAULT_REM_DIVIDER * grid.ROW_HEIGHT;

  const [scrollTop, setScrollTop] = useState(0);
  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - rowsOffset);

  const rows = useMemo(() => {
    console.log('render - rows');

    const endIndex = startIndex + visibleRows + rowsOffset * 2;
    return grid.rows.value.slice(startIndex, endIndex).map((row) => (
      <Box key={row.rowKey} className={['grid-row', row.rowKey.toString()]} display="contents">
        {grid.leafs.value.map((c) => (
          <DataGridCell key={c.key} row={row} column={c} />
        ))}
      </Box>
    ));
  }, [grid.rows.value, grid.leafs.value, startIndex]);

  useImperativeHandle(ref, () => ({
    setScrollTop,
  }));

  return (
    <Box height={grid.ROW_HEIGHT * visibleRows}>
      <Box
        style={{
          height: `${grid.rows.value.length * rowHeight}px`,
        }}
      >
        <Grid
          width="max-content"
          minWidth="fit"
          transition="none"
          style={{
            transform: `translateY(${startIndex * rowHeight}px)`,
            gridTemplateColumns: grid.gridTemplateColumns.value,
          }}
        >
          {rows}
        </Grid>
      </Box>
    </Box>
  );
}

const Rows = forwardRef(DataGridRows) as <TRow>(props: DataGridRowsProps<TRow> & React.RefAttributes<DataGridRowsRef>) => React.ReactNode;
