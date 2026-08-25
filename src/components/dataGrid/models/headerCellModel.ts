import ArrayUtils from '../../../utils/array/arrayUtils';
import type { SortDirection } from '../contracts/dataGridContract';
import type ColumnModel from './columnModel';
import type GridModel from './gridModel';

/** All derived state for rendering a column's header cell and its context menu. */
export default class HeaderCellModel<TRow> {
  constructor(public readonly column: ColumnModel<TRow>) {}

  private get grid(): GridModel<TRow> {
    return this.column.grid;
  }

  // ========== Header cell ==========

  /** Header label. `null` for the row-number and selection cells (rendered specially). */
  public get label(): string | number | null {
    const c = this.column;
    if (c.isRowNumber || c.isRowSelection) return null;

    if (c.isGrouping) {
      if (this.grid.groupColumns.size === 1) {
        const groupedKey = this.grid.groupColumns.values().next().value!;
        const col = ArrayUtils.findOrThrow(this.grid.columns.value.leafs, (l) => l.key === groupedKey);
        return col.header ?? col.key;
      }
      return 'Group';
    }

    return c.header ?? c.key;
  }

  public get isSortable(): boolean {
    const c = this.column;
    return c.isLeaf && !c.isRowNumber && !c.isRowSelection && !c.isRowDetail && c.sortable;
  }

  public get isSorted(): boolean {
    return this.column.key === this.grid.sortColumn;
  }

  public get sortDirection(): SortDirection | undefined {
    return this.grid.sortDirection;
  }

  public get showResizer(): boolean {
    const c = this.column;
    return !c.isRowNumber && !c.isRowSelection && !c.isRowDetail && c.resizable;
  }

  public get showContextMenu(): boolean {
    const c = this.column;
    return !c.isRowNumber && !c.isRowSelection && !c.isRowDetail && c.showContextMenu;
  }

  /** Grid column span: a leaf occupies one column, a group header spans its leaf count. */
  public get gridColumn(): number {
    return this.column.isLeaf ? 1 : this.column.leafs.length;
  }

  public get paddingLeft(): number | undefined {
    if (this.column.isRowSelection) return undefined;
    return this.column.align === 'right' ? 10 : 3;
  }

  public get paddingRight(): number | undefined {
    if (this.column.isRowSelection) return undefined;
    return this.column.align === 'center' ? 3 : undefined;
  }

  /** Variant flags for the header cell. */
  public get variant() {
    const { isPinned, isFirstLeftPinned, isLastLeftPinned, isFirstRightPinned, isLastRightPinned } = this.column.pinFlags.value;
    return {
      isPinned,
      isFirstLeftPinned,
      isLastLeftPinned,
      isFirstRightPinned,
      isLastRightPinned,
      isSortable: this.isSortable,
      isRowNumber: this.column.isRowNumber,
      isFirstLeaf: this.column.isFirstLeaf,
      isLastLeaf: this.column.isLastLeaf,
    };
  }

  /** Variant flags for the context-menu trigger button. */
  public get contextMenuButtonVariant() {
    const { isPinned, isFirstLeftPinned, isLastLeftPinned, isFirstRightPinned, isLastRightPinned } = this.column.pinFlags.value;
    return {
      isPinned,
      isFirstLeftPinned,
      isLastLeftPinned,
      isFirstRightPinned,
      isLastRightPinned,
      isSortable: this.isSortable,
      isRowNumber: this.column.isRowNumber,
    };
  }

  // ========== Context menu availability ==========

  private get sections() {
    return this.column.contextMenuSections; // { sort, pin, group }
  }

  public get canSortAsc(): boolean {
    const { key } = this.column;
    return (
      this.sections.sort &&
      this.column.isLeaf &&
      this.column.sortable &&
      (this.grid.sortColumn !== key || this.grid.sortDirection === 'DESC')
    );
  }

  public get canSortDesc(): boolean {
    const { key } = this.column;
    return (
      this.sections.sort &&
      this.column.isLeaf &&
      this.column.sortable &&
      (this.grid.sortColumn !== key || this.grid.sortDirection === 'ASC')
    );
  }

  public get canClearSort(): boolean {
    return this.sections.sort && this.column.isLeaf && this.column.sortable && this.grid.sortColumn === this.column.key;
  }

  public get canPinLeft(): boolean {
    return this.sections.pin && this.column.pin !== 'LEFT';
  }

  public get canPinRight(): boolean {
    return this.sections.pin && this.column.pin !== 'RIGHT';
  }

  public get canUnpin(): boolean {
    return this.sections.pin && !!this.column.pin;
  }

  public get canGroupBy(): boolean {
    return this.sections.group && this.column.isLeaf && !this.column.isGrouping;
  }

  public get canUnGroupAll(): boolean {
    return this.sections.group && this.column.isLeaf && this.column.isGrouping;
  }

  public get hasSortSection(): boolean {
    return this.canSortAsc || this.canSortDesc || this.canClearSort;
  }

  public get hasPinSection(): boolean {
    return this.canPinLeft || this.canPinRight || this.canUnpin;
  }

  public get hasGroupSection(): boolean {
    return this.canGroupBy || this.canUnGroupAll;
  }
}
