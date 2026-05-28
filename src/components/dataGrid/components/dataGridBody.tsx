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
  const { viewport } = grid;

  const { startIndex, take, translateY, totalHeight, viewHeight } = viewport.window(scrollTop);
  const showAll = viewport.showAll;
  const isEmpty = viewport.isEmpty;
  const flatRows = grid.flatRows.value;

  const rows = useMemo(() => {
    console.debug('\x1b[36m%s\x1b[0m', '[react-box]: DataGrid render rows');

    if (isEmpty) return null;

    return flatRows.take(take, startIndex).map(renderRow);
  }, [flatRows, isEmpty, take, startIndex]);

  console.debug('\x1b[36m%s\x1b[0m', '[react-box]: DataGrid render DataGridBody');

  // Render empty state outside the CSS Grid to ensure full width
  if (isEmpty) {
    const { noDataComponent } = grid.props.def;
    const defaultEmpty = grid.props.loading ? 'loading...' : 'empty';

    return (
      <Flex
        component={`${grid.componentName}.body.empty` as never}
        jc="center"
        ai="center"
        width="fit"
        position="sticky"
        left={0}
        style={{ height: viewport.emptyHeight }}
      >
        {noDataComponent ?? defaultEmpty}
      </Flex>
    );
  }

  if (showAll) {
    return (
      <Grid
        component={`${grid.componentName}.body` as never}
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
      <Box style={{ height: `${totalHeight}px` }}>
        <Grid
          component={`${grid.componentName}.body` as never}
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
