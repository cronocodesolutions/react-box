import { describe, expect, it } from 'vitest';
import { GridDefinition } from '../contracts/dataGridContract';
import GridModel from './gridModel';

interface Person {
  firstName: string;
  lastName: string;
  day?: number;
  month?: number;
}

const data: Person[] = [
  { firstName: 'A', lastName: 'X' },
  { firstName: 'B', lastName: 'Y' },
];

const def: GridDefinition<Person> = {
  columns: [{ key: 'parent', pin: 'LEFT', columns: [{ key: 'firstName' }, { key: 'lastName' }] }],
};

function getGrid() {
  return new GridModel<Person>({ data, def }, () => {});
}

describe('ColumnModel', () => {
  it('propagates pin from parent to leafs', () => {
    const grid = getGrid();
    const firstName = grid.columns.value.flat.findOrThrow((c) => c.key === 'firstName');
    const lastName = grid.columns.value.flat.findOrThrow((c) => c.key === 'lastName');

    expect(firstName.pin).toEqual('LEFT');
    expect(lastName.pin).toEqual('LEFT');
  });

  it('initializes inline width for leafs', () => {
    const grid = getGrid();
    const leaf = grid.columns.value.leafs.findOrThrow((c) => c.key === 'firstName');
    expect(leaf.inlineWidth).toEqual(grid.DEFAULT_COLUMN_WIDTH_PX);
  });

  it('computes edge for pinned columns', () => {
    const grid = getGrid();
    const parent = grid.columns.value.flat.findOrThrow((c) => c.key === 'parent');
    const leafs = parent.visibleColumns;
    const lastLeft = leafs.at(-1)!;
    expect(lastLeft.isEdge).toBe(true);
  });

  it('toggleVisibility hides and shows a column', () => {
    const grid = getGrid();
    const firstName = grid.columns.value.leafs.findOrThrow((c) => c.key === 'firstName');
    expect(firstName.isVisible).toBe(true);
    firstName.toggleVisibility();
    expect(grid.hiddenColumns.has('firstName')).toBe(true);
    expect(firstName.isVisible).toBe(false);
  });

  it('setWidth updates leaf inlineWidth', () => {
    const grid = getGrid();
    const leaf = grid.columns.value.leafs.findOrThrow((c) => c.key === 'firstName');
    leaf.setWidth(300);
    expect(leaf.inlineWidth).toEqual(300);
  });
});
