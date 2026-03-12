import { useRef, useState } from 'react';
import { DataGridProps } from './contracts/dataGridContract';
import GridModel from './models/gridModel';

export default function useGrid<TRow>(props: DataGridProps<TRow>): GridModel<TRow> {
  const [_, setUpdate] = useState(0);

  const gridRef = useRef<GridModel<TRow>>();
  if (!gridRef.current) {
    gridRef.current = new GridModel(props, () => setUpdate((u) => u + 1));
  }

  const grid = gridRef.current;
  const prev = grid.props;

  // Sync props during render — no useEffect needed.
  // Memos recompute lazily when accessed, so no extra render cycle is triggered.
  if (prev !== props) {
    grid.props = props;

    // Definition changed — clear everything (columns, headers, layout, rows)
    if (prev.def !== props.def) {
      grid.sourceColumns.clear();
      grid.columns.clear();
      grid.headerRows.clear();
      grid.gridTemplateColumns.clear();
      grid.sizes.clear();
    }

    // Clear row-related memos when any row-affecting prop changes
    if (
      prev.data !== props.data ||
      prev.def !== props.def ||
      prev.globalFilterValue !== props.globalFilterValue ||
      prev.columnFilters !== props.columnFilters ||
      prev.filters !== props.filters ||
      prev.expandedRowKeys !== props.expandedRowKeys ||
      prev.page !== props.page
    ) {
      grid.rows.clear();
      grid.flatRows.clear();
      grid.rowOffsets.clear();
    }
  }

  return grid;
}
