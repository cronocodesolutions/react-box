import { GridDef, GridRow } from './dataGridContract';

const DEFAULT_WIDTH = 40;
export const EMPTY_CELL_KEY = 'empty-cell';

interface Props<TRow> {
  data?: TRow[];
  def: GridDef<TRow>;
}

export default function useGridData<TRow>(props: Props<TRow>) {
  const { data, def } = props;

  const headerRow: GridRow = { cells: [], key: 'header' };
  const rows: GridRow[] = [headerRow];

  def.columns.forEach((c, index) => {
    headerRow.cells.push({
      key: (c.key as string) ?? index,
      value: c.key as string,
      width: DEFAULT_WIDTH,
      isHeader: true,
    });
  });
  headerRow.cells.push({ key: EMPTY_CELL_KEY, isHeader: true });

  data?.forEach((item, rowIndex) => {
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
  };
}
