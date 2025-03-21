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
import DataGridHeaderCell from './dataGrid/components/dataGridHeaderCell';
import { DEFAULT_REM_DIVIDER } from '../core/boxConstants';
import FnUtils from '../utils/fn/fnUtils';
import GridModel from './dataGrid/models/gridModel';
import GroupRowModel from './dataGrid/models/groupRowModel';
import DataGridGroupRow from './dataGrid/components/dataGridGroupRow';
import DataGridRow from './dataGrid/components/dataGridRow';
import DataGridColumnGroups from './dataGrid/components/dataGridColumnGroups';

export default function DataGrid<TRow extends {}>(props: DataGridProps<TRow>) {
  const grid = useGrid(props);
  const { isResizeMode } = grid;

  const headers = useMemo(() => {
    console.log('render - headers');
    return grid.headerRows.value.map((row) => {
      return row.map((cell) => {
        return <DataGridHeaderCell key={cell.uniqueKey} column={cell} />;
      });
    });
  }, [grid.headerRows.value]);

  const rowsRef = useRef<DataGridRowsRef>(null);
  const handleScroll = useCallback(
    FnUtils.throttle((event: React.UIEvent) => {
      rowsRef.current?.setScrollTop((event.target as HTMLDivElement).scrollTop);
    }, 100),
    [rowsRef.current],
  );

  console.log('render - data grid');

  return (
    <Box component="datagrid" style={grid.sizes.value} props={{ role: 'presentation' }}>
      <DataGridColumnGroups grid={grid} />

      <Box overflowX="scroll" props={{ onScroll: handleScroll }}>
        <Grid component="datagrid.header" variant={{ isResizeMode }} style={{ gridTemplateColumns: grid.gridTemplateColumns.value }}>
          {headers}
        </Grid>

        <Rows ref={rowsRef} grid={grid} />
      </Box>
      <Box p={3} bgColor="gray-200" bt={1} borderColor="gray-400">
        Rows: {props.data.length}
      </Box>
    </Box>
  );
}

interface DataGridRowsProps<TRow> {
  grid: GridModel<TRow>;
}

interface DataGridRowsRef {
  setScrollTop(value: number): void;
}

const visibleRows = 10;
const rowsOffset = 25;
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
  }, [grid.flatRows.value, startIndex]);

  useImperativeHandle(ref, () => ({
    setScrollTop,
  }));

  const rowsCount = grid.flatRows.value.length;

  return (
    <Box height={grid.ROW_HEIGHT * visibleRows + 4}>
      <Box
        style={{
          height: `${rowsCount * rowHeight}px`,
        }}
      >
        <Grid
          props={{ role: 'presentation' }}
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
