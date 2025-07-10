import { useState, useMemo } from 'react';
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
import { GROUPING_CELL_KEY } from '../models/gridModel';

interface Props<TRow> {
  column: ColumnModel<TRow>;
}

export default function DataGridHeaderCellContextMenu<TRow>(props: Props<TRow>) {
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
      <Button component="datagrid.header.cell.contextMenu" onClick={() => setOpen(!isOpen)}>
        <Span component="datagrid.header.cell.contextMenu.icon">
          <DotsIcon fill="currentColor" />
        </Span>
        {isOpen && (
          <Tooltip
            component="datagrid.header.cell.contextMenu.tooltip"
            variant={{ openLeft }}
            onPositionChange={setTooltipPosition}
            ref={refToUse}
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
              <Box bb={1} my={2} borderColor="gray-300" />
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
              <Box bb={1} my={2} borderColor="gray-300" />
            )}
            {isGroupByAvailable && (
              <Button component="datagrid.header.cell.contextMenu.tooltip.item" onClick={column.toggleGrouping}>
                <Span component="datagrid.header.cell.contextMenu.tooltip.item.icon">
                  <GroupingIcon width="100%" fill="currentColor" />
                </Span>
                <Box textWrap="nowrap">Group by {column.header ?? column.key}</Box>
              </Button>
            )}
            {isUnGroupByAvailable && (
              <Button component="datagrid.header.cell.contextMenu.tooltip.item" onClick={column.grid.unGroupAll}>
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
