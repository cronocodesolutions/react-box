import { useMemo } from 'react';
import { DataGridProps } from './dataGridContract';
import { DataGridHelper } from './dataGridHelper';

export default function useGridData<TRow>(props: DataGridProps<TRow>) {
  const helperInstance = useMemo(() => new DataGridHelper(props), [props]);
}
