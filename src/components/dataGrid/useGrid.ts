import { useEffect, useRef, useState } from 'react';
import { DataGridProps } from './contracts/dataGridContract';
import GridModel from './models/gridModel';

export default function useGrid<TRow>(props: DataGridProps<TRow>): GridModel<TRow> {
  const [_, setUpdate] = useState(0);

  const gridRef = useRef<GridModel<TRow>>();
  if (!gridRef.current) {
    gridRef.current = new GridModel(props, () => setUpdate((u) => u + 1));
  }

  // This ensures any prop changes are updated in the model
  useEffect(() => {
    gridRef.current!.props = props;
    gridRef.current!.rows.clear();
    gridRef.current!.flatRows.clear();
    gridRef.current!.update();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data]);

  useEffect(() => {
    gridRef.current!.props = props;
    gridRef.current!.sourceColumns.clear();
    gridRef.current!.columns.clear();
    gridRef.current!.headerRows.clear();
    gridRef.current!.gridTemplateColumns.clear();
    gridRef.current!.rows.clear();
    gridRef.current!.flatRows.clear();
    gridRef.current!.sizes.clear();
    gridRef.current!.update();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.def]);

  useEffect(() => {
    gridRef.current!.props = props;
    gridRef.current!.update();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.loading]);

  // Handle controlled filter changes
  useEffect(() => {
    gridRef.current!.props = props;
    gridRef.current!.rows.clear();
    gridRef.current!.flatRows.clear();
    gridRef.current!.update();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.globalFilterValue, props.columnFilters, props.filters]);

  return gridRef.current;
}
