import Box from '../../../box';
import GridModel from '../models/gridModel';

interface Props<TRow> {
  grid: GridModel<TRow>;
}

export default function DataGridBottomBar<TRow>(props: Props<TRow>) {
  const { grid } = props;

  return <Box component="datagrid.bottomBar">Rows: {grid.props.data.length}</Box>;
}
