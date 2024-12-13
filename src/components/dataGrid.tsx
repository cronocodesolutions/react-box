// ✅ simple table column definitions + data[]
// ✅ hover row styles
// ✅ horizontal scroll for headers + rows
// ✅ vertical scroll rows only
// ✅ column sorting
// ✅ pagination
// ❌ select row checkbox
// ❌ filters
// ❌ pin (left/right)
// ❌ empty table

// datagrid container

import Box, { BoxProps } from '../box';
import { GridCell, GridDef } from './dataGrid/dataGridContract';
import Grid from './grid';
import useGridData, { EMPTY_CELL_KEY } from './dataGrid/useGridData';
import Flex from './flex';
import Button from './button';

interface Props<TRow> extends BoxProps {
  data?: TRow[];
  def: GridDef<TRow>;
  pagination?: boolean | { pageSize: number };
}

export default function DataGrid<TRow extends {}>(props: Props<TRow>) {
  const { pagination } = props;
  const grid = useGridData(props);

  return (
    <Box component="dataGrid" b={1} borderRadius={1} overflow="hidden" {...props}>
      <Box p={3} bb={1}>
        top bar
      </Box>
      <Box overflow="auto" minHeight={80}>
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
      <Flex p={3} jc="space-between">
        <Box>footer</Box>
        {pagination && (
          <Box>
            <Button clean inline onClick={() => grid.pagination.changePage(0)}>
              {'<<'}
            </Button>{' '}
            <Button clean inline onClick={() => grid.pagination.changePage(grid.pagination.page - 1)}>
              {'<'}
            </Button>{' '}
            {grid.pagination.page + 1} of {grid.pagination.totalPages}{' '}
            <Button clean inline onClick={() => grid.pagination.changePage(grid.pagination.page + 1)}>
              {'>'}
            </Button>{' '}
            <Button clean inline onClick={() => grid.pagination.changePage(grid.pagination.totalPages - 1)}>
              {'>>'}
            </Button>
          </Box>
        )}
      </Flex>
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
    <Flex
      position={data.isHeader ? 'sticky' : undefined}
      top={data.isHeader ? 0 : undefined}
      bgColor={data.isHeader ? 'slate-300' : 'white'}
      height={10}
      width={data.width}
      bb={1}
      hoverParent={{ 'grid-row': { bgColor: data.isHeader ? undefined : 'gray-200' } }}
      props={{ onClick: data.sortColumn }}
    >
      {/* <Flex
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
      > */}
      {data.value} {data.sortDirection}
      {/* </Flex> */}
    </Flex>
  );
}
