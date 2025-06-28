import memo from '../../../utils/memo';
import { DataGridProps, Key, NO_PIN, PinPosition } from '../contracts/dataGridContract';
import ColumnModel from './columnModel';
import GroupRowModel from './groupRowModel';
import RowModel from './rowModel';
import '../../../array';

export const EMPTY_CELL_KEY: Key = 'empty-cell';
export const ROW_NUMBER_CELL_KEY: Key = 'row-number-cell';
export const ROW_SELECTION_CELL_KEY: Key = 'row-selection-cell';
export const GROUPING_CELL_KEY: Key = 'grouping-cell';

export default class GridModel<TRow> {
  constructor(
    public readonly props: DataGridProps<TRow>,
    public readonly update: () => void,
  ) {
    this._sourceColumns = props.def.columns.map((def) => new ColumnModel(def, this));

    // add empty column
    this._sourceColumns.push(new ColumnModel({ key: EMPTY_CELL_KEY }, this));

    // add row selection column
    this._sourceColumns.unshift(new ColumnModel({ key: ROW_SELECTION_CELL_KEY, width: 50, align: 'center' }, this));

    // add row number column
    this._sourceColumns.unshift(new ColumnModel({ key: ROW_NUMBER_CELL_KEY, pin: 'LEFT', width: 70, align: 'right' }, this));
  }

  private _sourceColumns: ColumnModel<TRow>[] = [];

  public readonly columns = memo(() => {
    console.debug('\x1b[36m%s\x1b[0m', '[react-box]: DataGrid columns memo');

    const left = this._sourceColumns.map((c) => c.getPinnedColumn('LEFT')).filter((c) => !!c);
    const middle = this._sourceColumns.map((c) => c.getPinnedColumn()).filter((c) => !!c);
    const right = this._sourceColumns.map((c) => c.getPinnedColumn('RIGHT')).filter((c) => !!c);
    const flat = [...left, ...middle, ...right].flatMap((c) => c.flatColumns);
    const leafs = flat.filter((x) => x.isLeaf);
    const visibleLeafs = flat.filter((x) => x.isLeaf && x.isVisible);
    const maxDeath = flat.maxBy((x) => x.death) + 1;

    return {
      left,
      middle,
      right,
      flat,
      leafs,
      visibleLeafs,
      maxDeath,
    };
  });

  public readonly headerRows = memo(() => {
    console.debug('\x1b[36m%s\x1b[0m', '[react-box]: DataGrid headerRows memo');
    const groupedByLevel = this.columns.value.flat.groupBy((c) => c.death).sortBy((x) => x.key);

    return groupedByLevel.map((x) => {
      const cols = x.values.groupBy((c) => c.pin ?? NO_PIN).toRecord((c) => [c.key, c.values]);

      return [
        ...(cols.LEFT?.filter((c) => c.isVisible) ?? []),
        ...(cols.NO_PIN?.filter((c) => c.isVisible) ?? []),
        ...(cols.RIGHT?.filter((c) => c.isVisible) ?? []),
      ];
    });
  });

  public readonly gridTemplateColumns = memo(() => {
    console.debug('\x1b[36m%s\x1b[0m', '[react-box]: DataGrid gridTemplateColumns memo');
    const { visibleLeafs } = this.columns.value;

    const rightPinnedColumnsCount = visibleLeafs.sumBy((x) => (x.pin === 'RIGHT' ? 1 : 0));
    const leftColsCount = visibleLeafs.length - rightPinnedColumnsCount - 1;

    const left = leftColsCount > 0 ? `repeat(${leftColsCount}, max-content)` : '';
    const right = rightPinnedColumnsCount > 0 ? `repeat(${rightPinnedColumnsCount}, max-content)` : '';

    return `${left} auto ${right}`;
  });
  public readonly rows = memo(() => {
    console.debug('\x1b[36m%s\x1b[0m', '[react-box]: DataGrid rows memo');
    let data = this.props.data;

    if (this._sortColumn) {
      data = data.sortBy((x) => x[this._sortColumn as keyof TRow], this._sortDirection);
    }

    if (this.groupColumns.length > 0) {
      const getRowsGroup = (dataToGroup: TRow[], groupColumns: Key[], rowIndex: number): GroupRowModel<TRow>[] => {
        const groupKey = groupColumns[0];
        groupColumns = groupColumns.removeBy((c) => c === groupKey);
        const column = this.columns.value.leafs.findOrThrow((c) => c.key === groupKey);

        if (this._sortColumn === GROUPING_CELL_KEY) {
          dataToGroup = dataToGroup.sortBy((x) => x[groupKey as keyof TRow], this._sortDirection);
        }

        return dataToGroup
          .groupBy((item) => item[groupKey as keyof TRow] as Key)
          .map((group) => {
            let rows: RowModel<TRow>[] | GroupRowModel<TRow>[];

            if (groupColumns.length > 0) {
              rows = getRowsGroup(group.values, groupColumns, rowIndex + 1);
            } else {
              rows = group.values.map((dataRow, index) => new RowModel(this, dataRow, rowIndex + 1 + index));
            }

            const groupRow = new GroupRowModel(this, column, rows, rowIndex, group.key);
            rowIndex += 1;

            if (groupRow.expanded) {
              rowIndex += rows.length;
            }

            return groupRow;
          });
      };

      return getRowsGroup(data, this.groupColumns, 0);
    }

    return data.map((dataRow, rowIndex) => new RowModel(this, dataRow, rowIndex));
  });

