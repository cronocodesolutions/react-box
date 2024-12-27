import { useEffect, useMemo, useState } from 'react';
import Box from '../../box';
import useVisibility from '../../hooks/useVisibility';
import Button from '../button';
import Flex from '../flex';
import Tooltip from '../tooltip';
import { EMPTY_CELL_KEY, GridData } from './useGridData';
import { GridCell, GridRow } from './dataGridContract';

interface Props<TRow> {
  grid: GridData<TRow>;
  row: GridRow;
  cell: GridCell;
}

export default function DataGridCell<TRow>(props: Props<TRow>) {
  const { grid, row, cell } = props;
  const isEmptyCell = cell.key === EMPTY_CELL_KEY;
  const isPinned = !!cell.pinned;
  const isSticky = cell.isHeader || isPinned;

  const [isOpen, setOpen, refToUse] = useVisibility<HTMLButtonElement>();
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const openLeft = useMemo(() => tooltipPosition.left > window.innerWidth / 2, [tooltipPosition.left]);

  return (
    <Flex
      zIndex={cell.isHeader && isPinned ? 2 : isSticky ? 1 : undefined}
      position={isSticky ? 'sticky' : undefined}
      top={cell.isHeader ? cell.top : undefined}
      bgColor={cell.isHeader ? 'slate-300' : 'white'}
      height={cell.height}
      bb={1}
      hoverParent={{ 'grid-row': { bgColor: cell.isHeader ? undefined : 'gray-200' } }}
      jc="space-between"
      ai="center"
      transition="none"
      colSpan={cell.colSpan}
      gridRow={cell.rowSpan}
      style={{ left: cell.left, right: cell.right, width: `var(--${cell.key}-${cell.pinned ?? ''}-width)` }}
      br={cell.pinned === 'LEFT' && cell.edge ? 1 : 0}
      bl={cell.pinned === 'RIGHT' && cell.edge ? 1 : 0}
    >
      {!isEmptyCell && (
        <>
          {cell.isHeader && cell.pinned === 'RIGHT' && (
            <Box cursor="col-resize" px={0.25} className="resizer" props={{ onMouseDown: cell.resizeColumn }}>
              <Box width={0.5} height={4} bgColor="gray-400" hoverParent={{ resizer: { bgColor: 'gray-600' } }}></Box>
            </Box>
          )}
          <Flex inline position="sticky" left={0} overflow="hidden">
            {cell.isExpandableCell && (
              <Button clean onClick={() => grid.toggleExpandRow(row.key, cell.key)}>
                <Box rotate={cell.isExpanded ? 90 : 0}>{'>'}</Box>
              </Button>
            )}
            <Flex
              overflow="hidden"
              textOverflow="ellipsis"
              textWrap="nowrap"
              // pl={3 + (cell.expandableCellLevel ?? 0) * 5}
              // pr={4}
              props={{ onClick: cell.sortColumn }}
            >
              {cell.value as string} {cell.sortDirection} {row.isGrouped && cell.isExpandableCell ? `(${row.count})` : ''}
            </Flex>
          </Flex>
          <Flex>
            {cell.isHeader && (
              <Button clean onClick={() => setOpen(!isOpen)} ref={refToUse} width={2.5} userSelect="none">
                ⠿
                {isOpen && (
                  <Tooltip
                    bgColor="white"
                    width={40}
                    b={1}
                    borderRadius={1}
                    display="flex"
                    d="column"
                    mt={2}
                    overflow="hidden"
                    translateX={openLeft ? -27 : undefined}
                    onPositionChange={setTooltipPosition}
                  >
                    <Button clean height={10} textAlign="left" px={3} hover={{ bgColor: 'gray-200' }} onClick={() => cell.pinColumn?.()}>
                      Unpin
                    </Button>
                    <Button
                      clean
                      height={10}
                      textAlign="left"
                      px={3}
                      hover={{ bgColor: 'gray-200' }}
                      onClick={() => cell.pinColumn?.('LEFT')}
                    >
                      Pin Left
                    </Button>
                    <Button
                      clean
                      height={10}
                      textAlign="left"
                      px={3}
                      hover={{ bgColor: 'gray-200' }}
                      onClick={() => cell.pinColumn?.('RIGHT')}
                    >
                      Pin Right
                    </Button>
                    <Button clean height={10} textAlign="left" px={3} hover={{ bgColor: 'gray-200' }} onClick={cell.toggleGroupColumn}>
                      Group by: {cell.key}
                    </Button>
                  </Tooltip>
                )}
              </Button>
            )}
            {cell.isHeader && cell.pinned !== 'RIGHT' && (
              <Box cursor="col-resize" px={0.25} className="resizer" props={{ onMouseDown: cell.resizeColumn }}>
                <Box width={0.5} height={4} bgColor="gray-400" hoverParent={{ resizer: { bgColor: 'gray-600' } }}></Box>
              </Box>
            )}
          </Flex>
        </>
      )}
    </Flex>
  );
}
