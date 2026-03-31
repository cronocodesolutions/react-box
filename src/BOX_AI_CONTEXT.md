# @cronocode/react-box - AI Assistant Context

Runtime CSS-in-JS library. `Box` component accepts ~144 CSS props and generates CSS classes at runtime. Same prop values share a single class.

---

## CRITICAL RULES

### Rule #1: NEVER Use Inline Styles

Always use Box props. If a prop doesn't exist, create it with `Box.extend()` (see Extension System).

| Inline Style (WRONG) | Box Prop (CORRECT) |
|---|---|
| `style={{ width: "100%" }}` | `width="fit"` |
| `style={{ width: "100vw" }}` | `width="fit-screen"` |
| `style={{ height: "100%" }}` | `height="fit"` |
| `style={{ height: "100vh" }}` | `height="fit-screen"` |
| `style={{ minHeight: "100vh" }}` | `minHeight="fit-screen"` |
| `style={{ maxWidth: "1200px" }}` | `maxWidth={300}` (300/4=75rem=1200px) |
| `style={{ alignItems: "center" }}` | `ai="center"` |
| `style={{ justifyContent: "space-between" }}` | `jc="between"` |
| `style={{ flexDirection: "column" }}` | `d="column"` |
| `style={{ pointerEvents: "none" }}` | `pointerEvents="none"` |
| `style={{ cursor: "pointer" }}` | `cursor="pointer"` |
| `style={{ overflow: "hidden" }}` | `overflow="hidden"` |
| `style={{ position: "relative" }}` | `position="relative"` |
| `style={{ zIndex: 10 }}` | `zIndex={10}` |
| `style={{ opacity: 0.5 }}` | `opacity={0.5}` |
| `sm={{ style: { maxWidth: 600 } }}` | `sm={{ maxWidth: 150 }}` (150/4=37.5rem=600px) |

**`style` is top-level only** — it is NOT supported inside breakpoints, pseudo-classes, or theme objects. Always use Box props for responsive/conditional styles.

### Rule #2: ALWAYS Use Component Shortcuts

NEVER use `<Box tag="...">` when a component exists. NEVER use `<Box display="flex/grid">`.

| Instead of... | Use... | Import from |
|---|---|---|
| `<Box display="flex">` | `<Flex>` | `components/flex` |
| `<Box display="grid">` | `<Grid>` | `components/grid` |
| `<Box tag="button">` | `<Button>` | `components/button` |
| `<Box tag="input">` | `<Textbox>` | `components/textbox` |
| `<Box tag="textarea">` | `<Textarea>` | `components/textarea` |
| `<Box tag="a/img/label">` | `<Link>/<Img>/<Label>` | `components/semantics` |
| `<Box tag="h1/h2/h3/h4/h5/h6">` | `<H1>/<H2>/.../<H6>` | `components/semantics` |
| `<Box tag="p/span">` | `<P>/<Span>` | `components/semantics` |
| `<Box tag="nav/header/footer/main">` | `<Nav>/<Header>/<Footer>/<Main>` | `components/semantics` |
| `<Box tag="section/article/aside">` | `<Section>/<Article>/<Aside>` | `components/semantics` |

All imports from `@cronocode/react-box/components/...`. Semantics also export: `Mark`, `Figure`, `Figcaption`, `Details`, `Summary`, `Menu`, `Time`.

---

## Numeric Value Formatters

**#1 source of confusion.** Different props have different dividers:

| Prop Category | Divider | Example | CSS Output |
|---|---|---|---|
| Spacing (`p`, `m`, `gap`, `px`, `py`, `mx`, `my`, etc.) | 4 | `p={4}` | `padding: 1rem` (16px) |
| Font size (`fontSize`) | **16** | `fontSize={14}` | `font-size: 0.875rem` (14px) |
| Width/Height (numeric) | 4 | `width={20}` | `width: 5rem` (80px) |
| Border width (`b`, `bx`, `by`, `bt`, `br`, `bb`, `bl`) | none | `b={1}` | `border-width: 1px` |
| Border radius (`borderRadius`) | none | `borderRadius={8}` | `border-radius: 8px` |
| Line height (`lineHeight`) | none | `lineHeight={24}` | `line-height: 24px` |

