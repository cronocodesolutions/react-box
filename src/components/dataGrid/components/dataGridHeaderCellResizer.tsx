import { useCallback } from 'react';
import Box from '../../../box';
import Flex from '../../flex';
import ColumnModel from '../models/columnModel';

interface Props<TRow> {
  column: ColumnModel<TRow>;
  /** The header cell this separator sits in — `aria-controls`, the pane it resizes. */
  controls: string;
}

const pageXOf = (e: MouseEvent | TouchEvent): number => ('touches' in e ? (e.touches[0]?.pageX ?? 0) : e.pageX);

/** Pixels one arrow press moves the separator. Small enough to aim with, large enough to get there. */
const RESIZE_STEP_PX = 16;

/**
 * The column resizer, which is APG's window splitter: a `separator` with a value in pixels, its
 * own tab stop, and the arrows that move it.
 *
 * The pointer drag and the keyboard are two ways to run the same model. The drag bypasses React on
 * every move because it happens sixty times a second; a key press is one whole gesture, so it goes
 * through the model and lets the render put the new widths on screen.
 */
export default function DataGridHeaderCellResizer<TRow>(props: Props<TRow>) {
  const { column, controls } = props;
  const resizerStyle = column.grid.resizerStyle;
  const headerCell = column.headerCell;

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

  const resizeByKey = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
          column.moveResizer(RESIZE_STEP_PX);
          break;
        case 'ArrowLeft':
          column.moveResizer(-RESIZE_STEP_PX);
          break;
        case 'Home':
          column.resizeWidthTo(headerCell.minWidth);
          break;
        case 'End':
          column.resizeWidthTo(headerCell.maxWidth);
          break;
        default:
          return;
      }

      // The grid leaves every key alone while focus is inside a cell, but the scroller does not:
      // Home and End would scroll it sideways underneath the resize nobody could then see.
      e.preventDefault();
    },
    [column, headerCell],
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
          props={{
            role: 'separator',
            'aria-label': headerCell.resizerLabel,
            'aria-controls': controls,
            // The separator itself is the vertical thing; `separator` defaults to horizontal.
            'aria-orientation': 'vertical',
            'aria-valuenow': headerCell.width,
            'aria-valuemin': headerCell.minWidth,
            'aria-valuemax': headerCell.maxWidth,
            'aria-valuetext': `${headerCell.width} pixels`,
            tabIndex: 0,
            onKeyDown: resizeByKey,
          }}
        />
      </Box>
    </Flex>
  );
}

(DataGridHeaderCellResizer as React.FunctionComponent).displayName = 'DataGridHeaderCellResizer';
