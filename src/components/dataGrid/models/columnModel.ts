import FnUtils from '../../../utils/fn/fnUtils';
import { ColumnType, PinPosition } from '../contracts/dataGridContract';
import GridModel, { EMPTY_CELL_KEY } from './gridModel';

export default class ColumnModel<TRow> {
  constructor(
    private readonly def: ColumnType<TRow>,
    public readonly grid: GridModel<TRow>,
    private parent?: ColumnModel<TRow>,
  ) {
    // NOTE: is important to set pin before create children columns
    this.pin = parent?.pin ?? def.pin;
    this.columns = def.columns?.map((def) => new ColumnModel(def, grid, this)) ?? [];

    if (this.isLeaf) {
      this._inlineWidth = this.key == EMPTY_CELL_KEY ? undefined : this.grid.DEFAULT_COLUMN_WIDTH_PX;
    }
  }

  public columns: ColumnModel<TRow>[];
  public get key() {
    return this.def.key;
  }
  public get isLeaf() {
    return this.columns.length === 0;
  }

  public pin?: PinPosition;

  public get uniqueKey(): string {
    return `${this.key}-${this.pin ?? ''}`;
  }

  public getPinned(pin?: PinPosition): Maybe<ColumnModel<TRow>> {
    if (this.isPinned(pin)) {
      const _this = new ColumnModel(this.def, this.grid, this.parent);
      _this.pin = pin;
      _this._inlineWidth = this._inlineWidth;

      _this.columns = this.columns
        .filter((c) => c.isPinned(pin))
        .map((c) => {
          const pinColumn = c.getPinned(pin);
          pinColumn!.parent = _this;
          return pinColumn;
        })
        .filter((c) => !!c);

      return _this;
    }
  }

  public isPinned(pin?: PinPosition): boolean {
    return this.pin === pin || this.columns.some((c) => c.isPinned(pin));
  }

  public get death(): number {
    return this.parent ? this.parent.death + 1 : 0;
  }

  public get flatColumns(): ColumnModel<TRow>[] {
    const cols = [this] as ColumnModel<TRow>[];

    cols.push(...this.columns.flatMap((c) => c.flatColumns));

    return cols;
  }

  private _inlineWidth?: number;
  public get inlineWidth(): Maybe<number> {
    if (this.isLeaf) return this._inlineWidth;

    const sizes = this.columns.map((c) => c.inlineWidth).filter((width) => typeof width === 'number');

    if (sizes.length === 0) return undefined;

    return sizes.sumBy((s) => s);
  }

  public get left() {
    let sum = 0;

    if (this.parent) {
      const colIndex = this.parent.columns.findIndex((c) => c === this);
      sum += this.parent.columns.sumBy((c, index) => (index < colIndex ? (c.inlineWidth ?? 0) : 0));

      sum += this.parent.left;
    } else {
      const colIndex = this.grid.leftColumns.value.findIndex((c) => c === this);
      sum += this.grid.leftColumns.value.sumBy((c, index) => (index < colIndex ? (c.inlineWidth ?? 0) : 0));
    }

    return sum;
  }

  public get right() {
    let sum = 0;

    if (this.parent) {
      const reverse = [...this.parent.columns].reverse();
      const colIndex = reverse.findIndex((c) => c === this);
      sum += reverse.sumBy((c, index) => (index < colIndex ? (c.inlineWidth ?? 0) : 0));

      sum += this.parent.right;
    } else {
      const reverse = [...this.grid.rightColumns.value].reverse();
      const colIndex = reverse.findIndex((c) => c === this);
      sum += reverse.sumBy((c, index) => (index < colIndex ? (c.inlineWidth ?? 0) : 0));
    }

    return sum;
  }

  public get isEdge(): boolean {
    if (!this.pin) return false;

    if (this.parent) {
      const item = (this.pin === 'LEFT' ? this.parent.columns.at(-1) : this.parent.columns.at(0)) as ColumnModel<TRow>;
      return item === this && this.parent.isEdge;
    }

    const item = (this.pin === 'LEFT' ? this.grid.leftColumns.value.at(-1) : this.grid.rightColumns.value.at(0)) as ColumnModel<TRow>;
    return item === this;
  }

  // Approved

  public get leafs(): ColumnModel<TRow>[] {
    if (this.isLeaf) return [this];

    return this.columns.flatMap((c) => c.leafs);
  }

  public get groupColumnWidthVarName(): string {
    return `--${this.uniqueKey}-group-width`;
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
    return this.isLeaf ? this.grid.headerRows.value.length - this.death : 1;
  }

  public resizeColumn = (e: MouseEvent) => {
    this.grid.isResizeMode = true;
    const startPageX = e.pageX;
    const { MIN_COLUMN_WIDTH_PX: MIN_WIDTH_PX, update } = this.grid;
    const totalWidth = this.leafs.sumBy((c) => c.inlineWidth as number) - this.leafs.length * MIN_WIDTH_PX;
    const sizes = this.leafs.toRecord((leaf) => [leaf.key, leaf.inlineWidth as number]);

    const resize = FnUtils.throttle((e: MouseEvent) => {
      const dragDistance = (e.pageX - startPageX) * (this.pin === 'RIGHT' ? -1 : 1);

      this.leafs.forEach((leaf) => {
        const width = sizes[leaf.key];
        const dragDistanceForCell =
          totalWidth > 0 ? ((width - MIN_WIDTH_PX) / totalWidth) * dragDistance : dragDistance / this.leafs.length;
        const newWidth = Math.round(width + dragDistanceForCell);

        leaf.setWidth(newWidth < MIN_WIDTH_PX ? MIN_WIDTH_PX : newWidth);
      });

      update();
    }, 20);

    const stopResize = (e: MouseEvent) => {
      window.removeEventListener('mousemove', resize);
      this.grid.isResizeMode = false;
      update();
    };
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResize, { once: true });
  };

  public pinColumn = (pin?: PinPosition) => {
    this.grid.pinColumn(this.key, pin);
  };

  public toggleGrouping = () => {
    this.grid.toggleGrouping(this.key);
  };

  public sortColumn = () => {
    this.grid.setSortColumn(this.key);
  };

  public setWidth = (width: number) => {
    if (!this.isLeaf) {
      throw new Error('Cannot set width for a parent column.');
    }

    if (this._inlineWidth === width) return;

    this._inlineWidth = width;
    this.grid.setWidth(this.key, width);
  };
}
