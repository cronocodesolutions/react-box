import Box from '../../../box';
import Flex from '../../flex';
import ColumnModel from '../models/columnModel';

interface Props<TRow> {
  column: ColumnModel<TRow>;
}

export default function DataGridHeaderCellResizer<TRow>(props: Props<TRow>) {
  const { column } = props;

  return (
    <Flex
      height="fit"
      ai="center"
      position="absolute"
      right={column.pin === 'RIGHT' ? undefined : 0}
      left={column.pin !== 'RIGHT' ? undefined : 0}
      py={3}
    >
      <Box
        cursor="col-resize"
        px={0.75}
        mt={-6}
        className="resizer"
        height="fit"
        props={{ onMouseDown: column.resizeColumn, onTouchStart: column.resizeColumn }}
      >
        <Box component="datagrid.header.cell.resizer" />
      </Box>
    </Flex>
  );
}

(DataGridHeaderCellResizer as React.FunctionComponent).displayName = 'DataGridHeaderCellResizer';
