import Box from '../../../box';
import Flex from '../../flex';
import DetailRowModel from '../models/detailRowModel';

interface Props<TRow> {
  row: DetailRowModel<TRow>;
}

export default function DataGridDetailRow<TRow>(props: Props<TRow>) {
  const { row } = props;
  const { grid, parentRow } = row;
  const config = grid.props.def.rowDetail!;

  const isAutoHeight = row.height === 'auto';

  return (
    <Flex
      props={{ role: 'row' }}
      style={{
        gridColumn: '1 / -1',
        height: isAutoHeight ? 'auto' : `${row.height}px`,
      }}
    >
      <Box position="sticky" left={0} width="fit" overflow="hidden" style={{ minWidth: '100%' }}>
        {config.content(parentRow.data)}
      </Box>
    </Flex>
  );
}

(DataGridDetailRow as React.FunctionComponent).displayName = 'DataGridDetailRow';
