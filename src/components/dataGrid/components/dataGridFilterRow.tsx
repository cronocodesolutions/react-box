import GridModel from '../models/gridModel';
import DataGridFilterCell from './dataGridFilterCell';

interface Props<TRow> {
  grid: GridModel<TRow>;
}

export default function DataGridFilterRow<TRow>(props: Props<TRow>) {
  const { grid } = props;
  const { visibleLeafs } = grid.columns.value;

  // Check if any column has filterable enabled
  const hasFilterableColumns = visibleLeafs.some((col) => col.filterable);

  if (!hasFilterableColumns) return null;

  return visibleLeafs.map((column) => <DataGridFilterCell key={column.uniqueKey} column={column} grid={grid} />);
}

(DataGridFilterRow as React.FunctionComponent).displayName = 'DataGridFilterRow';
