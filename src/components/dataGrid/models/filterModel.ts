import { ColumnFilters } from '../contracts/dataGridContract';
import GridModel from './gridModel';

/**
 * Filtering concern: grid-level filter state + the derived flags the UI needs. Per-column
 * filter config/value/parse helpers live on ColumnModel; the coupled mutations (page-reset,
 * server-state events, filteredData) live on GridModel.
 */
export default class FilterModel<TRow> {
  constructor(public readonly grid: GridModel<TRow>) {}

  public get globalFilterValue(): string {
    return this.grid.globalFilterValue;
  }

  public get columnFilters(): ColumnFilters<TRow> {
    return this.grid.columnFilters;
  }

  public get hasActiveFilters(): boolean {
    return this.grid.hasActiveFilters;
  }

  public get filterStats(): { filtered: number; total: number } {
    return this.grid.filterStats;
  }

  /** Whether any visible column is filterable (controls the filter row's visibility). */
  public get hasFilterableColumns(): boolean {
    return this.grid.columns.value.visibleLeafs.some((c) => !!c.filterable);
  }

  public setGlobalFilter = (value: string): void => this.grid.setGlobalFilter(value);
  public clearAllFilters = (): void => this.grid.clearAllFilters();
}
