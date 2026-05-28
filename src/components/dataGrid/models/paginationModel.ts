import { PaginationState } from '../contracts/dataGridContract';
import GridModel from './gridModel';

/**
 * Pagination concern: navigation state + derived row range for the bottom bar / pager.
 * The coupled mutations (page-reset on filter/sort, server-state events) live on GridModel;
 * this model owns the navigation behavior and derivations the UI needs.
 */
export default class PaginationModel<TRow> {
  constructor(public readonly grid: GridModel<TRow>) {}

  public get isPaginated(): boolean {
    return this.grid.isPaginated;
  }

  public get state(): PaginationState | undefined {
    return this.grid.paginationState;
  }

  public get pageSizeOptions(): number[] | undefined {
    return this.grid.pageSizeOptions;
  }

  public get page(): number {
    return this.grid.page;
  }

  public get pageSize(): number {
    return this.grid.pageSize;
  }

  public get totalPages(): number {
    return this.state?.totalPages ?? 1;
  }

  public get totalItems(): number {
    return this.state?.totalItems ?? 0;
  }

  public get canGoPrev(): boolean {
    return this.page > 1;
  }

  public get canGoNext(): boolean {
    return this.page < this.totalPages;
  }

  /** 1-based index of the first row on the current page. */
  public get startItem(): number {
    return (this.page - 1) * this.pageSize + 1;
  }

  /** 1-based index of the last row on the current page (clamped to totalItems). */
  public get endItem(): number {
    return Math.min(this.startItem + this.pageSize - 1, this.totalItems);
  }

  public changePage = (page: number): void => this.grid.changePage(page);
  public changePageSize = (size: number): void => this.grid.changePageSize(size);

  public firstPage = (): void => {
    if (this.canGoPrev) this.grid.changePage(1);
  };
  public prevPage = (): void => {
    if (this.canGoPrev) this.grid.changePage(this.page - 1);
  };
  public nextPage = (): void => {
    if (this.canGoNext) this.grid.changePage(this.page + 1);
  };
  public lastPage = (): void => {
    if (this.canGoNext) this.grid.changePage(this.totalPages);
  };

  /** Parse a raw page-jump input and navigate (clamped to [1, totalPages]); ignores non-numeric input. */
  public jumpToPage = (raw: string): void => {
    const n = parseInt(raw, 10);
    if (!isNaN(n)) {
      this.grid.changePage(Math.max(1, Math.min(n, this.totalPages)));
    }
  };
}
