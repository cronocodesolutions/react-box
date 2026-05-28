import Flex from '../../flex';
import ColumnModel from '../models/columnModel';
import GridModel from '../models/gridModel';
import DataGridColumnFilter from './dataGridColumnFilter';

interface Props<TRow> {
  column: ColumnModel<TRow>;
  grid: GridModel<TRow>;
}

export default function DataGridFilterCell<TRow>(props: Props<TRow>) {
  const { column, grid } = props;
  const { widthVarName, leftVarName, rightVarName, filterable } = column;
  const { isLeftPinned, isRightPinned, isPinned, isFirstLeftPinned, isLastLeftPinned, isFirstRightPinned, isLastRightPinned } =
    column.pinFlags.value;

  const isSpecialCell = column.isGrouping || column.isRowNumber || column.isRowSelection;

  return (
    <Flex
      component={`${grid.componentName}.filter.cell` as never}
      variant={{ isPinned, isFirstLeftPinned, isLastLeftPinned, isFirstRightPinned, isLastRightPinned } as never}
      px={2}
      style={{
        width: `var(${widthVarName})`,
        left: isLeftPinned ? `var(${leftVarName})` : undefined,
        right: isRightPinned ? `var(${rightVarName})` : undefined,
      }}
    >
      {!isSpecialCell && filterable && <DataGridColumnFilter column={column} grid={grid} />}
    </Flex>
  );
}

(DataGridFilterCell as React.FunctionComponent).displayName = 'DataGridFilterCell';