```tsx
// fontSize: divider 16 → value maps directly to px
fontSize={12} // 12px    fontSize={14} // 14px    fontSize={16} // 16px
fontSize={18} // 18px    fontSize={24} // 24px    fontSize={32} // 32px

// Spacing: divider 4 → value/4 = rem
p={1} // 4px    p={2} // 8px    p={3} // 12px    p={4} // 16px    p={6} // 24px    p={8} // 32px

// Width/Height/min/max: divider 4 → value/4 = rem (NOT direct pixels)
width={20} // 5rem = 80px      height={10} // 2.5rem = 40px     height={20} // 5rem = 80px
maxWidth={300} // 75rem = 1200px    minHeight={50} // 12.5rem = 200px
height="fit" // 100%    height="fit-screen" // 100vh    width="1/2" // 50%
```

---

## Prop Reference

### Spacing

| Prop | CSS Property |
|---|---|
| `p` / `px` / `py` / `pt` / `pr` / `pb` / `pl` | padding (all / horizontal / vertical / individual) |
| `m` / `mx` / `my` / `mt` / `mr` / `mb` / `ml` | margin (all / horizontal / vertical / individual) |
| `gap` | gap (flexbox/grid) |

### Layout

| Prop | CSS Property | Values |
|---|---|---|
| `display` | display | `'flex'`, `'block'`, `'inline'`, `'grid'`, `'none'`, `'inline-flex'`, etc. |
| `d` | flex-direction | `'row'`, `'column'`, `'row-reverse'`, `'column-reverse'` |
| `wrap` | flex-wrap | `'wrap'`, `'nowrap'`, `'wrap-reverse'` |
| `ai` | align-items | `'center'`, `'start'`, `'end'`, `'stretch'`, `'baseline'` |
| `jc` | justify-content | `'center'`, `'start'`, `'end'`, `'between'`, `'around'`, `'evenly'` |
| `flex` / `grow` / `shrink` | flex / flex-grow / flex-shrink | number or string |

### Sizing

| Prop | CSS Property | Accepts |
|---|---|---|
| `width` / `height` | width / height | number (rem/4), `'auto'`, `'fit'` (100%), `'fit-screen'` (100vw/vh), fractions (`'1/2'`, `'1/3'`, `'2/3'`, `'1/4'`, `'3/4'`), percentages (`'33%'`) |
| `minWidth` / `maxWidth` / `minHeight` / `maxHeight` | min/max sizing | number or string |

All sizing, spacing, and positioning props also accept percentage strings: `p="5%"`, `top="10%"`, `gap="2%"`.

### Visual

| Prop | CSS Property | Notes |
|---|---|---|
| `bgColor` / `color` / `borderColor` | background-color / color / border-color | Tailwind palette: `'gray-50'`..`'gray-900'`, same for red/orange/yellow/green/teal/blue/indigo/purple/pink/violet. Also `'white'`, `'black'`, `'transparent'`, `'currentColor'` |
| `b` / `bx` / `by` / `bt` / `br` / `bb` / `bl` | border-width | direct px |
| `borderRadius` | border-radius | direct px |
| `borderStyle` | border-style | `'solid'`, `'dashed'`, `'dotted'`, `'none'` |
| `fontSize` | font-size | divider 16 |
| `fontWeight` | font-weight | `400`, `500`, `600`, `700`, etc. |
| `lineHeight` | line-height | direct px |
| `textAlign` / `textDecoration` / `textTransform` / `whiteSpace` / `textOverflow` | text properties | string values |
| `overflow` | overflow | `'hidden'`, `'auto'`, `'scroll'`, `'visible'` |
| `position` | position | `'relative'`, `'absolute'`, `'fixed'`, `'sticky'` |
| `top` / `right` / `bottom` / `left` / `inset` | positioning offsets | number or string |
| `zIndex` | z-index | number |
| `shadow` | box-shadow | `'small'`, `'medium'`, `'large'`, `'xl'`, `'none'` |
| `opacity` | opacity | number |
| `cursor` / `pointerEvents` / `transition` / `transform` / `userSelect` | misc | string values |

---

## Pseudo-Classes, Breakpoints & Themes

```tsx
// Pseudo-classes: hover, focus, active, disabled, checked, indeterminate, required, selected,
//   focusWithin, focusVisible, first, last, even, odd, empty
<Box bgColor="blue-500" hover={{ bgColor: 'blue-600' }} disabled={{ opacity: 0.5 }} />

// Responsive breakpoints (mobile-first): sm(640) md(768) lg(1024) xl(1280) xxl(1536)
<Box p={2} md={{ p: 4 }} lg={{ p: 6 }} />

// Combine: breakpoints can nest pseudo-classes
<Box bgColor="white" hover={{ bgColor: 'gray-100' }} md={{ bgColor: 'gray-50', hover: { bgColor: 'gray-200' } }} />
```

