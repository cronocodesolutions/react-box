// ✅ simple table column definitions + data[]
// ✅ hover row styles
// ✅ horizontal scroll for headers + rows
// ✅ vertical scroll rows only
// ✅ column sorting
// ❌ pagination
// ✅ resize column
// ✅ pin (left/right)
// ✅ multi-level headers
// ✅ grouping
// ❌ select row checkbox
// ❌ filters
// ❌ empty table
// ❌ column sorting by type

// datagrid container

import Box from '../box';
import DataGridBottomBar from './dataGrid/components/dataGridBottomBar';
import DataGridContent from './dataGrid/components/dataGridContent';
import DataGridTopBar from './dataGrid/components/dataGridTopBar';
import { DataGridProps } from './dataGrid/contracts/dataGridContract';
import useGrid from './dataGrid/useGrid';

export default function DataGrid<TRow extends object>(props: DataGridProps<TRow>) {
  const grid = useGrid(props);

  console.debug('\x1b[36m%s\x1b[0m', '[react-box]: DataGrid render');

  return (
    <Box component="datagrid" style={grid.sizes.value} props={{ role: 'presentation' }}>
      {grid.props.def.topBar && <DataGridTopBar grid={grid} />}

      <DataGridContent grid={grid} />

      {grid.props.def.bottomBar && <DataGridBottomBar grid={grid} />}
    </Box>
  );
}

(DataGrid as React.FunctionComponent).displayName = 'DataGrid';
