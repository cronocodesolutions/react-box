---
name: cronocode-react-box
description: "@cronocode/react-box expert — runtime CSS-in-JS library. Use when working with react-box Box component, CSS props, Flex/Grid/Button/Dropdown/DataGrid components, Box.extend(), Box.components(), or theme system. Also handles installation, updates, and package manager detection."
---

# @cronocode/react-box AI Skill

Runtime CSS-in-JS library. `Box` accepts ~144 CSS props → generates CSS classes at runtime. Same values share a class.

## Installation & Package Management

Detect package manager via lock files: `pnpm-lock.yaml` → pnpm, `yarn.lock` → yarn, `bun.lockb` → bun, else npm.

| Manager | Install | Update |
|---|---|---|
| npm | `npm install @cronocode/react-box` | `npm update @cronocode/react-box` |
| yarn | `yarn add @cronocode/react-box` | `yarn upgrade @cronocode/react-box` |
| pnpm | `pnpm add @cronocode/react-box` | `pnpm update @cronocode/react-box` |
| bun | `bun add @cronocode/react-box` | `bun update @cronocode/react-box` |

Check latest: `npm view @cronocode/react-box version`

## Critical Rules

1. **NEVER `style={{ }}`** — use Box props. Missing prop? `Box.extend()`. `style` is top-level only — never inside breakpoints/pseudo-classes/theme
2. **NEVER `<Box tag="...">`** for common elements — use `<Button>`, `<Link>`, `<H1>`, `<P>`, `<Nav>`, etc.
3. **NEVER `<Box display="flex/grid">`** — use `<Flex>` / `<Grid>`
4. **HTML attrs in `props`**: `<Link props={{ href: '/about' }}>` not `<Link href>`

## Numeric Value Formatters

| Category | Divider | Example → CSS |
|---|---|---|
| Spacing (`p`,`m`,`gap`,`px`,`py`…) | 4 | `p={4}` → 1rem (16px) |
| fontSize | **16** | `fontSize={14}` → 0.875rem (14px) |
| width/height/min/max (numeric) | 4 | `width={20}` → 5rem (80px) |
| Border (`b`,`bx`,`by`…) | px | `b={1}` → 1px |
| borderRadius / lineHeight | px | `borderRadius={8}` → 8px |

## Component Shortcuts

| Instead of… | Use | Import |
|---|---|---|
| `<Box display="flex/grid">` | `<Flex>`/`<Grid>` | `components/flex`, `components/grid` |
| `<Box tag="button/input/textarea">` | `<Button>`/`<Textbox>`/`<Textarea>` | `components/button`, `components/textbox`, `components/textarea` |
| `<Box tag="a/img/label">` | `<Link>`/`<Img>`/`<Label>` | `components/semantics` |
| `<Box tag="h1..h6/p/span">` | `<H1>..<H6>`/`<P>`/`<Span>` | `components/semantics` |
| `<Box tag="nav/header/footer/main">` | `<Nav>`/`<Header>`/`<Footer>`/`<Main>` | `components/semantics` |
| `<Box tag="section/article/aside">` | `<Section>`/`<Article>`/`<Aside>` | `components/semantics` |

Also: `Mark`, `Figure`, `Figcaption`, `Details`, `Summary`, `Menu`, `Time`. All from `@cronocode/react-box/components/...`.

## Props

**Spacing**: `p`/`px`/`py`/`pt`/`pr`/`pb`/`pl`, `m`/`mx`/`my`/`mt`/`mr`/`mb`/`ml`, `gap`
**Layout**: `display`, `d` (flex-direction), `wrap`, `ai` (align-items), `jc` (justify-content), `flex`/`grow`/`shrink`
**Sizing**: `width`/`height` — number (÷4=rem), `'auto'`, `'fit'` (100%), `'fit-screen'` (100vw/vh), fractions (`'1/2'`…), `'33%'`. `minWidth`/`maxWidth`/`minHeight`/`maxHeight` same. All accept `"5%"`.
**Colors**: `bgColor`/`color`/`borderColor` — Tailwind palette `'gray-50'`..`'gray-900'`, red/orange/yellow/green/teal/blue/indigo/purple/pink/violet, `'white'`/`'black'`/`'transparent'`/`'currentColor'`
**Borders**: `b`/`bx`/`by`/`bt`/`br`/`bb`/`bl` (px), `borderRadius` (px), `borderStyle`
**Text**: `fontSize` (÷16), `fontWeight`, `lineHeight` (px), `textAlign`/`textDecoration`/`textTransform`/`whiteSpace`/`textOverflow`, `textWrap`
**Position**: `position`, `top`/`right`/`bottom`/`left`/`inset`, `zIndex`
**Effects**: `shadow` (`'small'`/`'medium'`/`'large'`/`'xl'`/`'none'`), `opacity`, `cursor`, `pointerEvents`, `transition`, `transform`, `userSelect`, `overflow`

