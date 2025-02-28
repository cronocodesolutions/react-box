import ColumnModel from './columnModel';
import GridModel from './gridModel';
import RowModel from './rowModel';

export default class CellModel<TRow> {
  constructor(
    public readonly grid: GridModel<TRow>,
    public readonly row: RowModel<TRow>,
    public readonly column: ColumnModel<TRow>,
  ) {}
}