### Theme System

```tsx
import Box from '@cronocode/react-box';

// Setup: wrap app in Box.Theme (auto-detects via prefers-color-scheme)
<Box.Theme>                                      {/* auto light/dark detection */}
<Box.Theme theme="dark">                         {/* explicit theme, ignores system pref */}
<Box.Theme theme="dark" use="global">            {/* applies class + data-theme to <html> */}
<Box.Theme storageKey="app-theme">               {/* persists user choice to localStorage */}

// Hook: read + set theme programmatically (must be within Box.Theme)
const [theme, setTheme] = Box.useTheme();
setTheme('dark');   // set explicit theme (persists to localStorage if storageKey provided)
setTheme(null);     // reset to system auto-detection (clears localStorage)

// Supports any custom theme name — not limited to 'light'/'dark'
<Box.Theme theme="high-contrast">

// Theme-aware styles — nests with pseudo-classes and breakpoints
<Box
  bgColor="white" color="gray-900"
  hover={{ bgColor: 'gray-100' }}
  theme={{ dark: { bgColor: 'gray-900', color: 'gray-100', hover: { bgColor: 'gray-700' } } }}
/>
```

**Props**: `theme?` (string — explicit theme name), `use?` (`'global'`|`'local'`, default `'local'`), `storageKey?` (string — localStorage key for persistence).
**DOM**: Sets `data-theme` attribute and theme class on wrapper (local) or `document.documentElement` (global). Cleaned up on unmount.

---

## Component System

```tsx
// Component + variant props apply registered styles from Box.components()
<Box component="card" variant="bordered">
  <Box component="card.header">Title</Box>
  <Box component="card.body">Content</Box>
</Box>
```

### Box.components() — Define Custom Component Styles

```tsx
Box.components({
  card: {
    styles: { display: 'flex', d: 'column', p: 4, bgColor: 'white', borderRadius: 8, shadow: 'medium' },
    variants: {
      bordered: { b: 1, borderColor: 'gray-200', shadow: 'none' },
      elevated: { shadow: 'large' },
    },
    children: {
      header: { styles: { fontSize: 18, fontWeight: 600, mb: 3 } },
      body: { styles: { flex: 1 } },
    },
  },
});
```

### Component Inheritance with `extends`

```tsx
Box.components({
  subgrid: {
    extends: 'datagrid', // inherits all styles, variants, and children; deep-merges overrides
    styles: { b: 0, borderRadius: 0, shadow: 'none' },
    children: { header: { children: { cell: { styles: { fontSize: 12 } } } } },
  },
});
```

---

## Extension System

### Box.extend() — Add New Props, Colors, Variables

```tsx
import Box from '@cronocode/react-box';

export const { extendedProps, extendedPropTypes } = Box.extend(
  { 'brand-primary': '#ff6600', 'brand-secondary': '#0066ff' }, // CSS variables
  { // New props
    aspectRatio: [{
      values: ['auto', '1/1', '16/9', '4/3'] as const,
      styleName: 'aspect-ratio',
      valueFormat: (value) => value,
    }],
  },
  { // Extend existing props with new values
    bgColor: [{
      values: ['brand-primary', 'brand-secondary'] as const,
      styleName: 'background-color',
      valueFormat: (value, getVariable) => getVariable(value),
    }],
    color: [{
      values: ['brand-primary', 'brand-secondary'] as const,
      styleName: 'color',
      valueFormat: (value, getVariable) => getVariable(value),
    }],
  },
);
```

### Per-Property Values (Multi-styleName)

When `styleName` is an array, `valueFormat` is called once per CSS property with `styleName` as the third argument. Use for typography presets or any design token spanning multiple CSS properties:

