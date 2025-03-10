import FnUtils from '../../../utils/fn/fnUtils';
import { ColumnType, PinPosition } from '../contracts/dataGridContract';
import GridModel, { EMPTY_CELL_KEY } from './gridModel';

export default class ColumnModel<TRow> {
  constructor(
    private readonly def: ColumnType<TRow>,
    public readonly grid: GridModel<TRow>,
    private parent?: ColumnModel<TRow>,
  ) {
    this.columns = def.columns?.map((d) => new ColumnModel(def.pin ? { ...d, pin: def.pin } : d, grid, this)) ?? [];

    if (this.isLeaf) {
      this._inlineWidth = this.key == EMPTY_CELL_KEY ? undefined : (this.def.width ?? this.grid.DEFAULT_COLUMN_WIDTH_PX);
      this._pin = def.pin;
    }
  }

  public columns: ColumnModel<TRow>[] = [];
  public get key() {
    return this.def.key;
  }
  public get header() {
    return this.def.header;
  }
  public get align() {
    return this.def.align;
  }
  public get isLeaf() {
    return this.columns.length === 0;
  }

  private _pin?: PinPosition;
  public get pin(): Maybe<PinPosition> {
    if (this.isLeaf) return this._pin;

    const pins = [...new Set(this.columns.flatMap((c) => c.pin))];

    if (pins.length === 1) return pins[0];
  }

  public get uniqueKey(): string {
    return `${this.key}${this.pin ?? ''}`;
  }

  public getPinnedColumn(pin?: PinPosition): Maybe<ColumnModel<TRow>> {
    if (this.hasPin(pin)) {
      if (this.isLeaf) return this;

      const parent = new ColumnModel({ ...this.def, pin: pin }, this.grid, this.parent);

      parent.columns = this.columns
        .filter((c) => c.hasPin(pin))
        .map((c) => {
          const pinColumn = c.getPinnedColumn(pin);
          pinColumn!.parent = parent;
          return pinColumn;
        })
        .filter((c) => !!c);

      return parent;
    }
  }

  private hasPin(pin?: PinPosition): boolean {
    return this.isLeaf ? this._pin === pin : this.columns.some((c) => c.hasPin(pin));
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
      const colIndex = this.grid.columns.value.left.findIndex((c) => c === this);
      sum += this.grid.columns.value.left.sumBy((c, index) => (index < colIndex ? (c.inlineWidth ?? 0) : 0));
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
      const reverse = [...this.grid.columns.value.right].reverse();
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

    const item = (this.pin === 'LEFT' ? this.grid.columns.value.left.at(-1) : this.grid.columns.value.right.at(0)) as ColumnModel<TRow>;
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

  public resizeColumn = (e: unknown) => {
    this.grid.isResizeMode = true;
    const startPageX = (e as MouseEvent).pageX;
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

      this.grid.headerRows.clear();
      this.grid.sizes.clear();
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
    if (this.isLeaf) {
      this._pin = pin;
    } else {
      this.columns.forEach((c) => c.pinColumn(pin));
    }

    this.grid.pinColumn(this.uniqueKey, pin);
  };

  public toggleGrouping = () => {
    this.grid.toggleGrouping(this.key);
  };

  public sortColumn: (sortDirection?: SortDirection) => void = (...args: any[]) => {
    this.grid.setSortColumn(this.key, ...args);
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
