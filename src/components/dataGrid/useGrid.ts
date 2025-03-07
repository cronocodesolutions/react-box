import { useMemo, useState } from 'react';
import { DataGridProps } from './contracts/dataGridContract';
import GridModel from './models/gridModel';

export default function useGrid<TRow>(props: DataGridProps<TRow>): GridModel<TRow> {
  const grid = useMemo(() => new GridModel(props, () => setUpdate((prev) => prev + 1)), [props]);

  const [update, setUpdate] = useState(0);
  const gridToUse = useMemo(() => Object.create(Object.getPrototypeOf(grid), Object.getOwnPropertyDescriptors(grid)), [grid, update]);

  return gridToUse as GridModel<TRow>;
}