```tsx
Box.extend(
  { 'text-display-lg-size': '36px', 'text-display-lg-weight': '700',
    'text-display-lg-line-height': '1.2', 'text-display-lg-letter-spacing': '-0.02em' },
  { textStyle: [{
      values: ['display-lg', 'display-sm'] as const,
      styleName: ['font-size', 'font-weight', 'line-height', 'letter-spacing'],
      valueFormat: (value, getVariable, styleName) => {
        const suffix = { 'font-size': 'size', 'font-weight': 'weight', 'line-height': 'line-height', 'letter-spacing': 'letter-spacing' };
        return getVariable(`text-${value}-${suffix[styleName!]}`);
      },
  }] },
  {},
);
// <Box textStyle="display-lg" /> → sets all 4 CSS properties
```

### TypeScript Type Augmentation

```typescript
// types.d.ts — Generic approach (recommended)
import { ExtractComponentsAndVariants, ExtractBoxStyles } from '@cronocode/react-box/types';
import { components } from './boxComponents';
import { extendedPropTypes, extendedProps } from './boxExtends';

declare module '@cronocode/react-box/types' {
  namespace Augmented {
    interface BoxProps extends ExtractBoxStyles<typeof extendedProps> {}
    interface BoxPropTypes extends ExtractBoxStyles<typeof extendedPropTypes> {}
    interface ComponentsTypes extends ExtractComponentsAndVariants<typeof components> {}
  }
}

// Manual approach (simple cases):
declare module '@cronocode/react-box/types' {
  namespace Augmented {
    interface BoxPropTypes { bgColor: 'brand-primary' | 'brand-secondary' }
    interface ComponentsTypes { card: 'bordered' | 'elevated' }
  }
}
```

---

## Common Patterns

```tsx
import Flex from '@cronocode/react-box/components/flex';
import Grid from '@cronocode/react-box/components/grid';
import Button from '@cronocode/react-box/components/button';
import Textbox from '@cronocode/react-box/components/textbox';

// Flex layout
<Flex d="column" gap={4} ai="center" jc="between">{children}</Flex>
<Flex inline gap={2}>Inline flex</Flex>

// Responsive stack
<Flex d="column" gap={2} md={{ d: 'row', gap: 4 }}>{children}</Flex>

// Grid
<Grid gridCols={3} gap={4}>{items.map(i => <Box key={i.id}>{i.content}</Box>)}</Grid>

// Card
<Box p={4} bgColor="white" borderRadius={8} shadow="medium">{content}</Box>

// Button with states
<Button px={4} py={2} bgColor="blue-500" color="white" borderRadius={6}
  hover={{ bgColor: 'blue-600' }} disabled={{ opacity: 0.5, cursor: 'not-allowed' }}>Click</Button>

// Input
<Textbox placeholder="Enter..." width="fit" px={3} py={2} b={1} borderColor="gray-300"
  borderRadius={6} focus={{ borderColor: 'blue-500', outline: 'none' }} />

// Truncated text
<Box overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">Long text...</Box>

// Overlay
<Box position="fixed" top={0} left={0} right={0} bottom={0} bgColor="black" opacity={0.5} zIndex={50} />
```

**Portals**: For tooltips/dropdowns that need to escape `overflow: hidden`, use `Tooltip` component (renders via React portal into `#crono-box` container).

### Group Hover (hoverGroup)

```tsx
<Flex className="card-row" gap={2}>
  <Box opacity={0} hoverGroup={{ 'card-row': { opacity: 1 } }}>Actions</Box>
</Flex>
```

### Server-Side Rendering

```tsx
import { getStyles, resetStyles } from '@cronocode/react-box/ssg';
const cssString = getStyles();        // after rendering, get CSS string
<style id="crono-box">{cssString}</style>
resetStyles();                         // reset for next SSR request
```

---

## Key Reminders for AI Assistants

1. **NEVER `style={{ }}`** — use Box props. Missing prop? Use `Box.extend()`
2. **NEVER `<Box tag="...">` for common elements** — use `<Button>`, `<Link>`, `<H1>`, `<P>`, `<Nav>`, etc.
3. **NEVER `<Box display="flex/grid">`** — use `<Flex>` / `<Grid>`
4. **fontSize divider is 16** (not 4). `fontSize={14}` → 14px
5. **Spacing divider is 4**. `p={4}` → 16px (1rem)
6. **Border/borderRadius/lineHeight are direct px**. `b={1}` → 1px
7. **Colors are Tailwind-like**: `'gray-500'`, `'blue-600'`
8. **Breakpoints are mobile-first**: base → sm → md → lg → xl → xxl
9. **Theme styles nest**: `theme={{ dark: { hover: { ... } } }}`
10. **HTML attributes go in `props` prop**: `<Link props={{ href: '/about' }}>` not `<Link href>`
11. **Size shortcuts**: `width="fit"` = 100%, `width="fit-screen"` = 100vw, `width="1/2"` = 50%
12. **Box is memoized** with `React.memo`
13. **`style` is top-level only** — never inside breakpoints (`sm={{ style: ... }}`), pseudo-classes, or theme objects
14. **All sizing props use divider 4** — `width`, `height`, `minWidth`, `maxWidth`, `minHeight`, `maxHeight` are NOT direct pixels. `height={10}` = 2.5rem = 40px

