import '../../../array';
import memo from '../../../utils/memo';
import { fuzzySearch } from '../../../utils/string/fuzzySearch';
import DataGridCellRowSelection from '../components/dataGridCellRowSelection';
import { ColumnFilters, DataGridProps, FilterValue, Key, NO_PIN, PinPosition } from '../contracts/dataGridContract';
import ColumnModel from './columnModel';
import GroupRowModel from './groupRowModel';
import RowModel from './rowModel';

export const EMPTY_CELL_KEY: Key = 'empty-cell';
export const ROW_NUMBER_CELL_KEY: Key = 'row-number-cell';
export const DEFAULT_ROW_NUMBER_COLUMN_WIDTH = 70;
export const ROW_SELECTION_CELL_KEY: Key = 'row-selection-cell';
export const GROUPING_CELL_KEY: Key = 'grouping-cell';

export default class GridModel<TRow> {
  constructor(
    public props: DataGridProps<TRow>,
    public readonly update: () => void,
  ) {
    console.debug('\x1b[32m%s\x1b[0m', '[react-box]: DataGrid GridModel ctor');
  }

  public readonly sourceColumns = memo(() => {
    const { def } = this.props;

    const sourceColumns: ColumnModel<TRow>[] = [];

    if (this.groupColumns.size > 0) {
      sourceColumns.push(new ColumnModel({ key: GROUPING_CELL_KEY }, this));
    }

    sourceColumns.push(...def.columns.map((d) => new ColumnModel(d, this)));

    // add empty column
    sourceColumns.push(new ColumnModel({ key: EMPTY_CELL_KEY, Cell: () => null }, this));

    // add row selection column
    if (def.rowSelection) {
      const pin: PinPosition | undefined = typeof def.rowSelection === 'object' && def.rowSelection.pinned ? 'LEFT' : undefined;

      sourceColumns.unshift(
        new ColumnModel({ key: ROW_SELECTION_CELL_KEY, pin, width: 50, align: 'center', Cell: DataGridCellRowSelection }, this),
      );
    }

    // add row number column
    if (def.showRowNumber) {
      let pin: PinPosition | undefined;
      let width: number | undefined = DEFAULT_ROW_NUMBER_COLUMN_WIDTH;
      if (typeof def.showRowNumber === 'object') {
        def.showRowNumber.pinned && (pin = 'LEFT');
        width = def.showRowNumber.width ?? DEFAULT_ROW_NUMBER_COLUMN_WIDTH;
      }

      sourceColumns.unshift(new ColumnModel({ key: ROW_NUMBER_CELL_KEY, pin, width, align: 'right' }, this));
    }

    return sourceColumns;
  });

