import { ColumnType, DataGridProps, Key } from './dataGridContract';
import '../../array';

export class DataGridHelper<TRow> {
  constructor(private _props: DataGridProps<TRow>) {
    this.buildColumns();
  }

  private buildColumns() {
    read(this._props.def.columns);

    function read(cols: ColumnType<TRow>[], headerRow = 0, parentKey?: Key) {
      cols.forEach((col) => {
        const isParent = 'columns' in col;

        // const column: Column<TRow> = {
        //   // key: col.key as string,
        //   // headerRow,
        //   // isParent,
        //   // raw: col,
        //   // parentKey,
        //   // rowSpan: 1,
        //   // colSpan: 1,
        //   // leafs: [],
        //   // // inlineWidth: this._columnSize[col.key as string] ?? DEFAULT_WIDTH,
        //   // top: DEFAULT_ROW_HEIGHT * headerRow,
        // };

        // // this._columns.push(column);

        // if (isParent) {
        //   read(col.columns, headerRow + 1, column.key);

        //   // column.leafs = col.columns.flatMap((c) => this._columns.find((x) => x.key === c.key)!.leafs);
        // } else {
        //   column.leafs.push(col.key as string);
        // }
      });
    }
  }
}
