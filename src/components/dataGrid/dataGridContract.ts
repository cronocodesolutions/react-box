import { Key } from 'react';

type KeysMatching<T, V> = { [K in keyof T]-?: T[K] extends V ? K : never }[keyof T];

export interface GridDef<TRow> {
  rowKey?: KeysMatching<TRow, Key> | ((rowData: TRow) => Key);
  columns: GridColumn<TRow>[];
}

export interface GridCell<TRow> {
  key: keyof TRow;
  value: React.ReactNode;
}

export interface GridColumn<TRow> {
  key: keyof TRow;
}

export interface GridRow<TRow> {
  dataRow: TRow;
  cells: GridCell<TRow>[];
}

export interface GridData<TRow> {
  columns: GridColumn<TRow>[];
  rows: GridRow<TRow>[];
}
