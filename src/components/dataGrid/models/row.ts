import { Key } from '../dataGridContract';
import Cell from './cell';
import Grid from './grid';
import GroupRow from './groupRow';

export default class Row<TRow> {
  constructor(
    public readonly grid: Grid<TRow>,
    public readonly row: TRow,
    public readonly rowIndex: number,
  ) {
    this.grid = grid;
    this.row = row;
  }

  public get rowKey(): Key {
    return this.getRowKey();
  }
  public parentRow?: GroupRow<TRow>;

  public get cells(): Cell<TRow>[] {
    return this.grid.leafs.value.map((c) => new Cell<TRow>(this.grid, this, c));
  }

  public get count(): number {
    return 1;
  }

  public get flatRows(): Row<TRow>[] {
    return [this];
  }

  private getRowKey() {
    const { rowKey } = this.grid.props.def;

    const key = rowKey ? (typeof rowKey === 'function' ? rowKey(this.row) : (this.row[rowKey] as string)) : this.rowIndex;

    return `${this.parentRow?.rowKey ?? ''}${key}`;
  }
}
