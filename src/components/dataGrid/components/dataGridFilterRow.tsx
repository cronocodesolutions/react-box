import GridModel from '../models/gridModel';
import DataGridFilterCell from './dataGridFilterCell';

interface Props<TRow> {
  grid: GridModel<TRow>;
}

export default function DataGridFilterRow<TRow>(props: Props<TRow>) {
  const { grid } = props;

  if (!grid.filter.hasFilterableColumns) return null;

  return grid.columns.value.visibleLeafs.map((column) => <DataGridFilterCell key={column.uniqueKey} column={column} grid={grid} />);
}

(DataGridFilterRow as React.FunctionComponent).displayName = 'DataGridFilterRow';
