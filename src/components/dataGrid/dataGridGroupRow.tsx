import Button from '../button';
import Flex from '../flex';
import GroupRow from './models/groupRow';

interface Props<TRow> {
  row: GroupRow<TRow>;
}

export default function DataGridGroupRow<TRow>(props: Props<TRow>) {
  const { row } = props;

  return (
    <>
      <Flex
        bb={1}
        bgColor="gray-100"
        height={row.grid.ROW_HEIGHT}
        className={['grid-group-row', row.rowKey.toString()]}
        style={{
          width: `var(--row-width)`,
        }}
        ai="center"
        transition="none"
      >
        <Button clean cursor="pointer" position="sticky" left={0} onClick={() => row.toggleRow()}>
          {'>'} {row.groupValue} ({row.count})
        </Button>
      </Flex>
    </>
  );
}
