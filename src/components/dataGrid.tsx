// ❌ simple table column definitions + data[]
// ❌ hover row styles
// ❌ horizontal scroll for headers + rows
// ❌ vertical scroll rows only
// ❌ column sorting
// ❌ pagination
// ❌ resize column
// ❌ pin (left/right)
// ❌ multi-level headers
// ❌ grouping
// ❌ select row checkbox
// ❌ filters
// ❌ empty table
// ❌ column sorting by type

// datagrid container

import Box from '../box';
import { DataGridProps } from './dataGrid/contracts/dataGridContract';
import useGrid from './dataGrid/useGrid';
import DataGridColumnGroups from './dataGrid/components/dataGridColumnGroups';
import DataGridBody from './dataGrid/components/dataGridBody';

export default function DataGrid<TRow extends {}>(props: DataGridProps<TRow>) {
  const grid = useGrid(props);

  console.debug('\x1b[36m%s\x1b[0m', '[react-box]: DataGrid render');

  return (
    <Box component="datagrid" style={grid.sizes.value} props={{ role: 'presentation' }}>
      <DataGridColumnGroups grid={grid} />

      <DataGridBody grid={grid} />

      <Box p={3} bgColor="gray-200" bt={1} borderColor="gray-400">
        Rows: {props.data.length}
      </Box>
    </Box>
  );
}

(DataGrid as React.FunctionComponent).displayName = 'DataGrid';
