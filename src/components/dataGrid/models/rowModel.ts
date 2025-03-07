import { Key } from '../contracts/dataGridContract';
import CellModel from './cellModel';
import GridModel from './gridModel';
import GroupRowModel from './groupRowModel';

export default class RowModel<TRow> {
  constructor(
    public readonly grid: GridModel<TRow>,
    public readonly row: TRow,
    public readonly rowIndex: number,
  ) {
    this.grid = grid;
    this.row = row;
  }

  public get rowKey(): Key {
    return this.getRowKey();
  }
  public parentRow?: GroupRowModel<TRow>;

  public get cells(): CellModel<TRow>[] {
    return this.grid.columns.value.leafs.map((c) => new CellModel<TRow>(this.grid, this, c));
  }

  public get count(): number {
    return 1;
  }

  public get flatRows(): RowModel<TRow>[] {
    return [this];
  }

  private getRowKey() {
    const { rowKey } = this.grid.props.def;

    const key = rowKey ? (typeof rowKey === 'function' ? rowKey(this.row) : (this.row[rowKey] as string)) : this.rowIndex;

    return `${this.parentRow?.rowKey ?? ''}${key}`;
  }
}
