import Box from '../../../box';
import Flex from '../../flex';
import GridModel from '../models/gridModel';
import DataGridPagination from './dataGridPagination';

interface Props<TRow> {
  grid: GridModel<TRow>;
}

export default function DataGridBottomBar<TRow>(props: Props<TRow>) {
  const { grid } = props;
  const { pagination, filter } = grid;

  if (pagination.state) {
    const { totalItems, startItem, endItem } = pagination;

    return (
      <Flex component={`${grid.componentName}.bottomBar` as never}>
        <Box component={`${grid.componentName}.bottomBar.info` as never}>
          Rows: {totalItems > 0 ? `${startItem}–${endItem} of ${totalItems}` : '0'}
        </Box>
        {grid.props.def.rowSelection && (
          <Box component={`${grid.componentName}.bottomBar.info` as never}>Selected: {grid.selectedRows.size}</Box>
        )}
        <DataGridPagination grid={grid} />
      </Flex>
    );
  }

  const { filtered, total } = filter.filterStats;

  return (
    <Flex component={`${grid.componentName}.bottomBar` as never}>
      <Box component={`${grid.componentName}.bottomBar.info` as never}>Rows: {filtered !== total ? `${filtered} / ${total}` : total}</Box>
      {grid.props.def.rowSelection && (
        <Box component={`${grid.componentName}.bottomBar.info` as never}>Selected: {grid.selectedRows.size}</Box>
      )}
      {filter.hasActiveFilters && (
        <Box
          component={`${grid.componentName}.bottomBar.clearFilters` as never}
          color="blue-600"
          cursor="pointer"
          hover={{ textDecoration: 'underline' }}
          props={{ onClick: filter.clearAllFilters }}
        >
          Clear filters
        </Box>
      )}
    </Flex>
  );
}
