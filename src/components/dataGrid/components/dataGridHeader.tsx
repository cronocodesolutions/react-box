import DataGridHeaderCell from './dataGridHeaderCell';
import Grid from '../../grid';
import GridModel from '../models/gridModel';

interface Props<TRow> {
  grid: GridModel<TRow>;
}

export default function DataGridHeader<TRow>(props: Props<TRow>) {
  const { grid } = props;
  const { isResizeMode } = grid;

  return (
    <Grid component="datagrid.header" variant={{ isResizeMode }} style={{ gridTemplateColumns: grid.gridTemplateColumns.value }}>
      {grid.headerRows.value.map((row) => {
        return row.map((cell) => {
          return <DataGridHeaderCell key={cell.uniqueKey} column={cell} />;
        });
      })}
    </Grid>
  );
}

(DataGridHeader as React.FunctionComponent).displayName = 'DataGridHeader';
