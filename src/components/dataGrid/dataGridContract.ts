import { Key } from 'react';

export type PinPosition = 'LEFT' | 'RIGHT';

export type SortColumnType<TRow> = { key: keyof TRow; dir: SortDirection };

type KeysMatching<T, V> = { [K in keyof T]-?: T[K] extends V ? K : never }[keyof T];

export type GridColumnType<TRow> = GridColumn<TRow> | GridColumnParent<TRow>;
export interface GridColumnParent<TRow> {
  key: string;
  columns: GridColumnType<TRow>[];
}

export interface GridColumn<TRow> {
  key: KeysMatching<TRow, Key>;
}

export interface GridDef<TRow> {
  rowKey?: KeysMatching<TRow, Key> | ((rowData: TRow) => Key);
  columns: GridColumnType<TRow>[];
  pagination?: GridPagination;
}

export type GridPagination = boolean | { pageSize: number };

export interface GridRow {
  key: Key;
  cells: GridCell[];
}

export interface HeaderCell {
  //
}

export interface GridCell {
  key: Key;
  value?: unknown;
  height?: number;
  width?: number;
  inlineWidth?: number;
  isHeader?: boolean;
  colSpan?: number;
  rowSpan?: number;
  sortDirection?: SortDirection;
  top?: number;
  left?: number;
  right?: number;
  pinned?: PinPosition;
  edge?: boolean;
  sortColumn?(): void;
  resizeColumn?(e: React.MouseEvent): void;
  // TODO: split GridCell to simple cell and header cell to make pinColumn not undefined-able
  pinColumn?(pin?: PinPosition): void;
}

export interface GridHeaderCell extends GridCell {}

export interface GridValueCell extends GridCell {}
