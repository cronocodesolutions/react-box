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
import { GridDef } from './dataGrid/dataGridContract';
import Grid from './grid';
import useGridData from './dataGrid/useGridData';
import Flex from './flex';
import DataGridCell from './dataGrid/dataGridCell';
import DataGridPagination from './dataGrid/dataGridPagination';

interface Props<TRow> extends BoxProps {
  data?: TRow[];
  def: GridDef<TRow>;
}

export default function DataGrid<TRow extends {}>(props: Props<TRow>) {
  const { def } = props;
  const grid = useGridData(props);

  return (
    <Box component="dataGrid" b={1} borderRadius={1} overflow="hidden" {...props}>
      <Box p={3} bb={1}>
        top bar
      </Box>
      <Box overflow="auto" height={112} bb={1}>
        <Grid
          style={{
            gridTemplateColumns: grid.gridTemplateColumns,
            // width: grid.isResizeMode ? grid.gridWidth : undefined,
          }}
          userSelect={grid.isResizeMode ? 'none' : undefined}
        >
          {grid.rows.map((row) => {
            return (
              <Box key={row.key} display="contents" className="grid-row">
                {row.cells.map((cell) => (
                  <DataGridCell key={`${cell.key}${cell.pinned}`} cell={cell} />
                ))}
              </Box>
            );
          })}
        </Grid>
      </Box>
      <Flex p={3} jc="space-between" height={10}>
        <Box></Box>
        {def.pagination && <DataGridPagination pagination={grid.pagination} />}
      </Flex>
    </Box>
  );
}
