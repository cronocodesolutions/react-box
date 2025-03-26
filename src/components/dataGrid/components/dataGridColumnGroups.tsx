import React, { useMemo } from 'react';
import GridModel, { EMPTY_CELL_KEY, GROUPING_CELL_KEY, ROW_NUMBER_CELL_KEY, ROW_SELECTION_CELL_KEY } from '../models/gridModel';
import Button from '../../button';
import CloseSvg from '../../../../pages/svgs/closeSvg';
import Flex from '../../flex';
import GroupingIcon from '../../../icons/groupingIcon';
import BaseSvg from '../../baseSvg';
import useVisibility from '../../../hooks/useVisibility';
import Tooltip from '../../tooltip';
import Checkbox from '../../checkbox';
import SearchIcon from '../../../icons/searchIcon';
import Textbox from '../../textbox';

interface Props<TRow> {
  grid: GridModel<TRow>;
}

export default function DataGridColumnGroups<TRow>(props: Props<TRow>) {
  const { grid } = props;

  const items = useMemo(() => {
    if (grid.groupColumns.length === 0) {
      return null;
    }

    return grid.groupColumns.map((groupColumn, index) => {
      const column = grid.columns.value.leafs.findOrThrow((l) => l.key === groupColumn);

      return (
        <React.Fragment key={groupColumn}>
          {'>'}
          <Flex component="datagrid.columnGroups.item">
            {column.header ?? column.key}
            <Button component="datagrid.columnGroups.item.icon" onClick={() => grid.toggleGrouping(column.key)}>
              <CloseSvg fill="currentColor" width="100%" />
            </Button>
          </Flex>
        </React.Fragment>
      );
      //
    });
  }, [grid.groupColumns]);

  return (
    <Flex component="datagrid.columnGroups" position="relative">
      <ContextMenu grid={grid} />
      {items && <GroupingIcon width="1rem" fill="violet-950" />}
      {items}

      <Flex position="absolute" justifySelf="flex-end" right={2} top={2} className="parent">
        <Flex position="absolute" width={8} height={8} right={0} jc="center">
          <SearchIcon fill="violet-950" width="1rem" />
        </Flex>
        <Textbox placeholder="Search..." height={8} width={50} zIndex={1} bgColor="transparent" />
      </Flex>
    </Flex>
  );
}

interface ContextMenuProps<TRow> {
  grid: GridModel<TRow>;
}

function ContextMenu<TRow>(props: ContextMenuProps<TRow>) {
  const { grid } = props;
  const [isOpen, setOpen, refToUse] = useVisibility({ event: 'mousedown' });

  const leafsToHide = useMemo(
    () =>
      grid.columns.value.leafs.filter(
        (l) => ![EMPTY_CELL_KEY, ROW_NUMBER_CELL_KEY, ROW_SELECTION_CELL_KEY, GROUPING_CELL_KEY].includes(l.key),
      ),
    [grid.columns.value.leafs],
  );

  return (
    <Button clean cursor="pointer" p={1} hover={{ bgColor: 'gray-200', borderRadius: 1 }} onClick={() => setOpen(!isOpen)}>
      <BaseSvg viewBox="0 0 24 24" width="20" fill="currentColor" {...props}>
        <path d="M5 6h14M5 12h14M5 18h14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></path>
      </BaseSvg>
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
          translateX={-1}
          shadow="medium-shadow"
          ref={refToUse}
          overflow="auto"
          maxHeight={100}
        >
          {leafsToHide.map((leaf) => (
            <Button
              key={leaf.key}
              clean
              display="flex"
              gap={2}
              p={3}
              cursor="pointer"
              hover={{ bgColor: 'gray-200' }}
              onClick={(e) => {
                e.stopPropagation();
                leaf.toggleVisibility();
              }}
            >
              <Checkbox checked={leaf.isVisible} onChange={() => {}} focus={{ outline: 0 }} />
              {leaf.header ?? leaf.key}
            </Button>
          ))}
        </Tooltip>
      )}
    </Button>
  );
}
