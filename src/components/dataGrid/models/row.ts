import { Key } from '../dataGridContract';
import Grid from './grid';

export default class Row<TRow> {
  constructor(grid: Grid<TRow>, row: TRow, rowIndex: number) {
    this.grid = grid;
    this.row = row;

    this.rowKey = this.getRowKey(row, rowIndex);
  }

  public readonly grid: Grid<TRow>;
  public readonly rowKey: Key;
  public readonly row: TRow;

  private getRowKey(row: TRow, rowIndex: number) {
    const { rowKey } = this.grid.props.def;

    const key = rowKey ? (typeof rowKey === 'function' ? rowKey(row) : (row[rowKey] as string)) : rowIndex; //+ parentGroupValue;

    return key;
  }
}
