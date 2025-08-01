import { Key } from '../contracts/dataGridContract';
import ColumnModel from './columnModel';
import GridModel, { EMPTY_CELL_KEY, GROUPING_CELL_KEY, ROW_NUMBER_CELL_KEY, ROW_SELECTION_CELL_KEY } from './gridModel';
import GroupRowCellModel from './groupRowCellModel';
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

  public get key(): Key {
    return `${this.parentRow?.key ?? ''}${this.groupColumn.key}${this.groupValue}`;
  }
  public parentRow?: GroupRowModel<TRow>;

  public get cells(): GroupRowCellModel<TRow>[] {
    return this.grid.columns.value.visibleLeafs.map((c) => new GroupRowCellModel<TRow>(this.grid, this, c));
  }

  public get selected() {
    return this.allRows.every((r) => r.selected);
  }

  public get indeterminate() {
    return !this.selected && this.allRows.some((r) => r.selected);
  }

  public get expanded() {
    return this.grid.expandedGroupRow.has(this.key);
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

  public get allRows(): RowModel<TRow>[] {
    return this.rows.flatMap((row) => row.allRows);
  }

  public get groupingColumn() {
    return this.grid.columns.value.leafs.findOrThrow((c) => c.key === GROUPING_CELL_KEY);
  }

  public get groupingColumnGridColumn() {
    const { visibleLeafs } = this.grid.columns.value;
    const { groupingColumn } = this;

    const gridColumn = visibleLeafs.sumBy((c) =>
      c.pin === groupingColumn.pin && c.key !== EMPTY_CELL_KEY && c.key !== ROW_SELECTION_CELL_KEY && c.key !== ROW_NUMBER_CELL_KEY ? 1 : 0,
    );

    return gridColumn;
  }

  public toggleRow() {
    this.grid.toggleGroupRow(this.key);
  }
}
