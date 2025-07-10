import { useCallback, useState } from 'react';
import DataGridBody from './dataGridBody';
import DataGridHeader from './dataGridHeader';
import Box from '../../../box';
import FnUtils from '../../../utils/fn/fnUtils';
import GridModel from '../models/gridModel';

interface Props<TRow> {
  grid: GridModel<TRow>;
}

export default function DataGridContent<TRow>(props: Props<TRow>) {
  const { grid } = props;

  const [scrollTop, setScrollTop] = useState(0);

  const handleScroll = useCallback(
    FnUtils.throttle((event: React.UIEvent) => {
      setScrollTop((event.target as HTMLDivElement).scrollTop);
    }, 100),
    [],
  );

  return (
    <Box overflowX="scroll" props={{ onScroll: handleScroll }}>
      <DataGridHeader grid={grid} />

      <DataGridBody grid={grid} scrollTop={scrollTop} />
    </Box>
  );
}

(DataGridContent as React.FunctionComponent).displayName = 'DataGridContent';
