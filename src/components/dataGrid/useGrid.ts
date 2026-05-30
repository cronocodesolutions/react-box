import { useState } from 'react';
// Shim delegates to React's native useSyncExternalStore on 18+, and provides a correct
// userland implementation on React 16.14–17, so the DataGrid works across React 17–19.
import { useSyncExternalStore } from 'use-sync-external-store/shim';
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
  // Lazy initializer creates the model once; the store instance stays stable across renders.
  const [grid] = useState(() => new GridModel(props));

  // Sync props during render — memos recompute lazily, so no extra render is triggered.
  grid.setProps(props);

  useSyncExternalStore(grid.subscribe, grid.getSnapshot, grid.getSnapshot);

  return grid;
}
