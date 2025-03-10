import { useMemo, useState } from 'react';
import Box from '../../box';
import useVisibility from '../../hooks/useVisibility';
import Button from '../button';
import Flex from '../flex';
import Tooltip from '../tooltip';
import ColumnModel from './models/columnModel';
import { EMPTY_CELL_KEY, GROUPING_CELL_KEY } from './models/gridModel';
import ArrowIcon from '../../icons/arrowIcon';
import DotsIcon from '../../icons/dotsIcon';
import PinIcon from '../../icons/pinIcon';
import GroupingIcon from '../../icons/groupingIcon';

interface Props<TRow> {
  column: ColumnModel<TRow>;
}

export default function DataGridHeaderCell<TRow>(props: Props<TRow>) {
  const { column } = props;

  const isEmptyCell = column.key === EMPTY_CELL_KEY;
  const gridColumn = column.isLeaf ? 1 : column.leafs.length;
  const isSticky = column.pin === 'LEFT' || column.pin === 'RIGHT';
  const isSortable = column.isLeaf && !isEmptyCell;

  const value = useMemo(() => {
    if (column.key === GROUPING_CELL_KEY) {
      if (column.grid.groupColumns.length === 1) {
        const col = column.grid.columns.value.leafs.findOrThrow((l) => l.key === column.grid.groupColumns[0]);

        return col.header ?? col.key;
      }

      return 'Group';
    }

    return column.header ?? column.key;
  }, [column.grid.groupColumns]);

  return (
    <Flex
      gridRow={column.gridRows}
      gridColumn={gridColumn}
      bgColor="gray-200"
      position={isSticky ? 'sticky' : 'relative'}
      zIndex={isSticky ? 2 : 1}
      minHeight={column.grid.ROW_HEIGHT * column.gridRows}
      bb={1}
      br={column.pin === 'LEFT' && column.isEdge ? 1 : undefined}
      bl={column.pin === 'RIGHT' && column.isEdge ? 1 : undefined}
      borderColor="gray-400"
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
          <Flex width="fit" height="fit" props={{ onClick: isSortable ? () => column.sortColumn() : undefined }}>
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
              <Box overflow="hidden" textOverflow="ellipsis" textWrap="nowrap">
                {value}
              </Box>
              {column.key === column.grid.sortColumn && (
                <Box pl={(column.inlineWidth ?? 0) < 58 ? 0 : 2}>
                  <ArrowIcon width="16px" rotate={column.grid.sortDirection === 'ASC' ? 0 : 180} fill="violet-950" />
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

  const isSortAscAvailable = column.isLeaf && (column.grid.sortColumn !== column.key || column.grid.sortDirection === 'DESC');
  const isSortDescAvailable = column.isLeaf && (column.grid.sortColumn !== column.key || column.grid.sortDirection === 'ASC');
  const isClearSortAvailable = column.isLeaf && column.grid.sortColumn === column.key;
  const isPinLeftAvailable = column.pin !== 'LEFT';
  const isPinRightAvailable = column.pin !== 'RIGHT';
  const isUnpinAvailable = !!column.pin;
  const isGroupByAvailable = column.isLeaf && column.key !== GROUPING_CELL_KEY;

  return (
    <Flex position="absolute" right={column.pin === 'RIGHT' ? 2.5 : 4} top="1/2" translateY={-3} ai="center">
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
            width={56}
            b={1}
            borderColor="gray-400"
            borderRadius={1}
            display="flex"
            d="column"
            mt={4}
            overflow="hidden"
            translateX={openLeft ? -55 : -5}
            onPositionChange={setTooltipPosition}
            ref={refToUse}
          >
            {isSortAscAvailable && (
              <Button
                clean
                display="flex"
                gap={2}
                p={3}
                cursor="pointer"
                hover={{ bgColor: 'gray-200' }}
                onClick={() => column.sortColumn('ASC')}
              >
                <ArrowIcon width="1rem" fill="violet-950" />
                Sort Ascending
              </Button>
            )}
            {isSortDescAvailable && (
              <Button
                clean
                display="flex"
                gap={2}
                p={3}
                cursor="pointer"
                hover={{ bgColor: 'gray-200' }}
                onClick={() => column.sortColumn('DESC')}
              >
                <ArrowIcon width="1rem" fill="violet-950" rotate={180} />
                Sort Descending
              </Button>
            )}
            {isClearSortAvailable && (
              <Button
                clean
                display="flex"
                gap={2}
                p={3}
                cursor="pointer"
                hover={{ bgColor: 'gray-200' }}
                onClick={() => column.sortColumn(undefined)}
              >
                <Box width={4} />
                Clear Sort
              </Button>
            )}
            {isPinLeftAvailable && (
              <Button
                clean
                display="flex"
                gap={2}
                p={3}
                cursor="pointer"
                hover={{ bgColor: 'gray-200' }}
                onClick={() => column.pinColumn('LEFT')}
              >
                <PinIcon width="1rem" fill="violet-950" />
                Pin Left
              </Button>
            )}
            {isPinRightAvailable && (
              <Button
                clean
                display="flex"
                gap={2}
                p={3}
                cursor="pointer"
                hover={{ bgColor: 'gray-200' }}
                onClick={() => column.pinColumn('RIGHT')}
              >
                <PinIcon width="1rem" fill="violet-950" rotate={-90} />
                Pin Right
              </Button>
            )}
            {isUnpinAvailable && (
              <Button
                clean
                display="flex"
                gap={2}
                p={3}
                cursor="pointer"
                hover={{ bgColor: 'gray-200' }}
                onClick={() => column.pinColumn()}
              >
                <Box width={4} />
                Unpin
              </Button>
            )}
            {isGroupByAvailable && (
              <Button clean display="flex" gap={2} p={3} cursor="pointer" hover={{ bgColor: 'gray-200' }} onClick={column.toggleGrouping}>
                <Box>
                  <GroupingIcon width="1rem" fill="violet-950" />
                </Box>
                <Box textWrap="nowrap"> Group by {column.header ?? column.key}</Box>
              </Button>
            )}
          </Tooltip>
        )}
      </Button>
    </Flex>
  );
}
