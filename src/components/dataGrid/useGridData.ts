import { useCallback, useState } from 'react';
import { GridCell, GridDef, GridRow, SortDirection } from './dataGridContract';

const DEFAULT_WIDTH = 40;
export const EMPTY_CELL_KEY = 'empty-cell';
const SORT_DIRECTION: SortDirection = 'ASC';
const DEFAULT_PAGE_SIZE = 10;

interface Props<TRow> {
  data?: TRow[];
  def: GridDef<TRow>;
  pagination?: boolean | { pageSize: number };
}

export default function useGridData<TRow>(props: Props<TRow>) {
  const { data, def, pagination } = props;

  let dataToUse = data ? [...data] : [];

  console.count('useGridData');

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
    const pageSize = !pagination || typeof pagination === 'boolean' ? DEFAULT_PAGE_SIZE : pagination.pageSize;

    return { pageSize, page: 0, totalPages: Math.ceil(dataToUse.length / pageSize) };
  });
  const changePageHandler = useCallback((page: number) => {
    setPag((prev) => {
      if (page >= prev.totalPages || page < 0) return prev;

      return { ...prev, page };
    });
  }, []);

  const headerRow: GridRow = { cells: [], key: 'header' };
  const rows: GridRow[] = [headerRow];

  def.columns.forEach((c, index) => {
    const cell: GridCell = {
      key: (c.key as string) ?? index,
      value: c.key as string,
      width: DEFAULT_WIDTH,
      isHeader: true,
      sortColumn: () => sortColumnHandler(c.key),
    };

    if (sortColumn?.key === c.key) cell.sortDirection = sortColumn.dir;

    headerRow.cells.push(cell);
  });
  headerRow.cells.push({ key: EMPTY_CELL_KEY, isHeader: true });

  if (sortColumn) {
    dataToUse = dataToUse.sort((a, b) => {
      if (a[sortColumn.key] < b[sortColumn.key]) return sortColumn.dir === 'ASC' ? -1 : 1;
      if (a[sortColumn.key] > b[sortColumn.key]) return sortColumn.dir === 'ASC' ? 1 : -1;
      return 0;
    });
  }

  if (pagination) {
    dataToUse = dataToUse.take(pag.pageSize, pag.pageSize * pag.page);
  }

  dataToUse.forEach((item, rowIndex) => {
    const key = def.rowKey ? (typeof def.rowKey === 'function' ? def.rowKey(item) : (item[def.rowKey] as string)) : rowIndex;

    const row: GridRow = { cells: [], key };

    def.columns.forEach((c) => {
      row.cells.push({ key: c.key as string, value: item[c.key] as string, width: DEFAULT_WIDTH });
    });

    row.cells.push({ key: EMPTY_CELL_KEY });

    rows.push(row);
  });

  return {
    rows,
    gridTemplateColumns: `repeat(${def.columns.length}, max-content) auto`,
    pagination: {
      pageSize: pag.pageSize,
      page: pag.page,
      totalPages: pag.totalPages,
      changePage: changePageHandler,
    },
  };
}
