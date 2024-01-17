import Box from '../box';
import useGrid from './dataGrid/useGrid';

interface Props<T extends {}> {
  data?: T[];
}

export default function DataGrid<T extends {}>(props: Props<T>) {
  const { data } = props;

  const grid = useGrid(data);

  return (
    <Box display="grid" b={1} borderRadius={1}>
      {grid.columns.length === 0 ? (
        <>empty grid</>
      ) : (
        <>
          {grid.columns.map((column, index) => (
            <Box key={column.key.toString()} style={{ gridColumn: index + 1 }}>
              {column.key.toString()}
            </Box>
          ))}
          {grid.rows.map((row, rowIndex) => {
            return row.cells.map((cell) => {
              return <Box key={cell.key.toString() + rowIndex}>{cell.value}</Box>;
            });
          })}
        </>
      )}
    </Box>
  );
}
