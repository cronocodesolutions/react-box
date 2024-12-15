import { useCallback, useMemo, useState } from 'react';
import { GridCell, GridDef, GridRow, PinPosition, SortDirection } from './dataGridContract';
import FnUtils from '../../utils/fn/fnUtils';
import { DEFAULT_REM_DIVIDER } from '../../core/boxConstants';

const DEFAULT_WIDTH = 40;
const DEFAULT_WIDTH_PX = DEFAULT_WIDTH * DEFAULT_REM_DIVIDER;
export const EMPTY_CELL_KEY = 'empty-cell';
const SORT_DIRECTION: SortDirection = 'ASC';
const DEFAULT_PAGE_SIZE = 10;

interface Props<TRow> {
  data?: TRow[];
  def: GridDef<TRow>;
}

export default function useGridData<TRow>(props: Props<TRow>) {
  const { data, def } = props;

  const [sortColumn, setSortColumn] = useState<{ key: keyof TRow; dir: typeof SORT_DIRECTION }>();
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

  const [pag, setPag] = useState(() => {
    const pageSize = !def.pagination || typeof def.pagination === 'boolean' ? DEFAULT_PAGE_SIZE : def.pagination.pageSize;

    if ((data?.length ?? 0) === 0) {
      return { pageSize, page: 0, totalPages: 0 };
    }

    return { pageSize, page: 0, totalPages: Math.ceil(data!.length / pageSize) };
  });
  const changePageHandler = useCallback((page: number) => {
    setPag((prev) => {
      if (page >= prev.totalPages || page < 0) return prev;

      return { ...prev, page };
    });
  }, []);

  const tableData = useMemo(() => {
    let dataToUse = data ? [...data] : [];

    if (sortColumn) {
      dataToUse = dataToUse.sort((a, b) => {
        if (a[sortColumn.key] < b[sortColumn.key]) return sortColumn.dir === 'ASC' ? -1 : 1;
        if (a[sortColumn.key] > b[sortColumn.key]) return sortColumn.dir === 'ASC' ? 1 : -1;
        return 0;
      });
    }

    if (def.pagination) {
      dataToUse = dataToUse.take(pag.pageSize, pag.pageSize * pag.page);
    }

    return dataToUse;
  }, [data, sortColumn, def.pagination, pag]);

  const [columnSize, setColumnSize] = useState<{ [key: string]: number }>({});

  const resizeColumnHandler = useCallback((e: React.MouseEvent, headerCell: GridCell) => {
    const startPageX = e.pageX;
    const prevWidth = headerCell.inlineWidth ?? DEFAULT_WIDTH_PX;

    const resize = FnUtils.throttle((e: MouseEvent) => {
      setColumnSize((prev) => {
        const diffPageX = e.pageX - startPageX;
        const newWidth = prevWidth + diffPageX;

        return { ...prev, [headerCell.key as string]: newWidth < 36 ? 36 : newWidth };
      });
    }, 20);

    function stopResize(e: MouseEvent) {
      window.removeEventListener('mousemove', resize);
    }

    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResize, { once: true });
  }, []);

  const [leftPinnedColumns, setLeftPinnedColumns] = useState<(keyof TRow)[]>([]);
  const [rightPinnedColumns, setRightPinnedColumns] = useState<(keyof TRow)[]>([]);

  const pinColumnHandler = useCallback((pin: Maybe<PinPosition>, key: keyof TRow) => {
    if (pin === 'LEFT') {
      setLeftPinnedColumns((prev) => prev.removeBy((x) => x === key).add(key));
      setRightPinnedColumns((prev) => prev.removeBy((x) => x === key));
    } else if (pin === 'RIGHT') {
      setLeftPinnedColumns((prev) => prev.removeBy((x) => x === key));
      setRightPinnedColumns((prev) => prev.removeBy((x) => x === key).add(key));
    } else {
      setLeftPinnedColumns((prev) => prev.removeBy((x) => x === key));
      setRightPinnedColumns((prev) => prev.removeBy((x) => x === key));
    }
  }, []);

  const leftColumns = useMemo(() => {
    return leftPinnedColumns.map((key) => def.columns.find((x) => x.key === key)!);
  }, [leftPinnedColumns, def.columns]);

  const rightColumns = useMemo(() => {
    return rightPinnedColumns.map((key) => def.columns.find((x) => x.key === key)!).reverse();
  }, [rightPinnedColumns, def.columns]);

  const middleColumns = useMemo(() => {
    return def.columns.filter((c) => !leftPinnedColumns.includes(c.key) && !rightPinnedColumns.includes(c.key));
  }, [leftPinnedColumns, rightPinnedColumns, def.columns]);

  const rows = useMemo(() => {
    const pinLeftSizes = leftColumns.reduce<{ [key: string]: number }>((acc, c) => {
      acc[c.key as string] = Object.keys(acc).reduce((sum, key) => sum + (columnSize[key] ?? DEFAULT_WIDTH_PX), 0);

      return acc;
    }, {});

    const pinRightSizes = rightColumns.reduceRight<{ [key: string]: number }>((acc, c) => {
      acc[c.key as string] = Object.keys(acc).reduce((sum, key) => sum + (columnSize[key] ?? DEFAULT_WIDTH_PX), 0);

      return acc;
    }, {});

    const headerRow: GridRow = { cells: [], key: 'header' };
    const rows: GridRow[] = [headerRow];

    // #region add left columns 👇
    leftColumns.forEach((c, index) => {
      const headerCell: GridCell = {
        key: (c.key as string) ?? index,
        value: c.key as string,
        width: DEFAULT_WIDTH,
        inlineWidth: columnSize[c.key as string],
        pinLeft: pinLeftSizes[c.key as string],
        isHeader: true,
        sortColumn: () => sortColumnHandler(c.key),
        pinColumn: (pin: PinPosition) => pinColumnHandler(pin, c.key),
      };

      headerCell.resizeColumn = (e) => resizeColumnHandler(e, headerCell);

      if (sortColumn?.key === c.key) {
        headerCell.sortDirection = sortColumn.dir;
      }

      headerRow.cells.push(headerCell);
    });
    // #endregion
    // #region add middle columns 👇
    middleColumns.forEach((c, index) => {
      const headerCell: GridCell = {
        key: (c.key as string) ?? index,
        value: c.key as string,
        width: DEFAULT_WIDTH,
        inlineWidth: columnSize[c.key as string],
        isHeader: true,
        sortColumn: () => sortColumnHandler(c.key),
        pinColumn: (pin: PinPosition) => pinColumnHandler(pin, c.key),
      };

      headerCell.resizeColumn = (e) => resizeColumnHandler(e, headerCell);

      if (sortColumn?.key === c.key) {
        headerCell.sortDirection = sortColumn.dir;
      }

      headerRow.cells.push(headerCell);
    });
    // #endregion
    // #region add empty cell column 👇
    headerRow.cells.push({ key: EMPTY_CELL_KEY, isHeader: true });
    // #endregion
    // #region add right columns 👇
    rightColumns.forEach((c, index) => {
      const headerCell: GridCell = {
        key: (c.key as string) ?? index,
        value: c.key as string,
        width: DEFAULT_WIDTH,
        inlineWidth: columnSize[c.key as string],
        pinRight: pinRightSizes[c.key as string],
        isHeader: true,
        sortColumn: () => sortColumnHandler(c.key),
        pinColumn: (pin: PinPosition) => pinColumnHandler(pin, c.key),
      };

      headerCell.resizeColumn = (e) => resizeColumnHandler(e, headerCell);

      if (sortColumn?.key === c.key) {
        headerCell.sortDirection = sortColumn.dir;
      }

      headerRow.cells.push(headerCell);
    });
    // #endregion

    tableData.forEach((item, rowIndex) => {
      const key = def.rowKey ? (typeof def.rowKey === 'function' ? def.rowKey(item) : (item[def.rowKey] as string)) : rowIndex;
      const row: GridRow = { cells: [], key };

      // #region add left columns 👇
      leftColumns.forEach((c) => {
        row.cells.push({
          key: c.key as string,
          value: item[c.key] as string,
          width: DEFAULT_WIDTH,
          inlineWidth: columnSize[c.key as string],
          pinLeft: pinLeftSizes[c.key as string],
        });
      });
      // #endregion
      // #region add middle columns 👇
      middleColumns.forEach((c) => {
        row.cells.push({
          key: c.key as string,
          value: item[c.key] as string,
          width: DEFAULT_WIDTH,
          inlineWidth: columnSize[c.key as string],
        });
      });
      // #endregion
      // #region add empty cell column 👇
      row.cells.push({ key: EMPTY_CELL_KEY });
      // #endregion
      // #region add right columns 👇
      rightColumns.forEach((c) => {
        row.cells.push({
          key: c.key as string,
          value: item[c.key] as string,
          width: DEFAULT_WIDTH,
          inlineWidth: columnSize[c.key as string],
          pinRight: pinRightSizes[c.key as string],
        });
      });
      // #endregion

      rows.push(row);
    });

    return rows;
  }, [tableData, def, sortColumn, columnSize, leftColumns, rightColumns, middleColumns]);

  const gridTemplateColumns = useMemo(() => {
    const leftRepeat = leftColumns.length + middleColumns.length;

    const left = leftRepeat > 0 ? `repeat(${leftRepeat}, max-content)` : '';
    const right = rightColumns.length > 0 ? `repeat(${rightColumns.length}, max-content)` : '';

    return `${left} auto ${right}`;
  }, [leftColumns, rightColumns, middleColumns]);

  return {
    rows,
    gridTemplateColumns,
    pagination: {
      pageSize: pag.pageSize,
      page: pag.page,
      totalPages: pag.totalPages,
      changePage: changePageHandler,
    },
  };
}

export type GridData = ReturnType<typeof useGridData>;
