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

interface Props<TRow> {
  column: ColumnModel<TRow>;
}

export default function DataGridHeaderCellContextMenu<TRow>(props: Props<TRow>) {
  const { column } = props;
  const { grid, align, header, key } = column;
  const hc = column.headerCell;

  const [isOpen, setOpen, refToUse] = useVisibility({ hideOnScroll: true, event: 'mousedown' });
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const openLeft = useMemo(() => tooltipPosition.left > window.innerWidth / 2, [tooltipPosition.left]);

  const positionLeft = align === 'right' ? 2 : undefined;
  const positionRight = align === 'right' ? undefined : column.pin === 'RIGHT' ? 2.5 : 4;

  return (
    <Flex position="absolute" left={positionLeft} right={positionRight} top="1/2" translateY={-3} ai="center">
      <Button
        component={`${grid.componentName}.header.cell.contextMenu` as never}
        onClick={() => setOpen(!isOpen)}
        variant={hc.contextMenuButtonVariant as never}
      >
        <Span component={`${grid.componentName}.header.cell.contextMenu.icon` as never}>
          <DotsIcon fill="currentColor" />
        </Span>
        {isOpen && (
          <Tooltip
            component={`${grid.componentName}.header.cell.contextMenu.tooltip` as never}
            onPositionChange={setTooltipPosition}
            ref={refToUse}
            adjustTranslateX={openLeft ? '-100%' : '-21px'}
            adjustTranslateY="16px"
          >
            {hc.canSortAsc && (
              <Button
                component={`${grid.componentName}.header.cell.contextMenu.tooltip.item` as never}
                onClick={() => column.sortColumn('ASC')}
              >
                <Span component={`${grid.componentName}.header.cell.contextMenu.tooltip.item.icon` as never}>
                  <SortIcon width="100%" fill="currentColor" />
                </Span>
                Sort Ascending
              </Button>
            )}
            {hc.canSortDesc && (
              <Button
                component={`${grid.componentName}.header.cell.contextMenu.tooltip.item` as never}
                onClick={() => column.sortColumn('DESC')}
              >
                <Span component={`${grid.componentName}.header.cell.contextMenu.tooltip.item.icon` as never}>
                  <SortIcon width="100%" fill="currentColor" rotate={180} />
                </Span>
                Sort Descending
              </Button>
            )}
            {hc.canClearSort && (
              <Button
                component={`${grid.componentName}.header.cell.contextMenu.tooltip.item` as never}
                onClick={() => column.sortColumn(undefined)}
              >
                <Box width={4} />
                Clear Sort
              </Button>
            )}
            {hc.hasSortSection && (hc.hasPinSection || hc.hasGroupSection) && (
              <Box
                bb={1}
                my={2}
                borderColor="gray-300"
                component={`${grid.componentName}.header.cell.contextMenu.tooltip.item.separator` as never}
              />
            )}
            {hc.canPinLeft && (
              <Button
                component={`${grid.componentName}.header.cell.contextMenu.tooltip.item` as never}
                onClick={() => column.pinColumn('LEFT')}
              >
                <Span component={`${grid.componentName}.header.cell.contextMenu.tooltip.item.icon` as never}>
                  <PinIcon width="100%" fill="currentColor" />
                </Span>
                Pin Left
              </Button>
            )}
            {hc.canPinRight && (
              <Button
                component={`${grid.componentName}.header.cell.contextMenu.tooltip.item` as never}
                onClick={() => column.pinColumn('RIGHT')}
              >
                <Span component={`${grid.componentName}.header.cell.contextMenu.tooltip.item.icon` as never}>
                  <PinIcon width="100%" fill="currentColor" rotate={-90} />
                </Span>
                Pin Right
              </Button>
            )}
            {hc.canUnpin && (
              <Button component={`${grid.componentName}.header.cell.contextMenu.tooltip.item` as never} onClick={() => column.pinColumn()}>
                <Box width={4} />
                Unpin
              </Button>
            )}
            {hc.hasSortSection && hc.hasPinSection && hc.hasGroupSection && (
              <Box component={`${grid.componentName}.header.cell.contextMenu.tooltip.item.separator` as never} />
            )}
            {hc.canGroupBy && (
              <Button component={`${grid.componentName}.header.cell.contextMenu.tooltip.item` as never} onClick={column.toggleGrouping}>
                <Span component={`${grid.componentName}.header.cell.contextMenu.tooltip.item.icon` as never}>
                  <GroupingIcon width="100%" fill="currentColor" />
                </Span>
                <Box textWrap="nowrap">Group by {header ?? key}</Box>
              </Button>
            )}
            {hc.canUnGroupAll && (
              <Button component={`${grid.componentName}.header.cell.contextMenu.tooltip.item` as never} onClick={grid.unGroupAll}>
                <Span component={`${grid.componentName}.header.cell.contextMenu.tooltip.item.icon` as never}>
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
