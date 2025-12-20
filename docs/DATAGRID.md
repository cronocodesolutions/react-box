# DataGrid — Feature Inventory and Roadmap

This document describes the current capabilities of the DataGrid component and recommends features and API changes to make it production-ready and a competitive third‑party grid.

---

## Quick summary

- Location: `src/components/dataGrid/*` (main entry: `src/components/dataGrid.tsx`, model: `models/gridModel.ts`)
- Existing strengths: grouping, sorting, column pinning, column resizing, column visibility toggles, row selection (checkbox), row numbering, simple virtualization, custom cell renderers via `ColumnType.Cell`, header context menus and top/bottom bars, theming through the hosting library.

---

## What exists today (current capabilities)

### Data & definition API

- DataGridProps: `{ data: TRow[]; def: GridDefinition<TRow>; loading?: boolean; onSelectionChange?: ... }`
- GridDefinition includes: `columns`, `rowKey`, `showRowNumber`, `rowSelection`, `rowHeight`, `visibleRowsCount`, `topBar`, `bottomBar`.
- Column type supports nested columns (`columns`), `key`, `header`, `pin` (`LEFT`/`RIGHT`), `width`, `align`, and a custom `Cell` component.

### UX features

- Sorting: header context menu and header click can toggle sort state; supports ASC/DESC/clear.
- Column pinning (LEFT/RIGHT) with header controls and grouping-aware pinning.
- Column resizing via drag handle; columns respect min/max widths in model logic.
- Column visibility toggling via a top-bar context menu (checkbox list).
- Column grouping (grouping by a column): top bar shows active grouping and groups can be toggled (expand/collapse).
- Row selection: per-row checkboxes and select-all in header; `onSelectionChange` callback provides selection state.
- Row numbering column (configurable/pinnable/custom width).
- Virtualized rendering: simple windowing by calculating `startIndex` and rendering a subset of rows (`visibleRowsCount` + preload buffer).
- Header & body render as CSS grid with `gridTemplateColumns` adjusted for pinned columns.
- Group rows (aggregate rows): render header-like row with ability to expand/collapse and select all children.
- Top/Bottom bars: pluggable via `def.topBar` and `def.bottomBar` boolean flags; bottom bar currently shows rows count and selected count.

### Extensibility

- Custom cell renderers: `ColumnType.Cell` receives `{ cell }` with `.value`, `.row`, `.column` and can render arbitrary React components.
- Internals are model-driven (GridModel / ColumnModel / RowModel / CellModel), making behavioral changes observable and (relatively) encapsulated.

### Tests

- Unit tests cover header construction, pinning logic, grouping, sorting and row number behavior (`src/components/dataGrid/models/gridModel.test.ts`).

---

## Current limitations / notable gaps

- Pagination is stubbed and not implemented (commented code in `dataGridPagination.tsx`).
- No server-side modes (server paging, server sorting, server filtering) or built-in data fetching hooks.
- No filters (per-column or global) or filter UI.
- No multi-column sorting (only single sort column supported).
- No column reordering (drag-and-drop columns).
- The selection API is limited: internal state with `onSelectionChange` callback but no controlled selection props (e.g., `selectedRowKeys` input) or `selectionMode` (single/multi/none).
- No events/callbacks for: sort changes, column pin changes, column resize/width change, column visibility change, group changes, or row expand/collapse.
- Virtualization is a basic window; no support for variable row heights, true windowing libraries like `react-window`, or virtualization optimizations for very large datasets.
- Accessibility: limited ARIA/focus keyboard navigation and no keyboard-driven sorting/selection navigation.
- No cell editing API (inline editors, edit lifecycle events) or validation.
- No column footers/aggregation (sum/count/avg) or built-in aggregation functions for groups.
- No CSV/Excel export, copy/paste, or clipboard API.
- No row or column virtualization tests, integration tests for interactive features (resize drag, context menus, keyboard navigation).
- Column width persistence and controlled column state across re-renders or external state is missing (no onColumnWidthChange callback).

---

## Recommended feature set to make DataGrid competitive

Prioritized (must-have → nice-to-have):

1. Core data & control APIs (must-have)

- Controlled selection: add `selectedRowKeys?: Key[]` and `selectionMode?: 'single' | 'multiple' | 'none'` and keep `onSelectionChange` for events.
- Sort/Filter events: `onSortChange?(sort: {key: Key | undefined; dir?: 'ASC'|'DESC'})` and `onFilterChange?(filters)`.
- Column events: `onColumnVisibilityChange`, `onColumnResize`, `onColumnPinChange`, `onColumnOrderChange`.
- Paginated data support: `pagination?: { pageSize?: number } | { server: true }` and callbacks `onPageChange`, `onPageSizeChange`.

2. Server-side / controlled modes (must-have for large data)

- `mode: 'client'|'server'` flag and APIs to drive server paging, sorting, filtering.
- Simple examples/hooks for implementing server-side fetching and debounced requests (demo in `pages/`).

3. Filtering & multi-sort (must-have)

- Per-column filter controls (text/number/date/select-based) with pluggable filter UI components.
- Multi-column sort capability (array of sort descriptors).

4. Column improvements (must-have)

- Column definitions: add `sortable?: boolean`, `filterable?: boolean`, `editable?: boolean`, `resizable?: boolean`, `minWidth`, `maxWidth`, `defaultWidth`.
- Column reordering (drag-and-drop) with `onColumnOrderChange`.
- Column width persistence / controlled widths with `width` prop support and `onColumnResize` callback.

