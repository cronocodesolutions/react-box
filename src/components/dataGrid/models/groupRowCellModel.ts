import ColumnModel from './columnModel';
import GridModel from './gridModel';
import GroupRowModel from './groupRowModel';

/**
 * How a cell participates in a group row's layout:
 * - `grouping`  — the expand/label cell (spans the grouped data columns)
 * - `selection` — the select-all checkbox cell
 * - `spacer`    — a leading/other-pinned cell rendered with its own value (row number, detail, opposite pin)
 * - `hidden`    — a data column on the grouping side, absorbed into the grouping cell's column span
 */
export type GroupRowCellKind = 'grouping' | 'selection' | 'spacer' | 'hidden';

export default class GroupRowCellModel<TRow> {
  constructor(
    public readonly grid: GridModel<TRow>,
    public readonly row: GroupRowModel<TRow>,
    public readonly column: ColumnModel<TRow>,
  ) {}

  public get value(): string | number | null {
    if (this.column.isRowNumber) return this.row.rowIndex + 1;
    if (this.column.isGrouping) return `${this.row.groupValue} (${this.row.count})`;

    return null;
  }

  public get cellKind(): GroupRowCellKind {
    if (this.column.isGrouping) return 'grouping';
    if (this.column.isRowSelection) return 'selection';

    const { groupingColumn } = this.row;
    if (this.column.pin !== groupingColumn.pin || this.column.isRowNumber || this.column.isRowDetail) {
      return 'spacer';
    }

    return 'hidden';
  }

  // ========== Grouping-cell layout ==========

  public get depthPadding(): number {
    return 4 * this.row.depth;
  }

  public get gridColumnSpan(): number {
    return this.row.groupingColumnGridColumn;
  }

  public get widthVar(): string {
    return `var(${this.column.groupColumnWidthVarName})`;
  }

  public get isRightPinned(): boolean {
    return this.column.pin === 'RIGHT';
  }

  /** Grouping cell shows a right border only when the grouping column is left-pinned. */
  public get hasGroupingBorder(): boolean {
    return this.row.groupingColumn.pin === 'LEFT';
  }
}
