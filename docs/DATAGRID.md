# DataGrid

A feature-rich, model-driven data grid component with sorting, filtering, grouping, pinning, resizing, row selection, row detail expansion, virtualization, and more.

**Location:** `src/components/dataGrid/` (entry: `dataGrid.tsx`, model: `models/gridModel.ts`)

---

## Quick Start

```tsx
import DataGrid from '@cronocode/react-box/components/dataGrid';

const data = [
  { id: 1, name: 'Alice', age: 30 },
  { id: 2, name: 'Bob', age: 25 },
];

<DataGrid
  data={data}
  def={{
    rowKey: 'id',
    columns: [
      { key: 'name', header: 'Name' },
      { key: 'age', header: 'Age', align: 'right' },
    ],
  }}
/>
```

---

## API Reference

### DataGridProps\<TRow\>

| Prop | Type | Description |
|------|------|-------------|
| `data` | `TRow[]` | Row data array |
| `def` | `GridDefinition<TRow>` | Grid configuration |
| `loading` | `boolean` | Loading state |
| `onSelectionChange` | `(event) => void` | Row selection change callback |
| `globalFilterValue` | `string` | Controlled global filter value |
| `onGlobalFilterChange` | `(value: string) => void` | Global filter change callback |
| `columnFilters` | `ColumnFilters<TRow>` | Controlled column filters |
| `onColumnFiltersChange` | `(filters) => void` | Column filters change callback |
| `filters` | `((row: TRow) => boolean)[]` | External predicate filters |
| `expandedRowKeys` | `Key[]` | Controlled expanded detail row keys |
| `onExpandedRowKeysChange` | `(keys: Key[]) => void` | Expanded rows change callback |

### GridDefinition\<TRow\>

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `ColumnType<TRow>[]` | required | Column definitions |
| `rowKey` | `keyof TRow \| (row) => Key` | auto UUID | Unique row identifier |
| `rowHeight` | `number` | `48` | Row height in pixels |
| `visibleRowsCount` | `number` | `10` | Visible rows before scrolling |
| `showRowNumber` | `boolean \| { pinned?, width? }` | `false` | Show row number column |
| `rowSelection` | `boolean \| { pinned? }` | `false` | Enable row selection checkboxes |
| `rowDetail` | `RowDetailConfig<TRow>` | — | Enable expandable row detail panel |
| `topBar` | `boolean` | `false` | Show top bar |
| `bottomBar` | `boolean` | `false` | Show bottom bar |
| `title` | `React.ReactNode` | — | Title in the top bar |
| `topBarContent` | `React.ReactNode` | — | Custom content in the top bar |
| `globalFilter` | `boolean` | `false` | Enable global fuzzy search |
| `globalFilterKeys` | `(keyof TRow)[]` | all columns | Columns to search in global filter |
| `sortable` | `boolean` | `true` | Enable sorting for all columns |
| `resizable` | `boolean` | `true` | Enable resizing for all columns |
| `noDataComponent` | `React.ReactNode` | `'empty'` | Custom empty state |

### ColumnType\<TRow\>

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `key` | `Key` | required | Column identifier (maps to `TRow` property) |
| `header` | `string` | — | Column header text |
| `width` | `number` | `200` | Base column width in pixels |
| `align` | `'left' \| 'right' \| 'center'` | `'left'` | Cell text alignment |
| `pin` | `'LEFT' \| 'RIGHT'` | — | Pin column to edge |
| `columns` | `ColumnType<TRow>[]` | — | Nested columns (grouped header) |
| `Cell` | `React.ComponentType<{ cell }>` | — | Custom cell renderer |
| `sortable` | `boolean` | inherits | Override grid-level sortable |
| `resizable` | `boolean` | inherits | Override grid-level resizable |
| `flexible` | `boolean` | `true` | Participate in flex width distribution |
| `filterable` | `boolean \| ColumnFilterConfig` | — | Enable column filter |

### RowDetailConfig\<TRow\>

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | `(row: TRow) => React.ReactNode` | required | Render function for detail panel |
| `height` | `'auto' \| number \| ((row: TRow) => number)` | `'auto'` | Detail panel height. `'auto'` sizes to content |
| `expandOnRowClick` | `boolean` | `false` | Toggle detail on row click |
| `pinned` | `boolean` | `false` | Pin expand column to LEFT |
| `expandColumnWidth` | `number` | `50` | Width of the expand column |

---

## Features

### Sorting

Click a column header to sort ASC → DESC → clear. Use the header context menu for explicit sort control.

