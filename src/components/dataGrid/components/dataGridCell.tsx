import { BoxProps } from '../../../box';
import Flex from '../../flex';
import CellModel from '../models/cellModel';
import GroupRowCellModel from '../models/groupRowCellModel';

interface Props<TRow> extends BoxProps {
  children: React.ReactNode;
  cell: CellModel<TRow> | GroupRowCellModel<TRow>;
}

export default function DataGridCell<TRow>(props: Props<TRow>) {
  const { children, cell, style, ...restProps } = props;
  const { column } = cell;

  if (column.hasAlign) restProps.jc = column.align;

  // Column-stable variant (precomputed once) merged with this row's expansion state.
  const variant = cell.isExpanded
    ? { ...column.cellVariant.value, isExpanded: true, isExpandedFirstLeaf: cell.isFirst, isExpandedLastLeaf: cell.isLast }
    : column.cellVariant.value;

  return (
    <Flex
      component={`${column.grid.componentName}.body.cell` as never}
      props={{ role: 'cell' }}
      variant={variant as never}
      style={{ ...column.cellStyleVars.value, ...style }}
      {...restProps}
    >
      {children}
    </Flex>
  );
}

(DataGridCell as React.FunctionComponent).displayName = 'DataGridCell';
