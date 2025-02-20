import FnUtils from '../../../utils/fn/fnUtils';
import { ColumnType, Key, PinPosition } from '../dataGridContract';
import Grid, { EMPTY_CELL_KEY } from './grid';

export default class Column<TRow> {
  constructor(def: ColumnType<TRow>, grid: Grid<TRow>, parentPin?: PinPosition, columns: Column<TRow>[] = []) {
    this.grid = grid;
    this.isLeaf = 'columns' in def === false;
    this.key = def.key;
    this._pin = parentPin ?? def.pin ?? 'NO_PIN';

    if (this.isLeaf && this.key !== EMPTY_CELL_KEY) {
      this.inlineWidth = 200;
    }

    this._columns = columns;
    this._columns.forEach((c) => (c.parent = this));
  }

  public readonly grid: Grid<TRow>;
  public parent?: Column<TRow>;
  public readonly key: Key;
  public readonly isLeaf: boolean;

  private readonly _columns: Column<TRow>[];

  private _pin: PinPosition;
  public get pin() {
    return this._pin;
  }

  public inlineWidth?: number | 'auto' = 'auto';

  private _left?: number;
  public get left() {
    return this._left;
  }
  public setLeft(left: number) {
    this._left = left;

    let leftToSet = left;
    this._columns.forEach((c) => {
      leftToSet = c.setLeft(leftToSet);
    });

    return left + this.getWidth();
  }

  private _right?: number;
  public get right() {
    return this._right;
  }
  public setRight(right: number) {
    this._right = right;

    let rightToSet = right;
    const reverseColumns = [...this._columns];
    reverseColumns.forEach((c) => {
      rightToSet = c.setRight(rightToSet);
    });

    return right + this.getWidth();
  }

  public getWidth(): number {
    if (typeof this.inlineWidth === 'number') {
      return this.inlineWidth;
    }

    return this._columns.sumBy((c) => {
      const val = c.getWidth();

      return typeof val === 'number' ? val : 0;
    });
  }

  public get level() {
    let level = 0;

    let parent = this.parent;
    while (parent) {
      level++;
      parent = parent.parent;
    }

    return level;
  }

  // Approved

  public get allLevelColumns(): Column<TRow>[] {
    const cols = [this] as Column<TRow>[];

    cols.push(...this._columns.flatMap((c) => c.allLevelColumns));

    return cols;
  }

  public get leafs(): Column<TRow>[] {
    if (this.isLeaf) return [this];

    return this._columns.flatMap((c) => c.leafs);
  }

  public get uniqueKey(): string {
    return `${this.key}-${this.pin}`;
  }
  public get widthVarName(): string {
    return `--${this.uniqueKey}-width`;
  }
  public get leftVarName() {
    return `--${this.uniqueKey}-left`;
  }
  public get rightVarName() {
    return `--${this.uniqueKey}-right`;
  }

  public get gridRows() {
    return this.isLeaf ? this.grid.headerRows.value.length - this.level : 1;
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

      this.grid.headerRows.clear();
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

  public pinColumn = (pin: PinPosition) => {
    this.grid.pinOverrides[this.key] = pin;

    this.grid.gridTemplateColumns.clear();
    this.grid.headerRows.clear();
    this.grid.leafs.clear();
    this.grid._columns.clear();

    this.grid.update();
  };
}
