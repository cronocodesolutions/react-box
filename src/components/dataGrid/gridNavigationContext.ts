import { createContext, useContext } from 'react';
import { RovingFocusItemProps } from '../../react/a11y/useRovingFocus';

/**
 * The grid's keyboard coordinates, shared with every cell that draws itself.
 *
 * Rows are numbered the way `aria-rowindex` is: the header rows first, then the filter row when
 * there is one, then the body. A cell asks for its roving tabindex by that pair, which is why the
 * numbering has to be one thing the whole grid agrees on rather than three local ones.
 */
export interface GridNavigation {
  /** `aria-rowcount`: every row the grid has, not the window of them that is rendered. */
  rowCount: number;
  /** `aria-colcount`: the visible leaf columns. */
  columnCount: number;
  /** How many rows sit above the body — the offset from a body row's index to its row number. */
  headerRowCount: number;
  /** The roving tabindex and the ref for one cell, in the coordinates above. */
  cellProps: (row: number, column: number) => RovingFocusItemProps;
}

/**
 * Absent outside a DataGrid, and absent on purpose: `DataGridCell` is rendered by the grid and by
 * nothing else, so a missing provider is a bug rather than a supported way to use the component.
 */
const GridNavigationContext = createContext<GridNavigation | null>(null);

export default GridNavigationContext;

/** The grid navigation a cell belongs to. */
export function useGridNavigationContext(): GridNavigation | null {
  return useContext(GridNavigationContext);
}