```tsx
// Sorting enabled by default. Disable globally:
def={{ sortable: false, columns: [...] }}

// Disable for specific columns:
columns: [
  { key: 'id', header: 'ID', sortable: false },  // Fixed
  { key: 'name', header: 'Name' },                 // Sortable (default)
]

// Override global setting per column:
def={{
  sortable: false,
  columns: [
    { key: 'name', header: 'Name' },                // Not sortable (inherits)
    { key: 'age', header: 'Age', sortable: true },  // Sortable (override)
  ],
}}
```

### Column Filters

Three built-in filter types: text (fuzzy search), number (comparison operators), and multiselect (checkbox dropdown).

```tsx
columns: [
  // Text filter (fuzzy search)
  { key: 'name', header: 'Name', filterable: true },

  // Number filter with operators (=, ≠, >, ≥, <, ≤, between)
  { key: 'age', header: 'Age', filterable: { type: 'number', min: 0, max: 120 } },

  // Multiselect filter (auto-computes unique values from data)
  { key: 'status', header: 'Status', filterable: { type: 'multiselect' } },

  // Multiselect with custom options
  {
    key: 'role',
    header: 'Role',
    filterable: {
      type: 'multiselect',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
      ],
    },
  },
]
```

**Controlled column filters:**

```tsx
const [filters, setFilters] = useState({});

<DataGrid
  data={data}
  def={def}
  columnFilters={filters}
  onColumnFiltersChange={setFilters}
/>
```

### Global Filter

Fuzzy search across all (or specified) columns. Requires `topBar: true` and `globalFilter: true`.

```tsx
<DataGrid
  data={data}
  def={{
    topBar: true,
    globalFilter: true,
    globalFilterKeys: ['name', 'email'],  // optional: limit search columns
    columns: [...],
  }}
/>
```

**Controlled global filter:**

```tsx
const [search, setSearch] = useState('');

<DataGrid
  data={data}
  def={def}
  globalFilterValue={search}
  onGlobalFilterChange={setSearch}
/>
```

### External Filters

Apply custom predicate functions before global/column filters. Useful for building custom filter UIs outside the grid.

```tsx
const [gender, setGender] = useState<string | null>(null);

const filters = useMemo(() => {
  const result: ((row: Person) => boolean)[] = [];
  if (gender) result.push((row) => row.gender === gender);
  return result;
}, [gender]);

<DataGrid data={data} def={def} filters={filters} />
```

External filters are applied first (before global and column filters). They don't appear in the "active filters" count or "clear filters" UI — you manage them externally.

### Grouping

Group rows by a column via the header context menu. Supports multi-level nested grouping with expand/collapse.

- Grouped columns are auto-hidden from the column list
- Group rows show the group value and row count
- Expand/collapse groups by clicking the arrow
- Select-all within a group selects all child rows

### Column Pinning

Pin columns to LEFT or RIGHT edges. Pinned columns stay visible during horizontal scroll.

```tsx
columns: [
  { key: 'name', header: 'Name', pin: 'LEFT' },
  { key: 'email', header: 'Email' },
  { key: 'actions', header: '', pin: 'RIGHT', width: 80 },
]
```

Pin/unpin via the header context menu at runtime.

### Column Resizing

Drag the column border to resize. Minimum width: 48px. Resized columns become "fixed" and stop participating in flex distribution.

```tsx
// Disable globally:
def={{ resizable: false, columns: [...] }}

// Disable per column:
{ key: 'id', header: 'ID', resizable: false }
```

### Flexible Column Sizing

By default, columns stretch proportionally to fill available horizontal space based on their base `width`. Resized columns and columns with `flexible: false` don't stretch.

```tsx
columns: [
  { key: 'id', header: 'ID', width: 80, flexible: false },  // Fixed 80px
  { key: 'name', header: 'Name', width: 200 },               // Stretches (ratio 200)
  { key: 'email', header: 'Email', width: 300 },              // Stretches more (ratio 300)
]
// Grid 1000px: ID=80px, Name=368px, Email=552px
```

### Column Visibility

Toggle column visibility via the top bar context menu (checkbox list). Requires `topBar: true`.

### Row Selection

Checkbox column for selecting rows. Supports select-all with indeterminate state for partial selections.

```tsx
<DataGrid
  data={data}
  def={{
    rowSelection: true,              // or { pinned: true } to pin LEFT
    columns: [...],
  }}
  onSelectionChange={(event) => {
    // event.action: 'select' | 'deselect'
    // event.selectedRowKeys: Key[]
    // event.affectedRowKeys: Key[]
    // event.isAllSelected: boolean
  }}
/>
```

### Row Numbering

Auto-generated row number column.

```tsx
def={{
  showRowNumber: true,
  // or with options:
  showRowNumber: { pinned: true, width: 50 },
  columns: [...],
}}
```

