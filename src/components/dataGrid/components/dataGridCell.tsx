import { BoxProps } from '../../../box';
import Flex from '../../flex';
import ColumnModel from '../models/columnModel';

interface Props<TRow> extends BoxProps {
  children: React.ReactNode;
  column: ColumnModel<TRow>;
  isExpanded?: boolean;
  isFirstInRow?: boolean;
  isLastInRow?: boolean;
}

export default function DataGridCell<TRow>(props: Props<TRow>) {
  const { children, column, isExpanded = false, isFirstInRow = false, isLastInRow = false, style, ...restProps } = props;

  if (column.hasAlign) restProps.jc = column.align;

  // Column-stable variant (precomputed once) merged with this row's expansion state.
  const variant = isExpanded
    ? { ...column.cellVariant.value, isExpanded, isExpandedFirstLeaf: isFirstInRow, isExpandedLastLeaf: isLastInRow }
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
