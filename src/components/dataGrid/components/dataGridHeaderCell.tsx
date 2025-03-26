import { useMemo, useState } from 'react';
import Box from '../../../box';
import useVisibility from '../../../hooks/useVisibility';
import ArrowIcon from '../../../icons/arrowIcon';
import DotsIcon from '../../../icons/dotsIcon';
import GroupingIcon from '../../../icons/groupingIcon';
import PinIcon from '../../../icons/pinIcon';
import Button from '../../button';
import Checkbox from '../../checkbox';
import Flex from '../../flex';
import Tooltip from '../../tooltip';
import ColumnModel from '../models/columnModel';
import { EMPTY_CELL_KEY, GROUPING_CELL_KEY, ROW_NUMBER_CELL_KEY, ROW_SELECTION_CELL_KEY } from '../models/gridModel';

interface Props<TRow> {
  column: ColumnModel<TRow>;
}

export default function DataGridHeaderCell<TRow>(props: Props<TRow>) {
  const { column } = props;
  const { key, pin, left, right, isEdge, isLeaf, leafs, grid, header, gridRows, widthVarName, leftVarName, rightVarName, inlineWidth } =
    column;

  const isEmptyCell = key === EMPTY_CELL_KEY;
  const isGroupingCell = key === GROUPING_CELL_KEY;
  const isRowNumber = key === ROW_NUMBER_CELL_KEY;
  const isRowSelection = key === ROW_SELECTION_CELL_KEY;

  const isLeftPinned = pin === 'LEFT';
  const isRightPinned = pin === 'RIGHT';
  const isPinned = isLeftPinned || pin === 'RIGHT';
  const isFirstLeftPinned = isLeftPinned && left === 0;
  const isLastLeftPinned = isLeftPinned && isEdge;
  const isFirstRightPinned = isRightPinned && isEdge;
  const isLastRightPinned = isRightPinned && right === 0;
  const isSortable = isLeaf && !isEmptyCell && !isRowNumber && !isRowSelection;

  const gridColumn = isLeaf ? 1 : leafs.length;

  const showResizer = !isRowNumber && !isRowSelection;
  const showContextMenu = !isRowNumber && !isRowSelection;

  const value = useMemo(() => {
    if (isRowNumber) return null;
    if (isRowSelection) return <Checkbox m={1} />;
    if (isGroupingCell) {
      if (grid.groupColumns.length === 1) {
        const col = grid.columns.value.leafs.findOrThrow((l) => l.key === grid.groupColumns[0]);

        return col.header ?? col.key;
      }

      return 'Group';
    }

    return header ?? key;
  }, [grid.groupColumns]);

  return (
    <Flex
      component="datagrid.header.cell"
      variant={{ isRowNumber, isPinned, isFirstLeftPinned, isLastLeftPinned, isFirstRightPinned, isLastRightPinned, isSortable }}
      gridRow={gridRows}
      gridColumn={gridColumn}
      style={{
        width: `var(${widthVarName})`,
        left: isLeftPinned ? `var(${leftVarName})` : undefined,
        right: isRightPinned ? `var(${rightVarName})` : undefined,
      }}
    >
      {!isEmptyCell && (
        <>
          <Flex width="fit" height="fit" jc={column.align} props={{ onClick: isSortable ? () => column.sortColumn() : undefined }}>
            <Flex
              overflow="hidden"
              position={isLeaf ? undefined : 'sticky'}
              ai="center"
              transition="none"
              pl={column.align ? undefined : 4}
              style={{
                left: !pin ? `var(${grid.leftEdgeVarName})` : undefined,
              }}
            >
              <Box overflow="hidden" textOverflow="ellipsis" textWrap="nowrap">
                {value}
              </Box>
              {key === grid.sortColumn && (
                <Box pl={(inlineWidth ?? 0) < 58 ? 0 : 2}>
                  <ArrowIcon width="16px" rotate={grid.sortDirection === 'ASC' ? 0 : 180} fill="violet-950" />
                </Box>
              )}
              {showContextMenu && <Box minWidth={10} />}
            </Flex>
          </Flex>

          {showResizer && <Resizer column={column} />}

          {showContextMenu && <ContextMenu column={column} />}
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
      py={3}
    >
      <Box
        cursor="col-resize"
        px={0.75}
        className="resizer"
        height="fit"
        props={{ onMouseDown: column.resizeColumn, onTouchStart: column.resizeColumn }}
      >
        <Box width={0.5} height="fit" bgColor="gray-400" hoverGroup={{ resizer: { bgColor: 'gray-600' } }}></Box>
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
  const isUnGroupByAvailable = column.isLeaf && column.key === GROUPING_CELL_KEY;

  const isSortingAvailable = isSortAscAvailable || isSortDescAvailable || isClearSortAvailable;
  const isPiningAvailable = isPinLeftAvailable || isPinRightAvailable || isUnpinAvailable;

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
            borderColor="gray-300"
            borderRadius={1}
            display="flex"
            d="column"
            mt={4}
            py={2}
            overflow="hidden"
            translateX={openLeft ? -55 : -5}
            onPositionChange={setTooltipPosition}
            ref={refToUse}
            shadow="medium-shadow"
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
            {isSortingAvailable && (isPiningAvailable || isGroupByAvailable || isUnGroupByAvailable) && (
              <Box bb={1} my={2} borderColor="gray-300" />
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
            {isSortingAvailable && isPiningAvailable && (isGroupByAvailable || isUnGroupByAvailable) && (
              <Box bb={1} my={2} borderColor="gray-300" />
            )}
            {isGroupByAvailable && (
              <Button
                clean
                display="flex"
                ai="center"
                gap={2}
                p={3}
                cursor="pointer"
                hover={{ bgColor: 'gray-200' }}
                onClick={column.toggleGrouping}
              >
                <Box>
                  <GroupingIcon width="1rem" fill="violet-950" />
                </Box>
                <Box textWrap="nowrap"> Group by {column.header ?? column.key}</Box>
              </Button>
            )}
            {isUnGroupByAvailable && (
              <Button clean display="flex" gap={2} p={3} cursor="pointer" hover={{ bgColor: 'gray-200' }} onClick={column.grid.unGroupAll}>
                <Box>
                  <GroupingIcon width="1rem" fill="violet-950" />
                </Box>
                <Box textWrap="nowrap"> Un-Group All</Box>
              </Button>
            )}
          </Tooltip>
        )}
      </Button>
    </Flex>
  );
}
