import Box from '../../../box';
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
    <Grid
      component={`${grid.componentName}.header` as never}
      props={{ role: 'rowgroup' }}
      style={{ gridTemplateColumns: grid.gridTemplateColumns.value }}
    >
      {grid.headerRows.value.map((row, rowIndex) => {
        return (
          // `display: contents` is what lets a row exist for the accessibility tree without
          // existing for the layout: the cells stay direct children of the header's CSS grid, so
          // a column still spans the rows above and below it.
          <Box key={rowIndex} display="contents" props={{ role: 'row', 'aria-rowindex': rowIndex + 1 }}>
            {row.map((cell, columnIndex) => (
              <DataGridHeaderCell key={cell.uniqueKey} column={cell} row={rowIndex} columnIndex={columnIndex} />
            ))}
          </Box>
        );
      })}

      <DataGridFilterRow grid={grid} />
    </Grid>
  );
}

(DataGridHeader as React.FunctionComponent).displayName = 'DataGridHeader';
