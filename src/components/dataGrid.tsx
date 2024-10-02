import { Key, useId } from 'react';
import Box from '../box';
import { GridDef } from './dataGrid/dataGridContract';
import Grid from './grid';

interface Props<TRow> {
  data?: TRow[];
  def: GridDef<TRow>;
}

export default function DataGrid<TRow extends {}>(props: Props<TRow>) {
  const { data, def } = props;

  const { rowKey, columns } = def;

  if (columns.length === 0) {
    console.error('Cannot render grid without column definitions');

    return null;
  }

  return (
    <Box component="dataGrid">
      <Grid b={1} borderRadius={1}>
        {columns.map((column, index) => (
          <Box key={column.key.toString()} style={{ gridColumn: index + 1 }}>
            {column.key.toString()}
          </Box>
        ))}

        {(data?.length ?? 0) === 0 && <Box>Empty table</Box>}

        {(data?.length ?? 0) > 0 && (
          <>
            {data?.map((row, index) => {
              const key = rowKey ? ((typeof rowKey === 'function' ? rowKey(row) : row[rowKey]) as Key) : index;

              return (
                <Grid key={key} style={{ gridTemplateRows: 'subgrid' }}>
                  {columns.map((column, i) => (
                    <Box style={{ gridColumn: i + 1 }}>tes {i}</Box>
                  ))}
                </Grid>
              );
            })}
          </>
        )}
      </Grid>
    </Box>
  );
}

function DataGridRow() {
  const id = useId();

  return <Box key={id}>row</Box>;
}
