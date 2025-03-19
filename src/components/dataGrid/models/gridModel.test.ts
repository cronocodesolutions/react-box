import { beforeEach, describe, expect, it, suite } from 'vitest';
import GridModel from './gridModel';
import { ColumnType, GridDefinition } from '../contracts/dataGridContract';

interface Person {
  firstName: string;
  lastName: string;
  age: number;
  day: number;
  month: number;
  year: number;
  visits: number;
  status: string;
  progress: number;
}

describe('GridModel', () => {
  let gridDefinition: GridDefinition<Person> = {
    columns: [
      {
        key: 'employee',
        columns: [
          { key: 'age', columns: [{ key: 'day' }, { key: 'month' }, { key: 'year' }] },
          { key: 'name', columns: [{ key: 'firstName' }, { key: 'lastName' }] },
        ],
      },
      {
        key: 'visits',
      },
      {
        key: 'status',
      },
      {
        key: 'progress',
      },
    ],
  };

  function getGridModel(props?: { columns?: ColumnType<Person>[]; data?: Partial<Person>[] }) {
    const { columns, data } = props ?? {};

    let def = { ...gridDefinition };
    columns && (def = { ...def, columns });

    return new GridModel<Person>(
      {
        def,
        data: (data ?? []) as Person[],
      },
      () => {},
    );
  }

  suite('simple usage', () => {
    it('creates header Columns', () => {
      const grid = getGridModel({ columns: [{ key: 'firstName' }] });

      expect(grid.headerRows.value).to.length(1);
      expect(grid.headerRows.value.at(0)).to.length(4);
    });

    it('creates no rows when no data', () => {
      const grid = getGridModel({ columns: [{ key: 'firstName' }] });

      expect(grid.rows.value).to.length(0);
    });

    it('creates row model for each data item', () => {
      const data: Partial<Person>[] = [
        { firstName: 'John' },
        { firstName: 'John1' },
        { firstName: 'John2' },
        { firstName: 'John3' },
        { firstName: 'John4' },
      ];
      const grid = getGridModel({ columns: [{ key: 'firstName' }], data });

      expect(grid.rows.value).to.length(5);
    });
  });

  suite('when pin columns', () => {
    it('calculates correct left distance', () => {
      const grid = getGridModel();

      const yearColumn = grid.columns.value.flat.findOrThrow((c) => c.key === 'year');
      const firstNameColumn = grid.columns.value.flat.findOrThrow((c) => c.key === 'firstName');

      expect(yearColumn.left).to.eq(400);
      expect(firstNameColumn.left).to.eq(600);
    });

    it('calculates correct right distance', () => {
      const grid = getGridModel();

      const firstNameColumn = grid.columns.value.flat.findOrThrow((c) => c.key === 'firstName');
      const monthColumn = grid.columns.value.flat.findOrThrow((c) => c.key === 'month');

      expect(firstNameColumn.right).to.eq(grid.DEFAULT_COLUMN_WIDTH_PX * 1); // lastName
      expect(monthColumn.right).to.eq(grid.DEFAULT_COLUMN_WIDTH_PX * 3); // year, firstName, lastName
    });

    it('moves parent header to the right pin position', () => {
      const grid = getGridModel({ columns: [{ key: 'parent', columns: [{ key: 'firstName' }] }] });
      grid.pinColumn('firstName', 'LEFT');

      const parentColumns = grid.columns.value.flat.filter((c) => c.key === 'parent');
      expect(parentColumns).to.have.length(1);
    });

    it('moves parent header to the right pin position', () => {
      const grid = getGridModel({ columns: [{ key: 'parent', columns: [{ key: 'firstName' }] }] });

      grid.pinColumn('parent', 'LEFT');
      grid.pinColumn('firstNameLEFT');

      const parentColumn = grid.columns.value.flat.findOrThrow((c) => c.key === 'parent');
      expect(parentColumn.pin).to.be.undefined;

      const parentColumns = grid.columns.value.flat.filter((c) => c.key === 'parent');
      expect(parentColumns).to.have.length(1);
    });
  });
});
