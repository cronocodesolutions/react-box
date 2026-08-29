import Box from '../../../box';
import GridModel from '../models/gridModel';
import DataGridFilterCell from './dataGridFilterCell';

interface Props<TRow> {
  grid: GridModel<TRow>;
}

export default function DataGridFilterRow<TRow>(props: Props<TRow>) {
  const { grid } = props;

  if (!grid.filter.hasFilterableColumns) return null;

  // The last row of the header rowgroup, and numbered as such: `aria-rowindex` counts every row
  // in the grid, header rows included, so the body carries on from here.
  const row = grid.headerRows.value.length;

  return (
    <Box display="contents" props={{ role: 'row', 'aria-rowindex': row + 1 }}>
      {grid.columns.value.visibleLeafs.map((column, columnIndex) => (
        <DataGridFilterCell key={column.uniqueKey} column={column} grid={grid} row={row} columnIndex={columnIndex} />
      ))}
    </Box>
  );
}

(DataGridFilterRow as React.FunctionComponent).displayName = 'DataGridFilterRow';
