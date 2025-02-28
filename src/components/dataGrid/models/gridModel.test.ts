import { describe, expect, it, suite } from 'vitest';
import GridModel from './gridModel';

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

describe('DataGridHelper', () => {
  //
  it('creates header Columns', () => {
    const grid = new GridModel<Person>(
      {
        def: {
          columns: [
            {
              key: 'firstName',
            },
          ],
        },
        data: [],
      },
      () => {},
    );

    expect(grid.flatColumns.value).to.length(2);
  });

  suite('when pin columns', () => {
    it('calculates correct left distance', () => {
      const grid = new GridModel<Person>(
        {
          def: {
            columns: [
              {
                key: 'employee',
                columns: [
                  { key: 'age', columns: [{ key: 'month' }, { key: 'year' }] },
                  { key: 'name', columns: [{ key: 'firstName' }, { key: 'lastName' }] },
                ],
              },
              {
                key: 'status',
              },
            ],
          },
          data: [],
        },
        () => {},
      );

      const yearColumn = grid.flatColumns.value.findOrThrow((c) => c.key === 'year');
      const firstNameColumn = grid.flatColumns.value.findOrThrow((c) => c.key === 'firstName');

      expect(yearColumn.left).to.eq(200);
      expect(firstNameColumn.left).to.eq(400);
    });

    it('calculates correct right distance', () => {
      const grid = new GridModel<Person>(
        {
          def: {
            columns: [
              {
                key: 'employee',
                columns: [
                  { key: 'age', columns: [{ key: 'month' }, { key: 'year' }] },
                  { key: 'name', columns: [{ key: 'firstName' }, { key: 'lastName' }] },
                ],
              },
              {
                key: 'status',
              },
            ],
          },
          data: [],
        },
        () => {},
      );

      const firstNameColumn = grid.flatColumns.value.findOrThrow((c) => c.key === 'firstName');
      const monthColumn = grid.flatColumns.value.findOrThrow((c) => c.key === 'month');

      expect(firstNameColumn.right).to.eq(grid.DEFAULT_COLUMN_WIDTH_PX * 1); // lastName
      expect(monthColumn.right).to.eq(grid.DEFAULT_COLUMN_WIDTH_PX * 3); // year, firstName, lastName
    });
  });
});
