import { describe, expect, it, vi } from 'vitest';
import { ignoreLogs } from '../../../../dev/tests';
import { DataGridProps, GridDefinition } from '../contracts/dataGridContract';
import GridModel from './gridModel';

interface Person {
  firstName: string;
  lastName: string;
}

const data: Person[] = [
  { firstName: 'A', lastName: 'X' },
  { firstName: 'B', lastName: 'Y' },
];

const def: GridDefinition<Person> = { columns: [{ key: 'firstName' }, { key: 'lastName' }] };

function getGrid(props?: Partial<DataGridProps<Person>>) {
  return new GridModel<Person>({ data, def, ...props });
}

describe('GridModel store', () => {
  ignoreLogs();

  it('notifies subscribers and increments the snapshot on mutation', () => {
    const grid = getGrid();
    const listener = vi.fn();
    grid.subscribe(listener);

    const before = grid.getSnapshot();
    grid.setSortColumn('firstName');

    expect(listener).toHaveBeenCalledTimes(1);
    expect(grid.getSnapshot()).toBe(before + 1);
  });

  it('getSnapshot is stable between mutations', () => {
    const grid = getGrid();
    const a = grid.getSnapshot();
    const b = grid.getSnapshot();
    expect(a).toBe(b);
  });

  it('unsubscribe stops further notifications', () => {
    const grid = getGrid();
    const listener = vi.fn();
    const unsubscribe = grid.subscribe(listener);

    grid.setSortColumn('firstName');
    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
    grid.setSortColumn('lastName');
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('supports multiple independent subscribers', () => {
    const grid = getGrid();
    const a = vi.fn();
    const b = vi.fn();
    grid.subscribe(a);
    grid.subscribe(b);

    grid.notify();
    expect(a).toHaveBeenCalledTimes(1);
    expect(b).toHaveBeenCalledTimes(1);
  });

  it('registers the optional constructor onChange listener', () => {
    const onChange = vi.fn();
    const grid = new GridModel<Person>({ data, def }, onChange);

    grid.notify();
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  describe('setProps', () => {
    it('is a no-op (no memo rebuild) when the same props object is passed', () => {
      const grid = getGrid();
      const rows = grid.rows.value; // prime cache
      grid.setProps(grid.props);
      expect(grid.rows.value).toBe(rows); // same cached instance, not recomputed
    });

    it('rebuilds rows when the data prop changes', () => {
      const grid = getGrid();
      const rows = grid.rows.value;

      const newData: Person[] = [{ firstName: 'C', lastName: 'Z' }];
      grid.setProps({ data: newData, def });

      expect(grid.rows.value).not.toBe(rows);
      expect(grid.rows.value).toHaveLength(1);
    });

    it('rebuilds columns when the def prop changes', () => {
      const grid = getGrid();
      const columns = grid.columns.value;

      grid.setProps({ data, def: { columns: [{ key: 'firstName' }] } });

      expect(grid.columns.value).not.toBe(columns);
      expect(grid.columns.value.userVisibleLeafs).toHaveLength(1);
    });

    it('does not notify subscribers (render-time sync)', () => {
      const grid = getGrid();
      const listener = vi.fn();
      grid.subscribe(listener);

      grid.setProps({ data: [{ firstName: 'C', lastName: 'Z' }], def });
      expect(listener).not.toHaveBeenCalled();
    });
  });
});
