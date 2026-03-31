import { useCallback } from 'react';
import ExpandIcon from '../../../icons/expandIcon';
import Button from '../../button';
import CellModel from '../models/cellModel';

interface Props<TRow> {
  cell: CellModel<TRow>;
}

export default function DataGridCellRowDetail<TRow>(props: Props<TRow>) {
  const { cell } = props;
  const expanded = cell.grid.expandedDetailRows.has(cell.row.key);

  const toggleHandler = useCallback(() => {
    cell.grid.toggleDetailRow(cell.row.key);
  }, [cell.grid, cell.row.key]);

  return (
    <Button
      component={`${cell.grid.componentName}.body.cell.rowDetail` as never}
      clean
      onClick={toggleHandler}
      cursor="pointer"
      display="flex"
      ai="center"
      jc="center"
    >
      <ExpandIcon fill="currentColor" width="14px" height="14px" rotate={expanded ? 0 : -90} />
    </Button>
  );
}

(DataGridCellRowDetail as React.FunctionComponent).displayName = 'DataGridCellRowDetail';
