import ColumnModel from './columnModel';
import GridModel from './gridModel';
import RowModel from './rowModel';

export default class CellModel<TRow> {
  constructor(
    public readonly grid: GridModel<TRow>,
    public readonly row: RowModel<TRow>,
    public readonly column: ColumnModel<TRow>,
  ) {}

  public get value() {
    if (this.column.isRowNumber) return this.row.rowIndex + 1;

    return this.row.data[this.column.key as keyof TRow];
  }

  public get expanded(): boolean {
    return this.row.expanded;
  }

  public get selected(): boolean {
    return this.row.selected;
  }

  /** Toggle this row's detail panel (used by the row-detail expand cell). */
  public toggleDetail = (): void => {
    this.grid.toggleDetailRow(this.row.key);
  };

  /** Toggle this row's selection (used by the row-selection checkbox cell). */
  public toggleSelection = (): void => {
    this.grid.toggleRowSelection(this.row.key);
  };
}
