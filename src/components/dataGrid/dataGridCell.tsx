import { useMemo, useState } from 'react';
import Box from '../../box';
import useVisibility from '../../hooks/useVisibility';
import Button from '../button';
import Flex from '../flex';
import Tooltip from '../tooltip';
import { EMPTY_CELL_KEY } from './useGridData';
import { GridCell } from './dataGridContract';

interface Props {
  cell: GridCell;
}

export default function DataGridCell(props: Props) {
  const { cell } = props;
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
      width={cell.width}
      bb={1}
      hoverParent={{ 'grid-row': { bgColor: cell.isHeader ? undefined : 'gray-200' } }}
      jc="space-between"
      ai="center"
      gap={3}
      transition="none"
      colSpan={cell.colSpan}
      gridRow={cell.rowSpan}
      style={{ left: cell.left, right: cell.right, width: cell.inlineWidth }}
    >
      {!isEmptyCell && (
        <>
          <Flex flex1 pl={3} height="fit" ai="center" jc="space-between" overflow="hidden">
            <Box flex1 overflow="hidden" textOverflow="ellipsis" textWrap="nowrap" props={{ onClick: cell.sortColumn }}>
              {cell.value as string} {cell.sortDirection}
            </Box>
            {cell.isHeader && (
              <Button clean onClick={() => setOpen(!isOpen)} ref={refToUse} width={2.5} userSelect="none">
                ⠿
                {isOpen && (
                  <Tooltip
                    bgColor="white"
                    width={30}
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
                  </Tooltip>
                )}
              </Button>
            )}
          </Flex>
          {cell.isHeader && (
            <Box cursor="col-resize" px={0.25} className="resizer" props={{ onMouseDown: cell.resizeColumn }}>
              <Box width={0.5} height={4} bgColor="gray-400" hoverParent={{ resizer: { bgColor: 'gray-600' } }}></Box>
            </Box>
          )}
        </>
      )}
    </Flex>
  );
}
