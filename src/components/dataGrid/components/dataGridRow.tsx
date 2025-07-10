import { useCallback } from 'react';
import DataGridCell from './dataGridCell';
import Checkbox from '../../checkbox';
import Flex from '../../flex';
import { ROW_SELECTION_CELL_KEY } from '../models/gridModel';
import RowModel from '../models/rowModel';

interface Props<TRow> {
  row: RowModel<TRow>;
}

export default function DataGridRow<TRow>(props: Props<TRow>) {
  const { row } = props;

  const rowSelectedHandler = useCallback((_e: React.ChangeEvent<HTMLInputElement>) => {
    row.grid.toggleRowSelection(row.key);
  }, []);

  return (
    <Flex className="grid-row" display="contents" props={{ role: 'row' }}>
      {row.cells.map((cell) => (
        <DataGridCell key={cell.column.key} column={cell.column}>
          {cell.column.key === ROW_SELECTION_CELL_KEY ? (
            <Checkbox variant="datagrid" checked={row.selected} onChange={rowSelectedHandler} />
          ) : (
            cell.value
          )}
        </DataGridCell>
      ))}
    </Flex>
  );
}

(DataGridRow as React.FunctionComponent).displayName = 'DataGridRow';
