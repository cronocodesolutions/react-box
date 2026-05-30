import { useCallback } from 'react';
import Box from '../../../box';
import Flex from '../../flex';
import ColumnModel from '../models/columnModel';

interface Props<TRow> {
  column: ColumnModel<TRow>;
}

const pageXOf = (e: MouseEvent | TouchEvent): number => ('touches' in e ? (e.touches[0]?.pageX ?? 0) : e.pageX);

export default function DataGridHeaderCellResizer<TRow>(props: Props<TRow>) {
  const { column } = props;
  const resizerStyle = column.grid.resizerStyle;

  // The model owns the resize math (beginResize/applyResize/endResize). This adapter wires the
  // DOM drag and, since column widths are driven entirely by CSS variables on the grid container,
  // writes the updated vars straight to that element — bypassing React re-renders mid-drag.
  // resizeMode 'smooth' batches the writes to one per animation frame; 'instant' writes on every
  // pointer move. endResize() commits the final widths back into React state.
  const startResize = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const { grid } = column;
      column.beginResize(pageXOf(e.nativeEvent));

      const controller = new AbortController();
      const { signal } = controller;

      let frame = 0;
      let latestX = pageXOf(e.nativeEvent);

      const paint = () => {
        column.applyResize(latestX);
        const el = grid.sizingElement;
        if (!el) return;
        Object.entries(grid.sizes.value).forEach(([name, value]) => el.style.setProperty(name, value));
      };

      // 'instant': paint synchronously on every move so the column tracks the cursor with no
      // added latency. 'smooth': coalesce moves to one paint per animation frame (~60fps).
      const move =
        grid.resizeMode === 'instant'
          ? (ev: MouseEvent | TouchEvent) => {
              latestX = pageXOf(ev);
              paint();
            }
          : (ev: MouseEvent | TouchEvent) => {
              latestX = pageXOf(ev);
              if (!frame) {
                frame = requestAnimationFrame(() => {
                  frame = 0;
                  paint();
                });
              }
            };

      const end = () => {
        controller.abort();
        if (frame) cancelAnimationFrame(frame);
        paint(); // flush the final pointer position
        column.endResize(); // single notify → React reconciles to the committed widths
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
