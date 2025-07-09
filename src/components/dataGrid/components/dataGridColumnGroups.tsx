import React from 'react';
import CloseSvg from '../../../../pages/svgs/closeSvg';
import GroupingIcon from '../../../icons/groupingIcon';
import Button from '../../button';
import Flex from '../../flex';
import { Span } from '../../semantics';
import GridModel from '../models/gridModel';
import ExpandIcon from '../../../icons/expandIcon';

interface Props<TRow> {
  grid: GridModel<TRow>;
}

export default function DataGridColumnGroups<TRow>(props: Props<TRow>) {
  const { grid } = props;

  if (grid.groupColumns.size === 0) return null;

  return (
    <Flex component="datagrid.topBar.columnGroups">
      <Span component="datagrid.topBar.columnGroups.icon">
        <GroupingIcon width="100%" fill="currentColor" />
      </Span>
      {Array.from(grid.groupColumns, (groupColumn) => {
        const column = grid.columns.value.leafs.findOrThrow((l) => l.key === groupColumn);

        return (
          <React.Fragment key={groupColumn}>
            <ExpandIcon fill="currentColor" width="14px" height="14px" rotate={-90} />
            <Flex component="datagrid.topBar.columnGroups.item">
              {column.header ?? column.key}
              <Button component="datagrid.topBar.columnGroups.item.icon" onClick={() => grid.toggleGrouping(column.key)}>
                <CloseSvg fill="currentColor" width="100%" />
              </Button>
            </Flex>
          </React.Fragment>
        );
      })}
    </Flex>
  );
}

(DataGridColumnGroups as React.FunctionComponent).displayName = 'DataGridColumnGroups';
