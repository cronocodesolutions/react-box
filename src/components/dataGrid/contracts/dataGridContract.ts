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
/** Server-side pagination configuration on GridDefinition */
export interface PaginationConfig {
  /** Total number of items across all pages (from server response) */
  totalCount: number;
  /** Page size override. If omitted, defaults to visibleRowsCount (or 10). */
  pageSize?: number;
}

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

// ========== Row Detail ==========

/** Configuration for expandable row detail panel */
export interface RowDetailConfig<TRow> {
  /** Render function for the detail content */
  content: (row: TRow) => React.ReactNode;
  /** Height of the detail row. 'auto' sizes to content. Default: 'auto' */
  height?: 'auto' | number | ((row: TRow) => number);
  /** Whether clicking the row also toggles expansion. Default: false */
  expandOnRowClick?: boolean;
  /** Pin the expand column to LEFT. Default: false */
  pinned?: boolean;
  /** Width of the expand column. Default: 50 */
  expandColumnWidth?: number;
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
  /** Enable sorting for this column. If undefined, inherits from GridDefinition.sortable */
  sortable?: boolean;
  /** Enable resizing for this column. If undefined, inherits from GridDefinition.resizable */
  resizable?: boolean;
  /** If false, column stays fixed at its width and doesn't participate in flex distribution. Default: true */
  flexible?: boolean;
}

export interface GridDefinition<TRow> {
  rowKey?: KeysMatching<TRow, Key> | ((rowData: TRow) => Key);
  columns: ColumnType<TRow>[];
  showRowNumber?: boolean | { pinned?: boolean; width?: number };
  rowSelection?: boolean | { pinned?: boolean };
  rowHeight?: number;
  /** Number of visible rows. Set to 'all' to render all rows without virtualization or vertical scrollbar. */
  visibleRowsCount?: number | 'all';
  topBar?: boolean;
  bottomBar?: boolean;
  /** Title displayed in the top bar */
  title?: React.ReactNode;
  /** Custom filters or actions rendered in the top bar */
  topBarContent?: React.ReactNode;
  /** Enable global filter with fuzzy search */
  globalFilter?: boolean;
  /** Keys of columns to search in global filter. If not provided, all columns are searched */
  globalFilterKeys?: (keyof TRow | Key)[];
  /** Enable sorting for all columns. Default is true. Individual column settings take priority. */
  sortable?: boolean;
  /** Enable resizing for all columns. Default is true. Individual column settings take priority. */
  resizable?: boolean;
  /** Custom component to render when data is empty */
  noDataComponent?: React.ReactNode;
  /** Enable expandable row detail panel */
  rowDetail?: RowDetailConfig<TRow>;
  /** Server-side pagination. Provide totalCount from the API response. */
  pagination?: PaginationConfig;
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
  /** External predicate filters applied before global/column filters. Memoize with useMemo for performance. */
  filters?: ((row: TRow) => boolean)[];
  /** Controlled expanded detail row keys */
  expandedRowKeys?: Key[];
  /** Callback when expanded detail rows change */
  onExpandedRowKeysChange?: (keys: Key[]) => void;
  /** Controlled current page (1-indexed). Used with pagination. */
  page?: number;
  /** Callback when page changes. Receives page (1-indexed) and pageSize. */
  onPageChange?: (page: number, pageSize: number) => void;
  /** Callback when sort changes. For server-side sorting with pagination. */
  onSortChange?: (columnKey: Key | undefined, direction: SortDirection | undefined) => void;
}

interface SelectionChangeEvent<TRow, TKey = TRow[keyof TRow] | number | string> {
  action: 'select' | 'deselect';
  selectedRowKeys: TKey[];
  affectedRowKeys: TKey[];
  isAllSelected: boolean;
}
