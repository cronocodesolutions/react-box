import { describe, expect, it } from 'vitest';
import { ignoreLogs } from '../../../../dev/tests';
import { GridDefinition } from '../contracts/dataGridContract';
import GridModel, { ROW_DETAIL_CELL_KEY, ROW_NUMBER_CELL_KEY, ROW_SELECTION_CELL_KEY } from './gridModel';

interface Person {
  firstName: string;
  age: number;
  country: string;
}

const data: Person[] = [
  { firstName: 'John', age: 20, country: 'USA' },
  { firstName: 'Jane', age: 22, country: 'UK' },
  { firstName: 'Bob', age: 20, country: 'USA' },
];

function getGrid(def?: Partial<GridDefinition<Person>>) {
  return new GridModel<Person>({ data, def: { columns: [{ key: 'firstName' }, { key: 'age' }, { key: 'country' }], ...def } });
}

const leaf = (grid: GridModel<Person>, key: string | number) => grid.columns.value.leafs.findOrThrow((c) => c.key === key);

describe('ColumnModel kind + layout', () => {
  ignoreLogs();

  it('classifies columns by kind', () => {
    const grid = getGrid({ showRowNumber: true, rowSelection: true, rowDetail: { content: () => null } });
    expect(leaf(grid, 'firstName').kind).toBe('data');
    expect(leaf(grid, ROW_NUMBER_CELL_KEY).kind).toBe('rowNumber');
    expect(leaf(grid, ROW_SELECTION_CELL_KEY).kind).toBe('rowSelection');
    expect(leaf(grid, ROW_DETAIL_CELL_KEY).kind).toBe('rowDetail');

    grid.toggleGrouping('firstName');
    expect(grid.columns.value.leafs.findOrThrow((c) => c.isGrouping).kind).toBe('grouping');
  });

  it('convenience flags match the kind', () => {
    const col = leaf(getGrid(), 'firstName');
    expect(col.isData).toBe(true);
    expect(col.isRowNumber).toBe(false);
    expect(col.isRowSelection).toBe(false);
    expect(col.isRowDetail).toBe(false);
    expect(col.isGrouping).toBe(false);
  });

  it('cellVariant / cellStyleVars are stable (memoized) per column instance', () => {
    const col = leaf(getGrid(), 'firstName');
    expect(col.cellVariant.value).toBe(col.cellVariant.value);
    expect(col.cellStyleVars.value).toBe(col.cellStyleVars.value);
  });

  it('pinFlags reflect pinning', () => {
    const grid = getGrid({ columns: [{ key: 'firstName', pin: 'LEFT' }, { key: 'age' }] });
    const flags = leaf(grid, 'firstName').pinFlags.value;
    expect(flags.isLeftPinned).toBe(true);
    expect(flags.isFirstLeftPinned).toBe(true);
  });
});

describe('ColumnModel filtering helpers', () => {
  ignoreLogs();

  it('resolves filterConfig (boolean → text, object passthrough)', () => {
    const grid = getGrid({
      columns: [{ key: 'firstName', filterable: true }, { key: 'age', filterable: { type: 'number' } }, { key: 'country' }],
    });
    expect(leaf(grid, 'firstName').filterConfig).toEqual({ type: 'text' });
    expect(leaf(grid, 'age').filterConfig).toEqual({ type: 'number' });
    expect(leaf(grid, 'country').filterConfig).toBeUndefined();
  });

  it('setTextFilter sets/clears the column filter', () => {
    const grid = getGrid({ columns: [{ key: 'firstName', filterable: true }] });
    const col = leaf(grid, 'firstName');

    col.setTextFilter('jo');
    expect(col.currentFilter).toEqual({ type: 'text', value: 'jo' });

    col.setTextFilter('   ');
    expect(col.currentFilter).toBeUndefined();
  });

  it('setNumberFilter validates input and supports between', () => {
    const grid = getGrid({ columns: [{ key: 'age', filterable: { type: 'number' } }] });
    const col = leaf(grid, 'age');

    col.setNumberFilter('gte', '21');
    expect(col.currentFilter).toEqual({ type: 'number', operator: 'gte', value: 21 });

    col.setNumberFilter('between', 20, 30);
    expect(col.currentFilter).toEqual({ type: 'number', operator: 'between', value: 20, valueTo: 30 });

    col.setNumberFilter('eq', ''); // invalid → clears
    expect(col.currentFilter).toBeUndefined();
  });

  it('setMultiselectFilter sets values and clears on empty', () => {
    const grid = getGrid({ columns: [{ key: 'country', filterable: { type: 'multiselect' } }] });
    const col = leaf(grid, 'country');

    col.setMultiselectFilter(['USA']);
    expect(col.currentFilter).toEqual({ type: 'multiselect', values: ['USA'] });

    col.setMultiselectFilter([]);
    expect(col.currentFilter).toBeUndefined();
  });

  it('filterOptions computes unique values when no options are configured', () => {
    const grid = getGrid({ columns: [{ key: 'country', filterable: { type: 'multiselect' } }] });
    expect(leaf(grid, 'country').filterOptions).toEqual([
      { label: 'UK', value: 'UK' },
      { label: 'USA', value: 'USA' },
    ]);
  });
});
