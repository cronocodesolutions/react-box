import { describe, expect, it, suite } from 'vitest';
import GridModel from './gridModel';
import GroupRowModel from './groupRowModel';
import RowModel from './rowModel';
import { ignoreLogs } from '../../../../dev/tests';
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

const testData: Person[] = [
  { firstName: 'John', lastName: 'Doe', age: 20, day: 3, month: 5, year: 2000, visits: 23, status: 'OK', progress: 2 },
  { firstName: 'Joe', lastName: 'Smith', age: 22, day: 24, month: 11, year: 2002, visits: 3, status: 'Fail', progress: 4 },
];

describe('GridModel', () => {
  ignoreLogs();

  const gridDefinition: GridDefinition<Person> = {
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
        data: (data ?? testData) as Person[],
      },
      () => {},
    );
  }

  suite('simple usage', () => {
    it('creates header Columns', () => {
      const grid = getGridModel({ columns: [{ key: 'firstName' }] });

      expect(grid.headerRows.value).toHaveLength(1);
      expect(grid.headerRows.value.at(0)).toHaveLength(2);
    });

    it('creates no rows when no data', () => {
      const grid = getGridModel({ columns: [{ key: 'firstName' }], data: [] });

      expect(grid.rows.value).toHaveLength(0);
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

      expect(grid.rows.value).toHaveLength(5);
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
      expect(parentColumns).toHaveLength(1);
    });

    it('moves parent header to the right pin position', () => {
      const grid = getGridModel({ columns: [{ key: 'parent', columns: [{ key: 'firstName' }] }] });

      grid.pinColumn('parent', 'LEFT');
      grid.pinColumn('firstNameLEFT');

      const parentColumn = grid.columns.value.flat.findOrThrow((c) => c.key === 'parent');
      expect(parentColumn.pin).toBeUndefined();

      const parentColumns = grid.columns.value.flat.filter((c) => c.key === 'parent');
      expect(parentColumns).toHaveLength(1);
    });
  });

  suite('when group by column', () => {
    const data: Partial<Person>[] = [
      { firstName: 'John', day: 20, month: 3 },
      { firstName: 'John1', day: 20, month: 3 },
      { firstName: 'John2', day: 20, month: 4 },
      { firstName: 'John3', day: 21, month: 5 },
      { firstName: 'John4', day: 21, month: 6 },
    ];

    it('groups data by day', () => {
      const grid = getGridModel({ data });

      grid.toggleGrouping('day');

      expect(grid.flatRows.value).toHaveLength(2);
      expect(grid.flatRows.value.at(0) instanceof GroupRowModel).toBeTruthy();
      expect((grid.flatRows.value.at(0) as GroupRowModel<Person>).rows).toHaveLength(3);

      expect(grid.flatRows.value.at(1) instanceof GroupRowModel).toBeTruthy();
      expect((grid.flatRows.value.at(1) as GroupRowModel<Person>).rows).toHaveLength(2);
    });

    it('groups data by day and expand', () => {
      const grid = getGridModel({ data });

      grid.toggleGrouping('day');
      grid.toggleGroupRow(grid.rows.value[0].key);

      expect(grid.flatRows.value).toHaveLength(5);
      expect(grid.flatRows.value.at(0) instanceof GroupRowModel).toBeTruthy();
      expect(grid.flatRows.value.at(1) instanceof RowModel).toBeTruthy();
      expect(grid.flatRows.value.at(2) instanceof RowModel).toBeTruthy();
      expect(grid.flatRows.value.at(3) instanceof RowModel).toBeTruthy();
      expect(grid.flatRows.value.at(4) instanceof GroupRowModel).toBeTruthy();
    });

    it('groups data by day and month', () => {
      const grid = getGridModel({ data });

      grid.toggleGrouping('day');
      grid.toggleGrouping('month');

      expect(grid.rows.value).toHaveLength(2);

      expect(grid.rows.value.at(0) instanceof GroupRowModel).toBeTruthy();
      expect((grid.rows.value.at(0) as GroupRowModel<Person>).rows).toHaveLength(2);
      expect((grid.rows.value.at(0) as GroupRowModel<Person>).rows.at(0) instanceof GroupRowModel).toBeTruthy();
      expect(((grid.rows.value.at(0) as GroupRowModel<Person>).rows.at(0) as GroupRowModel<Person>).rows).toHaveLength(2);
      expect((grid.rows.value.at(0) as GroupRowModel<Person>).rows.at(1) instanceof GroupRowModel).toBeTruthy();
      expect(((grid.rows.value.at(0) as GroupRowModel<Person>).rows.at(1) as GroupRowModel<Person>).rows).toHaveLength(1);

      expect(grid.rows.value.at(1) instanceof GroupRowModel).toBeTruthy();
      expect((grid.rows.value.at(1) as GroupRowModel<Person>).rows).toHaveLength(2);
      expect((grid.rows.value.at(1) as GroupRowModel<Person>).rows.at(0) instanceof GroupRowModel).toBeTruthy();
      expect(((grid.rows.value.at(1) as GroupRowModel<Person>).rows.at(0) as GroupRowModel<Person>).rows).toHaveLength(1);
      expect((grid.rows.value.at(1) as GroupRowModel<Person>).rows.at(1) instanceof GroupRowModel).toBeTruthy();
      expect(((grid.rows.value.at(1) as GroupRowModel<Person>).rows.at(1) as GroupRowModel<Person>).rows).toHaveLength(1);
    });
  });

  suite('when sort column', () => {
    it('sets the sort column', () => {
      const grid = getGridModel();

      grid.setSortColumn('firstName');

      expect(grid.sortColumn).toEqual('firstName');
      expect(grid.sortDirection).toEqual('ASC');
    });

    it('changes sort direction', () => {
      const grid = getGridModel();

      grid.setSortColumn('firstName');
      grid.setSortColumn('firstName');

      expect(grid.sortColumn).toEqual('firstName');
      expect(grid.sortDirection).toEqual('DESC');
    });

    it('clears sort column', () => {
      const grid = getGridModel();

      grid.setSortColumn('firstName');
      grid.setSortColumn('firstName');
      grid.setSortColumn('firstName');

      expect(grid.sortColumn).toBeUndefined();
    });

    it('sets the sort column and sort direction', () => {
      const grid = getGridModel();

      grid.setSortColumn('firstName', 'ASC');
      expect(grid.sortColumn).toEqual('firstName');
      expect(grid.sortDirection).toEqual('ASC');

      grid.setSortColumn('firstName', 'ASC');
      expect(grid.sortColumn).toEqual('firstName');
      expect(grid.sortDirection).toEqual('ASC');

      grid.setSortColumn('firstName', 'DESC');
      expect(grid.sortColumn).toEqual('firstName');
      expect(grid.sortDirection).toEqual('DESC');

      grid.setSortColumn('age', 'DESC');
      expect(grid.sortColumn).toEqual('age');
      expect(grid.sortDirection).toEqual('DESC');

      grid.setSortColumn('firstName', undefined);
      expect(grid.sortColumn).toBeUndefined();
      expect(grid.sortDirection).toBeUndefined();
    });
  });
});
