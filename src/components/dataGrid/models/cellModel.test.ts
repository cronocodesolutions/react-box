import { describe, expect, it } from 'vitest';
import { ignoreLogs } from '../../../../dev/tests';
import { GridDefinition } from '../contracts/dataGridContract';
import GridModel from './gridModel';

interface Person {
  firstName: string;
}

const data: Person[] = [{ firstName: 'A' }, { firstName: 'B' }];

const def: GridDefinition<Person> = {
  columns: [{ key: 'firstName' }],
  showRowNumber: true,
};

function getGrid() {
  return new GridModel<Person>({ data, def }, () => {});
}

describe('CellModel', () => {
  ignoreLogs();

  it('returns data value for regular columns', () => {
    const grid = getGrid();
    const row = grid.rows.value[0];
    const firstNameLeaf = grid.columns.value.visibleLeafs.findOrThrow((c) => c.key === 'firstName');
    const cell = row.cells.find((c) => c.column.key === firstNameLeaf.key)!;
    expect(cell.value).toEqual('A');
  });

  it('returns row index + 1 for row-number column', () => {
    const grid = getGrid();
    const row = grid.rows.value[0];
    const rowNumberLeaf = grid.columns.value.visibleLeafs.findOrThrow((c) => c.key === 'row-number-cell');
    const rowNumberCell = row.cells.find((c) => c.column.key === rowNumberLeaf.key)!;
    expect(rowNumberCell.value).toEqual(row.rowIndex + 1);
  });
});
