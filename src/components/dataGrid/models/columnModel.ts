import FnUtils from '../../../utils/fn/fnUtils';
import { ColumnType, PinPosition } from '../contracts/dataGridContract';
import GridModel, { EMPTY_CELL_KEY } from './gridModel';

export default class ColumnModel<TRow> {
  constructor(
    public readonly def: ColumnType<TRow>,
    public readonly grid: GridModel<TRow>,
    private parent?: ColumnModel<TRow>,
  ) {
    this.columns = def.columns?.map((d) => new ColumnModel(def.pin ? { ...d, pin: def.pin } : d, grid, this)) ?? [];

    if (this.isLeaf) {
      // Use stored width if available (survives memo recreation), otherwise use def.width or default
      const storedWidth = this.grid.columnWidths.get(this.key);
      this._inlineWidth = this.key == EMPTY_CELL_KEY ? undefined : (storedWidth ?? this.def.width ?? this.grid.DEFAULT_COLUMN_WIDTH_PX);
      this._pin = def.pin;
    }
  }

  public columns: ColumnModel<TRow>[] = [];
  public get visibleColumns() {
    return this.columns.filter((c) => c.isVisible);
  }

  public get isFirstLeaf() {
    const { leafs } = this;

    return leafs.length > 0 && leafs.at(0) === this;
  }

  public get isLastLeaf() {
    const { leafs } = this;

    return leafs.length > 0 && leafs.at(-1) === this;
  }

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
  public get Cell() {
    return this.def.Cell;
  }
  public get filterable() {
    return this.def.filterable;
  }

  /** Whether sorting is enabled for this column. Column-level setting takes priority over grid-level. */
  public get sortable(): boolean {
    if (this.def.sortable !== undefined) {
      return this.def.sortable;
    }
    return this.grid.props.def.sortable !== false;
  }

  /** Whether resizing is enabled for this column. Column-level setting takes priority over grid-level. */
  public get resizable(): boolean {
    if (this.def.resizable !== undefined) {
      return this.def.resizable;
    }
    return this.grid.props.def.resizable !== false;
  }

  /** Whether column participates in flex distribution. Default true unless explicitly false. */
  public get isFlexible(): boolean {
    return this.def.flexible !== false;
  }

  /** The base width before flex calculation (what user set or DEFAULT). */
  public get baseWidth(): number {
    return this._inlineWidth ?? this.grid.DEFAULT_COLUMN_WIDTH_PX;
  }

  private _pin?: PinPosition;
  public get pin(): PinPosition | undefined {
    if (this.isLeaf) return this._pin;

    const pins = [...new Set(this.columns.flatMap((c) => c.pin))];

    if (pins.length === 1) return pins[0];
  }

  public get uniqueKey(): string {
    return `${this.key}${this.pin ?? ''}`;
  }

  public getPinnedColumn(pin?: PinPosition): ColumnModel<TRow> | undefined {
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
  public get inlineWidth(): number | undefined {
    if (this.isLeaf) {
      // Use flex-calculated width if available, otherwise use base width
      const flexWidth = this.grid.getFlexWidth(this.key);
      return flexWidth ?? this._inlineWidth;
    }

    const sizes = this.visibleColumns.map((c) => c.inlineWidth).filter((width) => typeof width === 'number');

    if (sizes.length === 0) return undefined;

    return sizes.sumBy((s) => s);
  }

  public get left() {
    let sum = 0;

    if (this.parent) {
      const { visibleColumns, left: parentLeft } = this.parent;

      const colIndex = visibleColumns.findIndex((c) => c === this);
      sum += visibleColumns.sumBy((c, index) => (index < colIndex ? (c.inlineWidth ?? 0) : 0));

      sum += parentLeft;
    } else {
      const leftVisibleColumns = this.grid.columns.value.left.filter((c) => c.isVisible);

      const colIndex = leftVisibleColumns.findIndex((c) => c === this);
      sum += leftVisibleColumns.sumBy((c, index) => (index < colIndex ? (c.inlineWidth ?? 0) : 0));
    }

    return sum;
  }

  public get right() {
    let sum = 0;

    if (this.parent) {
      const { visibleColumns } = this.parent;
      const reverse = visibleColumns.reverse();
      const colIndex = reverse.findIndex((c) => c === this);
      sum += reverse.sumBy((c, index) => (index < colIndex ? (c.inlineWidth ?? 0) : 0));

      sum += this.parent.right;
    } else {
      const rightVisibleColumns = this.grid.columns.value.right.filter((c) => c.isVisible);

      const reverse = rightVisibleColumns.reverse();
      const colIndex = reverse.findIndex((c) => c === this);
      sum += reverse.sumBy((c, index) => (index < colIndex ? (c.inlineWidth ?? 0) : 0));
    }

    return sum;
  }

  public get isEdge(): boolean {
    if (!this.pin) return false;

    if (this.parent) {
      const { visibleColumns } = this.parent;
      const item = (this.pin === 'LEFT' ? visibleColumns.at(-1) : visibleColumns.at(0)) as ColumnModel<TRow>;
      return item === this && this.parent.isEdge;
    }

    const item = (
      this.pin === 'LEFT'
        ? this.grid.columns.value.left.filter((x) => x.isVisible).at(-1)
        : this.grid.columns.value.right.filter((x) => x.isVisible).at(0)
    ) as ColumnModel<TRow>;
    return item === this;
  }

  public get isVisible(): boolean {
    if (this.isLeaf) return !this.grid.hiddenColumns.has(this.key);

    return this.leafs.some((l) => l.isVisible);
  }

  // Approved

  public get leafs(): ColumnModel<TRow>[] {
    if (this.isLeaf) return [this];

    return this.visibleColumns.flatMap((c) => c.leafs);
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
    return this.isLeaf ? this.grid.columns.value.maxDeath - this.death : 1;
  }

  public resizeColumn = (e: unknown) => {
    const startPageX = (e as MouseEvent).pageX;
    const { MIN_COLUMN_WIDTH_PX: MIN_WIDTH_PX, update } = this.grid;

    // Capture current visual widths (includes flex-calculated width) as starting point
    const sizes = this.leafs.toRecord((leaf) => [leaf.key, leaf.inlineWidth ?? leaf.baseWidth]);
    const totalWidth = this.leafs.sumBy((c) => sizes[c.key]) - this.leafs.length * MIN_WIDTH_PX;

    const resize = FnUtils.throttle((e: MouseEvent) => {
      const dragDistance = (e.pageX - startPageX) * (this.pin === 'RIGHT' ? -1 : 1);

      this.leafs.forEach((leaf) => {
        const width = sizes[leaf.key];
        const dragDistanceForCell =
          totalWidth > 0 ? ((width - MIN_WIDTH_PX) / totalWidth) * dragDistance : dragDistance / this.leafs.length;
        const newWidth = Math.round(width + dragDistanceForCell);

        leaf.setWidth(newWidth < MIN_WIDTH_PX ? MIN_WIDTH_PX : newWidth);
      });

      this.grid.flexWidths.clear();
      this.grid.sizes.clear();
      update();
    }, 40);

    const controller = new AbortController();

    const stopResize = (_e: MouseEvent) => {
      controller.abort();
      update();
    };

    window.addEventListener('mousemove', resize, controller);
    window.addEventListener('mouseup', stopResize, controller);
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

  public sortColumn: (sortDirection?: SortDirection) => void = (...args: [SortDirection | undefined]) => {
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

  public toggleVisibility = () => {
    this.grid.toggleColumnVisibility(this.key);
  };
}
