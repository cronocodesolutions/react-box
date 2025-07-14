import Box from '../../../box';
import Flex from '../../flex';
import CellModel from '../models/cellModel';

interface Props<TRow> {
  cell: CellModel<TRow>;
}

export default function DataGridCellText<TRow>(props: Props<TRow>) {
  const { cell } = props;

  return (
    <Flex height="fit" width="fit" overflow="auto" ai="center" jc={cell.column.align}>
      <Box px={3} textOverflow="ellipsis" overflow="hidden" textWrap="nowrap">
        {cell.value as string}
      </Box>
    </Flex>
  );
}

(DataGridCellText as React.FunctionComponent).displayName = 'DataGridCellText';
