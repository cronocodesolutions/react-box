import memo from '../../../utils/memo';
import { DataGridProps, Key, NO_PIN, PinPosition } from '../contracts/dataGridContract';
import ColumnModel from './columnModel';
import GroupRowModel from './groupRowModel';
import RowModel from './rowModel';
import '../../../array';

export const EMPTY_CELL_KEY = 'empty-cell';
export const GROUPING_CELL_KEY = 'grouping-cell';
export default class GridModel<TRow> {
  constructor(
    public readonly props: DataGridProps<TRow>,
    public readonly update: () => void,
  ) {
    this._sourceColumns = props.def.columns.map((def) => new ColumnModel(def, this));

    // add empty column
    this._sourceColumns.push(new ColumnModel({ key: EMPTY_CELL_KEY }, this));
  }

  private _sourceColumns: ColumnModel<TRow>[] = [];

  public readonly columns = memo(() => {
    const left = this._sourceColumns.map((c) => c.getPinnedColumn('LEFT')).filter((c) => !!c);
    const middle = this._sourceColumns.map((c) => c.getPinnedColumn()).filter((c) => !!c);
    const right = this._sourceColumns.map((c) => c.getPinnedColumn('RIGHT')).filter((c) => !!c);
    const flat = [...left, ...middle, ...right].flatMap((c) => c.flatColumns);
    const leafs = flat.filter((x) => x.isLeaf);

    return {
      left,
      middle,
      right,
      flat,
      leafs,
    };
  });

  public readonly headerRows = memo(() => {
    const groupedByLevel = this.columns.value.flat.groupBy((c) => c.death).sortBy((x) => x.key);

    return groupedByLevel.map((x) => {
      const cols = x.values.groupBy((c) => c.pin ?? NO_PIN).toRecord((c) => [c.key, c.values]);

      return [...(cols.LEFT ?? []), ...(cols.NO_PIN ?? []), ...(cols.RIGHT ?? [])];
    });
  });

  public readonly gridTemplateColumns = memo(() => {
    const rightPinnedColumnsCount = this.columns.value.leafs.sumBy((x) => (x.pin === 'RIGHT' ? 1 : 0));
    const leftColsCount = this.columns.value.leafs.length - rightPinnedColumnsCount - 1;

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
      const getRowsGroup = (dataToGroup: TRow[], groupColumns: Key[]): GroupRowModel<TRow>[] => {
        const groupKey = groupColumns[0];
        groupColumns = groupColumns.removeBy((c) => c === groupKey);
        const column = this.columns.value.leafs.findOrThrow((c) => c.key === groupKey);

        if (this._sortColumn === GROUPING_CELL_KEY) {
          dataToGroup = dataToGroup.sortBy((x) => x[groupKey as keyof TRow], this._sortDirection);
        }

        return dataToGroup
          .groupBy((item) => item[groupKey as keyof TRow] as Key)
          .map((group, groupRowIndex) => {
            let rows: RowModel<TRow>[] | GroupRowModel<TRow>[];

            if (groupColumns.length > 0) {
              rows = getRowsGroup(group.values, groupColumns);
            } else {
              rows = group.values.map((dataRow, rowIndex) => new RowModel(this, dataRow, rowIndex));
            }

            return new GroupRowModel(this, column, rows, groupRowIndex, group.key);
          });
      };

      return getRowsGroup(data, this.groupColumns);
    }

    return data.map((dataRow, rowIndex) => new RowModel(this, dataRow, rowIndex));
  });

  public readonly flatRows = memo(() => {
    return this.rows.value.flatMap((row) => {
      return row.flatRows;
    });
  });

  public readonly ROW_HEIGHT = 12;
  public readonly MIN_COLUMN_WIDTH_PX = 48;
  public readonly DEFAULT_COLUMN_WIDTH_PX = 200;

  public isResizeMode = false;
  public expandedGroupRow: Record<Key, boolean> = {};
  public get leftEdge() {
    return this.columns.value.left.sumBy((c) => c.inlineWidth ?? 0);
  }
  public get rightEdge() {
    return this.columns.value.right.sumBy((c) => c.inlineWidth ?? 0);
  }
  public readonly leftEdgeVarName = '--left-edge';

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

    this.headerRows.clear();
    this.rows.clear();
    this.flatRows.clear();
    this.update();
  };

  public pinColumn = (uniqueKey: string, pin?: PinPosition) => {
    const column = this.columns.value.flat.findOrThrow((c) => c.uniqueKey === uniqueKey);
    if (column.pin !== pin) {
      column.pinColumn(pin);
    }

    this.columns.clear();
    this.headerRows.clear();
    this.gridTemplateColumns.clear();
    this.rows.clear();
    this.flatRows.clear();

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
      this._sourceColumns.unshift(new ColumnModel({ key: GROUPING_CELL_KEY }, this));
    } else if (this.groupColumns.length === 0 && groupingColumn) {
      this._sourceColumns = this._sourceColumns.removeBy((c) => c.key === GROUPING_CELL_KEY);
    }

    this.columns.clear();
    this.headerRows.clear();
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

  public setWidth = (columnKey: Key, width: number) => {
    const leaf = this.columns.value.leafs.find((l) => l.key === columnKey);

    if (!leaf) {
      throw new Error('Leaf column not found.');
    }

    leaf.setWidth(width);

    const sourceLeaf = this._sourceColumns.flatMap((x) => x.flatColumns).findOrThrow((l) => l.key === columnKey);
    sourceLeaf.setWidth(width);
  };

  public groupColumns: Key[] = [];

  private _sortColumn?: Key;
  public get sortColumn() {
    return this._sortColumn;
  }
  private _sortDirection: SortDirection = 'ASC';
  public get sortDirection() {
    return this._sortDirection;
  }
}
