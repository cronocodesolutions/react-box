import { describe, expect, it, vi } from 'vitest';
import { ignoreLogs } from '../../../../dev/tests';
import { DataGridProps, GridDefinition } from '../contracts/dataGridContract';
import GridModel from './gridModel';

interface Order {
  id: number;
  total: number;
}

const data: Order[] = Array.from({ length: 10 }, (_, i) => ({ id: i + 1, total: (i + 1) * 10 }));

const def: GridDefinition<Order> = {
  rowKey: 'id',
  columns: [{ key: 'total' }],
  pagination: { totalCount: 50 },
  visibleRowsCount: 10,
};

function getGrid(overrides?: Partial<DataGridProps<Order>>) {
  return new GridModel<Order>({ data, def, ...overrides });
}

describe('PaginationModel', () => {
  ignoreLogs();

  it('exposes derived navigation state', () => {
    const { pagination } = getGrid();
    expect(pagination.isPaginated).toBe(true);
    expect(pagination.page).toBe(1);
    expect(pagination.totalPages).toBe(5);
    expect(pagination.totalItems).toBe(50);
    expect(pagination.canGoPrev).toBe(false);
    expect(pagination.canGoNext).toBe(true);
  });

  describe('navigation', () => {
    it('nextPage / prevPage / firstPage / lastPage move within bounds', () => {
      const { pagination } = getGrid();

      pagination.nextPage();
      expect(pagination.page).toBe(2);

      pagination.prevPage();
      expect(pagination.page).toBe(1);

      pagination.prevPage(); // already first → no-op
      expect(pagination.page).toBe(1);

      pagination.lastPage();
      expect(pagination.page).toBe(5);

      pagination.nextPage(); // already last → no-op
      expect(pagination.page).toBe(5);

      pagination.firstPage();
      expect(pagination.page).toBe(1);
    });

    it('canGoPrev/canGoNext flip at the boundaries', () => {
      const { pagination } = getGrid();
      pagination.lastPage();
      expect(pagination.canGoPrev).toBe(true);
      expect(pagination.canGoNext).toBe(false);
    });
  });

  describe('jumpToPage', () => {
    it('navigates to a valid page', () => {
      const { pagination } = getGrid();
      pagination.jumpToPage('3');
      expect(pagination.page).toBe(3);
    });

    it('clamps out-of-range input', () => {
      const { pagination } = getGrid();
      pagination.jumpToPage('999');
      expect(pagination.page).toBe(5);
    });

    it('ignores non-numeric input', () => {
      const { pagination } = getGrid();
      pagination.jumpToPage('abc');
      expect(pagination.page).toBe(1);
    });
  });

  describe('row range', () => {
    it('computes startItem / endItem for the current page', () => {
      const { pagination } = getGrid();
      expect(pagination.startItem).toBe(1);
      expect(pagination.endItem).toBe(10);

      pagination.changePage(3);
      expect(pagination.startItem).toBe(21);
      expect(pagination.endItem).toBe(30);
    });

    it('clamps endItem on the last partial page', () => {
      const grid = getGrid({ def: { ...def, pagination: { totalCount: 45 } } });
      grid.pagination.lastPage();
      expect(grid.pagination.page).toBe(5);
      expect(grid.pagination.startItem).toBe(41);
      expect(grid.pagination.endItem).toBe(45);
    });
  });

  it('delegates page changes to the grid callback (controlled)', () => {
    const onPageChange = vi.fn();
    const { pagination } = getGrid({ page: 2, onPageChange });
    pagination.nextPage();
    expect(onPageChange).toHaveBeenCalledWith(3, 10);
  });
});
