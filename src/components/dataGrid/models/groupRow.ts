import { Key } from '../dataGridContract';
import Column from './column';
import Grid from './grid';
import Row from './row';

export default class GroupRow<TRow> {
  constructor(
    public readonly grid: Grid<TRow>,
    public readonly groupColumn: Column<TRow>,
    public readonly rows: Row<TRow>[] | GroupRow<TRow>[],
    public readonly rowIndex: number,
    public readonly groupValue: Key,
  ) {
    rows.forEach((row) => (row.parentRow = this));
  }

  public get rowKey(): Key {
    return `${this.parentRow?.rowKey ?? ''}${this.groupColumn.key}${this.groupValue}`;
  }
  public parentRow?: GroupRow<TRow>;

  public get expanded() {
    return this.grid.expandedGroupRow[this.rowKey];
  }

  public get count(): number {
    return this.rows.sumBy((row) => row.count, 0);
  }

  public get flatRows(): (Row<TRow> | GroupRow<TRow>)[] {
    if (this.expanded) {
      return [this, ...this.rows.flatMap((row) => row.flatRows)];
    }

    return [this];
  }

  public toggleRow() {
    this.grid.toggleGroupRow(this.rowKey);
  }
}
