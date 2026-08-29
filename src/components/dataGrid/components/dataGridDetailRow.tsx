import Box from '../../../box';
import Flex from '../../flex';
import { useGridNavigationContext } from '../gridNavigationContext';
import DetailRowModel from '../models/detailRowModel';

interface Props<TRow> {
  row: DetailRowModel<TRow>;
  /** Position in the whole row list, not in the rendered window. */
  index: number;
}

export default function DataGridDetailRow<TRow>(props: Props<TRow>) {
  const { row, index } = props;
  const { grid, parentRow } = row;
  const config = grid.props.def.rowDetail!;
  const navigation = useGridNavigationContext();
  const navRow = (navigation?.headerRowCount ?? 0) + index;
  const { ref, tabIndex, onFocus } = navigation?.cellProps(navRow, 0) ?? {};

  const isAutoHeight = row.isAutoHeight;

  return (
    <Flex
      component={`${grid.componentName}.body.detailRow` as never}
      props={{ role: 'row', 'aria-rowindex': navRow + 1 }}
      style={{
        gridColumn: '1 / -1',
        height: isAutoHeight ? 'auto' : `${row.height}px`,
      }}
    >
      <Box
        ref={ref}
        component={`${grid.componentName}.body.detailRow.content` as never}
        position="sticky"
        left={0}
        overflowX="auto"
        overflowY="hidden"
        // One cell across every column: the panel is what the row holds, and a row may hold
        // nothing but cells.
        props={{ role: 'gridcell', 'aria-colindex': 1, 'aria-colspan': navigation?.columnCount, tabIndex, onFocus }}
        style={{ width: `var(${grid.viewportWidthVarName})` }}
      >
        {config.content(parentRow.data)}
      </Box>
    </Flex>
  );
}

(DataGridDetailRow as React.FunctionComponent).displayName = 'DataGridDetailRow';
