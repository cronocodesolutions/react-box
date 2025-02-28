import Column from './column';
import Grid from './grid';
import Row from './row';

export default class Cell<TRow> {
  constructor(
    public readonly grid: Grid<TRow>,
    public readonly row: Row<TRow>,
    public readonly column: Column<TRow>,
  ) {}
}
