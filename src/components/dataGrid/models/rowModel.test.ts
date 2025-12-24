import { describe, expect, it } from 'vitest';
import { GridDefinition } from '../contracts/dataGridContract';
import GridModel from './gridModel';

interface Person {
  id: number;
  firstName: string;
}

const data: Person[] = [
  { id: 1, firstName: 'A' },
  { id: 2, firstName: 'B' },
];

const def: GridDefinition<Person> = {
  rowKey: 'id',
  columns: [{ key: 'firstName' }],
};

function getGrid() {
  return new GridModel<Person>({ data, def }, () => {});
}

describe('RowModel', () => {
  it('generates key using rowKey', () => {
    const grid = getGrid();
    const row = grid.rows.value[0];
    expect(row.key).toEqual(1);
  });

  it('selected reflects grid.selectedRows', () => {
    const grid = getGrid();
    const row = grid.rows.value[0];
    grid.toggleRowSelection(row.key);
    expect(row.selected).toBe(true);
  });

  it('cells count equals visible leaf columns', () => {
    const grid = getGrid();
    const row = grid.rows.value[0];
    expect(row.cells.length).toEqual(grid.columns.value.visibleLeafs.length);
  });

  it('flatRows and allRows return self', () => {
    const grid = getGrid();
    const row = grid.rows.value[0];
    expect(row.flatRows).toBe(row);
    expect(row.allRows).toBe(row);
  });
});
