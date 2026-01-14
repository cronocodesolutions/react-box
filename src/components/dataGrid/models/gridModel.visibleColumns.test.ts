import { describe, expect, it } from 'vitest';
import { ignoreLogs } from '../../../../dev/tests';
import { GridDefinition } from '../contracts/dataGridContract';
import GridModel, { EMPTY_CELL_KEY, GROUPING_CELL_KEY, ROW_NUMBER_CELL_KEY, ROW_SELECTION_CELL_KEY } from './gridModel';

interface Person {
  firstName: string;
  lastName: string;
  age: number;
}

const testData: Person[] = [
  { firstName: 'John', lastName: 'Doe', age: 20 },
  { firstName: 'Jane', lastName: 'Smith', age: 22 },
];

describe('GridModel - Visible Columns', () => {
  ignoreLogs();

  function getGridModel(props?: { gridDef?: Partial<GridDefinition<Person>>; data?: Partial<Person>[] }) {
    const { gridDef, data } = props ?? {};

    const def: GridDefinition<Person> = {
      columns: [{ key: 'firstName' }, { key: 'lastName' }, { key: 'age' }],
      ...gridDef,
    };

    return new GridModel<Person>(
      {
        def,
        data: (data ?? testData) as Person[],
      },
      () => {},
    );
  }

  describe('visibleLeafs computation', () => {
    it('should not include empty cell column in visibleLeafs (flexible sizing handles space)', () => {
      const grid = getGridModel();
      const emptyCell = grid.columns.value.visibleLeafs.find((c) => c.key === EMPTY_CELL_KEY);
      expect(emptyCell).toBeUndefined();
    });

    it('should include only user columns when no special columns', () => {
      const grid = getGridModel();
      const visibleKeys = grid.columns.value.visibleLeafs.map((c) => c.key);

      expect(visibleKeys).toContain('firstName');
      expect(visibleKeys).toContain('lastName');
      expect(visibleKeys).toContain('age');
      expect(visibleKeys).toHaveLength(3);
    });

    it('should include row number column in visibleLeafs when enabled', () => {
      const grid = getGridModel({ gridDef: { showRowNumber: true } });
      const visibleKeys = grid.columns.value.visibleLeafs.map((c) => c.key);

      expect(visibleKeys).toContain(ROW_NUMBER_CELL_KEY);
      expect(visibleKeys).toContain('firstName');
    });

    it('should include row selection column in visibleLeafs when enabled', () => {
      const grid = getGridModel({ gridDef: { rowSelection: true } });
      const visibleKeys = grid.columns.value.visibleLeafs.map((c) => c.key);

      expect(visibleKeys).toContain(ROW_SELECTION_CELL_KEY);
      expect(visibleKeys).toContain('firstName');
    });

    it('should include grouping column in visibleLeafs when grouping is active', () => {
      const grid = getGridModel();
      grid.toggleGrouping('firstName');

      const visibleKeys = grid.columns.value.visibleLeafs.map((c) => c.key);

      expect(visibleKeys).toContain(GROUPING_CELL_KEY);
    });
  });

  describe('hidden user columns scenario', () => {
    it('should have no visible columns when all user columns are hidden', () => {
      const grid = getGridModel();

      // Hide all user columns
      const firstNameCol = grid.columns.value.leafs.find((c) => c.key === 'firstName');
      const lastNameCol = grid.columns.value.leafs.find((c) => c.key === 'lastName');
      const ageCol = grid.columns.value.leafs.find((c) => c.key === 'age');

      firstNameCol?.toggleVisibility();
      lastNameCol?.toggleVisibility();
      ageCol?.toggleVisibility();

      const visibleKeys = grid.columns.value.visibleLeafs.map((c) => c.key);

      // Should be empty (no empty cell anymore with flexible sizing)
      expect(visibleKeys).toEqual([]);
      expect(grid.columns.value.visibleLeafs).toHaveLength(0);
    });

    it('should have only special columns when all user columns are hidden but special columns are enabled', () => {
      const grid = getGridModel({ gridDef: { showRowNumber: true, rowSelection: true } });

      // Hide all user columns
      const firstNameCol = grid.columns.value.leafs.find((c) => c.key === 'firstName');
      const lastNameCol = grid.columns.value.leafs.find((c) => c.key === 'lastName');
      const ageCol = grid.columns.value.leafs.find((c) => c.key === 'age');

      firstNameCol?.toggleVisibility();
      lastNameCol?.toggleVisibility();
      ageCol?.toggleVisibility();

      const visibleKeys = grid.columns.value.visibleLeafs.map((c) => c.key);

      expect(visibleKeys).toContain(ROW_NUMBER_CELL_KEY);
      expect(visibleKeys).toContain(ROW_SELECTION_CELL_KEY);
      expect(visibleKeys).not.toContain('firstName');
      expect(visibleKeys).not.toContain('lastName');
      expect(visibleKeys).not.toContain('age');
    });

    it('should correctly identify when no user columns are visible', () => {
      const grid = getGridModel();

      // Initially all user columns are visible
      const userColumns = grid.columns.value.visibleLeafs.filter(
        (c) => ![EMPTY_CELL_KEY, ROW_NUMBER_CELL_KEY, ROW_SELECTION_CELL_KEY, GROUPING_CELL_KEY].includes(c.key),
      );
      expect(userColumns.length).toBeGreaterThan(0);

      // Hide all user columns
      const firstNameCol = grid.columns.value.leafs.find((c) => c.key === 'firstName');
      const lastNameCol = grid.columns.value.leafs.find((c) => c.key === 'lastName');
      const ageCol = grid.columns.value.leafs.find((c) => c.key === 'age');

      firstNameCol?.toggleVisibility();
      lastNameCol?.toggleVisibility();
      ageCol?.toggleVisibility();

      const userColumnsAfterHiding = grid.columns.value.visibleLeafs.filter(
        (c) => ![EMPTY_CELL_KEY, ROW_NUMBER_CELL_KEY, ROW_SELECTION_CELL_KEY, GROUPING_CELL_KEY].includes(c.key),
      );

      expect(userColumnsAfterHiding).toHaveLength(0);
    });
  });

  describe('userVisibleLeafs property', () => {
    it('should expose userVisibleLeafs that excludes internal columns', () => {
      const grid = getGridModel({ gridDef: { showRowNumber: true, rowSelection: true } });

      expect(grid.columns.value.userVisibleLeafs).toHaveLength(3);
      expect(grid.columns.value.userVisibleLeafs.map((c) => c.key)).toEqual(['firstName', 'lastName', 'age']);
    });

    it('should return empty array when all user columns are hidden', () => {
      const grid = getGridModel();

      // Hide all user columns
      const firstNameCol = grid.columns.value.leafs.find((c) => c.key === 'firstName');
      const lastNameCol = grid.columns.value.leafs.find((c) => c.key === 'lastName');
      const ageCol = grid.columns.value.leafs.find((c) => c.key === 'age');

      firstNameCol?.toggleVisibility();
      lastNameCol?.toggleVisibility();
      ageCol?.toggleVisibility();

      expect(grid.columns.value.userVisibleLeafs).toHaveLength(0);
    });
  });
});
