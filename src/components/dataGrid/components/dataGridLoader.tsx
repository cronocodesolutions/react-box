import Box from '../../../box';
import GridModel from '../models/gridModel';

interface Props<TRow> {
  grid: GridModel<TRow>;
}

/**
 * The indeterminate loading bar: a 40%-wide bar sliding off one edge to the other, over and over. The
 * sweep is `rb-datagrid-loader`, registered with the engine's own keyframes, and the animation props
 * live in the bar's component styles — this component draws three Boxes and nothing else.
 */
export default function DataGridLoader<TRow>(props: Props<TRow>) {
  const { grid } = props;

  return (
    // Decorative, and hidden from the accessibility tree on purpose: a grid may hold nothing but
    // rowgroups, and "this grid is loading" is `aria-busy` on the grid itself, which is where
    // `DataGridContent` puts it.
    <Box component={`${grid.componentName}.loader` as never} props={{ 'aria-hidden': true }}>
      <Box component={`${grid.componentName}.loader.track` as never} style={{ height: 3 }}>
        <Box component={`${grid.componentName}.loader.track.bar` as never} width="2/5" />
      </Box>
    </Box>
  );
}

(DataGridLoader as React.FunctionComponent).displayName = 'DataGridLoader';
