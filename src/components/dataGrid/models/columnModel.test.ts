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

  describe('sortable', () => {
    it('defaults to true when no flags are set', () => {
      const grid = new GridModel<Person>({ data, def: { columns: [{ key: 'firstName' }] } }, () => {});
      const col = grid.columns.value.leafs.findOrThrow((c) => c.key === 'firstName');
      expect(col.sortable).toBe(true);
    });

    it('respects global sortable: false', () => {
      const grid = new GridModel<Person>({ data, def: { columns: [{ key: 'firstName' }], sortable: false } }, () => {});
      const col = grid.columns.value.leafs.findOrThrow((c) => c.key === 'firstName');
      expect(col.sortable).toBe(false);
    });

    it('column-level sortable: true overrides global sortable: false', () => {
      const grid = new GridModel<Person>({ data, def: { columns: [{ key: 'firstName', sortable: true }], sortable: false } }, () => {});
      const col = grid.columns.value.leafs.findOrThrow((c) => c.key === 'firstName');
      expect(col.sortable).toBe(true);
    });

    it('column-level sortable: false overrides global sortable: true', () => {
      const grid = new GridModel<Person>({ data, def: { columns: [{ key: 'firstName', sortable: false }], sortable: true } }, () => {});
      const col = grid.columns.value.leafs.findOrThrow((c) => c.key === 'firstName');
      expect(col.sortable).toBe(false);
    });

    it('column-level sortable: false works when global is undefined', () => {
      const grid = new GridModel<Person>({ data, def: { columns: [{ key: 'firstName', sortable: false }] } }, () => {});
      const col = grid.columns.value.leafs.findOrThrow((c) => c.key === 'firstName');
      expect(col.sortable).toBe(false);
    });
  });

  describe('resizable', () => {
    it('defaults to true when no flags are set', () => {
      const grid = new GridModel<Person>({ data, def: { columns: [{ key: 'firstName' }] } }, () => {});
      const col = grid.columns.value.leafs.findOrThrow((c) => c.key === 'firstName');
      expect(col.resizable).toBe(true);
    });

    it('respects global resizable: false', () => {
      const grid = new GridModel<Person>({ data, def: { columns: [{ key: 'firstName' }], resizable: false } }, () => {});
      const col = grid.columns.value.leafs.findOrThrow((c) => c.key === 'firstName');
      expect(col.resizable).toBe(false);
    });

    it('column-level resizable: true overrides global resizable: false', () => {
      const grid = new GridModel<Person>({ data, def: { columns: [{ key: 'firstName', resizable: true }], resizable: false } }, () => {});
      const col = grid.columns.value.leafs.findOrThrow((c) => c.key === 'firstName');
      expect(col.resizable).toBe(true);
    });

    it('column-level resizable: false overrides global resizable: true', () => {
      const grid = new GridModel<Person>({ data, def: { columns: [{ key: 'firstName', resizable: false }], resizable: true } }, () => {});
      const col = grid.columns.value.leafs.findOrThrow((c) => c.key === 'firstName');
      expect(col.resizable).toBe(false);
    });

    it('column-level resizable: false works when global is undefined', () => {
      const grid = new GridModel<Person>({ data, def: { columns: [{ key: 'firstName', resizable: false }] } }, () => {});
      const col = grid.columns.value.leafs.findOrThrow((c) => c.key === 'firstName');
      expect(col.resizable).toBe(false);
    });
  });

  describe('flexible', () => {
    it('isFlexible defaults to true when flexible is undefined', () => {
      const grid = new GridModel<Person>({ data, def: { columns: [{ key: 'firstName' }] } }, () => {});
      const col = grid.columns.value.leafs.findOrThrow((c) => c.key === 'firstName');
      expect(col.isFlexible).toBe(true);
    });

    it('isFlexible returns false when flexible: false', () => {
      const grid = new GridModel<Person>({ data, def: { columns: [{ key: 'firstName', flexible: false }] } }, () => {});
      const col = grid.columns.value.leafs.findOrThrow((c) => c.key === 'firstName');
      expect(col.isFlexible).toBe(false);
    });

    it('isFlexible returns true when flexible: true', () => {
      const grid = new GridModel<Person>({ data, def: { columns: [{ key: 'firstName', flexible: true }] } }, () => {});
      const col = grid.columns.value.leafs.findOrThrow((c) => c.key === 'firstName');
      expect(col.isFlexible).toBe(true);
    });

    it('baseWidth returns the column base width', () => {
      const grid = new GridModel<Person>({ data, def: { columns: [{ key: 'firstName', width: 150 }] } }, () => {});
      const col = grid.columns.value.leafs.findOrThrow((c) => c.key === 'firstName');
      expect(col.baseWidth).toBe(150);
    });

    it('baseWidth returns DEFAULT_COLUMN_WIDTH_PX when no width specified', () => {
      const grid = new GridModel<Person>({ data, def: { columns: [{ key: 'firstName' }] } }, () => {});
      const col = grid.columns.value.leafs.findOrThrow((c) => c.key === 'firstName');
      expect(col.baseWidth).toBe(grid.DEFAULT_COLUMN_WIDTH_PX);
    });
  });

  describe('flexWidths calculation', () => {
    it('returns empty object when container width is 0', () => {
      const grid = new GridModel<Person>({ data, def: { columns: [{ key: 'firstName' }] } }, () => {});
      expect(grid.flexWidths.value).toEqual({});
    });

    it('distributes space proportionally based on base widths', () => {
      const grid = new GridModel<Person>(
        {
          data,
          def: {
            columns: [
              { key: 'firstName', width: 100 },
              { key: 'lastName', width: 200 },
            ],
          },
        },
        () => {},
      );

      grid.setContainerWidth(600);

      // Total base: 300, available: 600
      // firstName: 100/300 * 600 = 200
      // lastName: 200/300 * 600 = 400
      const flexWidths = grid.flexWidths.value;
      expect(flexWidths['firstName']).toBe(200);
      expect(flexWidths['lastName']).toBe(400);
    });

    it('fixed columns (flexible: false) do not participate in flex', () => {
      const grid = new GridModel<Person>(
        {
          data,
          def: {
            columns: [
              { key: 'firstName', width: 100, flexible: false },
              { key: 'lastName', width: 100 },
            ],
          },
        },
        () => {},
      );

      grid.setContainerWidth(400);

      // firstName is fixed at 100, lastName gets remaining 300
      const flexWidths = grid.flexWidths.value;
      expect(flexWidths['firstName']).toBeUndefined();
      expect(flexWidths['lastName']).toBe(300);
    });

    it('uses base widths when container is smaller than total base widths', () => {
      const grid = new GridModel<Person>(
        {
          data,
          def: {
            columns: [
              { key: 'firstName', width: 200 },
              { key: 'lastName', width: 200 },
            ],
          },
        },
        () => {},
      );

      grid.setContainerWidth(300); // Less than total base (400)

      const flexWidths = grid.flexWidths.value;
      expect(flexWidths['firstName']).toBe(200);
      expect(flexWidths['lastName']).toBe(200);
    });

    it('inlineWidth uses flex width when available', () => {
      const grid = new GridModel<Person>(
        {
          data,
          def: {
            columns: [
              { key: 'firstName', width: 100 },
              { key: 'lastName', width: 100 },
            ],
          },
        },
        () => {},
      );

      grid.setContainerWidth(400);

      const firstName = grid.columns.value.leafs.findOrThrow((c) => c.key === 'firstName');
      const lastName = grid.columns.value.leafs.findOrThrow((c) => c.key === 'lastName');

      // Both should get 200 (400 / 2)
      expect(firstName.inlineWidth).toBe(200);
      expect(lastName.inlineWidth).toBe(200);
    });
  });
});
