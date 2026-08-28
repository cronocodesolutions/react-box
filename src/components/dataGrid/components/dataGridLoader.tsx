import { useLayoutEffect } from 'react';
import Box from '../../../box';
import { documentOrNull } from '../../../utils/environment/environmentUtils';
import GridModel from '../models/gridModel';

const ANIMATION_NAME = 'rb-datagrid-loader';
const STYLE_ID = 'rb-datagrid-loader-keyframes';

// Box has no @keyframes API, so the loader registers its indeterminate-sweep animation
// once in a dedicated <style>. The bar (40% wide) slides from off the left edge to off
// the right edge and repeats, giving a continuous progress sweep.
function ensureKeyframes() {
  const doc = documentOrNull();
  if (!doc || doc.getElementById(STYLE_ID)) return;

  const style = doc.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `@keyframes ${ANIMATION_NAME}{0%{transform:translateX(-100%)}100%{transform:translateX(250%)}}`;
  doc.head.appendChild(style);
}

interface Props<TRow> {
  grid: GridModel<TRow>;
}

export default function DataGridLoader<TRow>(props: Props<TRow>) {
  const { grid } = props;

  useLayoutEffect(ensureKeyframes, []);

  return (
    <Box component={`${grid.componentName}.loader` as never} props={{ role: 'progressbar', 'aria-busy': true }}>
      <Box component={`${grid.componentName}.loader.track` as never} style={{ height: 3 }}>
        <Box
          component={`${grid.componentName}.loader.track.bar` as never}
          width="2/5"
          style={{ animation: `${ANIMATION_NAME} 1.1s linear infinite` }}
        />
      </Box>
    </Box>
  );
}

(DataGridLoader as React.FunctionComponent).displayName = 'DataGridLoader';
