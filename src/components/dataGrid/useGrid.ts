import React from 'react';
import { Grid } from './dataGridContract';

export default function useGrid<T extends {}>(data?: T[]): Grid<T> {
  if (!data?.length) {
    return {
      rows: [],
      columns: [],
    };
  }

  const keys = Object.keys(data[0]) as (keyof T)[];

  return {
    rows: data.map((dataRow) => ({
      dataRow,
      cells: keys.map((key) => ({
        key,
        value: dataRow[key] as React.ReactNode,
      })),
    })),
    columns: keys.map((key) => ({
      key,
    })),
  };
}