---

## DataGrid Component

```tsx
import DataGrid from '@cronocode/react-box/components/dataGrid';

<DataGrid
  data={users}
  def={{
    rowKey: 'id',
    title: 'Users',
    topBar: true, bottomBar: true, globalFilter: true,
    rowSelection: { pinned: true },
    showRowNumber: { pinned: true },
    rowHeight: 40,
    visibleRowsCount: 15,         // or 'all' to disable virtualization
    columns: [
      { key: 'name', header: 'Name', filterable: true },
      { key: 'age', header: 'Age', width: 80, align: 'right', filterable: { type: 'number' } },
      { key: 'email', header: 'Email', width: 250, filterable: true },
      { key: 'status', header: 'Status', filterable: { type: 'multiselect' } },
      { key: 'country', header: 'Country', pin: 'RIGHT' },
      {
        key: 'actions', header: '', pin: 'RIGHT', width: 80, sortable: false, resizable: false,
        Cell: ({ cell }) => <Button onClick={() => edit(cell.row.data)}>Edit</Button>,
      },
    ],
    rowDetail: { content: (user) => <UserDetails user={user} />, height: 'auto', expandOnRowClick: true },
  }}
  onSelectionChange={(e) => console.log(e.selectedRowKeys)}
/>
```

### DataGridProps

| Prop | Type | Description |
|---|---|---|
| `data` | `TRow[]` | Row data (required) |
| `def` | `GridDefinition` | Grid config (required) |
| `component` | `string` | Style tree name (default: `'datagrid'`) |
| `loading` | `boolean` | Loading state |
| `filters` | `((row) => boolean)[]` | External predicate filters (applied before column/global filters) |
| `page` / `onPageChange` | `number` / `(page, size) => void` | Controlled pagination (1-indexed) |
| `onSortChange` | `(columnKey, direction) => void` | Sort callback (`direction`: `'ASC'`/`'DESC'`/`undefined`) |
| `onServerStateChange` | `(state) => void` | Unified: `{ page, pageSize, sortColumn, sortDirection, columnFilters, globalFilterValue }` |
| `onSelectionChange` | `(event) => void` | `event`: `{ action, selectedRowKeys, affectedRowKeys, isAllSelected }` |
| `expandedRowKeys` / `onExpandedRowKeysChange` | `Key[]` / `(keys) => void` | Controlled expanded rows |
| `globalFilterValue` / `onGlobalFilterChange` | `string` / `(value) => void` | Controlled global filter |
| `columnFilters` / `onColumnFiltersChange` | `ColumnFilters` / `(filters) => void` | Controlled column filters |

### GridDefinition

| Prop | Type | Default | Description |
|---|---|---|---|
| `columns` | `ColumnType[]` | required | Column definitions |
| `rowKey` | `keyof TRow \| (row) => Key` | auto | Unique row identifier |
| `rowHeight` | `number` | `48` | Row height in px |
| `visibleRowsCount` | `number \| 'all'` | `10` | Visible rows. `'all'` disables virtualization |
| `showRowNumber` | `boolean \| { pinned?, width? }` | `false` | Row number column |
| `rowSelection` | `boolean \| { pinned? }` | `false` | Checkbox selection column |
| `rowDetail` | `{ content, height?, expandOnRowClick?, pinned? }` | — | Expandable detail panel. `height`: `'auto'`/number/`(row) => number` |
| `pagination` | `{ totalCount, pageSize? }` | — | Server-side pagination. Bypasses client-side filtering |
| `topBar` / `bottomBar` | `boolean` | `false` | Show top/bottom bars |
| `title` / `topBarContent` | `ReactNode` | — | Top bar content |
| `globalFilter` | `boolean` | `false` | Enable global fuzzy search |
| `globalFilterKeys` | `(keyof TRow)[]` | all | Limit global filter columns |
| `sortable` / `resizable` | `boolean` | `true` | Enable sorting/resizing for all columns |
| `noDataComponent` | `ReactNode` | `'empty'` | Custom empty state |

