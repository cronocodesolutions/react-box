import { useRef, useSyncExternalStore } from 'react';
import { DataGridProps } from './contracts/dataGridContract';
import GridModel from './models/gridModel';

/**
 * React binding for the headless GridModel store.
 *
 * The model owns all state and behavior; React only subscribes. `setProps` syncs
 * incoming props during render (clearing affected memos lazily), and
 * `useSyncExternalStore` re-renders this component whenever the model calls notify().
 */
export default function useGrid<TRow>(props: DataGridProps<TRow>): GridModel<TRow> {
  const gridRef = useRef<GridModel<TRow>>();
  if (!gridRef.current) {
    gridRef.current = new GridModel(props);
  }

  const grid = gridRef.current;

  // Sync props during render — memos recompute lazily, so no extra render is triggered.
  grid.setProps(props);

  useSyncExternalStore(grid.subscribe, grid.getSnapshot, grid.getSnapshot);

  return grid;
}
