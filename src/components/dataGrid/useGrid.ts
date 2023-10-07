interface GridCell {
  value: string;
}

interface GridColumn<T extends {}> {
  key: string | number;
}

interface GridRow<T extends {}> {
  dataRow: T;
  cells: GridCell[];
}

interface Grid<T extends {}> {
  columns: GridColumn<T>[];
  rows: GridRow<T>[];
}

export default function useGrid<T extends {}>(data?: T[]): Grid<T> {
  if (!data?.length) {
    return {
      rows: [],
      columns: [],
    };
  }

  const keys = Object.keys(data[0]);

  return {
    rows: data.map((dataRow) => ({
      dataRow,
      cells: keys.map((key) => ({
        value: key,
      })),
    })),
    columns: keys.map((key) => ({
      key,
    })),
  };
}
