---
name: cronocode-react-box
description: "@cronocode/react-box expert — runtime CSS-in-JS library. Use when working with react-box Box component, CSS props, Flex/Grid/Button/Dropdown/DataGrid components, Box.extend(), Box.components(), or theme system. Also handles installation, updates, and package manager detection."
---

# @cronocode/react-box AI Skill

You are an expert in the `@cronocode/react-box` library — a React runtime CSS-in-JS library where the `Box` component accepts ~144 CSS props and generates CSS classes at runtime.

## Installation & Package Management

When the user needs to install or update `@cronocode/react-box`, detect their package manager and use the correct command:

```bash
# Detection order: check lock files in project root
# pnpm-lock.yaml → pnpm
# yarn.lock     → yarn
# bun.lockb     → bun
# package-lock.json or default → npm
```

**Install commands:**
| Manager | Install | Update |
|---|---|---|
| npm | `npm install @cronocode/react-box` | `npm update @cronocode/react-box` |
| yarn | `yarn add @cronocode/react-box` | `yarn upgrade @cronocode/react-box` |
| pnpm | `pnpm add @cronocode/react-box` | `pnpm update @cronocode/react-box` |
| bun | `bun add @cronocode/react-box` | `bun update @cronocode/react-box` |

**Check for updates:**
```bash
npm view @cronocode/react-box version  # latest published version
```
Compare against the installed version in `package.json`. If outdated, suggest updating.

## Critical Rules

1. **NEVER use `style={{ }}`** — always use Box props. Missing prop? Create with `Box.extend()`
2. **NEVER `<Box tag="...">`** for common elements — use `<Button>`, `<Link>`, `<H1>`, `<P>`, `<Nav>`, etc.
3. **NEVER `<Box display="flex/grid">`** — use `<Flex>` / `<Grid>` components
4. **HTML attributes go in `props` prop**: `<Link props={{ href: '/about' }}>` not `<Link href>`

## Numeric Value Formatters

| Prop Category | Divider | Example | CSS Output |
|---|---|---|---|
| Spacing (`p`, `m`, `gap`, `px`, `py`, etc.) | 4 | `p={4}` | 1rem (16px) |
| Font size (`fontSize`) | **16** | `fontSize={14}` | 0.875rem (14px) |
| Width/Height (numeric) | 4 | `width={20}` | 5rem (80px) |
| Border width (`b`, `bx`, `by`, etc.) | none | `b={1}` | 1px |
| Border radius / lineHeight | none | `borderRadius={8}` | 8px |

## Component Shortcuts

| Instead of... | Use... | Import from |
|---|---|---|
| `<Box display="flex">` | `<Flex>` | `@cronocode/react-box/components/flex` |
| `<Box display="grid">` | `<Grid>` | `@cronocode/react-box/components/grid` |
| `<Box tag="button">` | `<Button>` | `@cronocode/react-box/components/button` |
| `<Box tag="input">` | `<Textbox>` | `@cronocode/react-box/components/textbox` |
| `<Box tag="textarea">` | `<Textarea>` | `@cronocode/react-box/components/textarea` |
| `<Box tag="a/img/label">` | `<Link>/<Img>/<Label>` | `@cronocode/react-box/components/semantics` |
| `<Box tag="h1-h6/p/span">` | `<H1>..<H6>/<P>/<Span>` | `@cronocode/react-box/components/semantics` |
| `<Box tag="nav/header/footer/main">` | `<Nav>/<Header>/<Footer>/<Main>` | `@cronocode/react-box/components/semantics` |
| `<Box tag="section/article/aside">` | `<Section>/<Article>/<Aside>` | `@cronocode/react-box/components/semantics` |

Semantics also export: `Mark`, `Figure`, `Figcaption`, `Details`, `Summary`, `Menu`, `Time`.

## Prop Reference

### Spacing
`p`/`px`/`py`/`pt`/`pr`/`pb`/`pl` (padding), `m`/`mx`/`my`/`mt`/`mr`/`mb`/`ml` (margin), `gap`

