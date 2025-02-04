import { ColumnType, Key } from '../dataGridContract';
import Grid from './grid';

export default class Column<TRow> {
  constructor(grid: Grid<TRow>, def: ColumnType<TRow>, parent?: Column<TRow>, left?: Column<TRow>) {
    this.level = parent ? parent.level + 1 : 0;
    this.key = def.key;
    this.isLeaf = 'columns' in def === false;
    this.left = left;
    this.parent = parent;
    this.grid = grid;

    if (this.left) this.left.right = this;
  }

  public readonly level: number;
  public readonly key: Key;
  public readonly isLeaf: boolean;

  public grid: Grid<TRow>;
  public left?: Column<TRow>;
  public right?: Column<TRow>;
  public parent?: Column<TRow>;
  public columns: Column<TRow>[] = [];

  public get leafs(): Column<TRow>[] {
    if (this.isLeaf) return [this];

    return this.columns.flatMap((c) => c.leafs);
  }
}
