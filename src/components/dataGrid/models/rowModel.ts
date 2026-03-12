import { Key } from '../contracts/dataGridContract';
import CellModel from './cellModel';
import DetailRowModel from './detailRowModel';
import GridModel from './gridModel';
import GroupRowModel from './groupRowModel';

export default class RowModel<TRow> {
  constructor(
    public readonly grid: GridModel<TRow>,
    public readonly data: TRow,
    public readonly rowIndex: number,
  ) {
    this.grid = grid;
    this.data = data;
    this.key = this.grid.getRowKey(data);
  }

  public readonly key: Key;
  public parentRow?: GroupRowModel<TRow>;
  public readonly count = 1;

  public get cells(): CellModel<TRow>[] {
    return this.grid.columns.value.visibleLeafs.map((c) => new CellModel<TRow>(this.grid, this, c));
  }

  public get selected() {
    return this.grid.selectedRows.has(this.key);
  }

  public get expanded() {
    return this.grid.expandedDetailRows.has(this.key);
  }

  public get flatRows(): (RowModel<TRow> | DetailRowModel<TRow>)[] {
    if (this.grid.props.def.rowDetail && this.expanded) {
      return [this, new DetailRowModel(this.grid, this)];
    }

    return [this];
  }

  public get allRows() {
    return this;
  }
}
