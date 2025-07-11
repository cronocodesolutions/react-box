import { useCallback } from 'react';
import Checkbox from '../../checkbox';
import CellModel from '../models/cellModel';

interface Props<TRow> {
  cell: CellModel<TRow>;
}

export default function DataGridCellRowSelection<TRow>(props: Props<TRow>) {
  const { cell } = props;

  const rowSelectedHandler = useCallback(() => {
    cell.grid.toggleRowSelection(cell.row.key);
  }, [cell.grid, cell.row.key]);

  return <Checkbox variant="datagrid" checked={cell.row.selected} onChange={rowSelectedHandler} />;
}

(DataGridCellRowSelection as React.FunctionComponent).displayName = 'DataGridCellRowSelection';
