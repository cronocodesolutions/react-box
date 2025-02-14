import FnUtils from '../../../utils/fn/fnUtils';
import { ColumnType, Key, PinPosition } from '../dataGridContract';
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
    if (this.isLeaf) this.inlineWidth = 200;
  }

  public readonly level: number;
  public readonly key: Key;
  public readonly isLeaf: boolean;

  public grid: Grid<TRow>;
  public left?: Column<TRow>;
  public right?: Column<TRow>;
  public parent?: Column<TRow>;
  public columns: Column<TRow>[] = [];

  public pin?: PinPosition;
  public inlineWidth?: number;

  public get leafs(): Column<TRow>[] {
    if (this.isLeaf) return [this];

    return this.columns.flatMap((c) => c.leafs);
  }

  public get widthVarName(): string {
    return `--${this.key}-${this.pin ?? ''}-width`;
  }

  public resizeColumn = (e: React.MouseEvent) => {
    this.grid.isResizeMode = true;
    const startPageX = e.pageX;
    const { MIN_WIDTH_PX, update } = this.grid;
    const totalWidth = this.leafs.sumBy((c) => c.inlineWidth as number) - this.leafs.length * MIN_WIDTH_PX;
    const sizes = this.leafs.toRecord((leaf) => [leaf.key, leaf.inlineWidth as number]);

    const resize = FnUtils.throttle((e: MouseEvent) => {
      const dragDistance = (e.pageX - startPageX) * (this.pin === 'RIGHT' ? -1 : 1);
      this.leafs.forEach((leaf) => {
        const width = sizes[leaf.key];
        const dragDistanceForCell =
          totalWidth > 0 ? ((width - MIN_WIDTH_PX) / totalWidth) * dragDistance : dragDistance / this.leafs.length;
        const newWidth = Math.round(width + dragDistanceForCell);
        leaf.inlineWidth = newWidth < MIN_WIDTH_PX ? MIN_WIDTH_PX : newWidth;
      });

      update();
    }, 10);

    const stopResize = (e: MouseEvent) => {
      window.removeEventListener('mousemove', resize);
      this.grid.isResizeMode = false;
      update();
    };
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResize, { once: true });
  };
}
