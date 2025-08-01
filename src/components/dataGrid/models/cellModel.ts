import ColumnModel from './columnModel';
import GridModel, { ROW_NUMBER_CELL_KEY } from './gridModel';
import RowModel from './rowModel';

export default class CellModel<TRow> {
  constructor(
    public readonly grid: GridModel<TRow>,
    public readonly row: RowModel<TRow>,
    public readonly column: ColumnModel<TRow>,
  ) {}

  public get value() {
    if (this.column.key === ROW_NUMBER_CELL_KEY) return this.row.rowIndex + 1;

    return this.row.data[this.column.key as keyof TRow];
  }
}
