import { useLayoutEffect } from 'react';
import Box from '../../../box';
import { documentOrNull } from '../../../utils/environment/environmentUtils';
import GridModel from '../models/gridModel';

const ANIMATION_NAME = 'rb-datagrid-loader';
const BAR_CLASS_NAME = 'rb-datagrid-loader-bar';
const STYLE_ID = 'rb-datagrid-loader-keyframes';

// Box has no @keyframes API, so the loader registers its indeterminate sweep once in a dedicated <style>:
// a 40%-wide bar sliding off one edge to the other, repeating. Applied from a class rather than an inline
// style so the reduced-motion rule below can take it off again — an inline style outranks every
// stylesheet, and `aria-busy` on the grid is what says "loading" anyway.
function ensureKeyframes() {
  const doc = documentOrNull();
  if (!doc || doc.getElementById(STYLE_ID)) return;

  const style = doc.createElement('style');
  style.id = STYLE_ID;
  style.textContent =
    `@keyframes ${ANIMATION_NAME}{0%{transform:translateX(-100%)}100%{transform:translateX(250%)}}` +
    `.${BAR_CLASS_NAME}{animation:${ANIMATION_NAME} 1.1s linear infinite}` +
    `@media (prefers-reduced-motion: reduce){.${BAR_CLASS_NAME}{animation:none}}`;
  doc.head.appendChild(style);
}

interface Props<TRow> {
  grid: GridModel<TRow>;
}

export default function DataGridLoader<TRow>(props: Props<TRow>) {
  const { grid } = props;

  useLayoutEffect(ensureKeyframes, []);

  return (
    // Decorative, and hidden from the accessibility tree on purpose: a grid may hold nothing but
    // rowgroups, and "this grid is loading" is `aria-busy` on the grid itself, which is where
    // `DataGridContent` puts it.
    <Box component={`${grid.componentName}.loader` as never} props={{ 'aria-hidden': true }}>
      <Box component={`${grid.componentName}.loader.track` as never} style={{ height: 3 }}>
        <Box component={`${grid.componentName}.loader.track.bar` as never} width="2/5" className={BAR_CLASS_NAME} />
      </Box>
    </Box>
  );
}

(DataGridLoader as React.FunctionComponent).displayName = 'DataGridLoader';
