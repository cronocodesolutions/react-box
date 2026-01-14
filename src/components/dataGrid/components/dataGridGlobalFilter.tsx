import { useCallback, useEffect, useRef, useState } from 'react';
import Box from '../../../box';
import SearchIcon from '../../../icons/searchIcon';
import Flex from '../../flex';
import Textbox from '../../textbox';
import GridModel from '../models/gridModel';

interface Props<TRow> {
  grid: GridModel<TRow>;
}

export default function DataGridGlobalFilter<TRow>(props: Props<TRow>) {
  const { grid } = props;
  const [localValue, setLocalValue] = useState(grid.globalFilterValue);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Debounce filter changes
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setLocalValue(value);

      // Clear previous timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        grid.setGlobalFilter(value);
        timeoutRef.current = null;
      }, 300);
    },
    [grid],
  );

  const handleClear = useCallback(() => {
    setLocalValue('');
    grid.setGlobalFilter('');
  }, [grid]);

  const { filtered, total } = grid.filterStats;
  const showStats = grid.hasActiveFilters && filtered !== total;

  return (
    <Flex component="datagrid.topBar.globalFilter">
      {showStats && (
        <Box component="datagrid.topBar.globalFilter.stats">
          {filtered}/{total}
        </Box>
      )}
      <Flex position="relative" ai="center">
        <Flex position="absolute" left={3} pointerEvents="none" color="gray-400" theme={{ dark: { color: 'gray-500' } }}>
          <SearchIcon fill="currentColor" width="14px" />
        </Flex>
        <Textbox placeholder="Search..." variant="compact" value={localValue} onChange={handleChange} pl={8} pr={localValue ? 8 : 3} />
        {localValue && (
          <Box
            position="absolute"
            right={2}
            cursor="pointer"
            p={1}
            color="gray-400"
            hover={{ color: 'gray-600' }}
            theme={{ dark: { color: 'gray-500', hover: { color: 'gray-300' } } }}
            props={{ onClick: handleClear }}
          >
            <Box fontSize={12} fontWeight={600}>
              ✕
            </Box>
          </Box>
        )}
      </Flex>
    </Flex>
  );
}
