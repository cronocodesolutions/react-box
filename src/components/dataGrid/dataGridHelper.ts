import { DEFAULT_REM_DIVIDER } from '../../core/boxConstants';
import { GridColumnType, GridDef, PinPosition, SortColumnType, SortDirection } from './dataGridContract';

interface Column<TRow> {
  key: string;
  headerRow: number;
  isParent: boolean;
  raw?: GridColumnType<TRow>;
  parentKey?: string;
  rowSpan: number;
  colSpan: number;
  leafs: string[];
  pinned?: PinPosition;
  height?: number;
  width?: number;
  inlineWidth?: number;
  top: number;
  left?: number;
  right?: number;
}

const DEFAULT_WIDTH = 40;
const DEFAULT_WIDTH_PX = DEFAULT_WIDTH * DEFAULT_REM_DIVIDER;
export const DEFAULT_ROW_HEIGHT = 10;
const SORT_DIRECTION: SortDirection = 'ASC';
export const EMPTY_CELL_KEY = 'empty-cell';

interface Props<TRow> {
  data?: TRow[];
  def: GridDef<TRow>;
}

export class DataGridHelper<TRow> {
  constructor(
    private _props: Props<TRow>,
    private _leftPinnedColumns: string[],
    private _rightPinnedColumns: string[],
    private _columnSize: Record<string, number>,
  ) {
    this.buildColumns();
  }

  public get gridWidth() {
    return this._gridWidth;
  }

  public get headerColumns() {
    return this._columns;
  }

  public get gridTemplateColumns() {
    const rightPinnedColumns = this._columns.filter((c) => !c.isParent && c.pinned === 'RIGHT');
    const leftColsCount = this._columns.filter((c) => !c.isParent).length - rightPinnedColumns.length - 1;
    const left = leftColsCount > 0 ? `repeat(${leftColsCount}, max-content)` : '';

    const right = rightPinnedColumns.length > 0 ? `repeat(${rightPinnedColumns.length}, max-content)` : '';

    return `${left} auto ${right}`;
  }

  public get headerRowLevels() {
    return this._headerRowLevels;
  }

  private _columns: Column<TRow>[] = [];
  private _headerRowLevels: number = 0;
  private _gridWidth: number = 0;

  private buildColumns() {
    this.read(this._props.def.columns);
    this._headerRowLevels = this._columns.maxBy((c) => c.headerRow) + 1;

    this.splitColumns();

    this.setPinData('LEFT');
    this.setPinData('RIGHT');
  }

  private splitColumns() {
    const leftColumns = this._columns
      .filter((c) => c.leafs.some((leafKey) => this._leftPinnedColumns.includes(leafKey)))
      .map<Column<TRow>>((c) => {
        const leafs = c.leafs.filter((leafKey) => this._leftPinnedColumns.includes(leafKey));

        return { ...c, leafs, pinned: 'LEFT' };
      });

    const rightColumns = this._columns
      .filter((c) => c.leafs.some((leafKey) => this._rightPinnedColumns.includes(leafKey)))
      .map<Column<TRow>>((c) => {
        const leafs = c.leafs.filter((leafKey) => this._rightPinnedColumns.includes(leafKey));

        return { ...c, leafs, pinned: 'RIGHT' };
      });

    const middleColumns = this._columns
      .map<Column<TRow>>((c) => {
        const leafs = c.leafs.filter(
          (leafKey) => !this._leftPinnedColumns.includes(leafKey) && !this._rightPinnedColumns.includes(leafKey),
        );

        return { ...c, leafs };
      })
      .filter((c) => c.leafs.length > 0);

    middleColumns.push({
      key: EMPTY_CELL_KEY,
      headerRow: 0,
      isParent: false,
      rowSpan: this._headerRowLevels,
      colSpan: 1,
      leafs: ['EMPTY_CELL_KEY'],
      top: 0,
    });

    this._columns = [...leftColumns, ...middleColumns, ...rightColumns].sortBy((c) => c.headerRow);

    this._columns.forEach((c) => {
      if (!c.isParent) {
        c.rowSpan = this._headerRowLevels - c.headerRow;
        if (typeof c.height === 'number') {
          c.height = c.height * c.rowSpan;
        }
      }
      c.colSpan = c.leafs.length;
      if (typeof c.width === 'number') {
        c.width = c.width * c.colSpan;
      }
    });
  }

  private setPinData(pin: PinPosition, parentKey?: string, size = 0) {
    const cols = this._columns.filter((c) => c.parentKey === parentKey && c.pinned === pin);
    if (pin === 'RIGHT') cols.reverse();

    let prevSize = size;
    cols.forEach((c) => {
      if (pin === 'LEFT') {
        c.left = prevSize;
      } else if (pin === 'RIGHT') {
        c.right = prevSize;
      }

      this.setPinData(pin, c.key, prevSize);

      prevSize += c.inlineWidth ?? (c.width ?? 0) * DEFAULT_REM_DIVIDER;
    });
  }

  private read(cols: GridColumnType<TRow>[], headerRow = 0, parentKey?: string) {
    cols.forEach((col) => {
      const isParent = 'columns' in col;

      const column: Column<TRow> = {
        key: col.key as string,
        headerRow,
        isParent,
        raw: col,
        parentKey,
        rowSpan: 1,
        colSpan: 1,
        leafs: [],
        height: DEFAULT_ROW_HEIGHT,
        width: isParent ? undefined : DEFAULT_WIDTH,
        inlineWidth: this._columnSize[col.key as string],
        top: DEFAULT_ROW_HEIGHT * headerRow,
      };

      this._columns.push(column);

      if (isParent) {
        this.read(col.columns, headerRow + 1, column.key);

        column.leafs = col.columns.flatMap((c) => this._columns.find((x) => x.key === c.key)!.leafs);
      } else {
        column.leafs.push(col.key as string);

        this._gridWidth += column.inlineWidth ?? (column.width ?? 0) * DEFAULT_REM_DIVIDER;
      }
    });
  }
}
