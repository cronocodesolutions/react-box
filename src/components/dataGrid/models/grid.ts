import memo from '../../../utils/memo';
import { ColumnType, DataGridProps, Key } from '../dataGridContract';
import Column from './column';
import Row from './row';

export const EMPTY_CELL_KEY = 'empty-cell';

export default class Grid<TRow> {
  constructor(
    public readonly props: DataGridProps<TRow>,
    public readonly update: () => void,
  ) {}

  public readonly columns = memo(() => {
    const create = (columnDefs: ColumnType<TRow>[], parent?: Column<TRow>): Column<TRow>[] => {
      let left: Maybe<Column<TRow>>;
      return columnDefs.map((def) => {
        const isParent = 'columns' in def;
        const column = new Column(this, def, parent, left);
        this._flatColumns.push(column);

        if (isParent) {
          column.columns = create(def.columns, column);
        }

        left = column;
        return column;
      });
    };

    const columns = create(this.props.def.columns);

    // add empty column
    const emptyColumn = new Column<TRow>(this, { key: EMPTY_CELL_KEY });
    columns.push(emptyColumn);
    this._flatColumns.push(emptyColumn);

    return columns;
  });

  public readonly headers = memo(() => {
    return this._flatColumns.sortBy((c) => c.level);
  });

  public readonly headerRowsCount = memo(() => {
    return this._flatColumns.maxBy((c) => c.level) + 1;
  });

  public readonly leafs = memo(() => {
    return this.columns.value.flatMap((c) => c.leafs);
  });

  public readonly gridTemplateColumns = memo(() => {
    const rightPinnedColumnsCount = 0; // this.columns.filter((c) => !c.isParent && c.pinned === 'RIGHT');
    const leftColsCount = this.leafs.value.length - rightPinnedColumnsCount - 1;

    const left = leftColsCount > 0 ? `repeat(${leftColsCount}, max-content)` : '';

    const right = rightPinnedColumnsCount > 0 ? `repeat(${rightPinnedColumnsCount}, max-content)` : '';

    return `${left} auto ${right}`;
  });

  public readonly rows = memo(() => {
    let data = this.props.data;

    if (this._sortColumn) {
      data = data.sortBy((x) => x[this._sortColumn as keyof TRow], this._sortDirection);
    }

    return data.map((row, rowIndex) => new Row(this, row, rowIndex));
  });

  public readonly defaultCellWidth = 40;
  public readonly defaultCellHeight = 12;

  public setSortColumn(columnKey: Key) {
    if (this._sortColumn !== columnKey) {
      this._sortDirection = 'ASC';
      this._sortColumn = columnKey;
    } else {
      if (this._sortDirection === 'ASC') {
        this._sortDirection = 'DESC';
      } else {
        this._sortDirection = 'ASC';
        this._sortColumn = undefined;
      }
    }

    this.rows.clear();
    this.update();
  }

  private _sortColumn?: Key;
  private _sortDirection: SortDirection = 'ASC';
  private readonly _flatColumns: Column<TRow>[] = [];
}
