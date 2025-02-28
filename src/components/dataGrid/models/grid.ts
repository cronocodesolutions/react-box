import memo from '../../../utils/memo';
import { DataGridProps, Key, NO_PIN, PinPosition } from '../dataGridContract';
import Column from './column';
import GroupRow from './groupRow';
import Row from './row';

export const EMPTY_CELL_KEY = 'empty-cell';
export const GROUPING_CELL_KEY = 'grouping-cell';
export default class Grid<TRow> {
  constructor(
    public readonly props: DataGridProps<TRow>,
    public readonly update: () => void,
  ) {
    this._sourceColumns = props.def.columns.map((def) => new Column(def, this));

    // add empty column
    this._sourceColumns.push(new Column({ key: EMPTY_CELL_KEY }, this));
  }

  private _sourceColumns: Column<TRow>[] = [];

  public readonly leftColumns = memo(() => this._sourceColumns.map((c) => c.getPinned('LEFT')).filter((c) => !!c));
  public readonly middleColumns = memo(() => this._sourceColumns.map((c) => c.getPinned()).filter((c) => !!c));
  public readonly rightColumns = memo(() => this._sourceColumns.map((c) => c.getPinned('RIGHT')).filter((c) => !!c));
  public readonly flatColumns = memo(() =>
    [...this.leftColumns.value, ...this.middleColumns.value, ...this.rightColumns.value].flatMap((c) => c.flatColumns),
  );
  public readonly headerRows = memo(() => {
    const groupedByLevel = this.flatColumns.value.groupBy((c) => c.death).sortBy((x) => x.key);

    return groupedByLevel.map((x) => {
      const cols = x.values.groupBy((c) => c.pin ?? NO_PIN).toRecord((c) => [c.key, c.values]);

      return [...(cols.LEFT ?? []), ...(cols.NO_PIN ?? []), ...(cols.RIGHT ?? [])];
    });
  });
  public readonly leafs = memo(() => this.flatColumns.value.filter((x) => x.isLeaf));
  public readonly gridTemplateColumns = memo(() => {
    const rightPinnedColumnsCount = this.leafs.value.sumBy((x) => (x.pin === 'RIGHT' ? 1 : 0));
    const leftColsCount = this.leafs.value.length - rightPinnedColumnsCount - 1;

    const left = leftColsCount > 0 ? `repeat(${leftColsCount}, max-content)` : '';
    const right = rightPinnedColumnsCount > 0 ? `repeat(${rightPinnedColumnsCount}, max-content)` : '';

    return `${left} auto ${right}`;
  });
  public readonly rows = memo(() => {
    let data = this.props.data;

    if (this._sortColumn) {
      data = data.sortBy((x) => x[this._sortColumn as keyof TRow], this._sortDirection);
    }

    if (this.groupColumns.length > 0) {
      const getRowsGroup = (dataToGroup: TRow[], groupColumns: Key[]): GroupRow<TRow>[] => {
        const groupKey = groupColumns[0];
        groupColumns = groupColumns.removeBy((c) => c === groupKey);
        const column = this.leafs.value.findOrThrow((c) => c.key === groupKey);

        return dataToGroup
          .groupBy((item) => item[groupKey as keyof TRow] as Key)
          .map((group, groupRowIndex) => {
            let rows: Row<TRow>[] | GroupRow<TRow>[];

            if (groupColumns.length > 0) {
              rows = getRowsGroup(group.values, groupColumns);
            } else {
              rows = group.values.map((dataRow, rowIndex) => new Row(this, dataRow, rowIndex));
            }

            return new GroupRow(this, column, rows, groupRowIndex, group.key);
          });
      };

      return getRowsGroup(data, this.groupColumns);
    }

    return data.map((dataRow, rowIndex) => new Row(this, dataRow, rowIndex));
  });

  public readonly flatRows = memo(() => {
    return this.rows.value.flatMap((row) => {
      return row.flatRows;
    });
  });

  public readonly ROW_HEIGHT = 12;
  public readonly MIN_WIDTH_PX = 48;
  public isResizeMode = false;
  public expandedGroupRow: Record<Key, boolean> = {};

  public setSortColumn = (columnKey: Key) => {
    if (this._sortColumn !== columnKey) {
      this._sortDirection = 'ASC';
      this._sortColumn = columnKey;
    } else {
      if (this._sortDirection === 'ASC') {
        this._sortDirection = 'DESC';
      } else {
        this._sortDirection = 'ASC';
        this._sortColumn = undefined;
      }
    }

    this.rows.clear();
    this.update();
  };

  public pinColumn = (column: Column<TRow>, pin?: PinPosition) => {
    const flatSourceColumns = this._sourceColumns.flatMap((x) => x.flatColumns);

    const setPin = (col: Column<TRow>, pin?: PinPosition) => {
      const columnToPin = flatSourceColumns.findOrThrow((c) => c.key === col.key);
      columnToPin.pin = pin;

      col.columns.forEach((c) => setPin(c, pin));
    };

    setPin(column, pin);

    this.leftColumns.clear();
    this.middleColumns.clear();
    this.rightColumns.clear();
    this.flatColumns.clear();
    this.headerRows.clear();
    this.leafs.clear();
    this.gridTemplateColumns.clear();

    this.update();
  };

  public toggleGrouping = (columnKey: Key) => {
    if (this.groupColumns.includes(columnKey)) {
      this.groupColumns = this.groupColumns.removeBy((key) => key === columnKey);
    } else {
      this.groupColumns = this.groupColumns.add(columnKey);
    }

    const groupingColumn = this._sourceColumns.find((c) => c.key === GROUPING_CELL_KEY);
    if (this.groupColumns.length > 0 && !groupingColumn) {
      this._sourceColumns.unshift(new Column({ key: GROUPING_CELL_KEY }, this));
    } else if (this.groupColumns.length === 0 && groupingColumn) {
      this._sourceColumns = this._sourceColumns.removeBy((c) => c.key === GROUPING_CELL_KEY);
    }

    this.leftColumns.clear();
    this.middleColumns.clear();
    this.rightColumns.clear();
    this.flatColumns.clear();
    this.headerRows.clear();
    this.leafs.clear();
    this.gridTemplateColumns.clear();
    this.rows.clear();
    this.flatRows.clear();

    this.update();
  };

  public toggleGroupRow = (groupRowKey: Key) => {
    if (groupRowKey in this.expandedGroupRow) {
      delete this.expandedGroupRow[groupRowKey];
    } else {
      this.expandedGroupRow[groupRowKey] = true;
    }

    // this.rows.clear();
    this.flatRows.clear();
    this.update();
  };

  public groupColumns: Key[] = [];
  private _sortColumn?: Key;
  private _sortDirection: SortDirection = 'ASC';
}
