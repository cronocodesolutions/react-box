import { useCallback } from 'react';
import Box from '../../../box';
import ExpandIcon from '../../../icons/expandIcon';
import Button from '../../button';
import Checkbox from '../../checkbox';
import Flex from '../../flex';
import GroupRowModel from '../models/groupRowModel';
import DataGridCell from './dataGridCell';

interface Props<TRow> {
  row: GroupRowModel<TRow>;
}

export default function DataGridGroupRow<TRow>(props: Props<TRow>) {
  const { row } = props;
  const { selected, indeterminate, cells, expanded } = row;

  const selectAllHandler = useCallback(() => row.toggleSelectAll(), [row]);

  return (
    <Flex
      component={`${row.grid.componentName}.body.groupRow` as never}
      className="grid-row"
      selected={selected}
      display="contents"
      props={{ role: 'rowgroup' }}
    >
      {cells.map((cell) => {
        switch (cell.cellKind) {
          case 'grouping':
            return (
              <DataGridCell
                key={cell.column.key}
                column={cell.column}
                style={{ width: cell.widthVar, right: cell.isRightPinned ? '0' : undefined }}
                br={cell.hasGroupingBorder ? 1 : undefined}
                gridColumn={cell.gridColumnSpan}
                pl={cell.depthPadding}
                overflow="auto"
              >
                <Box textWrap="nowrap" px={3}>
                  <Button
                    component={`${row.grid.componentName}.body.groupRow.expandButton` as never}
                    clean
                    onClick={() => row.toggleRow()}
                    cursor="pointer"
                    display="flex"
                    gap={1}
                    ai="center"
                  >
                    <ExpandIcon fill="currentColor" width="14px" height="14px" rotate={expanded ? 0 : -90} />
                    {cell.value}
                  </Button>
                </Box>
              </DataGridCell>
            );

          case 'selection':
            return (
              <DataGridCell key={cell.column.key} column={cell.column}>
                <Checkbox variant="datagrid" m={1} checked={selected} indeterminate={indeterminate} onChange={selectAllHandler} />
              </DataGridCell>
            );

          case 'spacer':
            return (
              <DataGridCell key={cell.column.key} column={cell.column} px={cell.column.isRowNumber ? 3 : undefined}>
                {cell.value}
              </DataGridCell>
            );

          default:
            return null;
        }
      })}
    </Flex>
  );
}

(DataGridGroupRow as React.FunctionComponent).displayName = 'DataGridGroupRow';
