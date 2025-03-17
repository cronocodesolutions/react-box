import Button from '../button';
import Checkbox from '../checkbox';
import Flex from '../flex';
import DataGridCell from './dataGridCell';
import { EMPTY_CELL_KEY, GROUPING_CELL_KEY, ROW_NUMBER_CELL_KEY, ROW_SELECTION_CELL_KEY } from './models/gridModel';
import GroupRowModel from './models/groupRowModel';

interface Props<TRow> {
  row: GroupRowModel<TRow>;
}

export default function DataGridGroupRow<TRow>(props: Props<TRow>) {
  const { row } = props;

  return (
    <Flex className="grid-row" display="contents" props={{ role: 'rowgroup' }}>
      {row.cells.map((cell) => {
        if (cell.column.key === GROUPING_CELL_KEY) {
          return (
            <DataGridCell
              key={cell.column.key}
              column={cell.column}
              style={{
                width: `var(${cell.column.groupColumnWidthVarName})`,
              }}
              br={row.groupingColumn.pin === 'LEFT' ? 1 : undefined}
              gridColumn={row.groupingColumnGridColumn}
              pl={4 * row.depth}
            >
              <Button display="contents" clean onClick={() => row.toggleRow()} cursor="pointer">
                {cell.value}
              </Button>
            </DataGridCell>
          );
        }

        if (cell.column.key === ROW_SELECTION_CELL_KEY) {
          return (
            <DataGridCell key={cell.column.key} column={cell.column}>
              <Checkbox m={1} />
            </DataGridCell>
          );
        }

        if (cell.column.pin !== row.groupingColumn.pin || cell.column.key === EMPTY_CELL_KEY || cell.column.key === ROW_NUMBER_CELL_KEY) {
          return (
            <DataGridCell key={cell.column.key} column={cell.column}>
              {cell.value}
            </DataGridCell>
          );
        }
      })}
    </Flex>
  );
}
