import { Key } from '../contracts/dataGridContract';
import ColumnModel from './columnModel';
import GridModel from './gridModel';
import RowModel from './rowModel';

export default class GroupRowModel<TRow> {
  constructor(
    public readonly grid: GridModel<TRow>,
    public readonly groupColumn: ColumnModel<TRow>,
    public readonly rows: RowModel<TRow>[] | GroupRowModel<TRow>[],
    public readonly rowIndex: number,
    public readonly groupValue: Key,
  ) {
    rows.forEach((row) => (row.parentRow = this));
  }

  public get rowKey(): Key {
    return `${this.parentRow?.rowKey ?? ''}${this.groupColumn.key}${this.groupValue}`;
  }
  public parentRow?: GroupRowModel<TRow>;

  public get expanded() {
    return this.grid.expandedGroupRow[this.rowKey];
  }

  public get depth(): number {
    return this.parentRow ? this.parentRow.depth + 1 : 0;
  }

  public get count(): number {
    return this.rows.sumBy((row) => row.count, 0);
  }

  public get flatRows(): (RowModel<TRow> | GroupRowModel<TRow>)[] {
    if (this.expanded) {
      return [this, ...this.rows.flatMap((row) => row.flatRows)];
    }

    return [this];
  }

  public toggleRow() {
    this.grid.toggleGroupRow(this.rowKey);
  }
}
