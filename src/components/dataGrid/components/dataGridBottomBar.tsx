import Box from '../../../box';
import Flex from '../../flex';
import GridModel from '../models/gridModel';

interface Props<TRow> {
  grid: GridModel<TRow>;
}

export default function DataGridBottomBar<TRow>(props: Props<TRow>) {
  const { grid } = props;

  return (
    <Flex component="datagrid.bottomBar">
      <Box>Rows: {grid.props.data.length}</Box>
      <Box>Selected: {grid.selectedRows.size}</Box>
    </Flex>
  );
}
