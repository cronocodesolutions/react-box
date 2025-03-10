import ColumnModel from './columnModel';
import GridModel, { EMPTY_CELL_KEY, GROUPING_CELL_KEY, ROW_NUMBER_CELL_KEY, ROW_SELECTION_CELL_KEY } from './gridModel';
import GroupRowModel from './groupRowModel';

export default class GroupRowCellModel<TRow> {
  constructor(
    public readonly grid: GridModel<TRow>,
    public readonly row: GroupRowModel<TRow>,
    public readonly column: ColumnModel<TRow>,
  ) {}

  public get value(): React.ReactNode {
    if (this.column.key === ROW_NUMBER_CELL_KEY) return this.row.rowIndex + 1;
    if (this.column.key === GROUPING_CELL_KEY) return `> ${this.row.groupValue} (${this.row.count})`;

    return null;
  }
}
