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
import { DataGridProps } from './dataGrid/contracts/dataGridContract';
import Grid from './grid';
import { forwardRef, Ref, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import useGrid from './dataGrid/useGrid';
import DataGridHeaderCell from './dataGrid/dataGridHeaderCell';
import { DEFAULT_REM_DIVIDER } from '../core/boxConstants';
import FnUtils from '../utils/fn/fnUtils';
import GridModel from './dataGrid/models/gridModel';
import GroupRowModel from './dataGrid/models/groupRowModel';
import DataGridGroupRow from './dataGrid/dataGridGroupRow';
import DataGridRow from './dataGrid/dataGridRow';

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

    const size = grid.flatColumns.value.reduce<Record<string, string>>((acc, c) => {
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

    size['--row-width'] = `${grid.leafs.value.sumBy((c) => c.inlineWidth ?? 0)}px`;

    return size;
  }, [grid.flatColumns.value, grid.leafs.value]);

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
        {grid.groupColumns.length > 0 ? grid.groupColumns.join(' > ') : 'No grouping'}
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
const take = visibleRows + rowsOffset * 2;

function DataGridRows<TRow>(props: DataGridRowsProps<TRow>, ref: Ref<DataGridRowsRef>) {
  const { grid } = props;

  const rowHeight = DEFAULT_REM_DIVIDER * grid.ROW_HEIGHT;

  const [scrollTop, setScrollTop] = useState(0);
  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - rowsOffset);

  const rows = useMemo(() => {
    console.log('render - rows');

    const rowsToRender = grid.flatRows.value.take(take, startIndex).map((row) => {
      if (row instanceof GroupRowModel) {
        return <DataGridGroupRow key={row.rowKey} row={row} />;
      } else {
        return <DataGridRow key={row.rowKey} row={row} />;
      }
    });

    return rowsToRender;
  }, [grid, grid.flatRows.value, grid.rows.value, grid.leafs.value, startIndex]);

  useImperativeHandle(ref, () => ({
    setScrollTop,
  }));

  const rowsCount = grid.flatRows.value.length;

  return (
    <Box height={grid.ROW_HEIGHT * visibleRows}>
      <Box
        style={{
          height: `${rowsCount * rowHeight}px`,
        }}
      >
        <Box width="max-content" minWidth="fit" transition="none" style={{ transform: `translateY(${startIndex * rowHeight}px)` }}>
          {rows}
        </Box>
      </Box>
    </Box>
  );
}

const Rows = forwardRef(DataGridRows) as <TRow>(props: DataGridRowsProps<TRow> & React.RefAttributes<DataGridRowsRef>) => React.ReactNode;
