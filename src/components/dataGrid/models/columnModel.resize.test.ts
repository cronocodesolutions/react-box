import { describe, expect, it } from 'vitest';
import { ignoreLogs } from '../../../../dev/tests';
import { GridDefinition } from '../contracts/dataGridContract';
import GridModel from './gridModel';

interface Person {
  firstName: string;
  lastName: string;
}

const data: Person[] = [{ firstName: 'A', lastName: 'X' }];

function getGrid(def: GridDefinition<Person>) {
  return new GridModel<Person>({ data, def });
}

describe('ColumnModel resize (headless)', () => {
  ignoreLogs();

  it('widens a column as the pointer drags right', () => {
    const grid = getGrid({ columns: [{ key: 'firstName', width: 200 }] });
    const col = grid.columns.value.leafs.findOrThrow((c) => c.key === 'firstName');

    col.beginResize(100);
    col.resizeTo(160); // +60px

    expect(col.inlineWidth).toBe(260);
  });

  it('narrows a column as the pointer drags left, clamped to MIN_COLUMN_WIDTH_PX', () => {
    const grid = getGrid({ columns: [{ key: 'firstName', width: 200 }] });
    const col = grid.columns.value.leafs.findOrThrow((c) => c.key === 'firstName');

    col.beginResize(100);
    col.resizeTo(-1000); // far past the minimum

    expect(col.inlineWidth).toBe(grid.MIN_COLUMN_WIDTH_PX);
  });

  it('inverts drag direction for RIGHT-pinned columns', () => {
    const grid = getGrid({ columns: [{ key: 'firstName', width: 200, pin: 'RIGHT' }] });
    const col = grid.columns.value.leafs.findOrThrow((c) => c.key === 'firstName');

    col.beginResize(100);
    col.resizeTo(160); // pointer moves right → right-pinned column shrinks

    expect(col.inlineWidth).toBe(140);
  });

  it('notifies subscribers on each resizeTo and on endResize', () => {
    const grid = getGrid({ columns: [{ key: 'firstName', width: 200 }] });
    const col = grid.columns.value.leafs.findOrThrow((c) => c.key === 'firstName');

    const before = grid.getSnapshot();
    col.beginResize(100);
    col.resizeTo(120);
    col.resizeTo(140);
    col.endResize();

    expect(grid.getSnapshot()).toBe(before + 3);
  });
});
