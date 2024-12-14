import { Key } from 'react';

export type SortDirection = 'ASC' | 'DESC';

type KeysMatching<T, V> = { [K in keyof T]-?: T[K] extends V ? K : never }[keyof T];

export interface GridDef<TRow> {
  rowKey?: KeysMatching<TRow, Key> | ((rowData: TRow) => Key);
  columns: GridColumn<TRow>[];
  pagination?: GridPagination;
}

export interface GridColumn<TRow> {
  key: KeysMatching<TRow, Key>;
}

export type GridPagination = boolean | { pageSize: number };

export interface GridRow {
  key: Key;
  cells: GridCell[];
}

export interface GridCell {
  key: Key;
  value?: string;
  width?: number;
  inlineWidth?: number;
  isHeader?: boolean;
  sortDirection?: SortDirection;
  sortColumn?(): void;
  resizeColumn?(e: React.MouseEvent): void;
}
