import { useCallback, useRef, useState } from 'react';
import Box from '../../../box';
import BaseSvg from '../../baseSvg';
import Flex from '../../flex';
import GridModel from '../models/gridModel';
import DataGridBody from './dataGridBody';
import DataGridHeader from './dataGridHeader';

interface Props<TRow> {
  grid: GridModel<TRow>;
}

export default function DataGridContent<TRow>(props: Props<TRow>) {
  const { grid } = props;

  const [scrollTop, setScrollTop] = useState(0);
  const rafRef = useRef<number | null>(null);

  const handleScroll = useCallback((event: React.UIEvent) => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      setScrollTop((event.target as HTMLDivElement).scrollTop);
      rafRef.current = null;
    });
  }, []);

  const hasVisibleColumns = grid.columns.value.userVisibleLeafs.length > 0;

  if (!hasVisibleColumns) {
    return (
      <Flex
        d="column"
        ai="center"
        jc="center"
        gap={4}
        py={16}
        px={6}
        bgColor="gray-50"
        borderRadius={4}
        theme={{ dark: { bgColor: 'gray-900' } }}
      >
        <Flex d="column" ai="center" gap={3}>
          <Box
            width={16}
            height={16}
            borderRadius={999}
            bgColor="gray-200"
            theme={{ dark: { bgColor: 'gray-700' } }}
            display="flex"
            ai="center"
            jc="center"
          >
            <BaseSvg viewBox="0 0 24 24" width="40" fill="currentColor" color="gray-400" theme={{ dark: { color: 'gray-500' } }}>
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3 6a3 3 0 013-3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm3-1a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V6a1 1 0 00-1-1H6zm2 3a1 1 0 011-1h6a1 1 0 110 2H9a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H9a1 1 0 01-1-1zm0 4a1 1 0 011-1h4a1 1 0 110 2H9a1 1 0 01-1-1z"
              />
            </BaseSvg>
          </Box>

          <Flex d="column" ai="center" gap={1}>
            <Box fontSize={18} fontWeight={600} color="gray-900" theme={{ dark: { color: 'gray-50' } }}>
              No Columns Selected
            </Box>
            <Box fontSize={14} color="gray-500" textAlign="center" theme={{ dark: { color: 'gray-400' } }}>
              Select at least one column from the columns menu to display data
            </Box>
          </Flex>
        </Flex>
      </Flex>
    );
  }

  return (
    <Box overflowX="scroll" style={{ willChange: 'scroll-position' }} props={{ onScroll: handleScroll }}>
      <DataGridHeader grid={grid} />

      <DataGridBody grid={grid} scrollTop={scrollTop} />
    </Box>
  );
}

(DataGridContent as React.FunctionComponent).displayName = 'DataGridContent';
