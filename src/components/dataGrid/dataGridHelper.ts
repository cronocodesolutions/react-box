import { DEFAULT_REM_DIVIDER } from '../../core/boxConstants';
import {
  GridCell,
  GridColumnType,
  GridDef,
  GridGroupRow,
  GridNormalRow,
  GridPaginationState,
  GridRow,
  Key,
  KeysMatching,
  PinPosition,
  SortColumnType,
} from './dataGridContract';
import '../../array';

interface Column<TRow> {
  key: Key;
  headerRow: number;
  isParent: boolean;
  raw?: GridColumnType<TRow>;
  parentKey?: Key;
  rowSpan: number;
  colSpan: number;
  leafs: Key[];
  pinned?: PinPosition;
  height?: number;
  width?: number;
  inlineWidth?: number;
  top: number;
  left?: number;
  right?: number;
}

const DEFAULT_WIDTH = 40;
export const DEFAULT_ROW_HEIGHT = 10;
export const EMPTY_CELL_KEY = 'empty-cell';
export const GROUPING_COLUMN_ROW_KEY = 'grouping-column-row';
export const GROUPING_COLUMN_CELL_KEY = 'grouping-column-cell';

interface Props<TRow> {
  data: TRow[];
  def: GridDef<TRow>;
}

export class DataGridHelper<TRow> {
  constructor(
    private _props: Props<TRow>,
    private _leftPinnedColumns: Key[],
    private _rightPinnedColumns: Key[],
    private _columnSize: Record<Key, number>,
    private _groupColumns: Key[],
    private _sortColumn: Maybe<SortColumnType<TRow>>,
    private _page: number,
    private _expandedRow: Record<Key, Key[]>,
  ) {
    this.buildColumns();
    this.saveColumnsMetadata();

    this._pagination = this.getPagination();

    this.prepareRows();
  }

  public get gridWidth() {
    return this._gridWidth;
  }

  public get headerColumns() {
    return this._columns;
  }

  public get dataColumns() {
    return this._dataColumns;
  }

  public get rows() {
    return this._rows;
  }

  public get gridTemplateColumns() {
    const rightPinnedColumns = this._columns.filter((c) => !c.isParent && c.pinned === 'RIGHT');
    const leftColsCount = this._columns.filter((c) => !c.isParent).length - rightPinnedColumns.length - 1;
    const left = leftColsCount > 0 ? `repeat(${leftColsCount}, max-content)` : '';

    const right = rightPinnedColumns.length > 0 ? `repeat(${rightPinnedColumns.length}, max-content)` : '';

    return `${left} auto ${right}`;
  }

  public get pagination() {
    return this._pagination;
  }

  private _columns: Column<TRow>[] = [];
  private _dataColumns: Column<TRow>[] = [];
  private _leftEdgeColumn: Maybe<Column<TRow>>;
  private _rightEdgeColumn: Maybe<Column<TRow>>;
  private _headerRowLevels: number = 0;
  private _gridWidth: number = 0;
  private _rows: GridRow[] = [];
  private _pagination: GridPaginationState;

  private getPagination() {
    const pageSize = 10;

    let totalItems = this._props.data.length;
    if (this._groupColumns.length > 0) {
      totalItems = Object.keys(Object.groupBy(this._props.data, (item) => item[this._groupColumns[0] as keyof TRow] as PropertyKey)).length;
    }

    const totalPages = Math.ceil(totalItems / pageSize);

    const page = this._page < 0 ? 0 : this._page >= totalPages ? totalPages - 1 : this._page;

    return { page, pageSize, totalItems, totalPages };
  }

  private prepareRows() {
    let dataToUse = this._props.data ? [...this._props.data] : [];

    if (this._sortColumn) {
      dataToUse = dataToUse.sortBy((x) => x[this._sortColumn!.key], this._sortColumn.dir);
    }

    if (this._groupColumns.length > 0) {
      this.addGridGroupRow(0, dataToUse);
    } else {
      if (this._props.def.pagination) {
        dataToUse = dataToUse.take(this._pagination.pageSize, this._pagination.pageSize * this._pagination.page);
      }

      dataToUse.forEach((dataRow, rowIndex) => this.addGridNormalRow(dataRow, rowIndex));
    }
  }

