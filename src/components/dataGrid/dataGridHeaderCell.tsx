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
      minHeight={column.grid.ROW_HEIGHT * rowsCount}
      bb={1}
      cursor="pointer"
      jc="space-between"
      boxSizing="content-box"
      transition="none"
      style={{ width: `var(${column.widthVarName})` }}
    >
      {!isEmptyCell && (
        <>
          <Flex overflow="hidden" flex1 ai="center" height="fit" props={{ onClick: () => column.grid.setSortColumn(column.key) }}>
            <Box px={2} overflow="hidden" textOverflow="ellipsis">
              {column.key}
            </Box>
          </Flex>
          <Flex height="fit" ai="center" gap={1}>
            <Button
              clean
              width={6}
              height={6}
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
            <Box cursor="col-resize" px={0.5} className="resizer" height="2/4" props={{ onMouseDown: column.resizeColumn }}>
              <Box width={0.5} height="fit" bgColor="gray-400" hoverParent={{ resizer: { bgColor: 'gray-600' } }}></Box>
            </Box>
          </Flex>
        </>
      )}
    </Flex>
  );
}
