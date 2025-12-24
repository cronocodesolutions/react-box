import { useCallback, useState } from 'react';
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

  // Debounce filter changes
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setLocalValue(value);

      // Simple debounce using setTimeout
      const timeoutId = setTimeout(() => {
        grid.setGlobalFilter(value);
      }, 300);

      return () => clearTimeout(timeoutId);
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
          {filtered} / {total}
        </Box>
      )}
      <Flex component="datagrid.topBar.globalFilter.inputWrapper">
        <Flex component="datagrid.topBar.globalFilter.inputWrapper.icon">
          <SearchIcon fill="currentColor" width="1rem" />
        </Flex>
        <Textbox
          component="datagrid.topBar.globalFilter.inputWrapper.input"
          placeholder="Search..."
          value={localValue}
          onChange={handleChange}
          pl={8}
          pr={localValue ? 8 : 3}
          height={8}
          width={50}
        />
        {localValue && (
          <Box component="datagrid.topBar.globalFilter.inputWrapper.clear" props={{ onClick: handleClear }}>
            ✕
          </Box>
        )}
      </Flex>
    </Flex>
  );
}