### ColumnType

| Prop | Type | Default | Description |
|---|---|---|---|
| `key` | `Key` | required | Column identifier (maps to TRow property) |
| `header` | `string` | — | Header text |
| `width` | `number` | `200` | Base width in px |
| `align` | `'left' \| 'right' \| 'center'` | `'left'` | Cell alignment |
| `pin` | `'LEFT' \| 'RIGHT'` | — | Pin to edge (sticky on scroll) |
| `columns` | `ColumnType[]` | — | Nested columns (grouped header) |
| `Cell` | `({ cell }) => ReactNode` | — | Custom renderer. `cell`: `{ value, row, column, grid }` |
| `sortable` / `resizable` | `boolean` | inherits | Override grid-level setting |
| `flexible` | `boolean` | `true` | Participate in flex width distribution |
| `filterable` | `boolean \| FilterConfig` | — | `true` (text), `{ type: 'number', min?, max? }`, `{ type: 'multiselect', options? }` |

### Server-Side Pagination

```tsx
<DataGrid
  data={pageData} page={page} loading={loading}
  onServerStateChange={(state) => {
    // state = { page, pageSize, sortColumn, sortDirection, columnFilters, globalFilterValue }
    setPage(state.page); refetch(state);
  }}
  def={{ columns: [...], bottomBar: true, pagination: { totalCount, pageSize: 25 }, globalFilter: true }}
/>
```

### Style Customization

All sub-components are customizable via `Box.components()`:

```tsx
Box.components({
  datagrid: { children: { header: { children: { cell: { styles: { textTransform: 'uppercase' } } } } } },
  subgrid: {
    extends: 'datagrid', // MUST use extends — inherits pinning, sticky, hover groups, filters, etc.
    styles: { b: 0, shadow: 'none' },
    children: { body: { children: { cell: { styles: { fontSize: 13 } } } } },
  },
});
<DataGrid component="subgrid" data={data} def={def} />  {/* children resolve under subgrid.* */}
```

### Component Style Tree

| Component Name | Description | Variants |
|---|---|---|
| `datagrid` | Root container | — |
| `datagrid.content` | Scroll container for header + body | — |
| `datagrid.topBar` | Top bar (title, filters, column groups) | — |
| `datagrid.topBar.globalFilter` | Global search wrapper | — |
| `datagrid.topBar.globalFilter.stats` | Filtered rows count badge | — |
| `datagrid.topBar.columnGroups` | Column group chips container | — |
| `datagrid.topBar.columnGroups.icon` | Column group icon | — |
| `datagrid.topBar.columnGroups.separator` | Separator between groups | — |
| `datagrid.topBar.columnGroups.item` | Column group chip | — |
| `datagrid.topBar.columnGroups.item.icon` | Remove icon on chip | — |
| `datagrid.topBar.columnVisibility` | Column visibility dropdown | — |
| `datagrid.topBar.columnVisibility.badge` | Hidden columns count badge | — |
| `datagrid.filter.cell` | Filter row cell | `isPinned`, `isFirstLeftPinned`, `isLastLeftPinned`, `isFirstRightPinned`, `isLastRightPinned` |
| `datagrid.filter.cell.input` | Filter input container (text/number/multiselect) | — |
| `datagrid.header` | Header grid container (sticky) | — |
| `datagrid.header.cell` | Header cell | `isPinned`, `isFirstLeftPinned`, `isLastLeftPinned`, `isFirstRightPinned`, `isLastRightPinned`, `isSortable`, `isRowSelection`, `isRowNumber`, `isFirstLeaf`, `isLastLeaf`, `isEmptyCell` |
| `datagrid.header.cell.contextMenu` | Column context menu button | — |
| `datagrid.header.cell.contextMenu.icon` | Context menu icon | — |
| `datagrid.header.cell.contextMenu.tooltip` | Context menu popup | — |
| `datagrid.header.cell.contextMenu.tooltip.item` | Context menu action | — |
| `datagrid.header.cell.contextMenu.tooltip.item.icon` | Action icon | — |
| `datagrid.header.cell.contextMenu.tooltip.item.separator` | Menu separator line | — |
| `datagrid.header.cell.resizer` | Column resize handle | — |
| `datagrid.body` | Body grid container (virtualized rows) | — |
| `datagrid.body.cell` | Body cell | `isPinned`, `isFirstLeftPinned`, `isLastLeftPinned`, `isFirstRightPinned`, `isLastRightPinned`, `isRowNumber`, `isRowSelection`, `isRowSelected`, `isFirstLeaf`, `isLastLeaf`, `isEmptyCell` |
| `datagrid.body.cell.text` | Default cell text renderer | — |
| `datagrid.body.cell.rowDetail` | Row detail expand/collapse button | — |
| `datagrid.body.row` | Data row (display: contents) | — |
| `datagrid.body.groupRow` | Group row (display: contents) | — |
| `datagrid.body.groupRow.expandButton` | Group expand/collapse button | — |
| `datagrid.body.detailRow` | Expanded detail row | — |
| `datagrid.body.empty` | Empty state container | — |
| `datagrid.emptyColumns` | No columns selected placeholder | — |
| `datagrid.bottomBar` | Bottom bar (row count, pagination) | — |
| `datagrid.bottomBar.info` | Status text ("Rows: ...", "Selected: ...") | — |
| `datagrid.bottomBar.clearFilters` | "Clear filters" link | — |
| `datagrid.bottomBar.pagination` | Pagination controls wrapper | — |
| `datagrid.bottomBar.pagination.button` | Pagination nav button | — |
| `datagrid.bottomBar.pagination.info` | Page info text ("1 of 5") | — |

