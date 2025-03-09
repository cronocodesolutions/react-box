import { useMemo, useState } from 'react';
import Box from '../../box';
import useVisibility from '../../hooks/useVisibility';
import BaseSvg from '../baseSvg';
import Button from '../button';
import Flex from '../flex';
import Tooltip from '../tooltip';
import ColumnModel from './models/columnModel';
import { EMPTY_CELL_KEY, GROUPING_CELL_KEY } from './models/gridModel';
import ArrowIcon from '../../icons/arrowIcon';
import DotsIcon from '../../icons/dotsIcon';

interface Props<TRow> {
  column: ColumnModel<TRow>;
}

export default function DataGridHeaderCell<TRow>(props: Props<TRow>) {
  const { column } = props;

  const isEmptyCell = column.key === EMPTY_CELL_KEY;
  const colSpan = column.isLeaf ? 1 : column.leafs.length;
  const isSticky = column.pin === 'LEFT' || column.pin === 'RIGHT';
  const isSortable = column.isLeaf && !isEmptyCell;

  return (
    <Flex
      gridRow={column.gridRows}
      colSpan={colSpan}
      bgColor="gray-200"
      position={isSticky ? 'sticky' : 'relative'}
      zIndex={isSticky ? 2 : 1}
      minHeight={column.grid.ROW_HEIGHT * column.gridRows}
      bb={1}
      br={column.pin === 'LEFT' && column.isEdge ? 1 : undefined}
      bl={column.pin === 'RIGHT' && column.isEdge ? 1 : undefined}
      cursor={isSortable ? 'pointer' : undefined}
      transition="none"
      style={{
        width: `var(${column.widthVarName})`,
        left: column.pin === 'LEFT' ? `var(${column.leftVarName})` : undefined,
        right: column.pin === 'RIGHT' ? `var(${column.rightVarName})` : undefined,
      }}
    >
      {!isEmptyCell && (
        <>
          <Flex width="fit" height="fit" props={{ onClick: isSortable ? column.sortColumn : undefined }}>
            <Flex
              overflow="hidden"
              position="sticky"
              ai="center"
              transition="none"
              pl={4}
              style={{
                left: !column.pin ? `var(${column.grid.leftEdgeVarName})` : undefined,
              }}
            >
              <Box overflow="hidden" textOverflow="ellipsis">
                {column.key}
              </Box>
              {column.key === column.grid.sortColumn && (
                <Box pl={(column.inlineWidth ?? 0) < 58 ? 0 : 2}>
                  <ArrowIcon width="16px" rotate={column.grid.sortDirection === 'ASC' ? 180 : 0} fill="violet-950" />
                </Box>
              )}
              <Box minWidth={12} />
            </Flex>
          </Flex>

          <Resizer column={column} />
          <ContextMenu column={column} />
        </>
      )}
    </Flex>
  );
}

interface ResizerProps<TRow> {
  column: ColumnModel<TRow>;
}

function Resizer<TRow>(props: ResizerProps<TRow>) {
  const { column } = props;

  return (
    <Flex
      height="fit"
      ai="center"
      position="absolute"
      right={column.pin === 'RIGHT' ? undefined : 0}
      left={column.pin !== 'RIGHT' ? undefined : 0}
    >
      <Box
        cursor="col-resize"
        px={0.75}
        className="resizer"
        height="2/4"
        props={{ onMouseDown: column.resizeColumn, onTouchStart: column.resizeColumn }}
      >
        <Box width={0.5} height="fit" bgColor="gray-400" hoverParent={{ resizer: { bgColor: 'gray-600' } }}></Box>
      </Box>
    </Flex>
  );
}

interface ContextMenuProps<TRow> {
  column: ColumnModel<TRow>;
}
function ContextMenu<TRow>(props: ContextMenuProps<TRow>) {
  const { column } = props;
  const [isOpen, setOpen, refToUse] = useVisibility({ hideOnScroll: true, event: 'mousedown' });
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const openLeft = useMemo(() => tooltipPosition.left > window.innerWidth / 2, [tooltipPosition.left]);

  return (
    <Flex position="absolute" right={column.pin === 'RIGHT' ? 2.5 : 4} top="1/2" translateY={-3.5} ai="center">
      <Button
        clean
        onClick={() => setOpen(!isOpen)}
        width={6}
        height={6}
        cursor="pointer"
        userSelect="none"
        borderRadius={1}
        borderColor="gray-200"
        display="flex"
        jc="center"
        ai="center"
        transition="none"
        bgColor="gray-200"
        hover={{ bgColor: 'gray-300' }}
      >
        <DotsIcon fill="violet-950" />
        {isOpen && (
          <Tooltip
            bgColor="white"
            width={40}
            b={1}
            borderRadius={1}
            display="flex"
            d="column"
            mt={4}
            overflow="hidden"
            translateX={openLeft ? -39 : -5}
            onPositionChange={setTooltipPosition}
            ref={refToUse}
          >
            <Button clean textAlign="left" p={3} hover={{ bgColor: 'gray-200' }} onClick={() => column.pinColumn()}>
              Unpin
            </Button>
            <Button clean textAlign="left" p={3} hover={{ bgColor: 'gray-200' }} onClick={() => column.pinColumn('LEFT')}>
              Pin Left
            </Button>
            <Button clean textAlign="left" p={3} hover={{ bgColor: 'gray-200' }} onClick={() => column.pinColumn('RIGHT')}>
              Pin Right
            </Button>
            <Button clean textAlign="left" p={3} hover={{ bgColor: 'gray-200' }} onClick={column.toggleGrouping}>
              Group by: {column.key}
            </Button>
          </Tooltip>
        )}
      </Button>
    </Flex>
  );
}
