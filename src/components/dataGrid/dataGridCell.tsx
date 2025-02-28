import Box from '../../box';
import Flex from '../flex';
import ColumnModel from './models/columnModel';
import RowModel from './models/rowModel';
import { EMPTY_CELL_KEY } from './models/gridModel';

interface Props<TRow> {
  row: RowModel<TRow>;
  column: ColumnModel<TRow>;
}

export default function DataGridCell<TRow>(props: Props<TRow>) {
  const { column, row } = props;

  const isEmptyCell = column.key === EMPTY_CELL_KEY;
  const value = isEmptyCell ? null : (row.row[column.key as keyof TRow] as string);
  const isSticky = column.pin === 'LEFT' || column.pin === 'RIGHT';

  return (
    <Flex
      bgColor="gray-100"
      hoverParent={{ 'grid-row': { bgColor: 'gray-200' } }}
      overflow="hidden"
      minHeight={row.grid.ROW_HEIGHT}
      ai="center"
      bb={1}
      br={column.pin === 'LEFT' && column.isEdge ? 1 : undefined}
      bl={column.pin === 'RIGHT' && column.isEdge ? 1 : undefined}
      boxSizing="content-box"
      transition="none"
      position={isSticky ? 'sticky' : undefined}
      zIndex={isSticky ? 1 : undefined}
      style={{
        width: `var(${column.widthVarName})`,
        left: column.pin === 'LEFT' ? `var(${column.leftVarName})` : undefined,
        right: column.pin === 'RIGHT' ? `var(${column.rightVarName})` : undefined,
      }}
    >
      {!isEmptyCell && (
        <Box px={4} textOverflow="ellipsis" overflow="hidden" textWrap="nowrap">
          {value}
        </Box>
      )}
    </Flex>
  );
}
