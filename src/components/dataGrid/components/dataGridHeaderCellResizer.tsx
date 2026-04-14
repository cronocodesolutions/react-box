import Box from '../../../box';
import Flex from '../../flex';
import ColumnModel from '../models/columnModel';

interface Props<TRow> {
  column: ColumnModel<TRow>;
}

export default function DataGridHeaderCellResizer<TRow>(props: Props<TRow>) {
  const { column } = props;
  const resizerStyle = column.grid.resizerStyle;

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
        <Box
          component={`${column.grid.componentName}.header.cell.resizer` as never}
          opacity={resizerStyle !== 'visible' ? 0 : undefined}
          hoverGroup={resizerStyle === 'hover' ? ({ 'header-cell': { opacity: 1 } } as never) : undefined}
        />
      </Box>
    </Flex>
  );
}

(DataGridHeaderCellResizer as React.FunctionComponent).displayName = 'DataGridHeaderCellResizer';
