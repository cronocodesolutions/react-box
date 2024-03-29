export interface GridCell<T> {
  key: keyof T;
  value: React.ReactNode;
}

export interface GridColumn<T extends {}> {
  key: keyof T;
}

export interface GridRow<T extends {}> {
  dataRow: T;
  cells: GridCell<T>[];
}

export interface Grid<T extends {}> {
  columns: GridColumn<T>[];
  rows: GridRow<T>[];
}
