import { useMemo, useState } from 'react';
import Box, { useVisibility } from '../../../box';
import DotsIcon from '../../../icons/dotsIcon';
import GroupingIcon from '../../../icons/groupingIcon';
import PinIcon from '../../../icons/pinIcon';
import SortIcon from '../../../icons/sortIcon';
import Button from '../../button';
import Flex from '../../flex';
import { Span } from '../../semantics';
import Tooltip from '../../tooltip';
import ColumnModel from '../models/columnModel';
import { EMPTY_CELL_KEY, GROUPING_CELL_KEY, ROW_NUMBER_CELL_KEY, ROW_SELECTION_CELL_KEY } from '../models/gridModel';

interface Props<TRow> {
  column: ColumnModel<TRow>;
}

export default function DataGridHeaderCellContextMenu<TRow>(props: Props<TRow>) {
  const { column } = props;
  const { key, pin, left, right, isEdge, isLeaf, align, header, grid } = column;

  const [isOpen, setOpen, refToUse] = useVisibility({ hideOnScroll: true, event: 'mousedown' });
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const openLeft = useMemo(() => tooltipPosition.left > window.innerWidth / 2, [tooltipPosition.left]);

  const isSortAscAvailable = isLeaf && column.sortable && (grid.sortColumn !== key || grid.sortDirection === 'DESC');
  const isSortDescAvailable = isLeaf && column.sortable && (grid.sortColumn !== key || grid.sortDirection === 'ASC');
  const isClearSortAvailable = isLeaf && column.sortable && grid.sortColumn === key;
  const isPinLeftAvailable = pin !== 'LEFT';
  const isPinRightAvailable = pin !== 'RIGHT';
  const isUnpinAvailable = !!pin;
  const isGroupByAvailable = isLeaf && key !== GROUPING_CELL_KEY;
  const isUnGroupByAvailable = isLeaf && key === GROUPING_CELL_KEY;

  const isSortingAvailable = isSortAscAvailable || isSortDescAvailable || isClearSortAvailable;
  const isPiningAvailable = isPinLeftAvailable || isPinRightAvailable || isUnpinAvailable;

  const positionLeft = align === 'right' ? 2 : undefined;
  const positionRight = align === 'right' ? undefined : pin === 'RIGHT' ? 2.5 : 4;

  const isEmptyCell = key === EMPTY_CELL_KEY;
  const isRowNumber = key === ROW_NUMBER_CELL_KEY;
  const isRowSelection = key === ROW_SELECTION_CELL_KEY;

  const isLeftPinned = pin === 'LEFT';
  const isRightPinned = pin === 'RIGHT';
  const isPinned = isLeftPinned || pin === 'RIGHT';
  const isFirstLeftPinned = isLeftPinned && left === 0;
  const isLastLeftPinned = isLeftPinned && isEdge;
  const isFirstRightPinned = isRightPinned && isEdge;
  const isLastRightPinned = isRightPinned && right === 0;
  const isSortable = isLeaf && !isEmptyCell && !isRowNumber && !isRowSelection && column.sortable;

  return (
    <Flex position="absolute" left={positionLeft} right={positionRight} top="1/2" translateY={-3} ai="center">
      <Button
        component="datagrid.header.cell.contextMenu"
        onClick={() => setOpen(!isOpen)}
        variant={{ isPinned, isFirstLeftPinned, isLastLeftPinned, isFirstRightPinned, isLastRightPinned, isSortable, isRowNumber }}
      >
        <Span component="datagrid.header.cell.contextMenu.icon">
          <DotsIcon fill="currentColor" />
        </Span>
        {isOpen && (
          <Tooltip
            component="datagrid.header.cell.contextMenu.tooltip"
            onPositionChange={setTooltipPosition}
            ref={refToUse}
            adjustTranslateX={openLeft ? '-100%' : '-21px'}
            adjustTranslateY="16px"
          >
            {isSortAscAvailable && (
              <Button component="datagrid.header.cell.contextMenu.tooltip.item" onClick={() => column.sortColumn('ASC')}>
                <Span component="datagrid.header.cell.contextMenu.tooltip.item.icon">
                  <SortIcon width="100%" fill="currentColor" />
                </Span>
                Sort Ascending
              </Button>
            )}
            {isSortDescAvailable && (
              <Button component="datagrid.header.cell.contextMenu.tooltip.item" onClick={() => column.sortColumn('DESC')}>
                <Span component="datagrid.header.cell.contextMenu.tooltip.item.icon">
                  <SortIcon width="100%" fill="currentColor" rotate={180} />
                </Span>
                Sort Descending
              </Button>
            )}
            {isClearSortAvailable && (
              <Button component="datagrid.header.cell.contextMenu.tooltip.item" onClick={() => column.sortColumn(undefined)}>
                <Box width={4} />
                Clear Sort
              </Button>
            )}
            {isSortingAvailable && (isPiningAvailable || isGroupByAvailable || isUnGroupByAvailable) && (
              <Box bb={1} my={2} borderColor="gray-300" component="datagrid.header.cell.contextMenu.tooltip.item.separator" />
            )}
            {isPinLeftAvailable && (
              <Button component="datagrid.header.cell.contextMenu.tooltip.item" onClick={() => column.pinColumn('LEFT')}>
                <Span component="datagrid.header.cell.contextMenu.tooltip.item.icon">
                  <PinIcon width="100%" fill="currentColor" />
                </Span>
                Pin Left
              </Button>
            )}
            {isPinRightAvailable && (
              <Button component="datagrid.header.cell.contextMenu.tooltip.item" onClick={() => column.pinColumn('RIGHT')}>
                <Span component="datagrid.header.cell.contextMenu.tooltip.item.icon">
                  <PinIcon width="100%" fill="currentColor" rotate={-90} />
                </Span>
                Pin Right
              </Button>
            )}
            {isUnpinAvailable && (
              <Button component="datagrid.header.cell.contextMenu.tooltip.item" onClick={() => column.pinColumn()}>
                <Box width={4} />
                Unpin
              </Button>
            )}
            {isSortingAvailable && isPiningAvailable && (isGroupByAvailable || isUnGroupByAvailable) && (
              <Box component="datagrid.header.cell.contextMenu.tooltip.item.separator" />
            )}
            {isGroupByAvailable && (
              <Button component="datagrid.header.cell.contextMenu.tooltip.item" onClick={column.toggleGrouping}>
                <Span component="datagrid.header.cell.contextMenu.tooltip.item.icon">
                  <GroupingIcon width="100%" fill="currentColor" />
                </Span>
                <Box textWrap="nowrap">Group by {header ?? key}</Box>
              </Button>
            )}
            {isUnGroupByAvailable && (
              <Button component="datagrid.header.cell.contextMenu.tooltip.item" onClick={grid.unGroupAll}>
                <Span component="datagrid.header.cell.contextMenu.tooltip.item.icon">
                  <GroupingIcon width="100%" fill="currentColor" />
                </Span>
                <Box textWrap="nowrap">Un-Group All</Box>
              </Button>
            )}
          </Tooltip>
        )}
      </Button>
    </Flex>
  );
}

(DataGridHeaderCellContextMenu as React.FunctionComponent).displayName = 'DataGridHeaderCellContextMenu';
