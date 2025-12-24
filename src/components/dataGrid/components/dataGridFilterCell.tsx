import Flex from '../../flex';
import ColumnModel from '../models/columnModel';
import GridModel, { EMPTY_CELL_KEY, GROUPING_CELL_KEY, ROW_NUMBER_CELL_KEY, ROW_SELECTION_CELL_KEY } from '../models/gridModel';
import DataGridColumnFilter from './dataGridColumnFilter';

interface Props<TRow> {
  column: ColumnModel<TRow>;
  grid: GridModel<TRow>;
}

export default function DataGridFilterCell<TRow>(props: Props<TRow>) {
  const { column, grid } = props;
  const { key, pin, left, right, isEdge, widthVarName, leftVarName, rightVarName, filterable } = column;

  const isEmptyCell = key === EMPTY_CELL_KEY;
  const isGroupingCell = key === GROUPING_CELL_KEY;
  const isRowNumber = key === ROW_NUMBER_CELL_KEY;
  const isRowSelection = key === ROW_SELECTION_CELL_KEY;
  const isSpecialCell = isEmptyCell || isGroupingCell || isRowNumber || isRowSelection;

  const isLeftPinned = pin === 'LEFT';
  const isRightPinned = pin === 'RIGHT';
  const isPinned = isLeftPinned || isRightPinned;
  const isFirstLeftPinned = isLeftPinned && left === 0;
  const isLastLeftPinned = isLeftPinned && isEdge;
  const isFirstRightPinned = isRightPinned && isEdge;
  const isLastRightPinned = isRightPinned && right === 0;

  return (
    <Flex
      component="datagrid.filter.cell"
      variant={{ isPinned, isFirstLeftPinned, isLastLeftPinned, isFirstRightPinned, isLastRightPinned }}
      px={isEmptyCell ? 0 : 2}
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