---

## Dropdown Component

```tsx
import Dropdown from '@cronocode/react-box/components/dropdown';
```

### Usage

```tsx
// Single selection (uncontrolled)
<Dropdown<string> defaultValue="apple" onChange={(value, values) => console.log(value)}>
  <Dropdown.Unselect>Pick a fruit...</Dropdown.Unselect>
  <Dropdown.Item value="apple">Apple</Dropdown.Item>
  <Dropdown.Item value="banana">Banana</Dropdown.Item>
</Dropdown>

// Controlled
<Dropdown<string> value={fruit} onChange={(value) => setFruit(value!)}>
  <Dropdown.Item value="apple">Apple</Dropdown.Item>
  <Dropdown.Item value="banana">Banana</Dropdown.Item>
</Dropdown>

// Multiple + search + checkboxes
<Dropdown<string> multiple showCheckbox isSearchable searchPlaceholder="Search...">
  <Dropdown.SelectAll>Select all</Dropdown.SelectAll>
  <Dropdown.EmptyItem>No results</Dropdown.EmptyItem>
  <Dropdown.Display>{(values) => values.length === 0 ? 'Pick...' : `${values.length} selected`}</Dropdown.Display>
  <Dropdown.Item value="apple">Apple</Dropdown.Item>
  <Dropdown.Item value="banana">Banana</Dropdown.Item>
</Dropdown>

// Form integration: name prop renders hidden inputs with JSON-stringified values
<Dropdown<string> name="fruits" multiple defaultValue={['apple']}>...</Dropdown>
```

### Props

| Prop | Type | Description |
|---|---|---|
| `value` / `defaultValue` | `TVal \| TVal[]` | Controlled / uncontrolled selected value(s) |
| `multiple` | `boolean` | Multi-select mode |
| `isSearchable` | `boolean` | Show search input when open |
| `searchPlaceholder` | `string` | Search input placeholder |
| `hideIcon` | `boolean` | Hide chevron icon |
| `showCheckbox` | `boolean` | Show checkboxes in multiple mode |
| `name` | `string` | Form field name (renders hidden `<input>` elements) |
| `onChange` | `(value: TVal \| undefined, values: TVal[]) => void` | Selection callback |
| `itemsProps` | `BoxStyleProps` | Style overrides for the opened items container (`dropdown.items`) |
| `iconProps` | `BoxStyleProps` | Style overrides for the chevron icon container (`dropdown.icon`) |
| `variant` | `ClassNameType` | Propagates to root **and all child sub-components** |

Also accepts all `BoxProps` (styling props) which apply to the root button element.

### Sub-Components

All sub-components accept BoxProps for per-instance style overrides.

