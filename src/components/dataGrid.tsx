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

export default function DataGrid<TRow extends {}>(props: DataGridProps<TRow>) {
  const grid = useGrid(props);

  const headers = useMemo(() => {
    return grid.headerRows.value.map((row) => {
      return row.map((cell) => <DataGridHeaderCell key={cell.uniqueKey} column={cell} />);
    });
  }, [grid.headerRows.value]);

  const rows = useMemo(() => {
    console.log('render - rows');
    return grid.rows.value.map((row) => (
      <Box key={row.rowKey} className="grid-row" display="contents">
        {grid.leafs.value.map((c) => (
          <DataGridCell key={c.key} row={row} column={c} />
        ))}
      </Box>
    ));
  }, [grid.rows.value, grid.leafs.value]);

  const sizes = useMemo(() => {
    console.log('render - sizes');

    return grid.headerRows.value
      .flatMap((x) => x)
      .reduce<Record<string, string>>((acc, c) => {
        if (c.isLeaf) {
          acc[c.widthVarName] = `${c.inlineWidth}${typeof c.inlineWidth === 'number' ? 'px' : ''}`;
        }

        if (c.pin === 'LEFT') {
          acc[c.leftVarName] = `${c.left}px`;
        }

        if (c.pin === 'RIGHT') {
          acc[c.rightVarName] = `${c.right}px`;
        }

        return acc;
      }, {});
  }, [grid.headerRows.value]);

  const rowHeight = DEFAULT_REM_DIVIDER * grid.ROW_HEIGHT;
  const rowsRef = useRef<DataGridRowsRef>(null);
  const handleScroll = useCallback(
    FnUtils.throttle((event: React.UIEvent) => {
      rowsRef.current?.setScrollTop((event.target as HTMLDivElement).scrollTop);
    }, 200),
    [rowsRef.current],
  );

  // console.log('render - datagrid');

  return (
    <Box component="dataGrid" b={1} overflow="hidden" borderRadius={1} style={sizes}>
      <Box p={3} bb={1}>
        {/* {grid.groupColumns.length > 0 ? grid.groupColumns.join(' > ') : 'No grouping'} */}
        {'No grouping'}
      </Box>
      <Box overflowX="scroll" props={{ onScroll: handleScroll }}>
        <Grid
          width="min-content"
          userSelect={grid.isResizeMode ? 'none' : undefined}
          minWidth="fit"
          style={{ gridTemplateColumns: grid.gridTemplateColumns.value }}
          position="sticky"
          top={0}
          zIndex={1}
        >
          {headers}
        </Grid>

        <Rows
          ref={rowsRef}
          rows={rows}
          rowHeight={rowHeight}
          containerHeight={rowHeight * 10}
          gridTemplateColumns={grid.gridTemplateColumns.value}
        />
      </Box>
      <Box p={3} bgColor="gray-200">
        Rows: {grid.rows.value.length}
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

export interface DataGridRowsRef {
  setScrollTop(value: number): void;
}

function DataGridRows(props: DataGridRowsProps, ref: Ref<DataGridRowsRef>) {
  const { rows, rowHeight, containerHeight, gridTemplateColumns } = props;
  const [scrollTop, setScrollTop] = useState(0);
  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - 5);
  const endIndex = Math.min(startIndex + Math.ceil(containerHeight / rowHeight) + 10, rows.length);
  const visibleItems = rows.slice(startIndex, endIndex);

  useImperativeHandle(ref, () => ({
    setScrollTop,
  }));

  return (
    <Box height={120}>
      <Box
        width="max-content"
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

const Rows = forwardRef(DataGridRows);
