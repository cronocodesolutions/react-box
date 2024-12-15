import { Key } from 'react';

export type SortDirection = 'ASC' | 'DESC';
export type PinPosition = 'LEFT' | 'RIGHT';

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
  pinLeft?: number;
  pinRight?: number;
  sortColumn?(): void;
  resizeColumn?(e: React.MouseEvent): void;
  // TODO: split GridCell to simple cell and header cell to make pinColumn not undefined-able
  pinColumn?(pin?: PinPosition): void;
}
