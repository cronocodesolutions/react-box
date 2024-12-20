import { useCallback, useMemo, useState } from 'react';
import { GridCell, GridDef, GridRow, PinPosition, SortColumnType } from './dataGridContract';
import FnUtils from '../../utils/fn/fnUtils';
import { DEFAULT_REM_DIVIDER } from '../../core/boxConstants';
import { DataGridHelper, DEFAULT_ROW_HEIGHT } from './dataGridHelper';

const MIN_WIDTH_PX = 36;
export const EMPTY_CELL_KEY = 'empty-cell';
const DEFAULT_PAGE_SIZE = 10;

interface Props<TRow> {
  data?: TRow[];
  def: GridDef<TRow>;
}

export default function useGridData<TRow>(props: Props<TRow>) {
  const { data, def } = props;

  //#region Header related
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

  const [leftPinnedColumns, setLeftPinnedColumns] = useState<string[]>([]);
  const [rightPinnedColumns, setRightPinnedColumns] = useState<string[]>([]);

  const helper = useMemo(
    () => new DataGridHelper(props, leftPinnedColumns, rightPinnedColumns, columnSize),
    [props, leftPinnedColumns, rightPinnedColumns, columnSize],
  );

  const gridWidth = useMemo(() => helper.gridWidth, [isResizeMode]);

  const resizeColumnHandler = useCallback(
    (e: React.MouseEvent, key: string) => {
      setIsResizeMode(true);
      const startPageX = e.pageX;

      let cell = helper.headerColumns.findOrThrow((c) => c.key === key);
      if (cell.isParent) {
        cell = helper.headerColumns.findOrThrow((c) => c.key === cell.leafs.at(-1));
      }

      const width = cell.inlineWidth ?? (cell.width ?? 0) * DEFAULT_REM_DIVIDER;

      const resize = FnUtils.throttle((e: MouseEvent) => {
        setColumnSize((prev) => {
          const diffPageX = e.pageX - startPageX;
          const newWidth = width + diffPageX;

          return { ...prev, [cell.key as string]: newWidth < MIN_WIDTH_PX ? MIN_WIDTH_PX : newWidth };
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

  const pinColumnHandler = useCallback((pin: Maybe<PinPosition>, leafs: string[]) => {
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
  //#endregion

  //#region pagination
  const [pag, setPag] = useState(() => {
    const pageSize = !def.pagination || typeof def.pagination === 'boolean' ? DEFAULT_PAGE_SIZE : def.pagination.pageSize;

    const totalItems = data?.length ?? 0;
    const totalPages = Math.ceil(totalItems / pageSize);

    return { pageSize, page: 0, totalItems, totalPages };
  });

  const changePageHandler = useCallback((page: number) => {
    setPag((prev) => {
      if (page >= prev.totalPages || page < 0) return prev;

      return { ...prev, page };
    });
  }, []);
  //#endregion

  //#region data
  const dataTable = useMemo(() => {
    let dataToUse = data ? [...data] : [];

    if (sortColumn) {
      dataToUse = dataToUse.sortBy((x) => x[sortColumn.key], sortColumn.dir);
    }

    if (def.pagination) {
      dataToUse = dataToUse.take(pag.pageSize, pag.pageSize * pag.page);
    }

    return dataToUse;
  }, [data, sortColumn, def.pagination, pag]);
  //#endregion

  const rows = useMemo<GridRow[]>(() => {
    const allRows = [];

    //#region header

    const headerRow: GridRow = {
      key: 'header',
      cells: [],
    };

    allRows.push(headerRow);

    helper.headerColumns.forEach((c) => {
      const cell: GridCell = {
        key: c.key,
        value: c.key,
        height: c.height,
        width: c.width,
        inlineWidth: c.inlineWidth,
        isHeader: true,
        rowSpan: c.rowSpan,
        colSpan: c.colSpan,
        pinned: c.pinned,
        top: c.top,
        left: c.left,
        right: c.right,
        sortDirection: sortColumn?.key === c.key ? sortColumn.dir : undefined,
        pinColumn: (pin: PinPosition) => pinColumnHandler(pin, c.leafs),
        sortColumn: c.isParent ? undefined : () => sortColumnHandler(c.key as keyof TRow),
        resizeColumn: (e) => resizeColumnHandler(e, c.key),
      };

      headerRow.cells.push(cell);
    });

    //#endregion

    dataTable.forEach((dataRow, rowIndex) => {
      const key = def.rowKey ? (typeof def.rowKey === 'function' ? def.rowKey(dataRow) : (dataRow[def.rowKey] as string)) : rowIndex;
      const row: GridRow = { cells: [], key };

      helper.dataColumns.forEach((c) => {
        const cell: GridCell = {
          key: c.key,
          value: dataRow[c.key as keyof TRow],
          width: c.width,
          height: DEFAULT_ROW_HEIGHT,
          inlineWidth: c.inlineWidth,
          pinned: c.pinned,
          left: c.left,
          right: c.right,
        };

        row.cells.push(cell);
      });

      allRows.push(row);
    });

    return allRows;
  }, [helper, sortColumn, dataTable]);

  return {
    rows,
    gridTemplateColumns: helper.gridTemplateColumns,
    isResizeMode,
    gridWidth,
    pagination: {
      pageSize: pag.pageSize,
      page: pag.page,
      totalItems: pag.totalItems,
      totalPages: pag.totalPages,
      changePage: changePageHandler,
    },
  };
}

export type GridData = ReturnType<typeof useGridData>;
