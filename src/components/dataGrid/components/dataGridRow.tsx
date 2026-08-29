import { useCallback } from 'react';
import Flex from '../../flex';
import { useGridNavigationContext } from '../gridNavigationContext';
import RowModel from '../models/rowModel';
import DataGridCell from './dataGridCell';
import DataGridCellText from './dataGridCellText';

interface Props<TRow> {
  row: RowModel<TRow>;
  /** Position in the whole row list, not in the rendered window. */
  index: number;
}

export default function DataGridRow<TRow>(props: Props<TRow>) {
  const { row, index } = props;
  const { selected, expandOnRowClick } = row;
  const navigation = useGridNavigationContext();
  const navRow = (navigation?.headerRowCount ?? 0) + index;

  const handleRowClick = useCallback(() => {
    row.toggleDetail();
  }, [row]);

  return (
    <Flex
      component={`${row.grid.componentName}.body.row` as never}
      className="grid-row"
      // Box renders `selected` as `aria-selected`, so it is the row's state as well as its
      // styling hook — and only where rows can be selected: `aria-selected="false"` on a grid with
      // no selection tells a screen reader there is something to select, which there is not.
      selected={row.grid.props.def.rowSelection ? selected : undefined}
      display="contents"
      props={{ role: 'row', 'aria-rowindex': navRow + 1, onClick: expandOnRowClick ? handleRowClick : undefined }}
      cursor={expandOnRowClick ? 'pointer' : undefined}
    >
      {row.cells.map((cell, columnIndex) => (
        <DataGridCell key={cell.column.key} cell={cell} row={navRow} columnIndex={columnIndex}>
          {cell.column.Cell ? <cell.column.Cell cell={cell} /> : <DataGridCellText cell={cell} />}
        </DataGridCell>
      ))}
    </Flex>
  );
}

(DataGridRow as React.FunctionComponent).displayName = 'DataGridRow';
