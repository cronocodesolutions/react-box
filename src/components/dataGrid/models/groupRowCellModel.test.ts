import { describe, expect, it } from 'vitest';
import { GridDefinition } from '../contracts/dataGridContract';
import GridModel from './gridModel';
import GroupRowCellModel from './groupRowCellModel';
import GroupRowModel from './groupRowModel';

interface Person {
  firstName: string;
  day: number;
}

const data: Person[] = [
  { firstName: 'A', day: 1 },
  { firstName: 'B', day: 1 },
  { firstName: 'C', day: 2 },
];

const def: GridDefinition<Person> = {
  columns: [{ key: 'firstName' }, { key: 'day' }],
  showRowNumber: true,
};

function getGrid() {
  return new GridModel<Person>({ data, def }, () => {});
}

describe('GroupRowCellModel', () => {
  it('returns group label with count for grouping cell', () => {
    const grid = getGrid();
    grid.toggleGrouping('day');
    const groupRow = grid.rows.value[0] as GroupRowModel<Person>;
    const groupingLeaf = grid.columns.value.visibleLeafs.findOrThrow((c) => c.key === 'grouping-cell');
    const cell = new GroupRowCellModel(grid, groupRow, groupingLeaf);
    expect(cell.value).toEqual(`${groupRow.groupValue} (${groupRow.count})`);
  });

  it('returns row number for row-number column', () => {
    const grid = getGrid();
    grid.toggleGrouping('day');
    const groupRow = grid.rows.value[0] as GroupRowModel<Person>;
    const rowNumberLeaf = grid.columns.value.visibleLeafs.findOrThrow((c) => c.key === 'row-number-cell');
    const cell = new GroupRowCellModel(grid, groupRow, rowNumberLeaf);
    expect(cell.value).toEqual(groupRow.rowIndex + 1);
  });
});
