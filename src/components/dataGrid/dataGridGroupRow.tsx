import Button from '../button';
import Flex from '../flex';
import DataGridCell from './dataGridCell';
import { GROUPING_CELL_KEY } from './models/gridModel';
import GroupRowModel from './models/groupRowModel';

interface Props<TRow> {
  row: GroupRowModel<TRow>;
}

export default function DataGridGroupRow<TRow>(props: Props<TRow>) {
  const { row } = props;

  const groupingColumn = row.grid.leafs.value.find((c) => c.key === GROUPING_CELL_KEY);

  return (
    <Flex className={['grid-row', row.rowKey.toString()]}>
      {row.grid.leafs.value.map((leaf) => {
        if (groupingColumn) {
          if (leaf.pin !== groupingColumn.pin) {
            return <DataGridCell key={leaf.key} column={leaf} />;
          }

          if (leaf.key === GROUPING_CELL_KEY) {
            const style: Record<string, string> = { width: `var(${leaf.groupColumnWidthVarName})` };
            if (leaf.pin === 'LEFT') style.left = '0';
            else if (leaf.pin === 'RIGHT') style.right = '0';

            return (
              <DataGridCell key={leaf.key} column={leaf} style={style} br={1}>
                <Button clean onClick={() => row.toggleRow()} cursor="pointer" pl={4 * row.depth}>
                  {'>'} {row.groupValue} ({row.count}) {row.groupColumn.pin ?? 'no pin'}
                </Button>
              </DataGridCell>
            );
          }
        }
      })}
    </Flex>
  );
}
