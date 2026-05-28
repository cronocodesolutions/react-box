import { useCallback } from 'react';
import Box from '../../../box';
import FnUtils from '../../../utils/fn/fnUtils';
import Flex from '../../flex';
import ColumnModel from '../models/columnModel';

interface Props<TRow> {
  column: ColumnModel<TRow>;
}

const pageXOf = (e: MouseEvent | TouchEvent): number => ('touches' in e ? (e.touches[0]?.pageX ?? 0) : e.pageX);

export default function DataGridHeaderCellResizer<TRow>(props: Props<TRow>) {
  const { column } = props;
  const resizerStyle = column.grid.resizerStyle;

  // The model owns the resize math (beginResize/resizeTo/endResize); this adapter
  // only wires the DOM drag and throttles pointer moves.
  const startResize = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      column.beginResize(pageXOf(e.nativeEvent));

      const controller = new AbortController();
      const { signal } = controller;
      const move = FnUtils.throttle((ev: MouseEvent | TouchEvent) => column.resizeTo(pageXOf(ev)), 40);
      const end = () => {
        controller.abort();
        column.endResize();
      };

      window.addEventListener('mousemove', move, { signal });
      window.addEventListener('touchmove', move, { signal });
      window.addEventListener('mouseup', end, { signal });
      window.addEventListener('touchend', end, { signal });
    },
    [column],
  );

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
        props={{ onMouseDown: startResize, onTouchStart: startResize }}
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
