import { describe, expect, it, suite } from 'vitest';
import { DataGridHelper } from './dataGridHelper';

describe('DataGridHelper', () => {
  //
  it('creates header Columns', () => {
    const helper = new DataGridHelper(
      {
        def: {
          columns: [
            {
              key: 'firstName',
            },
          ],
        },
      },
      [],
      [],
      {},
    );

    expect(helper.headerColumns).to.length(2);
  });

  suite('when pin columns', () => {
    it('calculates correct left distance', () => {
      const helper = new DataGridHelper(
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
        },
        ['year', 'firstName'],
        [],
        {},
      );

      const yearColumn = helper.headerColumns.findOrThrow((c) => c.key === 'year');
      const firstNameColumn = helper.headerColumns.findOrThrow((c) => c.key === 'firstName');

      expect(yearColumn.left).to.eq(0);
      expect(firstNameColumn.left).to.eq(160);
    });

    it('calculates correct right distance', () => {
      const helper = new DataGridHelper(
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
        },
        [],
        ['month', 'firstName'],
        {},
      );

      const firstNameColumn = helper.headerColumns.findOrThrow((c) => c.key === 'firstName');
      const monthColumn = helper.headerColumns.findOrThrow((c) => c.key === 'month');

      expect(firstNameColumn.right).to.eq(0);
      expect(monthColumn.right).to.eq(160);
    });
  });
});
