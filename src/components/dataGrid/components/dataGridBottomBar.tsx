import Box from '../../../box';
import Flex from '../../flex';
import GridModel from '../models/gridModel';

interface Props<TRow> {
  grid: GridModel<TRow>;
}

export default function DataGridBottomBar<TRow>(props: Props<TRow>) {
  const { grid } = props;
  const { filtered, total } = grid.filterStats;
  const hasActiveFilters = grid.hasActiveFilters;

  return (
    <Flex component="datagrid.bottomBar">
      <Box>Rows: {filtered !== total ? `${filtered} / ${total}` : total}</Box>
      {grid.props.def.rowSelection && <Box>Selected: {grid.selectedRows.size}</Box>}
      {hasActiveFilters && (
        <Box color="blue-600" cursor="pointer" hover={{ textDecoration: 'underline' }} props={{ onClick: grid.clearAllFilters }}>
          Clear filters
        </Box>
      )}
    </Flex>
  );
}