  public readonly flatRows = memo(() => {
    console.debug('\x1b[36m%s\x1b[0m', '[react-box]: DataGrid flatRows memo');

    return this.rows.value.flatMap((row) => {
      return row.flatRows;
    });
  });

  public readonly sizes = memo(() => {
    console.debug('\x1b[36m%s\x1b[0m', '[react-box]: DataGrid sizes memo');

    const size = this.columns.value.flat.reduce<Record<string, string>>((acc, c) => {
      const { inlineWidth } = c;
      if (typeof inlineWidth === 'number') {
        acc[c.widthVarName] = `${c.inlineWidth}px`;
      }

      if (c.pin === 'LEFT') {
        acc[c.leftVarName] = `${c.left}px`;
      }

      if (c.pin === 'RIGHT') {
        acc[c.rightVarName] = `${c.right}px`;
      }

      return acc;
    }, {});

    size[this.leftEdgeVarName] = `${this.leftEdge}px`;

    const { visibleLeafs } = this.columns.value;
    const groupingColumn = visibleLeafs.find((c) => c.key === GROUPING_CELL_KEY);
    if (groupingColumn) {
      const groupingColumnSize = visibleLeafs.sumBy((c) => {
        return c.pin === groupingColumn.pin && c.key !== ROW_NUMBER_CELL_KEY && c.key !== ROW_SELECTION_CELL_KEY ? (c.inlineWidth ?? 0) : 0;
      });
      size[groupingColumn.groupColumnWidthVarName] = `${groupingColumnSize}px`;
    }

    this.groupColumns.forEach((key) => {
      const col = this.columns.value.leafs.findOrThrow((c) => c.key === key);
      size[col.groupColumnWidthVarName] = `${visibleLeafs.sumBy((c) => (c.pin === col.pin ? (c.inlineWidth ?? 0) : 0))}px`;
    });

    return size;
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

  public setSortColumn: (columnKey: Key, sortDirection?: SortDirection) => void = (columnKey: Key, ...sortDirection: any[]) => {
    if (sortDirection.length > 0) {
      [this._sortDirection] = sortDirection;
      this._sortColumn = this._sortDirection ? columnKey : undefined;
    } else {
      const { _sortColumn, _sortDirection } = this;

      this._sortColumn = _sortColumn === columnKey && _sortDirection === 'DESC' ? undefined : columnKey;
      this._sortDirection = _sortColumn === columnKey && _sortDirection === 'ASC' ? 'DESC' : 'ASC';
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
    this.sizes.clear();

    this.update();
  };

  public toggleGrouping = (columnKey: Key) => {
    if (this.groupColumns.includes(columnKey)) {
      this.groupColumns = this.groupColumns.removeBy((key) => key === columnKey);
      this.hiddenColumns = this.hiddenColumns.removeBy((key) => key === columnKey);
    } else {
      this.groupColumns = this.groupColumns.add(columnKey);
      this.hiddenColumns = this.hiddenColumns.add(columnKey);
    }

    const groupingColumn = this._sourceColumns.find((c) => c.key === GROUPING_CELL_KEY);
    if (this.groupColumns.length > 0 && !groupingColumn) {
      const position = this._sourceColumns.sumBy((c) => (c.key === ROW_NUMBER_CELL_KEY || c.key === ROW_SELECTION_CELL_KEY ? 1 : 0));
      this._sourceColumns.splice(position, 0, new ColumnModel({ key: GROUPING_CELL_KEY }, this));
    } else if (this.groupColumns.length === 0 && groupingColumn) {
      this._sourceColumns = this._sourceColumns.removeBy((c) => c.key === GROUPING_CELL_KEY);
    }

    this.columns.clear();
    this.headerRows.clear();
    this.gridTemplateColumns.clear();
    this.rows.clear();
    this.flatRows.clear();
    this.sizes.clear();

    this.update();
  };

  public unGroupAll = () => {
    this.groupColumns = [];
    this._sourceColumns = this._sourceColumns.removeBy((c) => c.key === GROUPING_CELL_KEY);

    this.columns.clear();
    this.headerRows.clear();
    this.gridTemplateColumns.clear();
    this.rows.clear();
    this.flatRows.clear();
    this.sizes.clear();
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

  public toggleColumnVisibility = (columnKey: Key) => {
    if (this.hiddenColumns.includes(columnKey)) {
      this.hiddenColumns = this.hiddenColumns.removeBy((key) => key === columnKey);
    } else {
      this.hiddenColumns = this.hiddenColumns.add(columnKey);
    }

    this.columns.clear();
    this.headerRows.clear();
    this.gridTemplateColumns.clear();
    this.rows.clear();
    this.flatRows.clear();
    this.sizes.clear();

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
  public hiddenColumns: Key[] = [];

  private _sortColumn?: Key;
  public get sortColumn() {
    return this._sortColumn;
  }
  private _sortDirection: SortDirection = 'ASC';
  public get sortDirection() {
    return this._sortDirection;
  }
}