  public readonly columns = memo(() => {
    console.debug('\x1b[36m%s\x1b[0m', '[react-box]: DataGrid columns memo');

    const left = this.sourceColumns.value.map((c) => c.getPinnedColumn('LEFT')).filter((c) => !!c);
    const middle = this.sourceColumns.value.map((c) => c.getPinnedColumn()).filter((c) => !!c);
    const right = this.sourceColumns.value.map((c) => c.getPinnedColumn('RIGHT')).filter((c) => !!c);
    const flat = [...left, ...middle, ...right].flatMap((c) => c.flatColumns);
    const leafs = flat.filter((x) => x.isLeaf);
    const visibleLeafs = flat.filter((x) => x.isLeaf && x.isVisible);
    const userVisibleLeafs = visibleLeafs.filter(
      (c) => ![EMPTY_CELL_KEY, ROW_NUMBER_CELL_KEY, ROW_SELECTION_CELL_KEY, GROUPING_CELL_KEY].includes(c.key),
    );
    const maxDeath = flat.maxBy((x) => x.death) + 1;

    return {
      left,
      middle,
      right,
      flat,
      leafs,
      visibleLeafs,
      userVisibleLeafs,
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

  // ========== Filtering ==========

  private _globalFilterValue = '';
  public get globalFilterValue(): string {
    return this.props.globalFilterValue ?? this._globalFilterValue;
  }

  private _columnFilters: ColumnFilters<TRow> = {};
  public get columnFilters(): ColumnFilters<TRow> {
    return this.props.columnFilters ?? this._columnFilters;
  }

  /**
   * Apply global filter (fuzzy search across all or specified columns)
   */
  private applyGlobalFilter(data: TRow[]): TRow[] {
    const filterValue = this.globalFilterValue.trim();
    if (!filterValue) return data;

    const { globalFilterKeys } = this.props.def;
    const searchableColumns =
      globalFilterKeys ??
      this.columns.value.leafs
        .filter(
          (c) =>
            c.key !== EMPTY_CELL_KEY && c.key !== ROW_NUMBER_CELL_KEY && c.key !== ROW_SELECTION_CELL_KEY && c.key !== GROUPING_CELL_KEY,
        )
        .map((c) => c.key);

    return data.filter((row) => {
      return searchableColumns.some((key) => {
        const value = row[key as keyof TRow];
        if (value == null) return false;
        return fuzzySearch(filterValue, String(value));
      });
    });
  }

  /**
   * Apply column-level filters
   */
  private applyColumnFilters(data: TRow[]): TRow[] {
    const filters = this.columnFilters;
    const filterKeys = Object.keys(filters) as (keyof TRow)[];

    if (filterKeys.length === 0) return data;

    return data.filter((row) => {
      return filterKeys.every((key) => {
        const filter = filters[key];
        if (!filter) return true;

        const cellValue = row[key as keyof TRow];

        return this.matchesFilter(cellValue, filter);
      });
    });
  }

  /**
   * Check if a cell value matches a filter
   */
  private matchesFilter(cellValue: unknown, filter: FilterValue): boolean {
    switch (filter.type) {
      case 'text': {
        if (!filter.value.trim()) return true;
        if (cellValue == null) return false;
        return fuzzySearch(filter.value, String(cellValue));
      }

      case 'number': {
        if (cellValue == null) return false;
        const numValue = typeof cellValue === 'number' ? cellValue : parseFloat(String(cellValue));
        if (isNaN(numValue)) return false;

        switch (filter.operator) {
          case 'eq':
            return numValue === filter.value;
          case 'ne':
            return numValue !== filter.value;
          case 'gt':
            return numValue > filter.value;
          case 'gte':
            return numValue >= filter.value;
          case 'lt':
            return numValue < filter.value;
          case 'lte':
            return numValue <= filter.value;
          case 'between':
            return filter.valueTo !== undefined ? numValue >= filter.value && numValue <= filter.valueTo : numValue >= filter.value;
          default:
            return true;
        }
      }

      case 'multiselect': {
        if (filter.values.length === 0) return true;
        return filter.values.includes(cellValue as string | number | boolean | null);
      }

      default:
        return true;
    }
  }

  /**
   * Get filtered data (applies global filter then column filters)
   */
  public get filteredData(): TRow[] {
    let data = this.props.data;

    // Apply global filter
    if (this.props.def.globalFilter) {
      data = this.applyGlobalFilter(data);
    }

    // Apply column filters
    data = this.applyColumnFilters(data);

    return data;
  }

  /**
   * Set global filter value
   */
  public setGlobalFilter = (value: string): void => {
    if (this.props.onGlobalFilterChange) {
      this.props.onGlobalFilterChange(value);
    } else {
      this._globalFilterValue = value;
    }

    this.rows.clear();
    this.flatRows.clear();
    this.update();
  };

  /**
   * Set a single column filter
   */
  public setColumnFilter = (columnKey: Key, filter: FilterValue | undefined): void => {
    const newFilters = { ...this.columnFilters };

    if (filter === undefined) {
      delete newFilters[columnKey as keyof TRow];
    } else {
      newFilters[columnKey as keyof TRow] = filter;
    }

    if (this.props.onColumnFiltersChange) {
      this.props.onColumnFiltersChange(newFilters);
    } else {
      this._columnFilters = newFilters;
    }

    this.rows.clear();
    this.flatRows.clear();
    this.update();
  };

  /**
   * Clear all column filters
   */
  public clearColumnFilters = (): void => {
    if (this.props.onColumnFiltersChange) {
      this.props.onColumnFiltersChange({});
    } else {
      this._columnFilters = {};
    }

    this.rows.clear();
    this.flatRows.clear();
    this.update();
  };

  /**
   * Clear all filters (global + column)
   */
  public clearAllFilters = (): void => {
    this.setGlobalFilter('');
    this.clearColumnFilters();
  };

  /**
   * Get unique values for a column (used for multiselect filter options)
   */
  public getColumnUniqueValues = (columnKey: Key): (string | number | boolean | null)[] => {
    const values = new Set<string | number | boolean | null>();

    this.props.data.forEach((row) => {
      const value = row[columnKey as keyof TRow];
      if (value !== undefined) {
        values.add(value as string | number | boolean | null);
      }
    });

    return Array.from(values).sort((a, b) => {
      if (a === null) return 1;
      if (b === null) return -1;
      if (typeof a === 'string' && typeof b === 'string') return a.localeCompare(b);
      if (typeof a === 'number' && typeof b === 'number') return a - b;
      return String(a).localeCompare(String(b));
    });
  };

  /**
   * Check if any filter is active
   */
  public get hasActiveFilters(): boolean {
    return this.globalFilterValue.trim() !== '' || Object.keys(this.columnFilters).length > 0;
  }

  /**
   * Get count of filtered rows vs total rows
   */
  public get filterStats(): { filtered: number; total: number } {
    return {
      filtered: this.filteredData.length,
      total: this.props.data.length,
    };
  }

  public readonly rows = memo(() => {
    console.debug('\x1b[36m%s\x1b[0m', '[react-box]: DataGrid rows memo');
    let data = this.filteredData;

    if (this._sortColumn) {
      data = data.sortBy((x) => x[this._sortColumn as keyof TRow], this._sortDirection);
    }

    if (this.groupColumns.size > 0) {
      const getRowsGroup = (dataToGroup: TRow[], groupColumns: Set<Key>, rowIndex: number): GroupRowModel<TRow>[] => {
        const groupKey = groupColumns.values().next().value!;
        groupColumns.delete(groupKey);
        const column = this.columns.value.leafs.findOrThrow((c) => c.key === groupKey);

        if (this._sortColumn === GROUPING_CELL_KEY) {
          dataToGroup = dataToGroup.sortBy((x) => x[groupKey as keyof TRow], this._sortDirection);
        }

        return dataToGroup
          .groupBy((item) => item[groupKey as keyof TRow] as Key)
          .map((group) => {
            let rows: RowModel<TRow>[] | GroupRowModel<TRow>[];

            if (groupColumns.size > 0) {
              rows = getRowsGroup(group.values, new Set(groupColumns), rowIndex + 1);
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

      return getRowsGroup(data, new Set(this.groupColumns), 0);
    }

    return data.map((dataRow, rowIndex) => new RowModel(this, dataRow, rowIndex));
  });

  public readonly flatRows = memo(() => {
    console.debug('\x1b[36m%s\x1b[0m', '[react-box]: DataGrid flatRows memo');

    return this.rows.value.flatMap((row) => {
      return row.flatRows;
    });
  });

  public get rowHeight() {
    return this.props.def.rowHeight ?? this.DEFAULT_ROW_HEIGHT_PX;
  }

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

    size[this.rowHeightVarName] = `${this.rowHeight}px`;
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

  public readonly DEFAULT_ROW_HEIGHT_PX = 48;
  public readonly MIN_COLUMN_WIDTH_PX = 48;
  public readonly DEFAULT_COLUMN_WIDTH_PX = 200;

  public isResizeMode = false;
  public expandedGroupRow: Set<Key> = new Set();
  public selectedRows: Set<Key> = new Set();
  public get leftEdge() {
    return this.columns.value.left.sumBy((c) => c.inlineWidth ?? 0);
  }
  public get rightEdge() {
    return this.columns.value.right.sumBy((c) => c.inlineWidth ?? 0);
  }
  public readonly leftEdgeVarName = '--left-edge';
  public readonly rowHeightVarName = '--row-height';

  private readonly _idMap = new WeakMap<WeakKey, Key>();
  public getRowKey(row: TRow): Key {
    const { rowKey } = this.props.def;

    if (rowKey) {
      return typeof rowKey === 'function' ? rowKey(row) : (row[rowKey] as string);
    }

    if (!this._idMap.has(row as WeakKey)) {
      this._idMap.set(row as WeakKey, crypto.randomUUID());
    }

    return this._idMap.get(row as WeakKey)!;
  }

  public setSortColumn: (columnKey: Key, sortDirection?: SortDirection) => void = (
    columnKey: Key,
    ...sortDirection: [SortDirection | undefined]
  ) => {
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
    this.groupColumns = new Set(this.groupColumns);
    this.hiddenColumns = new Set(this.hiddenColumns);

    if (this.groupColumns.has(columnKey)) {
      this.groupColumns.delete(columnKey);
      this.hiddenColumns.delete(columnKey);
    } else {
      this.groupColumns.add(columnKey);
      this.hiddenColumns.add(columnKey);
    }

    this.sourceColumns.clear();
    this.columns.clear();
    this.headerRows.clear();
    this.gridTemplateColumns.clear();
    this.rows.clear();
    this.flatRows.clear();
    this.sizes.clear();

    this.update();
  };

  public unGroupAll = () => {
    const prevGroupColumns = new Set(this.groupColumns);
    this.groupColumns = new Set();
    // Ensure previously grouped columns are made visible again
    this.hiddenColumns = new Set(Array.from(this.hiddenColumns).filter((key) => !prevGroupColumns.has(key)));

    this.sourceColumns.clear();
    this.columns.clear();
    this.headerRows.clear();
    this.gridTemplateColumns.clear();
    this.rows.clear();
    this.flatRows.clear();
    this.sizes.clear();
    this.update();
  };

  public toggleGroupRow = (groupRowKey: Key) => {
    this.expandedGroupRow = new Set(this.expandedGroupRow);

    if (this.expandedGroupRow.has(groupRowKey)) {
      this.expandedGroupRow.delete(groupRowKey);
    } else {
      this.expandedGroupRow.add(groupRowKey);
    }

    this.rows.clear(); // this one is required in order to update rowIndex
    this.flatRows.clear();
    this.update();
  };

  public toggleRowSelection = (rowKey: Key) => {
    this.toggleRowsSelection([rowKey]);
  };

  public toggleRowsSelection = (rowKeys: Key[]) => {
    this.selectedRows = new Set(this.selectedRows);

    const hasAllSelected = rowKeys.every((rowKey) => this.selectedRows.has(rowKey));

    if (hasAllSelected) {
      rowKeys.forEach((rowKey) => this.selectedRows.delete(rowKey));
    } else {
      rowKeys.forEach((rowKey) => this.selectedRows.add(rowKey));
    }

    this.flatRows.clear();
    this.update();

    this.props.onSelectionChange?.({
      action: hasAllSelected ? 'deselect' : 'select',
      affectedRowKeys: rowKeys,
      selectedRowKeys: Array.from(this.selectedRows),
      isAllSelected: this.selectedRows.size === this.props.data.length,
    });
  };

  public toggleSelectAllRows = () => {
    this.toggleRowsSelection(this.props.data.map((x) => this.getRowKey(x)));
  };

  public toggleColumnVisibility = (columnKey: Key) => {
    this.hiddenColumns = new Set(this.hiddenColumns);

    if (this.hiddenColumns.has(columnKey)) {
      this.hiddenColumns.delete(columnKey);
    } else {
      this.hiddenColumns.add(columnKey);
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

    const sourceLeaf = this.sourceColumns.value.flatMap((x) => x.flatColumns).findOrThrow((l) => l.key === columnKey);
    sourceLeaf.setWidth(width);
  };

  public groupColumns: Set<Key> = new Set();
  public hiddenColumns: Set<Key> = new Set();

  private _sortColumn?: Key;
  public get sortColumn() {
    return this._sortColumn;
  }
  private _sortDirection?: SortDirection = 'ASC';
  public get sortDirection() {
    return this._sortDirection;
  }
}
