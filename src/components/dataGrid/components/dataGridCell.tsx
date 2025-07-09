import Box, { BoxProps } from '../../../box';
import Flex from '../../flex';
import ColumnModel from '../models/columnModel';
import { EMPTY_CELL_KEY, ROW_NUMBER_CELL_KEY, ROW_SELECTION_CELL_KEY } from '../models/gridModel';

interface Props<TRow> extends BoxProps {
  children?: React.ReactNode;
  column: ColumnModel<TRow>;
}

export default function DataGridCell<TRow>(props: Props<TRow>) {
  const { children, column, style, ...restProps } = props;
  const { key, pin, left, right, isEdge, align, widthVarName, leftVarName, rightVarName } = column;

  const isEmptyCell = key === EMPTY_CELL_KEY;
  const isRowNumber = key === ROW_NUMBER_CELL_KEY;
  const isRowSelection = key === ROW_SELECTION_CELL_KEY;

  const isLeftPinned = pin === 'LEFT';
  const isRightPinned = pin === 'RIGHT';
  const isPinned = isLeftPinned || isRightPinned;
  const isFirstLeftPinned = isLeftPinned && left === 0;
  const isLastLeftPinned = isLeftPinned && isEdge;
  const isFirstRightPinned = isRightPinned && isEdge;
  const isLastRightPinned = isRightPinned && right === 0;

  const isText = !isRowSelection && !isEmptyCell;

  return (
    <Flex
      component="datagrid.cell"
      props={{ role: 'cell' }}
      variant={{ isPinned, isFirstLeftPinned, isLastLeftPinned, isFirstRightPinned, isLastRightPinned, isRowNumber, isRowSelection }}
      jc={align}
      style={{
        width: `var(${widthVarName})`,
        height: `var(${column.grid.rowHeightVarName})`,
        left: isLeftPinned ? `var(${leftVarName})` : undefined,
        right: isRightPinned ? `var(${rightVarName})` : undefined,
        ...style,
      }}
      {...restProps}
    >
      {isText && (
        <Box px={4} textOverflow="ellipsis" overflow="hidden" textWrap="nowrap">
          {children}
        </Box>
      )}
      {isRowSelection && children}
    </Flex>
  );
}

(DataGridCell as React.FunctionComponent).displayName = 'DataGridCell';
