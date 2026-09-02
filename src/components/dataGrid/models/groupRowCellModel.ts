import ColumnModel from './columnModel';
import GridModel from './gridModel';
import GroupRowModel from './groupRowModel';

/**
 * How a cell participates in a group row's layout: `grouping` is the expand/label cell spanning the
 * grouped columns, `selection` the select-all cell, `spacer` a pinned or leading cell with its own value,
 * and `hidden` a data column absorbed into the grouping cell's span.
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

  // Group cells never participate in the expanded-leaf variant, so positional flags are constant.
  public get isExpanded(): boolean {
    return false;
  }

  public get isFirst(): boolean {
    return false;
  }

  public get isLast(): boolean {
    return false;
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

  public get isEndPinned(): boolean {
    return this.column.pin === 'END';
  }

  /** Grouping cell shows a right border only when the grouping column is left-pinned. */
  public get hasGroupingBorder(): boolean {
    return this.row.groupingColumn.pin === 'START';
  }
}
