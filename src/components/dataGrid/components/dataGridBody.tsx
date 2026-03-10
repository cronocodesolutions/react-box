import { useMemo } from 'react';
import Box from '../../../box';
import Flex from '../../flex';
import Grid from '../../grid';
import DetailRowModel from '../models/detailRowModel';
import GridModel from '../models/gridModel';
import GroupRowModel from '../models/groupRowModel';
import RowModel from '../models/rowModel';
import DataGridDetailRow from './dataGridDetailRow';
import DataGridGroupRow from './dataGridGroupRow';
import DataGridRow from './dataGridRow';

const DEFAULT_VISIBLE_ROWS_COUNT = 10;
const ROWS_TO_PRELOAD = 20;

/**
 * Binary search to find the first row index whose offset is <= scrollTop.
 */
function findStartIndex(offsets: number[], scrollTop: number): number {
  let lo = 0;
  let hi = offsets.length - 1;

  while (lo < hi) {
    const mid = (lo + hi + 1) >>> 1;
    if (offsets[mid] <= scrollTop) {
      lo = mid;
    } else {
      hi = mid - 1;
    }
  }

  return lo;
}

function renderRow<TRow>(row: RowModel<TRow> | GroupRowModel<TRow> | DetailRowModel<TRow>) {
  if (row instanceof DetailRowModel) {
    return <DataGridDetailRow key={row.key} row={row} />;
  } else if (row instanceof GroupRowModel) {
    return <DataGridGroupRow key={row.key} row={row} />;
  } else {
    return <DataGridRow key={row.key} row={row as RowModel<TRow>} />;
  }
}

interface Props<TRow> {
  grid: GridModel<TRow>;
  scrollTop: number;
}

export default function DataGridBody<TRow>(props: Props<TRow>) {
  const { grid, scrollTop } = props;

  const showAll = grid.props.def.visibleRowsCount === 'all';
  const { offsets, totalHeight } = grid.rowOffsets.value;
  const hasDetailRows = !!grid.props.def.rowDetail;
  const startIndex = showAll
    ? 0
    : hasDetailRows
      ? Math.max(0, findStartIndex(offsets, scrollTop) - ROWS_TO_PRELOAD)
      : Math.max(0, Math.floor(scrollTop / grid.rowHeight) - ROWS_TO_PRELOAD);
  const translateY = showAll ? 0 : hasDetailRows ? (offsets[startIndex] ?? 0) : startIndex * grid.rowHeight;
  const numericVisibleRowsCount = showAll
    ? grid.flatRows.value.length
    : ((grid.props.def.visibleRowsCount as number | undefined) ?? DEFAULT_VISIBLE_ROWS_COUNT);
  const viewHeight = showAll ? undefined : grid.rowHeight * numericVisibleRowsCount + grid.rowHeight / 5;
  const isEmpty = grid.props.data.length === 0;

  const rows = useMemo(() => {
    console.debug('\x1b[36m%s\x1b[0m', '[react-box]: DataGrid render rows');

    if (isEmpty) {
      return null;
    }

    if (showAll) {
      return grid.flatRows.value.map(renderRow);
    }

    const take = numericVisibleRowsCount + ROWS_TO_PRELOAD * 2;
    return grid.flatRows.value.take(take, startIndex).map(renderRow);
  }, [grid.flatRows.value, isEmpty, showAll, startIndex, numericVisibleRowsCount]);

  console.debug('\x1b[36m%s\x1b[0m', '[react-box]: DataGrid render DataGridBody');

  // Render empty state outside the CSS Grid to ensure full width
  if (isEmpty) {
    const { noDataComponent } = grid.props.def;
    const defaultEmpty = grid.props.loading ? 'loading...' : 'empty';

    return (
      <Flex
        jc="center"
        ai="center"
        width="fit"
        position="sticky"
        left={0}
        style={{ height: viewHeight ?? grid.rowHeight * DEFAULT_VISIBLE_ROWS_COUNT }}
      >
        {noDataComponent ?? defaultEmpty}
      </Flex>
    );
  }

  if (showAll) {
    return (
      <Grid
        component="datagrid.body"
        width="max-content"
        minWidth="fit"
        transition="none"
        style={{ gridTemplateColumns: grid.gridTemplateColumns.value }}
      >
        {rows}
      </Grid>
    );
  }

  return (
    <Box style={{ height: viewHeight }}>
      <Box
        style={{
          height: hasDetailRows ? `${totalHeight}px` : `${grid.flatRows.value.length * grid.rowHeight}px`,
        }}
      >
        <Grid
          component="datagrid.body"
          width="max-content"
          minWidth="fit"
          transition="none"
          style={{
            transform: `translate3d(0, ${translateY}px, 0)`,
            willChange: 'transform',
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