## Pseudo-Classes & Breakpoints

```tsx
<Box bgColor="blue-500" hover={{ bgColor: 'blue-600' }} disabled={{ opacity: 0.5 }} />
// Pseudo: hover, focus, active, disabled, checked, indeterminate, required, selected,
//   focusWithin, focusVisible, first, last, even, odd, empty
// Responsive (mobile-first): sm(640) md(768) lg(1024) xl(1280) xxl(1536)
<Box p={2} md={{ p: 4, hover: { bgColor: 'gray-200' } }} />
```

## Theme System

```tsx
<Box.Theme>                            {/* auto-detect system */}
<Box.Theme theme="dark" use="global">  {/* explicit + applies to <html> */}
<Box.Theme storageKey="app-theme">     {/* persists to localStorage */}
// Hook: const [theme, setTheme] = Box.useTheme();
// setTheme('dark') | setTheme(null) resets to auto
<Box bgColor="white" theme={{ dark: { bgColor: 'gray-900', hover: { bgColor: 'gray-700' } } }} />
```

**Props**: `theme?` (string), `use?` (`'global'`|`'local'`), `storageKey?`. Sets `data-theme` attr + class.

## Component System

```tsx
<Box component="card" variant="bordered"><Box component="card.header">Title</Box></Box>

export const components = Box.components({
  card: {
    styles: { display: 'flex', d: 'column', p: 4, bgColor: 'white', borderRadius: 8, shadow: 'medium' },
    variants: { bordered: { b: 1, borderColor: 'gray-200', shadow: 'none' } },
    children: { header: { styles: { fontSize: 18, fontWeight: 600 } } },
  },
  subgrid: { extends: 'datagrid', styles: { b: 0, shadow: 'none' } }
});

```

## Extension System

```tsx
export const { extendedProps, extendedPropTypes } = Box.extend(
  { 'brand-primary': '#ff6600' },                                                          // CSS variables
  { aspectRatio: [{ values: ['16/9'] as const, styleName: 'aspect-ratio', valueFormat: (v) => v }] },  // New props
  { bgColor: [{ values: ['brand-primary'] as const, styleName: 'background-color',         // Extend existing
    valueFormat: (v, getVar) => getVar(v) }] },
);
// TypeScript: declare module '@cronocode/react-box/types' { namespace Augmented {
//   interface BoxProps extends ExtractBoxStyles<typeof extendedProps> {}
//   interface BoxPropTypes extends ExtractBoxStyles<typeof extendedPropTypes> {}
//   interface ComponentsTypes extends ExtractComponentsAndVariants<typeof components> {} }}
```

## Dropdown

```tsx
import Dropdown from '@cronocode/react-box/components/dropdown';
<Dropdown<string> defaultValue="a" onChange={(value, values) => {}}>
  <Dropdown.Unselect>Pick...</Dropdown.Unselect>
  <Dropdown.Item value="a">Alpha</Dropdown.Item>
</Dropdown>
// Multiple: <Dropdown multiple showCheckbox isSearchable searchPlaceholder="Search...">
//   <Dropdown.SelectAll>All</Dropdown.SelectAll> <Dropdown.EmptyItem>No results</Dropdown.EmptyItem>
//   <Dropdown.Display>{(values) => `${values.length} selected`}</Dropdown.Display>
```

**Props**: `value`/`defaultValue`, `multiple`, `isSearchable`, `searchPlaceholder`, `hideIcon`, `showCheckbox`, `name`, `onChange`, `itemsProps`, `iconProps`, `variant` (propagates to children). All BoxProps.
**Sub-components**: `Item<T>` (requires `value`), `Unselect`, `SelectAll`, `EmptyItem`, `Display` (static or `(values, isOpen) => ReactNode`).
**Style tree**: `dropdown` > `items`, `item` (variants: compact, multiple), `unselect`, `selectAll`, `emptyItem`, `icon`.

## Select

Data-driven dropdown — `data` + `def` instead of children. Shares `dropdown.*` style tree.

```tsx
import Select from '@cronocode/react-box/components/select';
<Select<User, number> data={users} def={{ valueKey: 'id', displayKey: 'name', placeholder: 'Pick...' }}
  value={selected} onChange={(value) => setSelected(value!)} />
```

