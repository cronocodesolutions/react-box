import { useMemo, useState } from 'react';
import { DataGridProps } from './dataGridContract';
import Grid from './models/grid';

export default function useGrid<TRow>(props: DataGridProps<TRow>) {
  const grid = useMemo(() => new Grid(props, () => setUpdate((prev) => prev + 1)), [props]);

  const [update, setUpdate] = useState(0);
  const gridToUse = useMemo(() => ({ ...grid }), [grid, update]);

  return gridToUse;
}