### Layout
`display`, `d` (flex-direction), `wrap`, `ai` (align-items), `jc` (justify-content), `flex`/`grow`/`shrink`

### Sizing
`width`/`height` — number (rem/4), `'auto'`, `'fit'` (100%), `'fit-screen'` (100vw/vh), fractions (`'1/2'`, `'1/3'`, `'2/3'`), percentages (`'33%'`).
`minWidth`/`maxWidth`/`minHeight`/`maxHeight`. All sizing/spacing/positioning accept percentages: `p="5%"`, `top="10%"`.

### Visual
Colors: `bgColor`/`color`/`borderColor` — Tailwind palette `'gray-50'`..'gray-900'`, red/orange/yellow/green/teal/blue/indigo/purple/pink/violet, `'white'`/`'black'`/`'transparent'`/`'currentColor'`.
Borders: `b`/`bx`/`by`/`bt`/`br`/`bb`/`bl` (direct px), `borderRadius` (direct px), `borderStyle`.
Typography: `fontSize` (divider 16), `fontWeight`, `lineHeight` (direct px), `textAlign`/`textDecoration`/`textTransform`/`whiteSpace`/`textOverflow`.
Position: `position`, `top`/`right`/`bottom`/`left`/`inset`, `zIndex`.
Effects: `shadow` (`'small'`/`'medium'`/`'large'`/`'xl'`/`'none'`), `opacity`, `cursor`, `pointerEvents`, `transition`, `transform`, `userSelect`, `overflow`.

## Pseudo-Classes & Breakpoints

```tsx
// Pseudo-classes: hover, focus, active, disabled, checked, indeterminate, required, selected,
//   focusWithin, focusVisible, first, last, even, odd, empty
<Box bgColor="blue-500" hover={{ bgColor: 'blue-600' }} disabled={{ opacity: 0.5 }} />

// Responsive (mobile-first): sm(640) md(768) lg(1024) xl(1280) xxl(1536)
<Box p={2} md={{ p: 4, hover: { bgColor: 'gray-200' } }} />
```

## Theme System

```tsx
<Box.Theme>                                {/* auto-detect via prefers-color-scheme */}
<Box.Theme theme="dark">                   {/* explicit, ignores system pref */}
<Box.Theme use="global">                   {/* applies class + data-theme to <html> */}
<Box.Theme storageKey="app-theme">         {/* persists user choice to localStorage */}
<Box.Theme theme="high-contrast">          {/* supports any custom theme name */}

// Hook: const [theme, setTheme] = Box.useTheme(); (within Box.Theme)
setTheme('dark');   // set theme (persists if storageKey provided)
setTheme(null);     // reset to system auto-detection, clears localStorage

// Theme-aware styles — nests with pseudo-classes and breakpoints
<Box bgColor="white" theme={{ dark: { bgColor: 'gray-900', hover: { bgColor: 'gray-700' } } }} />
```

**Props**: `theme?` (string), `use?` (`'global'`|`'local'`), `storageKey?` (localStorage persistence key).
**DOM**: Sets `data-theme` attribute + theme class. Cleaned up on unmount (global mode).

## Component System

```tsx
// Use component + variant for registered styles
<Box component="card" variant="bordered">
  <Box component="card.header">Title</Box>
</Box>

// Define custom components
Box.components({
  card: {
    styles: { display: 'flex', d: 'column', p: 4, bgColor: 'white', borderRadius: 8, shadow: 'medium' },
    variants: { bordered: { b: 1, borderColor: 'gray-200', shadow: 'none' } },
    children: { header: { styles: { fontSize: 18, fontWeight: 600 } } },
  },
});

// Inheritance
Box.components({ subgrid: { extends: 'datagrid', styles: { b: 0, shadow: 'none' } } });
```

## Extension System

```tsx
export const { extendedProps, extendedPropTypes } = Box.extend(
  { 'brand-primary': '#ff6600' },             // CSS variables
  { aspectRatio: [{ values: ['16/9'] as const, styleName: 'aspect-ratio', valueFormat: (v) => v }] }, // New props
  { bgColor: [{ values: ['brand-primary'] as const, styleName: 'background-color',                    // Extend existing
    valueFormat: (v, getVar) => getVar(v) }] },
);

