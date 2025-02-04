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
import { useMemo } from 'react';
import useGrid from './dataGrid/useGrid';
import DataGridCell from './dataGrid/dataGridCell';
import DataGridHeaderCell from './dataGrid/dataGridHeaderCell';

interface Props<TRow> extends DataGridProps<TRow>, BoxProps {
  data: TRow[];
  def: GridDefinition<TRow>;
}

export default function DataGrid<TRow extends {}>(props: Props<TRow>) {
  const { def } = props;
  const grid = useGridData2(props);

  const sizes = grid.headerColumns.reduce<Record<string, string>>((acc, c) => {
    acc[`--${c.key}-${c.pinned ?? ''}-width`] = typeof c.inlineWidth === 'number' ? `${c.inlineWidth}px` : (c.inlineWidth ?? 'unset');

    return acc;
  }, {});

  const renderRows = useMemo(() => {
    return grid.rows.map((row) => (
      <Box key={row.key} display="contents" className="grid-row">
        {row.cells.map((cell) => (
          <DataGridCell2 key={`${cell.key}${cell.pinned}`} row={row} cell={cell} grid={grid} />
        ))}
      </Box>
    ));
  }, [grid.rows]);

  return (
    <Box component="dataGrid" b={1} borderRadius={1} overflow="hidden" {...props} style={sizes}>
      <Box p={3} bb={1}>
        {grid.groupColumns.length > 0 ? grid.groupColumns.join(' > ') : 'No grouping'}
      </Box>
      <Box overflow="auto" height={112} bb={1}>
        <Grid style={{ gridTemplateColumns: grid.gridTemplateColumns }} userSelect={grid.isResizeMode ? 'none' : undefined}>
          {renderRows}
        </Grid>
      </Box>
      <Flex p={3} jc="space-between" height={10}>
        <Box></Box>
        {def.pagination && <DataGridPagination grid={grid} />}
      </Flex>
    </Box>
  );
}
