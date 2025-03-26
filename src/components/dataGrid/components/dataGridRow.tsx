import Checkbox from '../../checkbox';
import Flex from '../../flex';
import { ROW_SELECTION_CELL_KEY } from '../models/gridModel';
import RowModel from '../models/rowModel';
import DataGridCell from './dataGridCell';

interface Props<TRow> {
  row: RowModel<TRow>;
}

export default function DataGridRow<TRow>(props: Props<TRow>) {
  const { row } = props;

  return (
    <Flex className="grid-row" display="contents" props={{ role: 'row' }}>
      {row.cells.map((cell) => (
        <DataGridCell key={cell.column.key} column={cell.column}>
          {cell.column.key === ROW_SELECTION_CELL_KEY ? <Checkbox /> : cell.value}
        </DataGridCell>
      ))}
    </Flex>
  );
}