| Sub-Component | Purpose |
|---|---|
| `Dropdown.Item<TVal>` | Selectable option. Requires `value` prop |
| `Dropdown.Unselect` | Clear selection option (shown when items selected) |
| `Dropdown.SelectAll` | Select all (shown in `multiple` when not all selected) |
| `Dropdown.EmptyItem` | Shown when search yields no results |
| `Dropdown.Display` | Custom display: static content or `(values: TVal[], isOpen: boolean) => ReactNode` |

### Style Customization

**Per-instance** — use `itemsProps`, `iconProps`, or BoxProps directly on sub-components:

```tsx
<Dropdown<string> itemsProps={{ width: 80, maxHeight: 50 }} iconProps={{ color: 'gray-400' }}>
  <Dropdown.Item value="a" bgColor="blue-50" fontWeight={600}>Highlighted</Dropdown.Item>
</Dropdown>
```

**Global** — override defaults via `Box.components()` (deep-merged):

```tsx
Box.components({
  dropdown: {
    styles: { borderRadius: 4, bgColor: 'gray-50' },
    children: {
      items: { styles: { shadow: 'large', borderRadius: 4 } },
      item: { styles: { borderRadius: 2, hover: { bgColor: 'blue-50' } } },
    },
  },
});
```

**Custom variants** — `variant` propagates to all children. Define matching variants on each child:

```tsx
Box.components({
  dropdown: {
    variants: { dense: { p: 1, fontSize: 12 } },
    children: {
      items: { variants: { dense: { maxHeight: 40, gap: 0 } } },
      item: { variants: { dense: { p: 1, lineHeight: 16 } } },
      unselect: { variants: { dense: { p: 1 } } },
      selectAll: { variants: { dense: { p: 1 } } },
      emptyItem: { variants: { dense: { p: 1 } } },
    },
  },
});
<Dropdown variant="dense">...</Dropdown> // applies to root + all children
```

### Component Style Tree

| Component Name | Description | Built-in Variants |
|---|---|---|
| `dropdown` | Root button trigger | `compact` |
| `dropdown.items` | Opened items container (portal) | — |
| `dropdown.item` | Selectable item | `compact`, `multiple` |
| `dropdown.unselect` | Clear selection option | `compact` |
| `dropdown.selectAll` | Select all option | `compact` |
| `dropdown.emptyItem` | No results placeholder | `compact` |
| `dropdown.icon` | Chevron arrow container | — |

---

## Select Component

Data-driven dropdown — pass `data` + `def` instead of composing children. Wraps Dropdown internally, shares the same `dropdown.*` style tree.

```tsx
import Select from '@cronocode/react-box/components/select';

// Basic
<Select<User, number> data={users} def={{ valueKey: 'id', displayKey: 'name', placeholder: 'Pick...' }}
  value={selected} onChange={(value) => setSelected(value!)} />

// Multiple + search + custom display
<Select<User, number> data={users} multiple showCheckbox isSearchable searchPlaceholder="Search..."
  def={{
    valueKey: 'id', displayKey: 'name', placeholder: 'Pick users...',
    selectAllText: 'Select all', emptyText: 'No results',
    display: (user) => `${user.name} — ${user.role}`,
    selectedDisplay: (rows) => `${rows.length} selected`,
  }} />
```

### SelectDef

| Prop | Type | Description |
|---|---|---|
| `valueKey` | `keyof TRow` | Required — field used as option value |
| `displayKey` | `keyof TRow` | Field to display (defaults to valueKey) |
| `display` | `(row: TRow) => ReactNode` | Custom render per item |
| `selectedDisplay` | `(rows: TRow[], isOpen: boolean) => ReactNode` | Custom trigger display (receives resolved row objects) |
| `placeholder` | `string` | Unselect/placeholder text |
| `selectAllText` | `string` | Select all option text (multiple mode) |
| `emptyText` | `string` | Empty search results text |

Also accepts: `data` (TRow[]), `value`/`defaultValue`, `multiple`, `isSearchable`, `searchPlaceholder`, `showCheckbox`, `hideIcon`, `name`, `onChange`, `itemsProps`, `iconProps`, `variant`, and all BoxProps. Same styling/variants as Dropdown.

---

## Debugging Tips

1. **Inspect styles**: `<style id="crono-box">` in document head
2. **Class names**: Elements get classes like `_b`, `_2a`, etc.
3. **CSS variables**: In `:root` rules
4. **Theme issues**: Ensure `<Box.Theme>` wraps your app
5. **Portal theming**: Tooltips/dropdowns use `#crono-box` container
