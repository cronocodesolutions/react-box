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
export interface ColumnType<TRow> {
  key: Key;
  header?: string;
  pin?: PinPosition;
  width?: number;
  columns?: ColumnType<TRow>[];
  align?: 'right' | 'center';
}

export interface GridDefinition<TRow> {
  rowKey?: KeysMatching<TRow, Key> | ((rowData: TRow) => Key);
  columns: ColumnType<TRow>[];
  // pagination?: Pagination;
}

export interface DataGridProps<TRow> {
  data: TRow[];
  def: GridDefinition<TRow>;
  onSelectionChange?: (event: SelectionChangeEvent<TRow>) => void;
}

interface SelectionChangeEvent<TRow, TKey = TRow[keyof TRow] | number | string> {
  action: 'select' | 'deselect';
  selectedRowKeys: TKey[];
  affectedRowKeys: TKey[];
  isAllSelected: boolean;
}