**SelectDef**: `valueKey` (required), `displayKey`, `display` (`(row) => ReactNode`), `selectedDisplay` (`(rows, isOpen) => ReactNode`), `placeholder`, `selectAllText`, `emptyText`.
Also: `data`, `value`/`defaultValue`, `multiple`, `isSearchable`, `searchPlaceholder`, `showCheckbox`, `hideIcon`, `name`, `onChange`, `itemsProps`, `iconProps`, `variant`, BoxProps.

## DataGrid

```tsx
import DataGrid from '@cronocode/react-box/components/dataGrid';
<DataGrid data={users} def={{
  rowKey: 'id', topBar: true, bottomBar: true, globalFilter: true,
  rowSelection: { pinned: true }, showRowNumber: { pinned: true },
  rowHeight: 40, visibleRowsCount: 15,
  columns: [
    { key: 'name', header: 'Name', filterable: true },
    { key: 'age', header: 'Age', width: 80, align: 'right', filterable: { type: 'number' } },
    { key: 'status', header: 'Status', filterable: { type: 'multiselect' } },
    { key: 'country', header: 'Country', pin: 'RIGHT' },
    { key: 'actions', header: '', width: 80, sortable: false, contextMenu: false,
      Cell: ({ cell }) => <Button onClick={() => edit(cell.row.data)}>Edit</Button> },
  ],
  rowDetail: { content: (row) => <Details row={row} />, expandOnRowClick: true, expandColumnHeader: 'Details' },
  contextMenu: { sort: true, pin: true, group: false }, resizerStyle: 'hover',
}} onSelectionChange={(e) => console.log(e.selectedRowKeys)} />
```

**DataGridProps**: `data`, `def`, `component` (default `'datagrid'`), `loading`, `filters` (predicate[]), `page`/`onPageChange`, `onSortChange`, `onServerStateChange` (`{ page, pageSize, sortColumn, sortDirection, columnFilters, globalFilterValue }`), `onSelectionChange` (`{ action, selectedRowKeys, affectedRowKeys, isAllSelected }`), `expandedRowKeys`/`onExpandedRowKeysChange`, `globalFilterValue`/`onGlobalFilterChange`, `columnFilters`/`onColumnFiltersChange`.

**GridDefinition**: `columns` (required), `rowKey`, `rowHeight` (px, default 48), `visibleRowsCount` (number/`'all'`), `showRowNumber` (bool/`{ pinned?, width? }`), `rowSelection` (bool/`{ pinned? }`), `rowDetail` (`{ content, height?, expandOnRowClick?, pinned?, expandColumnWidth?, expandColumnHeader? }`), `pagination` (`{ totalCount, pageSize? }`), `topBar`/`bottomBar`, `title`/`topBarContent`, `globalFilter`, `globalFilterKeys`, `sortable`/`resizable` (default true), `contextMenu` (bool/`{ sort?, pin?, group? }`, default true), `resizerStyle` (`'visible'`/`'hover'`/`'hidden'`), `noDataComponent`.

**ColumnType**: `key`, `header`, `width` (px, default 200), `align`, `pin` (`'LEFT'`/`'RIGHT'`), `columns` (grouped headers), `Cell` (`({ cell }) => ReactNode`), `sortable`/`resizable` (override grid), `flexible`, `filterable` (`true`=text, `{ type: 'number' }`, `{ type: 'multiselect' }`), `contextMenu` (override grid).

**Server-side**: `def={{ pagination: { totalCount }, bottomBar: true }}` + `page={page}` + `onServerStateChange={fetchData}`.

**Style tree**: `datagrid` > `content`, `topBar` > (`globalFilter` > `stats`, `columnGroups` > `icon`|`separator`|`item` > `icon`, `columnVisibility` > `badge`), `filter` > `cell` > `input`, `header` > `cell` > (`contextMenu` > `icon`|`tooltip` > `item` > `icon`|`separator`, `resizer`), `body` > (`cell` > `text`|`rowDetail`, `row`, `groupRow` > `expandButton`, `detailRow`, `empty`), `emptyColumns`, `bottomBar` > (`info`, `clearFilters`, `pagination` > `button`|`info`).

## Common Patterns

```tsx
<Flex d="column" gap={4} ai="center" jc="between">{children}</Flex>
<Flex d="column" gap={2} md={{ d: 'row', gap: 4 }}>{children}</Flex>
<Grid gridCols={3} gap={4}>{items}</Grid>
<Box p={4} bgColor="white" borderRadius={8} shadow="medium" />
<Box overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap" />
```

**Group hover**: `<Box hoverGroup={{ 'parent-class': { opacity: 1 } }}>`
**SSR**: `import { getStyles, resetStyles } from '@cronocode/react-box/ssg'`
**Portals**: Tooltip for escaping `overflow: hidden` (renders into `#crono-box`)
