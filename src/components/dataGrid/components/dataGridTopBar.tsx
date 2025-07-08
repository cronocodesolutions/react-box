import GridModel from '../models/gridModel';
import Flex from '../../flex';
import DataGridColumnGroups from './dataGridColumnGroups';
import DataGridTopBarContextMenu from './dataGridTopBarContextMenu';

interface Props<TRow> {
  grid: GridModel<TRow>;
}

export default function DataGridTopBar<TRow>(props: Props<TRow>) {
  const { grid } = props;

  return (
    <Flex component="datagrid.topBar" position="relative">
      <DataGridTopBarContextMenu grid={grid} />
      <DataGridColumnGroups grid={grid} />

      {/* <Flex position="absolute" justifySelf="flex-end" right={2} top={2} className="parent">
        <Flex position="absolute" width={8} height={8} right={0} jc="center">
          <SearchIcon fill="currentColor" width="1rem" />
        </Flex>
        <Textbox placeholder="Search..." height={8} width={50} zIndex={1} bgColor="transparent" />
      </Flex> */}
    </Flex>
  );
}

(DataGridTopBar as React.FunctionComponent).displayName = 'DataGridTopBar';
