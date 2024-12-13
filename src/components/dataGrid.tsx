// ✅ simple table column definitions + data[]
// ✅ hover row styles
// ✅ horizontal scroll for headers + rows
// ✅ vertical scroll rows only
// ❌ column sorting
// ❌ select row checkbox
// ❌ pagination
// ❌ filters
// ❌ pin (left/right)
// ❌ empty table

// datagrid container

import Box from '../box';
import { GridCell, GridDef } from './dataGrid/dataGridContract';
import Grid from './grid';
import useGridData, { EMPTY_CELL_KEY } from './dataGrid/useGridData';
import Flex from './flex';

interface Props<TRow> {
  data?: TRow[];
  def: GridDef<TRow>;
}

export default function DataGrid<TRow extends {}>(props: Props<TRow>) {
  const grid = useGridData(props);

  return (
    <Box component="dataGrid" b={1} borderRadius={1} overflow="hidden">
      <Box p={3}>top bar</Box>
      <Box overflow="auto">
        <Grid style={{ gridTemplateColumns: grid.gridTemplateColumns }} maxHeight={80}>
          {grid.rows.map((row) => {
            return (
              <Box key={row.key} display="contents" className="grid-row">
                {row.cells.map((cell) => (
                  <GridCellIml key={cell.key} data={cell} />
                ))}
              </Box>
            );
          })}
        </Grid>
      </Box>
      <Box p={3}>footer</Box>
    </Box>
  );
}

interface GridCellProps {
  data: GridCell;
}

function GridCellIml(props: GridCellProps) {
  const { data } = props;
  const isEmptyCell = data.key === EMPTY_CELL_KEY;

  return (
    <Box
      position={data.isHeader ? 'sticky' : undefined}
      top={data.isHeader ? 0 : undefined}
      bgColor="white"
      height={10}
      width={data.width}
      bb={1}
      hoverParent={{ 'grid-row': { bgColor: data.isHeader ? undefined : 'gray-200' } }}
    >
      <Flex
        overflow="hidden"
        textOverflow="ellipsis"
        height="fit"
        props={{ tabIndex: data.isHeader || isEmptyCell ? undefined : 0 }}
        b={isEmptyCell ? undefined : 1}
        borderColor="transparent"
        focus={{ borderColor: 'gray-400' }}
        transition="none"
        ai="center"
        px={isEmptyCell ? undefined : 3}
      >
        {data.value}
      </Flex>
    </Box>
  );
}
