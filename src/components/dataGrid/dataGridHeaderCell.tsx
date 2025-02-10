import Box from '../../box';
import BaseSvg from '../baseSvg';
import Button from '../button';
import Flex from '../flex';
import Column from './models/column';
import { EMPTY_CELL_KEY } from './models/grid';

interface Props<TRow> {
  column: Column<TRow>;
}

export default function DataGridHeaderCell<TRow>(props: Props<TRow>) {
  const { column } = props;

  const isEmptyCell = column.key === EMPTY_CELL_KEY;
  const rowsCount = column.isLeaf ? column.grid.headerRowsCount.value - column.level : 1;
  const colSpan = column.isLeaf ? 1 : column.leafs.length;

  return (
    <Flex
      gridRow={rowsCount}
      colSpan={colSpan}
      ai="center"
      position="sticky"
      height={column.grid.defaultCellHeight * rowsCount}
      bgColor="gray-100"
      bb={1}
      cursor="pointer"
      jc="space-between"
      width={isEmptyCell ? 'auto' : column.grid.defaultCellWidth * colSpan}
    >
      {!isEmptyCell && (
        <>
          <Flex overflow="hidden" flex1 ai="center" height="fit" props={{ onClick: () => column.grid.setSortColumn(column.key) }}>
            <Box px={2} overflow="hidden" textOverflow="ellipsis">
              {column.key}
            </Box>
          </Flex>
          <Flex>
            <Button
              clean
              // onClick={() => setOpen(!isOpen)}
              // ref={refToUse}
              width={5}
              height={5}
              cursor="pointer"
              userSelect="none"
              borderRadius={1}
              borderColor="gray-200"
              display="flex"
              jc="center"
              ai="center"
              hover={{ bgColor: 'gray-300' }}
            >
              <BaseSvg viewBox="0 0 16 16" width="18">
                <path
                  fill="#1D1D1D"
                  strokeWidth={4}
                  d="M7.936 12.128a.936.936 0 1 1 0 1.872.936.936 0 0 1 0-1.872ZM7.936 7.052a.936.936 0 1 1 0 1.873.936.936 0 0 1 0-1.873ZM7.936 1.977a.936.936 0 1 1 0 1.872.936.936 0 0 1 0-1.872Z"
                />
              </BaseSvg>
            </Button>
            <Box cursor="col-resize" px={0.5} className="resizer">
              <Box width={0.5} height={5} bgColor="gray-400" hoverParent={{ resizer: { bgColor: 'gray-600' } }}></Box>
            </Box>
          </Flex>
        </>
      )}
    </Flex>
  );
}
