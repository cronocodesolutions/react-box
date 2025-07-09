import { useRef, useState } from 'react';
import { DataGridProps } from './contracts/dataGridContract';
import GridModel from './models/gridModel';

export default function useGrid<TRow>(props: DataGridProps<TRow>): GridModel<TRow> {
  const [_, setUpdate] = useState(0);

  const gridRef = useRef<GridModel<TRow>>();
  if (!gridRef.current) {
    gridRef.current = new GridModel(props, () => setUpdate((u) => u + 1));
  }

  return gridRef.current;
}
