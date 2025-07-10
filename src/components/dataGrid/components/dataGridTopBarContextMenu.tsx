import { useMemo } from 'react';
import useVisibility from '../../../hooks/useVisibility';
import BaseSvg from '../../baseSvg';
import Button from '../../button';
import Checkbox from '../../checkbox';
import Tooltip from '../../tooltip';
import GridModel, { EMPTY_CELL_KEY, GROUPING_CELL_KEY, ROW_NUMBER_CELL_KEY, ROW_SELECTION_CELL_KEY } from '../models/gridModel';

interface Props<TRow> {
  grid: GridModel<TRow>;
}

export default function DataGridTopBarContextMenu<TRow>(props: Props<TRow>) {
  const { grid } = props;
  const [isOpen, setOpen, refToUse] = useVisibility({ event: 'mousedown' });

  const leafsToHide = useMemo(
    () =>
      grid.columns.value.leafs.filter(
        (l) => ![EMPTY_CELL_KEY, ROW_NUMBER_CELL_KEY, ROW_SELECTION_CELL_KEY, GROUPING_CELL_KEY].includes(l.key),
      ),
    [grid.columns.value.leafs],
  );

  return (
    <Button component="datagrid.topBar.contextMenu" onClick={() => setOpen(!isOpen)}>
      <BaseSvg viewBox="0 0 24 24" width="20" fill="currentColor" {...props}>
        <path d="M5 6h14M5 12h14M5 18h14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></path>
      </BaseSvg>
      {isOpen && (
        <Tooltip component="datagrid.topBar.contextMenu.tooltip" ref={refToUse}>
          {leafsToHide.map((leaf) => (
            <Button
              key={leaf.key}
              component="datagrid.topBar.contextMenu.tooltip.item"
              onClick={(e) => {
                e.stopPropagation();
                leaf.toggleVisibility();
              }}
            >
              <Checkbox variant="datagrid" checked={leaf.isVisible} onChange={() => {}} focus={{ outline: 0 }} />
              {leaf.header ?? leaf.key}
            </Button>
          ))}
        </Tooltip>
      )}
    </Button>
  );
}

(DataGridTopBarContextMenu as React.FunctionComponent).displayName = 'DataGridTopBarContextMenu';
