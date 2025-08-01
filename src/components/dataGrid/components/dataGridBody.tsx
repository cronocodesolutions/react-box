import { useMemo } from 'react';
import Box from '../../../box';
import Flex from '../../flex';
import Grid from '../../grid';
import GridModel from '../models/gridModel';
import GroupRowModel from '../models/groupRowModel';
import DataGridGroupRow from './dataGridGroupRow';
import DataGridRow from './dataGridRow';

const DEFAULT_VISIBLE_ROWS_COUNT = 10;
const ROWS_TO_PRELOAD = 20;

interface Props<TRow> {
  grid: GridModel<TRow>;
  scrollTop: number;
}

export default function DataGridBody<TRow>(props: Props<TRow>) {
  const { grid, scrollTop } = props;

  const rowsCount = grid.flatRows.value.length;
  const startIndex = Math.max(0, Math.floor(scrollTop / grid.rowHeight) - ROWS_TO_PRELOAD);
  const visibleRowsCount = grid.props.def.visibleRowsCount ?? DEFAULT_VISIBLE_ROWS_COUNT;
  const viewHeight = grid.rowHeight * visibleRowsCount + grid.rowHeight / 5;

  const rows = useMemo(() => {
    console.debug('\x1b[36m%s\x1b[0m', '[react-box]: DataGrid render rows');

    if (grid.props.data.length === 0) {
      return (
        <Flex jc="center" ai="center" gridColumn="full-row" style={{ height: viewHeight }}>
          {grid.props.loading ? 'loading...' : 'empty'}
        </Flex>
      );
    }

    const take = visibleRowsCount + ROWS_TO_PRELOAD * 2;

    const rowsToRender = grid.flatRows.value.take(take, startIndex).map((row) => {
      if (row instanceof GroupRowModel) {
        return <DataGridGroupRow key={row.key} row={row} />;
      } else {
        return <DataGridRow key={row.key} row={row} />;
      }
    });

    return rowsToRender;
  }, [grid.flatRows.value, grid.props.data.length, grid.props.loading, startIndex, viewHeight, visibleRowsCount]);

  console.debug('\x1b[36m%s\x1b[0m', '[react-box]: DataGrid render DataGridBody');

  return (
    <Box style={{ height: viewHeight }}>
      <Box
        style={{
          height: `${rowsCount * grid.rowHeight}px`,
        }}
      >
        <Grid
          component="datagrid.body"
          width="max-content"
          minWidth="fit"
          transition="none"
          style={{
            transform: `translateY(${startIndex * grid.rowHeight}px)`,
            gridTemplateColumns: grid.gridTemplateColumns.value,
          }}
        >
          {rows}
        </Grid>
      </Box>
    </Box>
  );
}

(DataGridBody as React.FunctionComponent).displayName = 'DataGridBody';
