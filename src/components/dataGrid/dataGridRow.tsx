import Flex from '../flex';
import DataGridCell from './dataGridCell';
import RowModel from './models/rowModel';

interface Props<TRow> {
  row: RowModel<TRow>;
}

export default function DataGridRow<TRow>(props: Props<TRow>) {
  const { row } = props;

  return (
    <Flex className={['grid-row', row.rowKey.toString()]}>
      {row.cells.map((cell) => (
        <DataGridCell key={cell.column.key} row={row} column={cell.column} />
      ))}
    </Flex>
  );
}
