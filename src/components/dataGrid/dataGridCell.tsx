import Box from '../../box';
import Flex from '../flex';
import Column from './models/column';
import Row from './models/row';
import { EMPTY_CELL_KEY } from './models/grid';

interface Props<TRow> {
  row: Row<TRow>;
  column: Column<TRow>;
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
        <Box px={2} textOverflow="ellipsis" overflow="hidden" textWrap="nowrap">
          {value}
        </Box>
      )}
    </Flex>
  );
}
