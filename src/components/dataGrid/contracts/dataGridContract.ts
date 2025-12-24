import CellModel from '../models/cellModel';

export type Key = string | number;
export type PinPosition = 'LEFT' | 'RIGHT';
export const NO_PIN = 'NO_PIN';
export type SortColumnType<TRow> = { key: keyof TRow; dir: SortDirection };
export type KeysMatching<T, V> = { [K in keyof T]-?: T[K] extends V ? K : never }[keyof T];
export interface PaginationState {
  pageSize: number;
  page: number;
  totalItems: number;
  totalPages: number;
}
export type Pagination = boolean | { pageSize: number };

// ========== Filter Types ==========

/** Filter type for column-level filtering */
export type ColumnFilterType = 'text' | 'number' | 'multiselect';

/** Text filter configuration (fuzzy search) */
export interface TextFilterValue {
  type: 'text';
  value: string;
}

/** Number filter configuration with comparison operators */
export interface NumberFilterValue {
  type: 'number';
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'between';
  value: number;
  valueTo?: number; // For 'between' operator
}

/** Multi-select filter configuration */
export interface MultiselectFilterValue {
  type: 'multiselect';
  values: (string | number | boolean | null)[];
}

/** Union type for all filter values */
export type FilterValue = TextFilterValue | NumberFilterValue | MultiselectFilterValue;

/** Column filters record - maps column key to filter value */
export type ColumnFilters<TRow> = Partial<Record<keyof TRow | Key, FilterValue>>;

/** Filter configuration for a column */
export interface ColumnFilterConfig {
  type: ColumnFilterType;
  /** Placeholder text for input */
  placeholder?: string;
  /** For multiselect: custom options. If not provided, unique values are computed from data */
  options?: { label: string; value: string | number | boolean | null }[];
  /** For number: step value for input */
  step?: number;
  /** For number: min value */
  min?: number;
  /** For number: max value */
  max?: number;
}

// ========== Column Type ==========

export interface ColumnType<TRow> {
  key: Key;
  header?: string;
  pin?: PinPosition;
  width?: number;
  columns?: ColumnType<TRow>[];
  align?: 'left' | 'right' | 'center';
  Cell?: React.ComponentType<{ cell: CellModel<TRow> }>;
  /** Enable filtering for this column. Set to true for default text filter, or provide config */
  filterable?: boolean | ColumnFilterConfig;
}

export interface GridDefinition<TRow> {
  rowKey?: KeysMatching<TRow, Key> | ((rowData: TRow) => Key);
  columns: ColumnType<TRow>[];
  showRowNumber?: boolean | { pinned?: boolean; width?: number };
  rowSelection?: boolean | { pinned?: boolean };
  rowHeight?: number;
  visibleRowsCount?: number;
  topBar?: boolean;
  bottomBar?: boolean;
  /** Enable global filter with fuzzy search */
  globalFilter?: boolean;
  /** Keys of columns to search in global filter. If not provided, all columns are searched */
  globalFilterKeys?: (keyof TRow | Key)[];
  // pagination?: Pagination;
}

export interface DataGridProps<TRow> {
  data: TRow[];
  def: GridDefinition<TRow>;
  loading?: boolean;
  onSelectionChange?: (event: SelectionChangeEvent<TRow>) => void;
  /** Controlled global filter value */
  globalFilterValue?: string;
  /** Callback when global filter changes */
  onGlobalFilterChange?: (value: string) => void;
  /** Controlled column filters */
  columnFilters?: ColumnFilters<TRow>;
  /** Callback when column filters change */
  onColumnFiltersChange?: (filters: ColumnFilters<TRow>) => void;
}

interface SelectionChangeEvent<TRow, TKey = TRow[keyof TRow] | number | string> {
  action: 'select' | 'deselect';
  selectedRowKeys: TKey[];
  affectedRowKeys: TKey[];
  isAllSelected: boolean;
}
