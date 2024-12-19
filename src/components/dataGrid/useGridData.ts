import { useCallback, useMemo, useState } from 'react';
import { GridCell, GridDef, GridRow, PinPosition, SortColumnType, SortDirection } from './dataGridContract';
import FnUtils from '../../utils/fn/fnUtils';
import { DEFAULT_REM_DIVIDER } from '../../core/boxConstants';
import { DataGridHelper } from './dataGridHelper';

const MIN_WIDTH_PX = 36;
export const EMPTY_CELL_KEY = 'empty-cell';
const DEFAULT_PAGE_SIZE = 10;

interface Props<TRow> {
  data?: TRow[];
  def: GridDef<TRow>;
}

export default function useGridData<TRow>(props: Props<TRow>) {
  const { data, def } = props;

  const [sortColumn, setSortColumn] = useState<Maybe<SortColumnType>>();
  const sortColumnHandler = useCallback((key: string) => {
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

    const totalItems = data?.length ?? 0;
    const totalPages = Math.ceil(totalItems / pageSize);

    return { pageSize, page: 0, totalItems, totalPages };
  });
  const [columnSize, setColumnSize] = useState<Record<string, number>>({});
  const [isResizeMode, setIsResizeMode] = useState(false);

  const [leftPinnedColumns, setLeftPinnedColumns] = useState<string[]>([]);
  const [rightPinnedColumns, setRightPinnedColumns] = useState<string[]>([]);

  const helper = useMemo(
    () => new DataGridHelper(props, leftPinnedColumns, rightPinnedColumns, columnSize),
    [props, leftPinnedColumns, rightPinnedColumns, columnSize],
  );

  const resizeColumnHandler = useCallback(
    (e: React.MouseEvent, key: string) => {
      setIsResizeMode(true);
      const startPageX = e.pageX;

      let cell = helper.headerColumns.find((c) => c.key === key)!;
      if (cell.isParent) {
        cell = helper.headerColumns.find((c) => c.key === cell.leafs.at(-1))!;
      }

      const width = cell.inlineWidth ?? (cell.width ?? 20) * DEFAULT_REM_DIVIDER;
      console.log(width);

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

  const changePageHandler = useCallback((page: number) => {
    setPag((prev) => {
      if (page >= prev.totalPages || page < 0) return prev;

      return { ...prev, page };
    });
  }, []);

  const pinColumnHandler = useCallback((pin: Maybe<PinPosition>, leafs: string[]) => {
    console.log(leafs);

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

  // REVIEWED 👆

  const rows = useMemo<GridRow[]>(() => {
    //#region header

    const headerRow: GridRow = {
      key: 'header',
      cells: [],
    };

    helper.headerColumns.forEach((c) => {
      const cell: GridCell = {
        key: c.key,
        value: c.key,
        height: c.height,
        width: c.width,
        inlineWidth: c.inlineWidth,
        isHeader: true,
        rowSpan: c.rowSpan === 1 ? undefined : c.rowSpan,
        colSpan: c.colSpan === 1 ? undefined : c.colSpan,
        pinned: c.pinned,
        headerRow: c.headerRow,
        top: c.top,
        left: c.left,
        right: c.right,
        sortDirection: sortColumn?.key === c.key ? sortColumn.dir : undefined,
        pinColumn: (pin: PinPosition) => pinColumnHandler(pin, c.leafs),
        sortColumn: c.isParent ? undefined : () => sortColumnHandler(c.key),
        resizeColumn: (e) => resizeColumnHandler(e, c.key),
      };

      headerRow.cells.push(cell);
    });

    //#endregion

    return [headerRow];
  }, [helper, sortColumn]);

  return {
    rows,
    gridTemplateColumns: helper.gridTemplateColumns,
    isResizeMode,
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

// const tableData = useMemo(() => {
//   let dataToUse = data ? [...data] : [];

//   if (sortColumn) {
//     dataToUse = dataToUse.sort((a, b) => {
//       if (a[sortColumn.key] < b[sortColumn.key]) return sortColumn.dir === 'ASC' ? -1 : 1;
//       if (a[sortColumn.key] > b[sortColumn.key]) return sortColumn.dir === 'ASC' ? 1 : -1;
//       return 0;
//     });
//   }

//   if (def.pagination) {
//     dataToUse = dataToUse.take(pag.pageSize, pag.pageSize * pag.page);
//   }

//   return dataToUse;
// }, [data, sortColumn, def.pagination, pag]);

// const [columnSize, setColumnSize] = useState<{ [key: string]: number }>({});

// const resizeColumnHandler = useCallback((e: React.MouseEvent, headerCell: GridCell) => {
//   const startPageX = e.pageX;
//   const prevWidth = headerCell.inlineWidth ?? DEFAULT_WIDTH_PX;

//   const resize = FnUtils.throttle((e: MouseEvent) => {
//     setColumnSize((prev) => {
//       const diffPageX = e.pageX - startPageX;
//       const newWidth = prevWidth + diffPageX;

//       return { ...prev, [headerCell.key as string]: newWidth < 36 ? 36 : newWidth };
//     });
//   }, 20);

//   function stopResize(e: MouseEvent) {
//     window.removeEventListener('mousemove', resize);
//   }

//   window.addEventListener('mousemove', resize);
//   window.addEventListener('mouseup', stopResize, { once: true });
// }, []);

// const [leftPinnedColumns, setLeftPinnedColumns] = useState<(keyof TRow)[]>([]);
// const [rightPinnedColumns, setRightPinnedColumns] = useState<(keyof TRow)[]>([]);

// const pinColumnHandler = useCallback((pin: Maybe<PinPosition>, key: keyof TRow) => {
//   if (pin === 'LEFT') {
//     setLeftPinnedColumns((prev) => prev.removeBy((x) => x === key).add(key));
//     setRightPinnedColumns((prev) => prev.removeBy((x) => x === key));
//   } else if (pin === 'RIGHT') {
//     setLeftPinnedColumns((prev) => prev.removeBy((x) => x === key));
//     setRightPinnedColumns((prev) => prev.removeBy((x) => x === key).add(key));
//   } else {
//     setLeftPinnedColumns((prev) => prev.removeBy((x) => x === key));
//     setRightPinnedColumns((prev) => prev.removeBy((x) => x === key));
//   }
// }, []);

// const leftColumns = useMemo(() => {
//   return leftPinnedColumns.map((key) => def.columns.find((x) => x.key === key)!);
// }, [leftPinnedColumns, def.columns]);

// const rightColumns = useMemo(() => {
//   return rightPinnedColumns.map((key) => def.columns.find((x) => x.key === key)!).reverse();
// }, [rightPinnedColumns, def.columns]);

// const middleColumns = useMemo(() => {
//   return def.columns.filter((c) => !leftPinnedColumns.includes(c.key) && !rightPinnedColumns.includes(c.key));
// }, [leftPinnedColumns, rightPinnedColumns, def.columns]);

// const rows = useMemo(() => {
//   const pinLeftSizes = leftColumns.reduce<{ [key: string]: number }>((acc, c) => {
//     acc[c.key as string] = Object.keys(acc).reduce((sum, key) => sum + (columnSize[key] ?? DEFAULT_WIDTH_PX), 0);

//     return acc;
//   }, {});

//   const pinRightSizes = rightColumns.reduceRight<{ [key: string]: number }>((acc, c) => {
//     acc[c.key as string] = Object.keys(acc).reduce((sum, key) => sum + (columnSize[key] ?? DEFAULT_WIDTH_PX), 0);

//     return acc;
//   }, {});

//   const headerRow: GridRow = { cells: [], key: 'header' };
//   const rows: GridRow[] = [headerRow];

//   // #region add left columns 👇
//   leftColumns.forEach((c, index) => {
//     const headerCell: GridCell = {
//       key: (c.key as string) ?? index,
//       value: c.key as string,
//       width: DEFAULT_WIDTH,
//       inlineWidth: columnSize[c.key as string],
//       pinLeft: pinLeftSizes[c.key as string],
//       isHeader: true,
//       sortColumn: () => sortColumnHandler(c.key),
//       pinColumn: (pin?: PinPosition) => pinColumnHandler(pin, c.key),
//     };

//     headerCell.resizeColumn = (e) => resizeColumnHandler(e, headerCell);

//     if (sortColumn?.key === c.key) {
//       headerCell.sortDirection = sortColumn.dir;
//     }

//     headerRow.cells.push(headerCell);
//   });
//   // #endregion
//   // #region add middle columns 👇
//   middleColumns.forEach((c, index) => {
//     const headerCell: GridCell = {
//       key: (c.key as string) ?? index,
//       value: c.key as string,
//       width: DEFAULT_WIDTH,
//       inlineWidth: columnSize[c.key as string],
//       isHeader: true,
//       sortColumn: () => sortColumnHandler(c.key),
//       pinColumn: (pin: PinPosition) => pinColumnHandler(pin, c.key),
//     };

//     headerCell.resizeColumn = (e) => resizeColumnHandler(e, headerCell);

//     if (sortColumn?.key === c.key) {
//       headerCell.sortDirection = sortColumn.dir;
//     }

//     headerRow.cells.push(headerCell);
//   });
//   // #endregion
//   // #region add empty cell column 👇
//   headerRow.cells.push({ key: EMPTY_CELL_KEY, isHeader: true });
//   // #endregion
//   // #region add right columns 👇
//   rightColumns.forEach((c, index) => {
//     const headerCell: GridCell = {
//       key: (c.key as string) ?? index,
//       value: c.key as string,
//       width: DEFAULT_WIDTH,
//       inlineWidth: columnSize[c.key as string],
//       pinRight: pinRightSizes[c.key as string],
//       isHeader: true,
//       sortColumn: () => sortColumnHandler(c.key),
//       pinColumn: (pin: PinPosition) => pinColumnHandler(pin, c.key),
//     };

//     headerCell.resizeColumn = (e) => resizeColumnHandler(e, headerCell);

//     if (sortColumn?.key === c.key) {
//       headerCell.sortDirection = sortColumn.dir;
//     }

//     headerRow.cells.push(headerCell);
//   });
//   // #endregion

//   tableData.forEach((item, rowIndex) => {
//     const key = def.rowKey ? (typeof def.rowKey === 'function' ? def.rowKey(item) : (item[def.rowKey] as string)) : rowIndex;
//     const row: GridRow = { cells: [], key };

//     // #region add left columns 👇
//     leftColumns.forEach((c) => {
//       row.cells.push({
//         key: c.key as string,
//         value: item[c.key] as string,
//         width: DEFAULT_WIDTH,
//         inlineWidth: columnSize[c.key as string],
//         pinLeft: pinLeftSizes[c.key as string],
//       });
//     });
//     // #endregion
//     // #region add middle columns 👇
//     middleColumns.forEach((c) => {
//       row.cells.push({
//         key: c.key as string,
//         value: item[c.key] as string,
//         width: DEFAULT_WIDTH,
//         inlineWidth: columnSize[c.key as string],
//       });
//     });
//     // #endregion
//     // #region add empty cell column 👇
//     row.cells.push({ key: EMPTY_CELL_KEY });
//     // #endregion
//     // #region add right columns 👇
//     rightColumns.forEach((c) => {
//       row.cells.push({
//         key: c.key as string,
//         value: item[c.key] as string,
//         width: DEFAULT_WIDTH,
//         inlineWidth: columnSize[c.key as string],
//         pinRight: pinRightSizes[c.key as string],
//       });
//     });
//     // #endregion

//     rows.push(row);
//   });

//   return rows;
// }, [tableData, def, sortColumn, columnSize, leftColumns, rightColumns, middleColumns]);

// const gridTemplateColumns = useMemo(() => {
//   const leftRepeat = leftColumns.length + middleColumns.length;

//   const left = leftRepeat > 0 ? `repeat(${leftRepeat}, max-content)` : '';
//   const right = rightColumns.length > 0 ? `repeat(${rightColumns.length}, max-content)` : '';

//   return `${left} auto ${right}`;
// }, [leftColumns, rightColumns, middleColumns]);
