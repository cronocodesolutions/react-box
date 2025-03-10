import Checkbox from '../checkbox';
import Flex from '../flex';
import DataGridCell from './dataGridCell';
import { ROW_SELECTION_CELL_KEY } from './models/gridModel';
import RowModel from './models/rowModel';

interface Props<TRow> {
  row: RowModel<TRow>;
}

export default function DataGridRow<TRow>(props: Props<TRow>) {
  const { row } = props;

  return (
    <Flex className="grid-row" display="contents">
      {row.cells.map((cell) => (
        <DataGridCell key={cell.column.key} column={cell.column}>
          {cell.column.key === ROW_SELECTION_CELL_KEY ? <Checkbox /> : cell.value}
        </DataGridCell>
      ))}
    </Flex>
  );
}
