import { useCallback } from 'react';
import DataGridCell from './dataGridCell';
import ExpandIcon from '../../../icons/expandIcon';
import Button from '../../button';
import Checkbox from '../../checkbox';
import Flex from '../../flex';
import { EMPTY_CELL_KEY, GROUPING_CELL_KEY, ROW_NUMBER_CELL_KEY, ROW_SELECTION_CELL_KEY } from '../models/gridModel';
import GroupRowModel from '../models/groupRowModel';

interface Props<TRow> {
  row: GroupRowModel<TRow>;
}

export default function DataGridGroupRow<TRow>(props: Props<TRow>) {
  const { row } = props;

  const selectAllHandler = useCallback(() => {
    row.grid.toggleRowsSelection(row.allRows.map((x) => x.key));
  }, []);

  return (
    <Flex className="grid-row" display="contents" props={{ role: 'rowgroup' }}>
      {row.cells.map((cell) => {
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
              br={row.groupingColumn.pin === 'LEFT' ? 1 : undefined}
              gridColumn={row.groupingColumnGridColumn}
              pl={4 * row.depth}
            >
              <Button clean onClick={() => row.toggleRow()} cursor="pointer" display="flex" gap={1} ai="center">
                <ExpandIcon fill="currentColor" width="14px" height="14px" rotate={row.expanded ? 0 : -90} />
                {cell.value}
              </Button>
            </DataGridCell>
          );
        }

        if (key === ROW_SELECTION_CELL_KEY) {
          const rows = row.allRows;
          const checked = rows.every((r) => r.selected);
          const indeterminate = !checked && rows.some((r) => r.selected);

          return (
            <DataGridCell key={key} column={cell.column}>
              <Checkbox variant="datagrid" m={1} checked={checked} indeterminate={indeterminate} onChange={selectAllHandler} />
            </DataGridCell>
          );
        }

        if (pin !== row.groupingColumn.pin || key === EMPTY_CELL_KEY || key === ROW_NUMBER_CELL_KEY) {
          return (
            <DataGridCell key={key} column={cell.column}>
              {cell.value}
            </DataGridCell>
          );
        }
      })}
    </Flex>
  );
}

(DataGridGroupRow as React.FunctionComponent).displayName = 'DataGridGroupRow';
