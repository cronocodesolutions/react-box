import { useMemo, useState } from 'react';
import { DataGridProps } from './dataGridContract';
import Grid from './models/grid';

export default function useGrid<TRow>(props: DataGridProps<TRow>): Grid<TRow> {
  const grid = useMemo(() => new Grid(props, () => setUpdate((prev) => prev + 1)), [props]);

  const [update, setUpdate] = useState(0);
  // TODO: find a way to clone correct
  const gridToUse = useMemo(() => ({ ...grid }), [grid, update]);

  return gridToUse as Grid<TRow>;
}