### Row Detail (Expandable Rows)

Show a detail panel below each row when expanded. Ideal for master-detail patterns like orders → order items, bookings → details.

```tsx
<DataGrid
  data={orders}
  def={{
    rowKey: 'orderId',
    columns: [
      { key: 'orderId', header: 'Order #' },
      { key: 'customer', header: 'Customer' },
      { key: 'total', header: 'Total', align: 'right' },
    ],
    rowDetail: {
      content: (order) => (
        <DataGrid
          data={order.items}
          def={{
            columns: [
              { key: 'product', header: 'Product' },
              { key: 'qty', header: 'Qty', align: 'right' },
              { key: 'price', header: 'Price', align: 'right' },
            ],
          }}
        />
      ),
      height: 250,
    },
  }}
/>
```

**Options:**
- `content(row)` — render function for the detail panel
- `height` — `'auto'` (default, sizes to content), static number, or `(row) => number`
- `expandOnRowClick` — toggle detail by clicking the row (default: false)
- `pinned` — pin the expand column to LEFT (default: false)

**Controlled mode:**

```tsx
const [expanded, setExpanded] = useState<Key[]>([]);

<DataGrid
  data={orders}
  def={def}
  expandedRowKeys={expanded}
  onExpandedRowKeysChange={setExpanded}
/>
```

### Top Bar & Bottom Bar

```tsx
def={{
  topBar: true,
  bottomBar: true,
  title: 'Users',
  topBarContent: <MyCustomFilters />,
  globalFilter: true,
  columns: [...],
}}
```

**Top bar** shows: title, custom content, global filter input, column visibility menu, active grouping chips.

**Bottom bar** shows: row count (filtered / total), selected count, "clear filters" link.

### Custom Cell Renderers

```tsx
columns: [
  {
    key: 'status',
    header: 'Status',
    Cell: ({ cell }) => (
      <Badge color={cell.value === 'active' ? 'green' : 'red'}>
        {cell.value}
      </Badge>
    ),
  },
]
```

The `cell` prop provides: `cell.value`, `cell.row` (RowModel), `cell.column` (ColumnModel), `cell.grid` (GridModel).

### Empty State

```tsx
def={{
  noDataComponent: <MyEmptyState />,
  columns: [...],
}}
```

When `loading` is true and data is empty, shows "loading..." by default.

### Virtualization

Renders only visible rows plus a preload buffer (20 rows above/below). Configure visible area:

```tsx
def={{
  visibleRowsCount: 15,  // default: 10
  rowHeight: 40,          // default: 48px
  columns: [...],
}}
```

### Grouped Column Headers

Nest columns to create multi-level headers:

```tsx
columns: [
  { key: 'name', header: 'Name' },
  {
    key: 'contact',
    header: 'Contact Info',
    columns: [
      { key: 'email', header: 'Email' },
      { key: 'phone', header: 'Phone' },
    ],
  },
]
```

---

## Architecture

The grid is model-driven with observable state:

- **GridModel** — orchestrator: manages columns, rows, filters, sorting, grouping, selection, sizing
- **ColumnModel** — column definition, pinning, width, visibility, sorting, filtering
- **RowModel** — wraps row data, selection state, cell generation
- **GroupRowModel** — grouped rows with expand/collapse, child rows, aggregation
- **DetailRowModel** — detail panel row for expanded master-detail views
- **CellModel** — row + column intersection, value computation

State changes trigger memo invalidation and React re-render via `useGrid` hook.

---

## Current Limitations

- No pagination (type defined but not implemented)
- No server-side modes (server paging, sorting, filtering)
- No multi-column sorting (single sort column only)
- No column reordering (drag-and-drop)
- No controlled selection props (`selectedRowKeys` input)
- No column event callbacks (`onColumnResize`, `onColumnPinChange`, etc.)
- No cell editing or validation
- No column footers or group aggregation functions
- No CSV/Excel export or clipboard
- Limited keyboard navigation and ARIA attributes
- Basic virtualization (uniform row height, no react-window integration)

---

## Roadmap

1. **Core events** — controlled selection, sort/filter/column change callbacks
2. **Server mode** — server paging, sorting, filtering with hooks/examples
3. **Multi-sort & column reorder** — multi-column sort, drag-and-drop columns
4. **Inline editing** — cell editors, edit lifecycle events, validation
5. **Accessibility** — keyboard navigation, ARIA attributes, screen reader support
6. **Advanced virtualization** — react-window/react-virtual integration, variable row heights
7. **Aggregation** — group footers, column aggregation functions (sum/count/avg)
8. **Export** — CSV/Excel export, clipboard copy
