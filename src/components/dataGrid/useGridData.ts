import { useCallback, useMemo, useState } from 'react';
import { GridCell, GridDef, GridNormalRow, GridRow, Key, PinPosition, SortColumnType } from './dataGridContract';
import FnUtils from '../../utils/fn/fnUtils';
import { DEFAULT_REM_DIVIDER } from '../../core/boxConstants';
import { DataGridHelper } from './dataGridHelper';

const MIN_WIDTH_PX = 26;
export const EMPTY_CELL_KEY = 'empty-cell';

interface Props<TRow> {
  data: TRow[];
  def: GridDef<TRow>;
}

export default function useGridData<TRow>(props: Props<TRow>) {
  const [expandedRow, setExpandedRow] = useState<Record<Key, Key[]>>({});
  const [page, setPage] = useState(0);

  //#region Header related

  const [groupColumns, setGroupColumns] = useState<Key[]>([]);

  const [sortColumn, setSortColumn] = useState<Maybe<SortColumnType<TRow>>>();
  const sortColumnHandler = useCallback((key: keyof TRow) => {
    setSortColumn((prev) => {
      const prevKey = prev?.key;

      if (prevKey !== key) {
        return { key, dir: 'ASC' };
      }

      const prevDir = prev?.dir;

      if (prevDir === 'DESC') {
        return undefined;
      }

      return { key, dir: prevDir === 'ASC' ? 'DESC' : 'ASC' };
    });
  }, []);

  const [columnSize, setColumnSize] = useState<Record<string, number>>({});
  const [isResizeMode, setIsResizeMode] = useState(false);

  const [leftPinnedColumns, setLeftPinnedColumns] = useState<Key[]>([]);
  const [rightPinnedColumns, setRightPinnedColumns] = useState<Key[]>([]);

  const pinColumnHandler = useCallback((pin: Maybe<PinPosition>, leafs: Key[]) => {
    if (pin === 'LEFT') {
      setLeftPinnedColumns((prev) => prev.removeBy((x) => leafs.includes(x)).add(...leafs));

      setRightPinnedColumns((prev) => prev.removeBy((x) => leafs.includes(x)));
    } else if (pin === 'RIGHT') {
      setLeftPinnedColumns((prev) => prev.removeBy((x) => leafs.includes(x)));
      setRightPinnedColumns((prev) => prev.removeBy((x) => leafs.includes(x)).add(...leafs));
    } else {
      setLeftPinnedColumns((prev) => prev.removeBy((x) => leafs.includes(x)));
      setRightPinnedColumns((prev) => prev.removeBy((x) => leafs.includes(x)));
    }
  }, []);

  const toggleGroupColumnHandler = useCallback((key: Key) => {
    setGroupColumns((prev) => {
      if (prev.includes(key)) {
        return prev.removeBy((x) => x === key);
      }

      return prev.add(key);
    });
  }, []);

  //#endregion

  const helper = useMemo(
    () => new DataGridHelper(props, leftPinnedColumns, rightPinnedColumns, columnSize, groupColumns, sortColumn, page, expandedRow),
    [props, leftPinnedColumns, rightPinnedColumns, columnSize, groupColumns, sortColumn, page, expandedRow],
  );

  const resizeColumnHandler = useCallback(
    (e: React.MouseEvent, key: Key, pinned?: PinPosition) => {
      setIsResizeMode(true);
      const startPageX = e.pageX;

      const leafs = helper.headerColumns.findOrThrow((c) => c.key === key && c.pinned === pinned).leafs;
      const cells = helper.dataColumns.filter((c) => leafs.includes(c.key));
      const totalWidth = cells.sumBy((c) => c.inlineWidth as number) - cells.length * MIN_WIDTH_PX;

      const resize = FnUtils.throttle((e: MouseEvent) => {
        setColumnSize((prev) => {
          const result = { ...prev };

          const dragDistance = (e.pageX - startPageX) * (pinned === 'RIGHT' ? -1 : 1);

          cells.forEach((cell) => {
            const width = cell.inlineWidth as number;
            const dragDistanceForCell = totalWidth > 0 ? ((width - MIN_WIDTH_PX) / totalWidth) * dragDistance : dragDistance / cells.length;
            const newWidth = Math.round(width + dragDistanceForCell);

            result[cell.key] = newWidth < MIN_WIDTH_PX ? MIN_WIDTH_PX : newWidth;
          });

          return result;
        });
      }, 20);

      function stopResize(e: MouseEvent) {
        window.removeEventListener('mousemove', resize);
        setIsResizeMode(false);
      }

      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResize, { once: true });
    },
    [helper],
  );

  const toggleExpandRowHandler = useCallback((rowKey: string | number, cellKey: string | number) => {
    setExpandedRow((prev) => {
      const expandedRow = { ...prev };

      const cells = expandedRow[rowKey];
      if (!cells) {
        expandedRow[rowKey] = [cellKey];
      } else {
        if (cells.includes(cellKey)) {
          expandedRow[rowKey] = cells.removeBy((key) => key === cellKey);

          if (expandedRow[rowKey].length === 0) {
            delete expandedRow[rowKey];
          }
        } else {
          expandedRow[rowKey] = cells.add(cellKey);
        }
      }

      return expandedRow;
    });
  }, []);

  const rows = useMemo<GridRow[]>(() => {
    const leftEdgeColumn = helper.dataColumns.findLast((x) => x.pinned === 'LEFT');
    const rightEdgeColumn = helper.dataColumns.find((x) => x.pinned === 'RIGHT');

    const allRows = [];

    //#region header

    const headerRow: GridNormalRow = {
      key: 'header',
      isGrouped: false,
      cells: [],
    };

    allRows.push(headerRow);

    helper.headerColumns.forEach((c) => {
      const cell: GridCell = {
        key: c.key,
        value: c.key,
        height: c.height,
        inlineWidth: c.inlineWidth,
        isHeader: true,
        rowSpan: c.rowSpan,
        colSpan: c.colSpan,
        pinned: c.pinned,
        edge:
          (leftEdgeColumn && c.pinned === 'LEFT' && c.leafs.includes(leftEdgeColumn.key)) ||
          (rightEdgeColumn && c.pinned === 'RIGHT' && c.leafs.includes(rightEdgeColumn.key)),
        top: c.top,
        left: c.left,
        right: c.right,
        sortDirection: sortColumn?.key === c.key ? sortColumn.dir : undefined,
        pinColumn: (pin: PinPosition) => pinColumnHandler(pin, c.leafs),
        sortColumn: c.isParent ? undefined : () => sortColumnHandler(c.key as keyof TRow),
        resizeColumn: (e) => resizeColumnHandler(e, c.key, c.pinned),
        toggleGroupColumn: () => toggleGroupColumnHandler(c.key),
        unGroupAllColumns: () => setGroupColumns([]),
      };

      headerRow.cells.push(cell);
    });

    //#endregion

    allRows.push(...helper.rows);

    return allRows;
  }, [helper, sortColumn]);

  return {
    headerColumns: helper.headerColumns,
    rows,
    gridTemplateColumns: helper.gridTemplateColumns,
    isResizeMode,
    groupColumns,
    pagination: helper.pagination,
    changePage: (page: number) => setPage(page),
    toggleExpandRow: toggleExpandRowHandler,
  };
}

export type GridData<TRow> = ReturnType<typeof useGridData<TRow>>;
