import memo from '../../../utils/memo';
import { DataGridProps, Key, NO_PIN, PinPosition } from '../dataGridContract';
import Column from './column';
import Row from './row';

export const EMPTY_CELL_KEY = 'empty-cell';
export default class Grid<TRow> {
  constructor(
    public readonly props: DataGridProps<TRow>,
    public readonly update: () => void,
  ) {
    this.sourceColumns = props.def.columns.map((def) => new Column(def, this));
    // add empty column
    this.sourceColumns.push(new Column({ key: EMPTY_CELL_KEY }, this));
  }

  public readonly sourceColumns: Column<TRow>[] = [];

  public readonly leftColumns = memo(() => this.sourceColumns.map((c) => c.getPinned('LEFT')).filter((c) => !!c));
  public readonly middleColumns = memo(() => this.sourceColumns.map((c) => c.getPinned()).filter((c) => !!c));
  public readonly rightColumns = memo(() => this.sourceColumns.map((c) => c.getPinned('RIGHT')).filter((c) => !!c));
  public readonly flatColumns = memo(() =>
    [...this.leftColumns.value, ...this.middleColumns.value, ...this.rightColumns.value].flatMap((c) => c.flatColumns),
  );
  public readonly headerRows = memo(() => {
    const groupedByLevel = this.flatColumns.value.groupBy((c) => c.death).sortBy((x) => x.key);

    return groupedByLevel.map((x) => {
      const cols = x.values.groupBy((c) => c.pin ?? NO_PIN).toRecord((c) => [c.key, c.values]);

      return [...(cols.LEFT ?? []), ...(cols.NO_PIN ?? []), ...(cols.RIGHT ?? [])];
    });
  });
  public readonly leafs = memo(() => this.flatColumns.value.filter((x) => x.isLeaf));
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
