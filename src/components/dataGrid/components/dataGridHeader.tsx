import Grid from '../../grid';
import GridModel from '../models/gridModel';
import DataGridFilterRow from './dataGridFilterRow';
import DataGridHeaderCell from './dataGridHeaderCell';

interface Props<TRow> {
  grid: GridModel<TRow>;
}

export default function DataGridHeader<TRow>(props: Props<TRow>) {
  const { grid } = props;

  return (
    <Grid component="datagrid.header" style={{ gridTemplateColumns: grid.gridTemplateColumns.value }}>
      {grid.headerRows.value.map((row) => {
        return row.map((cell) => {
          return <DataGridHeaderCell key={cell.uniqueKey} column={cell} />;
        });
      })}

      <DataGridFilterRow grid={grid} />
    </Grid>
  );
}

(DataGridHeader as React.FunctionComponent).displayName = 'DataGridHeader';
