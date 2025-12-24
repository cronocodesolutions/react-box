import { describe, expect, it, vi } from 'vitest';
import { DataGridProps } from '../contracts/dataGridContract';
import GridModel from './gridModel';

interface TestRow {
  id: number;
  name: string;
  email: string;
  age: number;
  country: string;
}

const createTestData = (): TestRow[] => [
  { id: 1, name: 'John Doe', email: 'john@example.com', age: 30, country: 'USA' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25, country: 'UK' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 35, country: 'USA' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', age: 28, country: 'Canada' },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', age: 32, country: 'UK' },
];

const createGridModel = (props?: Partial<DataGridProps<TestRow>>): GridModel<TestRow> => {
  const defaultProps: DataGridProps<TestRow> = {
    data: createTestData(),
    def: {
      columns: [
        { key: 'name', header: 'Name', filterable: true },
        { key: 'email', header: 'Email', filterable: { type: 'text' } },
        { key: 'age', header: 'Age', filterable: { type: 'number' } },
        { key: 'country', header: 'Country', filterable: { type: 'multiselect' } },
      ],
      globalFilter: true,
    },
    ...props,
  };

  return new GridModel(defaultProps, vi.fn());
};

describe('GridModel Filtering', () => {
  describe('Global Filter', () => {
    it('should filter data using fuzzy search', () => {
      const grid = createGridModel();

      grid.setGlobalFilter('john');
      expect(grid.filteredData).toHaveLength(2); // John Doe and Bob Johnson
    });

    it('should be case-insensitive', () => {
      const grid = createGridModel();

      grid.setGlobalFilter('JOHN');
      expect(grid.filteredData).toHaveLength(2);
    });

    it('should match partial strings', () => {
      const grid = createGridModel();

      grid.setGlobalFilter('joh');
      expect(grid.filteredData).toHaveLength(2);
    });

    it('should return all data when filter is empty', () => {
      const grid = createGridModel();

      grid.setGlobalFilter('');
      expect(grid.filteredData).toHaveLength(5);
    });

    it('should respect globalFilterKeys', () => {
      const grid = createGridModel({
        def: {
          columns: [
            { key: 'name', header: 'Name' },
            { key: 'email', header: 'Email' },
          ],
          globalFilter: true,
          globalFilterKeys: ['name'],
        },
      });

      // Should match name but not email
      grid.setGlobalFilter('example');
      expect(grid.filteredData).toHaveLength(0);

      grid.setGlobalFilter('john');
      expect(grid.filteredData).toHaveLength(2);
    });

    it('should call onGlobalFilterChange when provided', () => {
      const onGlobalFilterChange = vi.fn();
      const grid = createGridModel({ onGlobalFilterChange });

      grid.setGlobalFilter('test');
      expect(onGlobalFilterChange).toHaveBeenCalledWith('test');
    });
  });

  describe('Column Filters - Text', () => {
    it('should filter by text column with fuzzy search', () => {
      const grid = createGridModel();

      grid.setColumnFilter('name', { type: 'text', value: 'alice' });
      expect(grid.filteredData).toHaveLength(1);
      expect(grid.filteredData[0].name).toBe('Alice Brown');
    });

    it('should clear filter when value is empty', () => {
      const grid = createGridModel();

      grid.setColumnFilter('name', { type: 'text', value: '' });
      expect(grid.filteredData).toHaveLength(5);
    });
  });

  describe('Column Filters - Number', () => {
    it('should filter with equals operator', () => {
      const grid = createGridModel();

      grid.setColumnFilter('age', { type: 'number', operator: 'eq', value: 30 });
      expect(grid.filteredData).toHaveLength(1);
      expect(grid.filteredData[0].name).toBe('John Doe');
    });

    it('should filter with not equals operator', () => {
      const grid = createGridModel();

      grid.setColumnFilter('age', { type: 'number', operator: 'ne', value: 30 });
      expect(grid.filteredData).toHaveLength(4);
    });

    it('should filter with greater than operator', () => {
      const grid = createGridModel();

      grid.setColumnFilter('age', { type: 'number', operator: 'gt', value: 30 });
      expect(grid.filteredData).toHaveLength(2);
    });

    it('should filter with greater than or equals operator', () => {
      const grid = createGridModel();

      grid.setColumnFilter('age', { type: 'number', operator: 'gte', value: 30 });
      expect(grid.filteredData).toHaveLength(3);
    });

    it('should filter with less than operator', () => {
      const grid = createGridModel();

      grid.setColumnFilter('age', { type: 'number', operator: 'lt', value: 30 });
      expect(grid.filteredData).toHaveLength(2);
    });

    it('should filter with less than or equals operator', () => {
      const grid = createGridModel();

      grid.setColumnFilter('age', { type: 'number', operator: 'lte', value: 30 });
      expect(grid.filteredData).toHaveLength(3);
    });

    it('should filter with between operator', () => {
      const grid = createGridModel();

      grid.setColumnFilter('age', { type: 'number', operator: 'between', value: 25, valueTo: 30 });
      expect(grid.filteredData).toHaveLength(3);
    });
  });

  describe('Column Filters - Multiselect', () => {
    it('should filter by selected values', () => {
      const grid = createGridModel();

      grid.setColumnFilter('country', { type: 'multiselect', values: ['USA'] });
      expect(grid.filteredData).toHaveLength(2);
    });

    it('should filter by multiple selected values', () => {
      const grid = createGridModel();

      grid.setColumnFilter('country', { type: 'multiselect', values: ['USA', 'UK'] });
      expect(grid.filteredData).toHaveLength(4);
    });

    it('should return all when no values selected', () => {
      const grid = createGridModel();

      grid.setColumnFilter('country', { type: 'multiselect', values: [] });
      expect(grid.filteredData).toHaveLength(5);
    });
  });

  describe('Combined Filters', () => {
    it('should apply global and column filters together', () => {
      const grid = createGridModel();

      grid.setGlobalFilter('john');
      grid.setColumnFilter('country', { type: 'multiselect', values: ['USA'] });

      // John Doe and Bob Johnson match "john", but only both are in USA
      expect(grid.filteredData).toHaveLength(2);
    });

    it('should apply multiple column filters together', () => {
      const grid = createGridModel();

      grid.setColumnFilter('country', { type: 'multiselect', values: ['USA', 'UK'] });
      grid.setColumnFilter('age', { type: 'number', operator: 'gte', value: 30 });

      expect(grid.filteredData).toHaveLength(3);
    });
  });

  describe('Filter State', () => {
    it('should track hasActiveFilters', () => {
      const grid = createGridModel();

      expect(grid.hasActiveFilters).toBe(false);

      grid.setGlobalFilter('test');
      expect(grid.hasActiveFilters).toBe(true);

      grid.setGlobalFilter('');
      expect(grid.hasActiveFilters).toBe(false);

      grid.setColumnFilter('name', { type: 'text', value: 'test' });
      expect(grid.hasActiveFilters).toBe(true);
    });

    it('should clear all filters', () => {
      const grid = createGridModel();

      grid.setGlobalFilter('test');
      grid.setColumnFilter('name', { type: 'text', value: 'test' });

      grid.clearAllFilters();

      expect(grid.globalFilterValue).toBe('');
      expect(grid.columnFilters).toEqual({});
      expect(grid.hasActiveFilters).toBe(false);
    });

    it('should clear column filters only', () => {
      const grid = createGridModel();

      grid.setGlobalFilter('test');
      grid.setColumnFilter('name', { type: 'text', value: 'test' });

      grid.clearColumnFilters();

      expect(grid.globalFilterValue).toBe('test');
      expect(grid.columnFilters).toEqual({});
    });

    it('should report filter stats', () => {
      const grid = createGridModel();

      expect(grid.filterStats).toEqual({ filtered: 5, total: 5 });

      grid.setGlobalFilter('john');
      expect(grid.filterStats).toEqual({ filtered: 2, total: 5 });
    });
  });

  describe('Unique Values', () => {
    it('should get unique values for a column', () => {
      const grid = createGridModel();

      const uniqueCountries = grid.getColumnUniqueValues('country');
      expect(uniqueCountries).toEqual(['Canada', 'UK', 'USA']);
    });

    it('should sort unique values', () => {
      const grid = createGridModel();

      const uniqueAges = grid.getColumnUniqueValues('age');
      expect(uniqueAges).toEqual([25, 28, 30, 32, 35]);
    });
  });
});
