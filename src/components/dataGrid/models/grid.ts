import memo from '../../../utils/memo';
import { ColumnType, DataGridProps, Key, PinPosition } from '../dataGridContract';
import Column from './column';
import Row from './row';

export const EMPTY_CELL_KEY = 'empty-cell';
const columnsOrder: Record<PinPosition, number> = {
  LEFT: 0,
  NO_PIN: 1,
  RIGHT: 2,
};

export default class Grid<TRow> {
  constructor(
    public readonly props: DataGridProps<TRow>,
    public readonly update: () => void,
  ) {}

  public widthOverrides: Record<Key, number> = {};
  public pinOverrides: Record<Key, PinPosition> = {};

  public readonly _columns = memo(() => {
    // console.log(this._columnDefs);

    const create = (columnDefs: ColumnType<TRow>[], parentPin?: PinPosition): Column<TRow>[] => {
      const columns: Column<TRow>[] = [];

      columnDefs.flatMap((def) => {
        const children = create(def.columns ?? [], this.pinOverrides[def.key] ?? parentPin ?? def.pin);
        const distinctPin = children.groupBy((c) => c.pin);

        distinctPin.forEach(({ key: pin, values }) => {
          const column = new Column(def, this, this.pinOverrides[def.key] ?? pin, values);
          columns.push(column);
        });

        if (children.length === 0) {
          const column = new Column(def, this, this.pinOverrides[def.key] ?? parentPin);
          columns.push(column);
        }
      });

      return columns;
    };

    // user defined columns
    let columns = create(this.props.def.columns);

    // add empty column
    const emptyColumn = new Column<TRow>({ key: EMPTY_CELL_KEY }, this);
    columns.push(emptyColumn);

    columns = columns.sortBy((c) => columnsOrder[c.pin]);

    let prevLeft = 0;
    let prevRight = 0;

    for (let index = 0, lastIndex = columns.length - 1; index < columns.length; index++, lastIndex--) {
      const left = columns.at(index);
      const right = columns.at(lastIndex);

      if (left?.pin === 'LEFT') {
        prevLeft = left.setLeft(prevLeft);

        if (columns.at(index + 1)?.pin !== 'LEFT') {
          left.setEdge();
        }
      }

      if (right?.pin === 'RIGHT') {
        prevRight = right.setRight(prevRight);

        if (columns.at(lastIndex - 1)?.pin !== 'RIGHT') {
          right.setEdge();
        }
      }
    }

    return columns;
  });

  public readonly headerRows = memo(() => {
    const groupedByLevel = this._columns.value
      .flatMap((c) => c.allLevelColumns)
      .groupBy((c) => c.level)
      .sortBy((x) => x.key);

    return groupedByLevel.map((x) => {
      const cols = x.values.groupBy((c) => c.pin).toRecord((c) => [c.key, c.values]);

      return [...(cols.LEFT ?? []), ...(cols.NO_PIN ?? []), ...(cols.RIGHT ?? [])];
    });
  });

  public readonly leafs = memo(() => this._columns.value.flatMap((c) => c.leafs));

  public readonly gridTemplateColumns = memo(() => {
    const rightPinnedColumnsCount = this.leafs.value.sumBy((x) => (x.pin === 'RIGHT' ? 1 : 0));
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

  public readonly ROW_HEIGHT = 12;
  public readonly MIN_WIDTH_PX = 40;
  public isResizeMode = false;

  public setSortColumn = (columnKey: Key) => {
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
  };

  private _sortColumn?: Key;
  private _sortDirection: SortDirection = 'ASC';
}
