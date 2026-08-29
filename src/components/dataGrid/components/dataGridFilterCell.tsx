import Flex from '../../flex';
import { useGridNavigationContext } from '../gridNavigationContext';
import ColumnModel from '../models/columnModel';
import GridModel from '../models/gridModel';
import DataGridColumnFilter from './dataGridColumnFilter';

interface Props<TRow> {
  column: ColumnModel<TRow>;
  grid: GridModel<TRow>;
  /** Navigation coordinates: the filter row, and this cell's column along it. */
  row: number;
  columnIndex: number;
}

export default function DataGridFilterCell<TRow>(props: Props<TRow>) {
  const { column, grid, row, columnIndex } = props;
  const { widthVarName, leftVarName, rightVarName, filterable } = column;
  const { isLeftPinned, isRightPinned, isPinned, isFirstLeftPinned, isLastLeftPinned, isFirstRightPinned, isLastRightPinned } =
    column.pinFlags.value;
  const navigation = useGridNavigationContext();
  const { ref, tabIndex, onFocus } = navigation?.cellProps(row, columnIndex) ?? {};

  const isSpecialCell = column.isGrouping || column.isRowNumber || column.isRowSelection;

  return (
    <Flex
      ref={ref}
      component={`${grid.componentName}.filter.cell` as never}
      props={{ role: 'gridcell', 'aria-colindex': columnIndex + 1, tabIndex, onFocus }}
      variant={{ isPinned, isFirstLeftPinned, isLastLeftPinned, isFirstRightPinned, isLastRightPinned } as never}
      px={2}
      style={{
        width: `var(${widthVarName})`,
        left: isLeftPinned ? `var(${leftVarName})` : undefined,
        right: isRightPinned ? `var(${rightVarName})` : undefined,
      }}
    >
      {!isSpecialCell && filterable && <DataGridColumnFilter column={column} />}
    </Flex>
  );
}

(DataGridFilterCell as React.FunctionComponent).displayName = 'DataGridFilterCell';
