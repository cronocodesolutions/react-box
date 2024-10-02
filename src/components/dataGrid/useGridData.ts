import React from 'react';
import { GridColumn, GridData } from './dataGridContract';

interface Props<TRow> {
  data?: TRow[];
  columns: GridColumn<TRow>[];
}

export default function useGridData<TRow>(props: Props<TRow>): GridData<TRow> {
  const { data, columns } = props;

  if (!data?.length) {
    return {
      rows: [],
      columns: [],
    };
  }

  return {
    rows: [],
    columns,
  };
}
