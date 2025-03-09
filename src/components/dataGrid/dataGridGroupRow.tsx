import Button from '../button';
import Flex from '../flex';
import DataGridCell from './dataGridCell';
import { EMPTY_CELL_KEY, GROUPING_CELL_KEY } from './models/gridModel';
import GroupRowModel from './models/groupRowModel';

interface Props<TRow> {
  row: GroupRowModel<TRow>;
}

export default function DataGridGroupRow<TRow>(props: Props<TRow>) {
  const { row } = props;
  const { leafs } = row.grid.columns.value;

  const groupingColumn = leafs.findOrThrow((c) => c.key === GROUPING_CELL_KEY);
  let gridColumns = leafs.sumBy((c) => (c.pin === groupingColumn.pin && c.key !== EMPTY_CELL_KEY ? 1 : 0));

  return (
    <Flex className="grid-row" display="contents">
      {leafs.map((leaf) => {
        if (leaf.pin !== groupingColumn.pin || leaf.key === EMPTY_CELL_KEY) {
          return <DataGridCell key={leaf.key} column={leaf} />;
        }

        if (leaf.key === GROUPING_CELL_KEY) {
          return (
            <DataGridCell
              key={leaf.key}
              column={leaf}
              style={{ width: `var(${leaf.groupColumnWidthVarName})`, left: leaf.pin === 'LEFT' ? 0 : undefined }}
              br={groupingColumn.pin === 'LEFT' ? 1 : undefined}
              gridColumn={gridColumns}
              pl={4 * row.depth}
            >
              <Button display="contents" clean onClick={() => row.toggleRow()} cursor="pointer">
                {'>'} {row.groupValue} ({row.count})
              </Button>
            </DataGridCell>
          );
        }
      })}
      {}
    </Flex>
  );
}
