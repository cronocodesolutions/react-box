import '../../../array';
import { ComponentsAndVariants } from '../../../types';
import memo from '../../../utils/memo';
import { fuzzySearch } from '../../../utils/string/fuzzySearch';
import DataGridCellRowDetail from '../components/dataGridCellRowDetail';
import DataGridCellRowSelection from '../components/dataGridCellRowSelection';
import {
  ColumnFilters,
  DataGridProps,
  FilterValue,
  Key,
  NO_PIN,
  PaginationState,
  PinPosition,
  ServerState,
} from '../contracts/dataGridContract';
import ColumnModel from './columnModel';
import DetailRowModel from './detailRowModel';
import GroupRowModel from './groupRowModel';
import RowModel from './rowModel';

export const EMPTY_CELL_KEY: Key = 'empty-cell';
export const ROW_NUMBER_CELL_KEY: Key = 'row-number-cell';
export const DEFAULT_ROW_NUMBER_COLUMN_WIDTH = 70;
export const ROW_SELECTION_CELL_KEY: Key = 'row-selection-cell';
export const GROUPING_CELL_KEY: Key = 'grouping-cell';
export const ROW_DETAIL_CELL_KEY: Key = 'row-detail-cell';

export default class GridModel<TRow> {
  constructor(
    public props: DataGridProps<TRow>,
    public readonly update: () => void,
  ) {
    console.debug('\x1b[32m%s\x1b[0m', '[react-box]: DataGrid GridModel ctor');
  }

  public get componentName(): keyof ComponentsAndVariants {
    return (this.props.component || 'datagrid') as keyof ComponentsAndVariants;
  }

