import Box from '../../../box';
import Flex from '../../flex';
import GridModel from '../models/gridModel';
import DataGridPagination from './dataGridPagination';

interface Props<TRow> {
  grid: GridModel<TRow>;
}

export default function DataGridBottomBar<TRow>(props: Props<TRow>) {
  const { grid } = props;
  const paginationState = grid.paginationState;

  if (paginationState) {
    const { page, pageSize, totalItems } = paginationState;
    const start = (page - 1) * pageSize + 1;
    const end = Math.min(start + pageSize - 1, totalItems);

    return (
      <Flex component={`${grid.componentName}.bottomBar` as never}>
        <Box component={`${grid.componentName}.bottomBar.info` as never}>
          Rows: {totalItems > 0 ? `${start}–${end} of ${totalItems}` : '0'}
        </Box>
        {grid.props.def.rowSelection && (
          <Box component={`${grid.componentName}.bottomBar.info` as never}>Selected: {grid.selectedRows.size}</Box>
        )}
        <DataGridPagination grid={grid} />
      </Flex>
    );
  }

  const { filtered, total } = grid.filterStats;
  const hasActiveFilters = grid.hasActiveFilters;

  return (
    <Flex component={`${grid.componentName}.bottomBar` as never}>
      <Box component={`${grid.componentName}.bottomBar.info` as never}>Rows: {filtered !== total ? `${filtered} / ${total}` : total}</Box>
      {grid.props.def.rowSelection && (
        <Box component={`${grid.componentName}.bottomBar.info` as never}>Selected: {grid.selectedRows.size}</Box>
      )}
      {hasActiveFilters && (
        <Box
          component={`${grid.componentName}.bottomBar.clearFilters` as never}
          color="blue-600"
          cursor="pointer"
          hover={{ textDecoration: 'underline' }}
          props={{ onClick: grid.clearAllFilters }}
        >
          Clear filters
        </Box>
      )}
    </Flex>
  );
}
