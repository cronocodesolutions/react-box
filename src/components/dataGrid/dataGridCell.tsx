import Box, { BoxProps } from '../../box';
import Flex from '../flex';
import ColumnModel from './models/columnModel';
import { EMPTY_CELL_KEY, ROW_NUMBER_CELL_KEY, ROW_SELECTION_CELL_KEY } from './models/gridModel';

interface Props<TRow> extends BoxProps {
  children?: React.ReactNode;
  column: ColumnModel<TRow>;
}

export default function DataGridCell<TRow>(props: Props<TRow>) {
  const { children, column, style, ...restProps } = props;
  const isEmptyCell = column.key === EMPTY_CELL_KEY;
  const isRowNumber = column.key === ROW_NUMBER_CELL_KEY;
  const isRowSelection = column.key === ROW_SELECTION_CELL_KEY;

  const isSticky = column.pin === 'LEFT' || column.pin === 'RIGHT';
  const showBorderRight = column.pin === 'LEFT' && column.isEdge;

  const isText = !isRowSelection && !isEmptyCell;

  return (
    <Flex
      bgColor={isRowNumber ? 'gray-200' : 'gray-100'}
      hoverParent={{ 'grid-row': { bgColor: 'gray-200' } }}
      overflow="hidden"
      minHeight={column.grid.ROW_HEIGHT}
      ai="center"
      jc={column.align}
      bb={1}
      br={showBorderRight ? 1 : undefined}
      bl={column.pin === 'RIGHT' && column.isEdge ? 1 : undefined}
      borderColor="gray-400"
      transition="none"
      position={isSticky ? 'sticky' : undefined}
      zIndex={isSticky ? 1 : undefined}
      style={{
        width: `var(${column.widthVarName})`,
        left: column.pin === 'LEFT' ? `var(${column.leftVarName})` : undefined,
        right: column.pin === 'RIGHT' ? `var(${column.rightVarName})` : undefined,
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
