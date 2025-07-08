import { useMemo } from 'react';
import Box from '../../../box';
import SortIcon from '../../../icons/sortIcon';
import Checkbox from '../../checkbox';
import Flex from '../../flex';
import ColumnModel from '../models/columnModel';
import { EMPTY_CELL_KEY, GROUPING_CELL_KEY, ROW_NUMBER_CELL_KEY, ROW_SELECTION_CELL_KEY } from '../models/gridModel';
import DataGridHeaderCellContextMenu from './dataGridHeaderCellContextMenu';
import DataGridHeaderCellResizer from './dataGridHeaderCellResizer';

interface Props<TRow> {
  column: ColumnModel<TRow>;
}

export default function DataGridHeaderCell<TRow>(props: Props<TRow>) {
  const { column } = props;
  const { key, pin, left, right, isEdge, isLeaf, leafs, grid, header, gridRows, widthVarName, leftVarName, rightVarName, inlineWidth } =
    column;

  const isEmptyCell = key === EMPTY_CELL_KEY;
  const isGroupingCell = key === GROUPING_CELL_KEY;
  const isRowNumber = key === ROW_NUMBER_CELL_KEY;
  const isRowSelection = key === ROW_SELECTION_CELL_KEY;

  const isLeftPinned = pin === 'LEFT';
  const isRightPinned = pin === 'RIGHT';
  const isPinned = isLeftPinned || pin === 'RIGHT';
  const isFirstLeftPinned = isLeftPinned && left === 0;
  const isLastLeftPinned = isLeftPinned && isEdge;
  const isFirstRightPinned = isRightPinned && isEdge;
  const isLastRightPinned = isRightPinned && right === 0;
  const isSortable = isLeaf && !isEmptyCell && !isRowNumber && !isRowSelection;

  const gridColumn = isLeaf ? 1 : leafs.length;

  const showResizer = !isRowNumber && !isRowSelection;
  const showContextMenu = !isRowNumber && !isRowSelection;

  const value = useMemo(() => {
    if (isRowNumber) return null;
    if (isRowSelection) return <Checkbox m={1} />;
    if (isGroupingCell) {
      if (grid.groupColumns.length === 1) {
        const col = grid.columns.value.leafs.findOrThrow((l) => l.key === grid.groupColumns[0]);

        return col.header ?? col.key;
      }

      return 'Group';
    }

    return header ?? key;
  }, [grid.groupColumns]);

  return (
    <Flex
      component="datagrid.header.cell"
      variant={{ isRowNumber, isPinned, isFirstLeftPinned, isLastLeftPinned, isFirstRightPinned, isLastRightPinned, isSortable }}
      gridRow={gridRows}
      gridColumn={gridColumn}
      style={{
        width: `var(${widthVarName})`,
        left: isLeftPinned ? `var(${leftVarName})` : undefined,
        right: isRightPinned ? `var(${rightVarName})` : undefined,
      }}
    >
      {!isEmptyCell && (
        <>
          <Flex width="fit" height="fit" jc={column.align} props={{ onClick: isSortable ? () => column.sortColumn() : undefined }}>
            <Flex
              overflow="hidden"
              position={isLeaf ? undefined : 'sticky'}
              ai="center"
              transition="none"
              pl={column.align ? undefined : 4}
              style={{
                left: !pin ? `var(${grid.leftEdgeVarName})` : undefined,
              }}
            >
              <Box overflow="hidden" textOverflow="ellipsis" textWrap="nowrap">
                {value}
              </Box>
              {key === grid.sortColumn && (
                <Box pl={(inlineWidth ?? 0) < 58 ? 0 : 2}>
                  <SortIcon width="16px" rotate={grid.sortDirection === 'ASC' ? 0 : 180} fill="currentColor" />
                </Box>
              )}
              {showContextMenu && <Box minWidth={10} />}
            </Flex>
          </Flex>

          {showResizer && <DataGridHeaderCellResizer column={column} />}

          {showContextMenu && <DataGridHeaderCellContextMenu column={column} />}
        </>
      )}
    </Flex>
  );
}

(DataGridHeaderCell as React.FunctionComponent).displayName = 'DataGridHeaderCell';
