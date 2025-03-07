import Flex from '../flex';
import DataGridCell from './dataGridCell';
import { EMPTY_CELL_KEY } from './models/gridModel';
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
          {cell.column.key === EMPTY_CELL_KEY ? null : (row.row[cell.column.key as keyof TRow] as string)}
        </DataGridCell>
      ))}
    </Flex>
  );
}
