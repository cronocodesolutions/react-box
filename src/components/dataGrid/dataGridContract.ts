export type Key = string | number;
export type PinPosition = 'LEFT' | 'RIGHT';
export type SortColumnType<TRow> = { key: keyof TRow; dir: SortDirection };
export type KeysMatching<T, V> = { [K in keyof T]-?: T[K] extends V ? K : never }[keyof T];
export interface PaginationState {
  pageSize: number;
  page: number;
  totalItems: number;
  totalPages: number;
}
export type Pagination = boolean | { pageSize: number };

export interface ParentColumn<TRow> {
  key: string;
  columns: ColumnType<TRow>[];
}
export interface Column<TRow> {
  key: KeysMatching<TRow, Key>;
}

export type ColumnType<TRow> = Column<TRow> | ParentColumn<TRow>;

export interface GridDefinition<TRow> {
  rowKey?: KeysMatching<TRow, Key> | ((rowData: TRow) => Key);
  columns: ColumnType<TRow>[];
  pagination?: Pagination;
}

export interface DataGridProps<TRow> {
  data: TRow[];
  def: GridDefinition<TRow>;
}

interface GridRow {
  key: Key;
}

// accepted

export type GridRow2 = GridNormalRow2 | GridGroupRow2;

export interface GridGroupRow2 {
  key: Key;
  isGrouped: true;
  count: number;
  cells: GridCell2[];
}

export interface GridNormalRow2 {
  key: Key;
  isGrouped: false;
  cells: GridCell2[];
}

export interface GridCell2 {
  key: Key;
  value?: unknown;
  height?: number;
  inlineWidth?: number | 'auto';
  isHeader?: boolean;
  colSpan?: number;
  rowSpan?: number;
  sortDirection?: SortDirection;
  top?: number;
  left?: number;
  right?: number;
  pinned?: PinPosition;
  edge?: boolean;
  isExpandableCell?: boolean;
  expandableCellLevel?: number;
  isExpanded?: boolean;
  sortColumn?(): void;
  resizeColumn?(e: React.MouseEvent): void;
  // TODO: split GridCell to simple cell and header cell to make pinColumn not undefined-able
  pinColumn?(pin?: PinPosition): void;
  toggleGroupColumn?(): void;
  unGroupAllColumns?(): void;
}

export interface GridHeaderCell extends GridCell2 {}

export interface GridValueCell extends GridCell2 {}
