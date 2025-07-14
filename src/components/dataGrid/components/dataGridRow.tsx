import Flex from '../../flex';
import RowModel from '../models/rowModel';
import DataGridCell from './dataGridCell';
import DataGridCellText from './dataGridCellText';

interface Props<TRow> {
  row: RowModel<TRow>;
}

export default function DataGridRow<TRow>(props: Props<TRow>) {
  const { row } = props;
  const { selected } = row;

  return (
    <Flex className="grid-row" selected={selected} display="contents" props={{ role: 'row' }}>
      {row.cells.map((cell) => (
        <DataGridCell key={cell.column.key} column={cell.column}>
          {cell.column.Cell ? <cell.column.Cell cell={cell} /> : <DataGridCellText cell={cell} />}
        </DataGridCell>
      ))}
    </Flex>
  );
}

(DataGridRow as React.FunctionComponent).displayName = 'DataGridRow';
