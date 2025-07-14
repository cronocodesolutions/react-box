import { useCallback } from 'react';
import Box from '../../../box';
import ExpandIcon from '../../../icons/expandIcon';
import Button from '../../button';
import Checkbox from '../../checkbox';
import Flex from '../../flex';
import { EMPTY_CELL_KEY, GROUPING_CELL_KEY, ROW_NUMBER_CELL_KEY, ROW_SELECTION_CELL_KEY } from '../models/gridModel';
import GroupRowModel from '../models/groupRowModel';
import DataGridCell from './dataGridCell';

interface Props<TRow> {
  row: GroupRowModel<TRow>;
}

export default function DataGridGroupRow<TRow>(props: Props<TRow>) {
  const { row } = props;
  const { selected, indeterminate, cells, groupingColumn, groupingColumnGridColumn, depth, expanded } = row;

  const selectAllHandler = useCallback(() => {
    row.grid.toggleRowsSelection(row.allRows.map((x) => x.key));
  }, []);

  return (
    <Flex className="grid-row" selected={selected} display="contents" props={{ role: 'rowgroup' }}>
      {cells.map((cell) => {
        const { key, pin, groupColumnWidthVarName } = cell.column;
        const isRightPinned = pin === 'RIGHT';

        if (key === GROUPING_CELL_KEY) {
          return (
            <DataGridCell
              key={key}
              column={cell.column}
              style={{
                width: `var(${groupColumnWidthVarName})`,
                right: isRightPinned ? '0' : undefined,
              }}
              br={groupingColumn.pin === 'LEFT' ? 1 : undefined}
              gridColumn={groupingColumnGridColumn}
              pl={4 * depth}
              overflow="auto"
            >
              <Box textWrap="nowrap" px={3}>
                <Button clean onClick={() => row.toggleRow()} cursor="pointer" display="flex" gap={1} ai="center">
                  <ExpandIcon fill="currentColor" width="14px" height="14px" rotate={expanded ? 0 : -90} />
                  {cell.value}
                </Button>
              </Box>
            </DataGridCell>
          );
        }

        if (key === ROW_SELECTION_CELL_KEY) {
          return (
            <DataGridCell key={key} column={cell.column}>
              <Checkbox variant="datagrid" m={1} checked={selected} indeterminate={indeterminate} onChange={selectAllHandler} />
            </DataGridCell>
          );
        }

        if (pin !== groupingColumn.pin || key === ROW_NUMBER_CELL_KEY || key === EMPTY_CELL_KEY) {
          return (
            <DataGridCell key={key} column={cell.column} px={key === ROW_NUMBER_CELL_KEY ? 3 : undefined}>
              {cell.value}
            </DataGridCell>
          );
        }
      })}
    </Flex>
  );
}

(DataGridGroupRow as React.FunctionComponent).displayName = 'DataGridGroupRow';