5. UX & accessibility (must-have)

- Keyboard navigation: arrow keys, space/enter for selection, home/end, page up/down; focus management for cells/headers.
- Proper ARIA attributes (aria-selected, aria-rowindex, etc.).
- Screen reader friendly header context menus and controls.

6. Editing & validation (highly recommended)

- Inline cell editors (text, select, number, custom), edit lifecycle events (`onCellEditStart`, `onCellEditCommit`, `onCellEditCancel`).
- Cell-level validation support.

7. Virtualization & performance (highly recommended)

- Replace/simple option to use `react-window` or `react-virtual` for robust virtualization (variable row heights, windowing).
- Expose virtualization configuration (`overscan`, `itemSize`, variable heights support).

8. Grouping & aggregation (strongly recommended)

- Group aggregates (sum/count/avg/min/max) with column-level aggregation functions.
- Group footers and group render customization.

9. API ergonomics & customization (recommended)

- `components` override system or render props for: `HeaderCell`, `Row`, `Cell`, `GroupRow`, `NoData`, `Loading`.
- Plugin/hooks API to add custom behaviors (e.g., selection persistence, column state plugin).

10. Export, copy & integrations (nice-to-have)

- CSV/Excel export, copy selected rows to clipboard, print-friendly mode.

11. Tests & examples (must-have for 3rd-party usage)

- Add tests for selection, resizing, pin/unpin, grouping expand/collapse, paging and server-driven data, keyboard navigation and accessibility.
- Add interactive demos in `pages/` showing: controlled selection, server-side data, inline editing, column reordering, grouping + aggregation, and per-column filters.

---

## Suggested API additions (concrete proposals)

- DataGridProps additions:

```ts
interface DataGridProps<TRow> {
  data: TRow[];
  def: GridDefinition<TRow>;
  loading?: boolean;

  // Events / controlled props
  selectedRowKeys?: Key[];
  onSelectionChange?: (event: SelectionChangeEvent) => void; // already exists
  selectionMode?: 'single' | 'multiple' | 'none';

  onSortChange?: (sort?: { key: Key; dir: 'ASC' | 'DESC' } | undefined) => void;
  sort?: { key: Key; dir: 'ASC' | 'DESC' } | { key: Key; dir: 'ASC' | 'DESC' }[]; // allow multi-sort

  onFilterChange?: (filters: Record<Key, any>) => void;
  filters?: Record<Key, any>;

  pagination?: { pageSize?: number; page?: number } | { server: true; pageSize: number; page: number };
  onPageChange?: (page: number) => void;

  onColumnResize?: (columnKey: Key, width: number) => void;
  onColumnVisibilityChange?: (columnKey: Key, visible: boolean) => void;
  onColumnPinChange?: (columnKey: Key, pin?: 'LEFT' | 'RIGHT') => void;
  onColumnOrderChange?: (order: Key[]) => void;

  components?: Partial<{
    HeaderCell: React.ComponentType<any>;
    Row: React.ComponentType<any>;
    Cell: React.ComponentType<any>;
    NoData: React.ComponentType<any>;
    Loading: React.ComponentType<any>;
  }>;
}
```

- ColumnType additions:

```ts
interface ColumnType<TRow> {
  key: Key;
  header?: string;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  sortable?: boolean;
  filterable?: boolean | { type: 'text' | 'select' | 'number' | 'date' };
  editable?: boolean | { Editor: React.ComponentType<any> };
  resizable?: boolean;
  reorderable?: boolean;
  Cell?: React.ComponentType<{ cell: CellModel<TRow>; rowIndex: number }>;
}
```

---

## Tests and examples to add

- Unit tests for selection (single and multi), select-all edge cases (empty data, partial selections), and `onSelectionChange` payload.
- Tests for `onColumnResize` and width updates (simulate mouse events)
- Tests for pin/unpin and column visibility toggles (state change and layout update assertions)
- Integration tests for grouping expand/collapse and grouping aggregates
- Visual/manual test pages in `pages/`:
  - Controlled selection demo
  - Server-side pagination + sorting demo
  - Column reordering + persistence demo
  - Inline editing + validation demo

---

## Implementation notes & pointers

- The model-driven design (GridModel / ColumnModel / RowModel / CellModel) is a good foundation—add controlled props and events at the GridModel boundary and wire them via `useGrid`.
- Virtualization: the current approach uses a calculated startIndex and CSS `transform` translate. For production-ready virtualization support, consider integrating `react-window` for stable performance on large datasets.
- Accessibility: enrich roles (rowgroup/row/columnheader/cell) with ARIA attributes and expose keyboard hooks on header/cell to handle actions (sorting, selecting, editing).
- Persistence: column widths and order can be persisted to external state via `onColumnResize` and `onColumnOrderChange` events to enable controlled columns and user preferences.

---

## Proposed roadmap (phases)

1. Stabilize core APIs & events (controlled selection, sort/filter events, column events).
2. Implement server mode (pagination, server sorting, filtering) + example demo.
3. Add filtering UI, multi-sort, and column reordering.
4. Add inline editing and validation.
5. Improve virtualization (react-window), accessibility, and comprehensive tests.
6. Add export & nice-to-have features (column grouping aggregates, export CSV/Excel).

---

If you'd like, I can:

- Draft the exact TypeScript changes (interfaces and models) and open a PR with incremental changes; or
- Implement a single high-impact feature first (e.g., controlled selection + events + tests).

Tell me which you'd prefer and I will proceed. ✅
