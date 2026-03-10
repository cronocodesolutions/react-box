import { Key } from '../contracts/dataGridContract';
import GridModel from './gridModel';
import RowModel from './rowModel';

export default class DetailRowModel<TRow> {
  constructor(
    public readonly grid: GridModel<TRow>,
    public readonly parentRow: RowModel<TRow>,
  ) {}

  public get key(): Key {
    return `detail-${this.parentRow.key}`;
  }

  public static readonly AUTO_HEIGHT_ESTIMATE = 200;

  public get height(): 'auto' | number {
    const config = this.grid.props.def.rowDetail;
    if (!config || config.height === undefined || config.height === 'auto') return 'auto';
    if (typeof config.height === 'function') return config.height(this.parentRow.data);
    return config.height;
  }

  /** Numeric height for virtualization offset calculations. Uses estimate for 'auto'. */
  public get heightForOffset(): number {
    const h = this.height;
    return h === 'auto' ? DetailRowModel.AUTO_HEIGHT_ESTIMATE : h;
  }

  public readonly count = 0;

  public get flatRows() {
    return [this];
  }

  public get allRows(): RowModel<TRow>[] {
    return [];
  }
}
