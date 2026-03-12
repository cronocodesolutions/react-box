# DataGrid

A feature-rich, model-driven data grid component with sorting, filtering, grouping, pinning, resizing, row selection, row detail expansion, pagination, virtualization, and full style customization via the component system.

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
| `component` | `string` | Component style tree name (default: `'datagrid'`). See [Custom Component Trees](#custom-component-trees) |
| `loading` | `boolean` | Loading state |
| `onSelectionChange` | `(event) => void` | Row selection change callback |
| `globalFilterValue` | `string` | Controlled global filter value |
| `onGlobalFilterChange` | `(value: string) => void` | Global filter change callback |
| `columnFilters` | `ColumnFilters<TRow>` | Controlled column filters |
| `onColumnFiltersChange` | `(filters) => void` | Column filters change callback |
| `filters` | `((row: TRow) => boolean)[]` | External predicate filters |
| `expandedRowKeys` | `Key[]` | Controlled expanded detail row keys |
| `onExpandedRowKeysChange` | `(keys: Key[]) => void` | Expanded rows change callback |
| `page` | `number` | Controlled current page (1-indexed, for pagination) |
| `onPageChange` | `(page: number, pageSize: number) => void` | Page change callback |
| `onSortChange` | `(columnKey, direction) => void` | Sort change callback (for server-side sorting) |
| `onServerStateChange` | `(state: ServerState<TRow>) => void` | Fires on any server-relevant state change (page, sort, filter). Provides full state snapshot for API calls. |

### GridDefinition\<TRow\>

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `ColumnType<TRow>[]` | required | Column definitions |
| `rowKey` | `keyof TRow \| (row) => Key` | auto UUID | Unique row identifier |
| `rowHeight` | `number` | `48` | Row height in pixels |
| `visibleRowsCount` | `number \| 'all'` | `10` | Visible rows before scrolling. `'all'` disables virtualization and shows all rows |
| `showRowNumber` | `boolean \| { pinned?, width? }` | `false` | Show row number column |
| `rowSelection` | `boolean \| { pinned? }` | `false` | Enable row selection checkboxes |
| `rowDetail` | `RowDetailConfig<TRow>` | — | Enable expandable row detail panel |
| `pagination` | `PaginationConfig` | — | Server-side pagination config |
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

### PaginationConfig

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `totalCount` | `number` | required | Total number of items across all pages (from server) |
| `pageSize` | `number` | `visibleRowsCount` or `10` | Number of rows per page |

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

**Server-side sorting** — use `onSortChange` to receive sort events and fetch sorted data from your API:

```tsx
<DataGrid
  data={data}
  def={def}
  onSortChange={(columnKey, direction) => {
    // direction: 'ASC' | 'DESC' | undefined (cleared)
    fetchData({ sortBy: columnKey, sortDir: direction });
  }}
/>
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

### Pagination (Server-Side)

Server-side pagination with first/prev/next/last navigation. The grid expects the server to handle page slicing — `data` should contain only the current page's rows.

```tsx
const [page, setPage] = useState(1);
const pageSize = 20;
const { data, totalCount } = useQuery(['users', page], () =>
  fetchUsers({ page, pageSize })
);

<DataGrid
  data={data}
  def={{
    columns: [...],
    bottomBar: true,
    pagination: {
      totalCount,        // Total items across all pages
      pageSize,          // Optional: defaults to visibleRowsCount or 10
    },
  }}
  page={page}
  onPageChange={(newPage, size) => setPage(newPage)}
/>
```

When pagination is enabled:
- Client-side filtering is bypassed (data comes pre-filtered from the server)
- The bottom bar shows `Rows: 1–20 of 500` format with page navigation controls
- Use `onServerStateChange` to get a full state snapshot on any change (page, sort, filter)

**`onServerStateChange`** — fires whenever page, sort, or filters change, providing all state needed for an API call:

```tsx
<DataGrid
  data={data}
  loading={loading}
  page={page}
  onServerStateChange={(state) => {
    // state = { page, pageSize, sortColumn, sortDirection, columnFilters, globalFilterValue }
    fetchData(state);
  }}
  def={{
    columns: [...],
    bottomBar: true,
    pagination: { totalCount },
    globalFilter: true,
  }}
/>
```

**Uncontrolled mode** (internal page state):

```tsx
<DataGrid
  data={data}
  def={{
    columns: [...],
    bottomBar: true,
    pagination: { totalCount: 500 },
  }}
  onPageChange={(page, pageSize) => refetch({ page, pageSize })}
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

**Bottom bar** shows: row count (filtered / total), selected count, "clear filters" link. With pagination: page range, navigation controls.

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

Set `visibleRowsCount: 'all'` to disable virtualization and render all rows without a vertical scrollbar.

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

## Style Customization

Every part of the DataGrid is customizable via `Box.components()`. Each subcomponent has a `component` name that maps to the component tree.

### Component Tree

```
datagrid                          — Root container
├── content                       — Scrollable content area
├── topBar                        — Top bar with title, filters, controls
│   ├── globalFilter              — Global search wrapper
│   │   └── stats                 — Filter stats badge
│   └── columnGroups              — Active grouping chips
│       ├── icon                  — Grouping icon
│       └── item                  — Individual group chip
│           └── icon              — Remove group button
├── header                        — Sticky header row
│   └── cell                      — Header cell
│       ├── contextMenu           — Column context menu button
│       │   ├── icon              — Menu button icon
│       │   └── tooltip           — Menu dropdown
│       │       └── item          — Menu item
│       │           ├── icon      — Menu item icon
│       │           └── separator — Menu item separator
│       └── resizer               — Column resize handle
├── filter                        — Column filter row
│   ├── row                       — Filter row container
│   └── cell                      — Filter cell
├── body                          — Body area
│   ├── cell                      — Body cell
│   ├── row                       — Data row
│   ├── groupRow                  — Group header row
│   └── detailRow                 — Expanded detail row
├── emptyColumns                  — Empty state (no columns visible)
└── bottomBar                     — Bottom bar with counts and pagination
    └── pagination                — Pagination controls
```

### Customizing Base Styles

Override default styles for any subcomponent using `Box.components()`:

```tsx
Box.components({
  datagrid: {
    // Override root styles
    styles: {
      borderRadius: 0,
      shadow: 'none',
    },
    children: {
      // Override header cell styles
      header: {
        children: {
          cell: {
            styles: {
              fontSize: 11,
              textTransform: 'uppercase',
              fontWeight: 700,
              color: 'gray-500',
            },
          },
        },
      },
      // Override body cell styles
      body: {
        children: {
          cell: {
            styles: { fontSize: 13 },
          },
          detailRow: {
            styles: {
              bgColor: 'blue-50',
              theme: { dark: { bgColor: 'blue-900' } },
            },
          },
        },
      },
      // Override bottom bar
      bottomBar: {
        styles: { fontSize: 12 },
      },
    },
  },
});
```

### Custom Component Trees

The DataGrid uses `component="datagrid"` by default and all children resolve under the `datagrid.*` component tree. You can register custom component trees with different visual styles using `extends` to inherit all internal datagrid styles (pinning, sticky headers, hover groups, filters, etc.) and only override what you need:

**Registering a custom component tree:**

```tsx
Box.components({
  // Customize default datagrid styles
  datagrid: {
    children: {
      body: { children: { detailRow: { styles: { bgColor: 'blue-50' } } } },
    },
  },
  // A lightweight style for embedded/nested grids — extends datagrid to inherit all internal styles
  subgrid: {
    extends: 'datagrid',
    styles: {
      b: 0,
      borderRadius: 0,
      shadow: 'none',
      bgColor: 'transparent',
    },
    children: {
      header: {
        children: {
          cell: {
            styles: {
              fontSize: 12,
              py: 1,
              bgColor: 'transparent',
              color: 'gray-400',
              fontWeight: 500,
            },
          },
        },
      },
      body: {
        children: {
          cell: {
            styles: { fontSize: 13, bgColor: 'transparent' },
          },
        },
      },
    },
  },
  // A compact style — extends datagrid so pinning, sorting, etc. all work
  compactGrid: {
    extends: 'datagrid',
    styles: { borderRadius: 1 },
    children: {
      header: { children: { cell: { styles: { py: 1, fontSize: 11 } } } },
      body: { children: { cell: { styles: { py: 0 } } } },
    },
  },
});
```

> **Why `extends`?** Without it, a custom component tree would not inherit any of the internal datagrid styles — pinned columns, sticky headers, hover groups, filter cells, context menus, and resizers would all break. With `extends: 'datagrid'`, the full internal style tree is used as the base, and your overrides are deep-merged on top.

**Using a custom component tree:**

```tsx
<DataGrid component="subgrid" data={data} def={def} />
<DataGrid component="compactGrid" data={data} def={def} />
<DataGrid data={data} def={def} />  {/* default "datagrid" styles */}
```

All children automatically resolve under the specified component tree (e.g., `subgrid.header.cell`, `subgrid.body.cell`, etc.).

**Nested DataGrids** — ideal for master-detail patterns:

```tsx
<DataGrid
  data={orders}
  def={{
    rowDetail: {
      content: (order) => (
        <DataGrid component="subgrid" data={order.items} def={itemDef} />
      ),
    },
    columns: [...],
  }}
/>
```

The outer DataGrid uses `datagrid.*` styles; the inner one uses `subgrid.*` styles. Each DataGrid independently resolves its component tree — no context propagation needed.

---

## Architecture

The grid is model-driven with observable state:

- **GridModel** — orchestrator: manages columns, rows, filters, sorting, grouping, selection, pagination, sizing
- **ColumnModel** — column definition, pinning, width, visibility, sorting, filtering
- **RowModel** — wraps row data, selection state, cell generation
- **GroupRowModel** — grouped rows with expand/collapse, child rows, aggregation
- **DetailRowModel** — detail panel row for expanded master-detail views
- **CellModel** — row + column intersection, value computation

State changes trigger memo invalidation and React re-render via `useGrid` hook.

---

## Full-Featured Example

```tsx
import DataGrid from '@cronocode/react-box/components/dataGrid';

<DataGrid
  data={users}
  def={{
    rowKey: 'id',
    title: 'Users',
    topBar: true,
    bottomBar: true,
    globalFilter: true,
    rowSelection: { pinned: true },
    showRowNumber: { pinned: true },
    rowHeight: 40,
    visibleRowsCount: 15,
    columns: [
      {
        key: 'personal',
        header: 'Personal',
        columns: [
          { key: 'name', header: 'Name', filterable: true },
          { key: 'age', header: 'Age', width: 80, align: 'right', filterable: { type: 'number' } },
        ],
      },
      { key: 'email', header: 'Email', width: 250, filterable: true },
      { key: 'status', header: 'Status', filterable: { type: 'multiselect' } },
      { key: 'country', header: 'Country', pin: 'RIGHT' },
    ],
    rowDetail: {
      content: (user) => <UserDetails user={user} />,
      height: 'auto',
      expandOnRowClick: true,
    },
  }}
  onSelectionChange={(e) => setSelected(e.selectedRowKeys)}
/>
```

## Server-Side Paginated Example

```tsx
const [page, setPage] = useState(1);
const { data, totalCount } = useServerData(page);

<DataGrid
  data={data}
  page={page}
  onServerStateChange={(state) => {
    // state: { page, pageSize, sortColumn, sortDirection, columnFilters, globalFilterValue }
    setPage(state.page);
    refetch(state);
  }}
  def={{
    rowKey: 'id',
    topBar: true,
    bottomBar: true,
    columns: [
      { key: 'name', header: 'Name' },
      { key: 'email', header: 'Email' },
    ],
    pagination: { totalCount, pageSize: 25 },
  }}
/>
```
