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

  return (
    <Flex component="datagrid.topBar" position="relative" ai="center" jc="space-between">
      <Flex ai="center" gap={2}>
        <DataGridTopBarContextMenu grid={grid} />
        <DataGridColumnGroups grid={grid} />
      </Flex>

      {grid.props.def.globalFilter && (
        <Flex position="relative" pr={2}>
          <DataGridGlobalFilter grid={grid} />
        </Flex>
      )}
    </Flex>
  );
}

(DataGridTopBar as React.FunctionComponent).displayName = 'DataGridTopBar';
