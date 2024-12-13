import { Key } from 'react';

type KeysMatching<T, V> = { [K in keyof T]-?: T[K] extends V ? K : never }[keyof T];

export interface GridDef<TRow> {
  rowKey?: KeysMatching<TRow, Key> | ((rowData: TRow) => Key);
  columns: GridColumn<TRow>[];
}

export interface GridColumn<TRow> {
  key: KeysMatching<TRow, Key>;
}

export interface GridRow {
  key: Key;
  cells: GridCell[];
}

export interface GridCell {
  key: Key;
  value?: string;
  // top?: number;
  width?: number;
  isHeader?: boolean;
}
