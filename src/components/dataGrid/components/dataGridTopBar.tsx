import Box from '../../../box';
import Flex from '../../flex';
import GridModel from '../models/gridModel';
import DataGridColumnGroups from './dataGridColumnGroups';
import DataGridGlobalFilter from './dataGridGlobalFilter';
import DataGridTopBarContextMenu from './dataGridTopBarContextMenu';

interface Props<TRow> {
  grid: GridModel<TRow>;
}

export default function DataGridTopBar<TRow>(props: Props<TRow>) {
  const { grid } = props;
  const { title, topBarContent, globalFilter } = grid.props.def;

  return (
    <Flex component="datagrid.topBar" position="relative" ai="center" jc="space-between" gap={4} flexWrap="wrap">
      {/* Left section: Title and grouping context */}
      <Flex ai="center" gap={3} flexWrap="wrap" minWidth={0}>
        <DataGridTopBarContextMenu grid={grid} />
        {title && (
          <Box fontWeight={600} fontSize={16} color="gray-800" theme={{ dark: { color: 'gray-100' } }}>
            {title}
          </Box>
        )}

        <DataGridColumnGroups grid={grid} />
      </Flex>

      {/* Right section: Actions */}
      <Flex ai="center" gap={3} flexWrap="wrap" jc="flex-end" minWidth={0}>
        {topBarContent && <Box>{topBarContent}</Box>}

        {globalFilter && <DataGridGlobalFilter grid={grid} />}
      </Flex>
    </Flex>
  );
}

(DataGridTopBar as React.FunctionComponent).displayName = 'DataGridTopBar';