// TypeScript augmentation (types.d.ts)
declare module '@cronocode/react-box/types' {
  namespace Augmented {
    interface BoxProps extends ExtractBoxStyles<typeof extendedProps> {}
    interface BoxPropTypes extends ExtractBoxStyles<typeof extendedPropTypes> {}
    interface ComponentsTypes extends ExtractComponentsAndVariants<typeof components> {}
  }
}
```

## Dropdown Component

```tsx
import Dropdown from '@cronocode/react-box/components/dropdown';

// Single selection
<Dropdown<string> defaultValue="a" onChange={(value, values) => {}}>
  <Dropdown.Unselect>Pick...</Dropdown.Unselect>
  <Dropdown.Item value="a">Alpha</Dropdown.Item>
  <Dropdown.Item value="b">Beta</Dropdown.Item>
</Dropdown>

// Multiple + search + checkboxes + custom display
<Dropdown<string> multiple showCheckbox isSearchable searchPlaceholder="Search...">
  <Dropdown.SelectAll>Select all</Dropdown.SelectAll>
  <Dropdown.EmptyItem>No results</Dropdown.EmptyItem>
  <Dropdown.Display>{(values) => `${values.length} selected`}</Dropdown.Display>
  <Dropdown.Item value="a">Alpha</Dropdown.Item>
</Dropdown>
```

**Props**: `value`/`defaultValue`, `multiple`, `isSearchable`, `searchPlaceholder`, `hideIcon`, `showCheckbox`, `name` (form), `onChange`, `itemsProps` (BoxStyleProps for items container), `iconProps` (BoxStyleProps for icon), `variant` (propagates to all children). Also accepts all BoxProps.

**Sub-components** (all accept BoxProps): `Dropdown.Item<TVal>` (requires `value`), `Dropdown.Unselect`, `Dropdown.SelectAll`, `Dropdown.EmptyItem`, `Dropdown.Display` (static or `(values, isOpen) => ReactNode`).

**Style tree**: `dropdown`, `dropdown.items`, `dropdown.item` (variants: compact, multiple), `dropdown.unselect`, `dropdown.selectAll`, `dropdown.emptyItem`, `dropdown.icon`. Custom variants propagate to all children.

## Select Component

Data-driven dropdown — pass `data` + `def` instead of composing children. Wraps Dropdown, shares `dropdown.*` style tree.

```tsx
import Select from '@cronocode/react-box/components/select';

<Select<User, number> data={users} def={{ valueKey: 'id', displayKey: 'name', placeholder: 'Pick...' }}
  value={selected} onChange={(value) => setSelected(value!)} />

// Multiple + search + custom display
<Select<User, number> data={users} multiple showCheckbox isSearchable searchPlaceholder="Search..."
  def={{
    valueKey: 'id', displayKey: 'name', selectAllText: 'Select all', emptyText: 'No results',
    display: (user) => `${user.name} — ${user.role}`,
    selectedDisplay: (rows) => `${rows.length} selected`,
  }} />
```

**SelectDef**: `valueKey` (required — field as value), `displayKey` (field to display, defaults to valueKey), `display` (`(row) => ReactNode` per item), `selectedDisplay` (`(rows, isOpen) => ReactNode` for trigger), `placeholder`, `selectAllText`, `emptyText`.

Also accepts: `data`, `value`/`defaultValue`, `multiple`, `isSearchable`, `searchPlaceholder`, `showCheckbox`, `hideIcon`, `name`, `onChange`, `itemsProps`, `iconProps`, `variant`, and all BoxProps. Same styling/variants as Dropdown.

## DataGrid Component

```tsx
import DataGrid from '@cronocode/react-box/components/dataGrid';

