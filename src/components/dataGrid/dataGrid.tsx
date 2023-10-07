import Box from '../../box';
import useGrid from './useGrid';

interface Props<T extends {}> {
  data?: T[];
}

export default function DataGrid<T extends {}>(props: Props<T>) {
  const { data } = props;

  const grid = useGrid(data);

  if (grid.columns.length === 0) {
    return <Box display="grid">empty grid</Box>;
  }

  return (
    <Box display="grid">
      {grid.columns.map((column, index) => (
        <Box key={column.key} style={{ gridColumn: index + 1 }}>
          {column.key}
        </Box>
      ))}
      {grid.rows.map(
        (row, rowIndex) =>
          // grid.columns.map((column, columnIndex) => (
          //   <Box key={column.key} style={{ gridColumn: columnIndex + 1 }}>
          //     {row.cells.data(column.key)}
          //   </Box>
          // )),
          'test',
      )}

      {/* {grid.columns.map((column, index) => (
        <Box key={column.key} style={{ gridColumn: index + 1 }}>
          {column.key}
        </Box>
      ))}
     */}
    </Box>
  );
}
