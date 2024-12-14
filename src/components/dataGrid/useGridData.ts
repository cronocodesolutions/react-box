import { useCallback, useMemo, useState } from 'react';
import { GridCell, GridDef, GridRow, SortDirection } from './dataGridContract';
import FnUtils from '../../utils/fn/fnUtils';

const DEFAULT_WIDTH = 40;
const DEFAULT_WIDTH_PX = DEFAULT_WIDTH * 4;
export const EMPTY_CELL_KEY = 'empty-cell';
const SORT_DIRECTION: SortDirection = 'ASC';
const DEFAULT_PAGE_SIZE = 10;

interface Props<TRow> {
  data?: TRow[];
  def: GridDef<TRow>;
}

export default function useGridData<TRow>(props: Props<TRow>) {
  const { data, def } = props;

  let dataToUse = data ? [...data] : [];

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

    return { pageSize, page: 0, totalPages: Math.ceil(dataToUse.length / pageSize) };
  });
  const changePageHandler = useCallback((page: number) => {
    setPag((prev) => {
      if (page >= prev.totalPages || page < 0) return prev;

      return { ...prev, page };
    });
  }, []);

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

  const rows = useMemo(() => {
    const headerRow: GridRow = { cells: [], key: 'header' };
    const rows: GridRow[] = [headerRow];

    def.columns.forEach((c, index) => {
      const headerCell: GridCell = {
        key: (c.key as string) ?? index,
        value: c.key as string,
        width: DEFAULT_WIDTH,
        inlineWidth: columnSize[c.key as string],
        isHeader: true,
        sortColumn: () => sortColumnHandler(c.key),
      };

      headerCell.resizeColumn = (e) => resizeColumnHandler(e, headerCell);

      if (sortColumn?.key === c.key) {
        headerCell.sortDirection = sortColumn.dir;
      }

      headerRow.cells.push(headerCell);
    });
    headerRow.cells.push({ key: EMPTY_CELL_KEY, isHeader: true });

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

    dataToUse.forEach((item, rowIndex) => {
      const key = def.rowKey ? (typeof def.rowKey === 'function' ? def.rowKey(item) : (item[def.rowKey] as string)) : rowIndex;

      const row: GridRow = { cells: [], key };

      def.columns.forEach((c) => {
        row.cells.push({
          key: c.key as string,
          value: item[c.key] as string,
          width: DEFAULT_WIDTH,
          inlineWidth: columnSize[c.key as string],
        });
      });

      row.cells.push({ key: EMPTY_CELL_KEY });

      rows.push(row);
    });

    return rows;
    // TODO: remove columnSize dependency
  }, [def, sortColumn, pag, columnSize]);

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

export type GridData = ReturnType<typeof useGridData>;