  public readonly sourceColumns = memo(() => {
    const { def } = this.props;

    const sourceColumns: ColumnModel<TRow>[] = [];

    if (this.groupColumns.size > 0) {
      sourceColumns.push(new ColumnModel({ key: GROUPING_CELL_KEY }, this));
    }

    sourceColumns.push(...def.columns.map((d) => new ColumnModel(d, this)));

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

    // add row detail expand column
    if (def.rowDetail) {
      const pin: PinPosition | undefined = def.rowDetail.pinned ? 'LEFT' : undefined;
      const width = def.rowDetail.expandColumnWidth ?? 50;

      sourceColumns.unshift(new ColumnModel({ key: ROW_DETAIL_CELL_KEY, pin, width, align: 'center', Cell: DataGridCellRowDetail }, this));
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
      (c) => ![EMPTY_CELL_KEY, ROW_NUMBER_CELL_KEY, ROW_SELECTION_CELL_KEY, GROUPING_CELL_KEY, ROW_DETAIL_CELL_KEY].includes(c.key),
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
    const leftAndMiddleCount = visibleLeafs.length - rightPinnedColumnsCount;

    const left = leftAndMiddleCount > 0 ? `repeat(${leftAndMiddleCount}, max-content)` : '';
    const right = rightPinnedColumnsCount > 0 ? `repeat(${rightPinnedColumnsCount}, max-content)` : '';

    return `${left} ${right}`.trim();
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
            c.key !== EMPTY_CELL_KEY &&
            c.key !== ROW_NUMBER_CELL_KEY &&
            c.key !== ROW_SELECTION_CELL_KEY &&
            c.key !== GROUPING_CELL_KEY &&
            c.key !== ROW_DETAIL_CELL_KEY,
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
   * Apply external predicate filters from the filters prop
   */
  private applyExternalFilters(data: TRow[]): TRow[] {
    const filters = this.props.filters;
    if (!filters || filters.length === 0) return data;

    return data.filter((row) => filters.every((predicate) => predicate(row)));
  }

  /**
   * Get filtered data (applies external, global, then column filters)
   */
  public get filteredData(): TRow[] {
    // With server-side pagination, data is already filtered by the server
    if (this.isPaginated) return this.props.data;

    let data = this.props.data;

    // Apply external predicate filters
    data = this.applyExternalFilters(data);

    // Apply global filter
    if (this.props.def.globalFilter) {
      data = this.applyGlobalFilter(data);
    }

    // Apply column filters
    data = this.applyColumnFilters(data);

    return data;
  }

  private fireServerStateChange(overrides?: Partial<ServerState<TRow>>): void {
    this.props.onServerStateChange?.({
      page: overrides?.page ?? this.page,
      pageSize: this.pageSize,
      sortColumn: 'sortColumn' in (overrides ?? {}) ? overrides!.sortColumn : this._sortColumn,
      sortDirection: 'sortDirection' in (overrides ?? {}) ? overrides!.sortDirection : this._sortDirection,
      columnFilters: overrides?.columnFilters ?? this.columnFilters,
      globalFilterValue: overrides?.globalFilterValue ?? this.globalFilterValue,
    });
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

    // Reset to page 1 when filter changes (server needs to re-filter from first page)
    const nextPage = this.isPaginated && this.page !== 1 ? 1 : this.page;
    if (nextPage !== this.page) {
      if (this.props.onPageChange) {
        this.props.onPageChange(1, this.pageSize);
      } else {
        this._page = 1;
      }
    }

    this.fireServerStateChange({ globalFilterValue: value, page: nextPage });

    this.rows.clear();
    this.flatRows.clear();
    this.rowOffsets.clear();
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

    // Reset to page 1 when filter changes (server needs to re-filter from first page)
    const nextPage = this.isPaginated && this.page !== 1 ? 1 : this.page;
    if (nextPage !== this.page) {
      if (this.props.onPageChange) {
        this.props.onPageChange(1, this.pageSize);
      } else {
        this._page = 1;
      }
    }

    this.fireServerStateChange({ columnFilters: newFilters, page: nextPage });

    this.rows.clear();
    this.flatRows.clear();
    this.rowOffsets.clear();
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

    this.fireServerStateChange({ columnFilters: {} });

    this.rows.clear();
    this.flatRows.clear();
    this.rowOffsets.clear();
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
    if (this.isPaginated) {
      const totalCount = this.props.def.pagination!.totalCount;
      return { filtered: totalCount, total: totalCount };
    }
    return {
      filtered: this.filteredData.length,
      total: this.props.data.length,
    };
  }

  public readonly rows = memo(() => {
    console.debug('\x1b[36m%s\x1b[0m', '[react-box]: DataGrid rows memo');
    let data = this.filteredData;

    if (this._sortColumn && !this.isPaginated) {
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
      return row.flatRows as (RowModel<TRow> | GroupRowModel<TRow> | DetailRowModel<TRow>)[];
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
        return c.pin === groupingColumn.pin &&
          c.key !== ROW_NUMBER_CELL_KEY &&
          c.key !== ROW_SELECTION_CELL_KEY &&
          c.key !== ROW_DETAIL_CELL_KEY
          ? (c.inlineWidth ?? 0)
          : 0;
      });
      size[groupingColumn.groupColumnWidthVarName] = `${groupingColumnSize}px`;
    }

    this.groupColumns.forEach((key) => {
      const col = this.columns.value.leafs.findOrThrow((c) => c.key === key);
      size[col.groupColumnWidthVarName] = `${visibleLeafs.sumBy((c) => (c.pin === col.pin ? (c.inlineWidth ?? 0) : 0))}px`;
    });

    return size;
  });

  // ========== Flexible Column Sizing ==========

  private _containerWidth = 0;
  public get containerWidth() {
    return this._containerWidth;
  }

  public setContainerWidth = (width: number) => {
    if (this._containerWidth !== width) {
      this._containerWidth = width;
      this.flexWidths.clear();
      this.sizes.clear();
      this.update();
    }
  };

  public readonly flexWidths = memo(() => {
    console.debug('\x1b[36m%s\x1b[0m', '[react-box]: DataGrid flexWidths memo');

    const containerWidth = this._containerWidth;
    if (containerWidth <= 0) return {};

    const visibleLeafs = this.columns.value.visibleLeafs.filter((c) => c.key !== EMPTY_CELL_KEY);

    // A column is "fixed" if: flexible: false OR it has been manually resized (in columnWidths)
    const isColumnFixed = (c: ColumnModel<TRow>) => !c.isFlexible || this.columnWidths.has(c.key);

    // Sum of fixed column widths
    const fixedWidth = visibleLeafs.filter(isColumnFixed).sumBy((c) => c.baseWidth);

    // Flexible columns (not fixed and not manually resized)
    const flexCols = visibleLeafs.filter((c) => !isColumnFixed(c));
    const totalFlexBase = flexCols.sumBy((c) => c.baseWidth);

    // Available space for flex columns
    const availableSpace = containerWidth - fixedWidth;

    // Distribute proportionally (never shrink below base width)
    if (availableSpace <= totalFlexBase) {
      // Not enough space - use base widths
      return flexCols.toRecord((c) => [c.key, c.baseWidth]);
    }

    // Proportional distribution using floor to avoid exceeding available space
    const result: Record<Key, number> = {};
    let distributed = 0;

    flexCols.forEach((c, index) => {
      if (index === flexCols.length - 1) {
        // Last column gets the remainder to avoid rounding issues
        result[c.key] = availableSpace - distributed;
      } else {
        const width = Math.floor((c.baseWidth / totalFlexBase) * availableSpace);
        result[c.key] = width;
        distributed += width;
      }
    });

    return result;
  });

  public getFlexWidth(key: Key): number | undefined {
    return this.flexWidths.value[key];
  }

  public readonly DEFAULT_ROW_HEIGHT_PX = 48;
  public readonly MIN_COLUMN_WIDTH_PX = 48;
  public readonly DEFAULT_COLUMN_WIDTH_PX = 200;

  public expandedGroupRow: Set<Key> = new Set();

  // ========== Row Detail Expansion ==========

  private _expandedDetailRows: Set<Key> = new Set();

  public get expandedDetailRows(): Set<Key> {
    if (this.props.expandedRowKeys) {
      return new Set(this.props.expandedRowKeys);
    }
    return this._expandedDetailRows;
  }

  public toggleDetailRow = (rowKey: Key) => {
    const expandedKeys = new Set(this.expandedDetailRows);

    if (expandedKeys.has(rowKey)) {
      expandedKeys.delete(rowKey);
    } else {
      expandedKeys.add(rowKey);
    }

    if (this.props.onExpandedRowKeysChange) {
      this.props.onExpandedRowKeysChange(Array.from(expandedKeys));
    } else {
      this._expandedDetailRows = expandedKeys;
    }

    this.rows.clear();
    this.flatRows.clear();
    this.rowOffsets.clear();
    this.update();
  };

  // ========== Pagination ==========

  private _page = 1;

  public get page(): number {
    return this.props.page ?? this._page;
  }

  public get pageSize(): number {
    const pagination = this.props.def.pagination;
    if (pagination?.pageSize) return pagination.pageSize;
    const vrc = this.props.def.visibleRowsCount;
    if (typeof vrc === 'number') return vrc;
    return 10;
  }

  public get isPaginated(): boolean {
    return !!this.props.def.pagination;
  }

  public get paginationState(): PaginationState | undefined {
    const pagination = this.props.def.pagination;
    if (!pagination) return undefined;
    const totalItems = pagination.totalCount;
    const pageSize = this.pageSize;
    return {
      page: this.page,
      pageSize,
      totalItems,
      totalPages: Math.max(1, Math.ceil(totalItems / pageSize)),
    };
  }

  public changePage = (page: number) => {
    const state = this.paginationState;
    if (!state) return;
    const clamped = Math.max(1, Math.min(page, state.totalPages));
    if (clamped === this.page) return;

    if (this.props.onPageChange) {
      this.props.onPageChange(clamped, state.pageSize);
    } else {
      this._page = clamped;
    }

    this.fireServerStateChange({ page: clamped });

    this.rows.clear();
    this.flatRows.clear();
    this.rowOffsets.clear();
    this.update();
  };

  // ========== Row Offsets (for variable-height virtualization) ==========

  public readonly rowOffsets = memo(() => {
    const offsets: number[] = [];
    let cumulative = 0;

    for (const row of this.flatRows.value) {
      offsets.push(cumulative);
      cumulative += row instanceof DetailRowModel ? row.heightForOffset : this.rowHeight;
    }

    return { offsets, totalHeight: cumulative };
  });

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

    // Notify parent for server-side sorting
    this.props.onSortChange?.(this._sortColumn, this._sortDirection);

    // Reset to page 1 when sort changes (server needs to re-sort from first page)
    const nextPage = this.isPaginated && this.page !== 1 ? 1 : this.page;
    if (nextPage !== this.page) {
      if (this.props.onPageChange) {
        this.props.onPageChange(1, this.pageSize);
      } else {
        this._page = 1;
      }
    }

    this.fireServerStateChange({ sortColumn: this._sortColumn, sortDirection: this._sortDirection, page: nextPage });

    this.headerRows.clear();
    this.rows.clear();
    this.flatRows.clear();
    this.rowOffsets.clear();
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
    this.rowOffsets.clear();
    this.flexWidths.clear();
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
    this.rowOffsets.clear();
    this.flexWidths.clear();
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
    this.rowOffsets.clear();
    this.flexWidths.clear();
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
    this.rowOffsets.clear();
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
    this.rowOffsets.clear();
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
    this.rowOffsets.clear();
    this.flexWidths.clear();
    this.sizes.clear();

    this.update();
  };

  public setWidth = (columnKey: Key, width: number) => {
    // Store width persistently so it survives memo recreation
    this.columnWidths.set(columnKey, width);
  };

  public groupColumns: Set<Key> = new Set();
  public hiddenColumns: Set<Key> = new Set();
  public columnWidths: Map<Key, number> = new Map();

  private _sortColumn?: Key;
  public get sortColumn() {
    return this._sortColumn;
  }
  private _sortDirection?: SortDirection = 'ASC';
  public get sortDirection() {
    return this._sortDirection;
  }
}