<DataGrid data={users} def={{
  rowKey: 'id', topBar: true, bottomBar: true, globalFilter: true,
  rowSelection: { pinned: true }, showRowNumber: { pinned: true },
  rowHeight: 40, visibleRowsCount: 15, // 'all' disables virtualization
  columns: [
    { key: 'name', header: 'Name', filterable: true },
    { key: 'age', header: 'Age', width: 80, align: 'right', filterable: { type: 'number' } },
    { key: 'status', header: 'Status', filterable: { type: 'multiselect' } },
    { key: 'country', header: 'Country', pin: 'RIGHT' },
    { key: 'actions', header: '', pin: 'RIGHT', width: 80, sortable: false,
      Cell: ({ cell }) => <Button onClick={() => edit(cell.row.data)}>Edit</Button> },
  ],
  rowDetail: { content: (row) => <Details row={row} />, height: 'auto', expandOnRowClick: true },
}} onSelectionChange={(e) => console.log(e.selectedRowKeys)} />
```

**DataGridProps**: `data` (TRow[]), `def` (GridDefinition), `component` (style tree, default `'datagrid'`), `loading`, `filters` (predicate array), `page`/`onPageChange`, `onSortChange` (columnKey, `'ASC'`/`'DESC'`/undefined), `onServerStateChange` (`{ page, pageSize, sortColumn, sortDirection, columnFilters, globalFilterValue }`), `onSelectionChange` (`{ action, selectedRowKeys, affectedRowKeys, isAllSelected }`), `expandedRowKeys`/`onExpandedRowKeysChange`, `globalFilterValue`/`onGlobalFilterChange`, `columnFilters`/`onColumnFiltersChange`.

**GridDefinition**: `columns` (required), `rowKey` (keyof TRow or fn), `rowHeight` (px, default 48), `visibleRowsCount` (number or `'all'`, default 10), `showRowNumber` (bool or `{ pinned?, width? }`), `rowSelection` (bool or `{ pinned? }`), `rowDetail` (`{ content, height?, expandOnRowClick?, pinned? }`), `pagination` (`{ totalCount, pageSize? }` — enables server-side, bypasses client filtering), `topBar`/`bottomBar` (bool), `title`/`topBarContent` (ReactNode), `globalFilter` (bool), `globalFilterKeys` (keyof TRow[]), `sortable`/`resizable` (bool, default true), `noDataComponent`.

**ColumnType**: `key`, `header`, `width` (px, default 200), `align` (`'left'`/`'right'`/`'center'`), `pin` (`'LEFT'`/`'RIGHT'`), `columns` (nested for grouped headers), `Cell` (`({ cell }) => ReactNode`, cell has `value`, `row`, `column`, `grid`), `sortable`/`resizable` (override grid), `flexible` (default true), `filterable` (`true` = text, `{ type: 'number', min?, max? }`, `{ type: 'multiselect', options? }`).

**Server-side pagination**: `def={{ pagination: { totalCount, pageSize }, bottomBar: true }}` + `page={page}` + `onServerStateChange={(state) => refetch(state)}`.

**Style tree**: `datagrid > content, topBar (globalFilter, columnGroups), header > cell (contextMenu, resizer), filter > row > cell, body > cell | row | groupRow | detailRow, bottomBar > pagination`. Customize via `Box.components()`. Use `extends: 'datagrid'` for variant grids (inherits pinning, sticky, etc.).

## Common Patterns

```tsx
<Flex d="column" gap={4} ai="center" jc="between">{children}</Flex>
<Flex d="column" gap={2} md={{ d: 'row', gap: 4 }}>{children}</Flex>  // responsive stack
<Grid gridCols={3} gap={4}>{items}</Grid>
<Box p={4} bgColor="white" borderRadius={8} shadow="medium" />        // card
<Box overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap" />  // truncated text
```

**Group hover**: `<Box hoverGroup={{ 'parent-class': { opacity: 1 } }}>`
**SSR**: `import { getStyles, resetStyles } from '@cronocode/react-box/ssg'`
**Portals**: Tooltip component for escaping `overflow: hidden` (renders into `#crono-box` container)