  private addGridGroupRow(groupColumnIndex: number, dataRows: TRow[], parentGroupValue: string = '') {
    const groupColumnKey = this._groupColumns[groupColumnIndex];
    const groups = Object.groupBy(dataRows, (item) => item[groupColumnKey as keyof TRow] as PropertyKey);

    let groupEntries = Object.entries(groups);
    if (groupColumnIndex === 0 && this._props.def.pagination) {
      groupEntries = groupEntries.take(this._pagination.pageSize, this._pagination.pageSize * this._pagination.page);
    }

    groupEntries.forEach(([groupValue, dataRows]) => {
      const rowGroupKey = GROUPING_COLUMN_ROW_KEY + parentGroupValue + groupValue;
      const isRowExpanded = this._expandedRow[rowGroupKey]?.includes(GROUPING_COLUMN_CELL_KEY);

      const row: GridGroupRow = { key: rowGroupKey, isGrouped: true, count: dataRows?.length ?? 0, cells: [] };

      this._dataColumns.forEach((c) => {
        row.cells.push({
          key: c.key,
          value: c.key === GROUPING_COLUMN_CELL_KEY ? groupValue : '',
          isExpandableCell: c.key === GROUPING_COLUMN_CELL_KEY,
          expandableCellLevel: groupColumnIndex,
          isExpanded: isRowExpanded,
          width: c.width,
          height: DEFAULT_ROW_HEIGHT,
          inlineWidth: c.inlineWidth,
          pinned: c.pinned,
          edge:
            (this._leftEdgeColumn && c.pinned === 'LEFT' && c.leafs.includes(this._leftEdgeColumn.key)) ||
            (this._rightEdgeColumn && c.pinned === 'RIGHT' && c.leafs.includes(this._rightEdgeColumn.key)),
          left: c.left,
          right: c.right,
        });
      });
      this._rows.push(row);

      if (isRowExpanded) {
        if (this._groupColumns.length > groupColumnIndex + 1) {
          this.addGridGroupRow(groupColumnIndex + 1, dataRows!, parentGroupValue + groupValue);
        } else {
          dataRows?.forEach((dataRow, rowIndex) => this.addGridNormalRow(dataRow, rowIndex, parentGroupValue + groupValue));
        }
      }
    });
  }

  private addGridNormalRow(dataRow: TRow, rowIndex: number, parentGroupValue: string = '') {
    const key =
      (this._props.def.rowKey
        ? typeof this._props.def.rowKey === 'function'
          ? this._props.def.rowKey(dataRow)
          : (dataRow[this._props.def.rowKey] as string)
        : rowIndex) + parentGroupValue;

    const row: GridNormalRow = { cells: [], key, isGrouped: false };

    this._dataColumns.forEach((c) => {
      const cell: GridCell = {
        key: c.key,
        value: dataRow[c.key as keyof TRow],
        width: c.width,
        height: DEFAULT_ROW_HEIGHT,
        inlineWidth: c.inlineWidth,
        pinned: c.pinned,
        edge:
          (this._leftEdgeColumn && c.pinned === 'LEFT' && c.leafs.includes(this._leftEdgeColumn.key)) ||
          (this._rightEdgeColumn && c.pinned === 'RIGHT' && c.leafs.includes(this._rightEdgeColumn.key)),
        left: c.left,
        right: c.right,
      };

      row.cells.push(cell);
    });

    this._rows.push(row);
  }

  private saveColumnsMetadata() {
    const leafs = this._columns.filter((c) => c.headerRow === 0).flatMap((c) => c.leafs);

    this._dataColumns = leafs.map((l) => this._columns.findOrThrow((c) => c.key === l));

    this._leftEdgeColumn = this._dataColumns.findLast((x) => x.pinned === 'LEFT');
    this._rightEdgeColumn = this._dataColumns.find((x) => x.pinned === 'RIGHT');
  }

  private buildColumns() {
    const cols = [...this._props.def.columns];

    if (this._groupColumns.length > 0) {
      cols.unshift({
        key: GROUPING_COLUMN_CELL_KEY as KeysMatching<TRow, Key>,
      });
    }

    this.read(cols);
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
      leafs: [EMPTY_CELL_KEY],
      top: 0,
    });

    this._columns = [...leftColumns, ...middleColumns, ...rightColumns].sortBy((c) => c.headerRow);

    this._columns.forEach((c) => {
      if (!c.isParent) {
        c.rowSpan = this._headerRowLevels - c.headerRow;
      }

      c.colSpan = c.leafs.length;

      if (c.rowSpan === 1) {
        c.height = DEFAULT_ROW_HEIGHT;
      }
    });
  }

  private setPinData(pin: PinPosition, parentKey?: Key, size = 0) {
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

      const sum = this._columns.filter((x) => c.leafs.includes(x.key)).sumBy((x) => x.inlineWidth ?? (x.width ?? 0) * DEFAULT_REM_DIVIDER);

      prevSize += sum;
    });
  }

  private read(cols: GridColumnType<TRow>[], headerRow = 0, parentKey?: Key) {
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
