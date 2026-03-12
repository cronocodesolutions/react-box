import { useCallback } from 'react';
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
  const expandOnRowClick = row.grid.props.def.rowDetail?.expandOnRowClick;

  const handleRowClick = useCallback(() => {
    row.grid.toggleDetailRow(row.key);
  }, [row.grid, row.key]);

  return (
    <Flex
      component={`${row.grid.componentName}.body.row` as never}
      className="grid-row"
      selected={selected}
      display="contents"
      props={{ role: 'row', onClick: expandOnRowClick ? handleRowClick : undefined }}
      cursor={expandOnRowClick ? 'pointer' : undefined}
    >
      {row.cells.map((cell) => (
        <DataGridCell key={cell.column.key} column={cell.column}>
          {cell.column.Cell ? <cell.column.Cell cell={cell} /> : <DataGridCellText cell={cell} />}
        </DataGridCell>
      ))}
    </Flex>
  );
}

(DataGridRow as React.FunctionComponent).displayName = 'DataGridRow';
