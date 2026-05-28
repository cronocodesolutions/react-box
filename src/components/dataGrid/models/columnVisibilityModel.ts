import ColumnModel from './columnModel';
import GridModel from './gridModel';

export interface ColumnVisibilityEntry<TRow> {
  id: string;
  label: string;
  column: ColumnModel<TRow>;
  visible: boolean;
}

/**
 * Backs the top-bar column-visibility menu: the toggleable (user data) columns, which
 * are currently shown, and a diff-based bulk setter.
 */
export default class ColumnVisibilityModel<TRow> {
  constructor(public readonly grid: GridModel<TRow>) {}

  /** All user data leafs (visible and hidden) — excludes row-number/selection/detail/grouping. */
  public get entries(): ColumnVisibilityEntry<TRow>[] {
    return this.grid.columns.value.leafs
      .filter((c) => c.isData)
      .map((column) => ({
        id: String(column.key),
        label: String(column.header ?? column.key),
        column,
        visible: column.isVisible,
      }));
  }

  public get selectedIds(): string[] {
    return this.entries.filter((e) => e.visible).map((e) => e.id);
  }

  public get total(): number {
    return this.entries.length;
  }

  public get hiddenCount(): number {
    return this.entries.reduce((n, e) => (e.visible ? n : n + 1), 0);
  }

  public get hasHidden(): boolean {
    return this.hiddenCount > 0;
  }

  /** Make exactly the columns in `ids` visible, toggling only those whose state must change. */
  public setVisibility = (ids: string[]): void => {
    const next = new Set(ids);
    this.entries.forEach((entry) => {
      const shouldBeVisible = next.has(entry.id);
      if (entry.visible !== shouldBeVisible) {
        entry.column.toggleVisibility();
      }
    });
  };
}
