---
description: Critical rules for @cronocode/react-box — prevents the most common AI mistakes
globs: '**/*.{ts,tsx,jsx}'
---

# @cronocode/react-box Rules

1. **NEVER use `style={{ }}`** — always use Box props. Missing prop? Create with `Box.extend()`
2. **NEVER `<Box tag="...">`** for common elements — use `<Button>`, `<Link>`, `<H1>`, `<P>`, `<Nav>`, `<Flex>`, `<Grid>`, and for SVG `<Svg>`, `<Path>`, `<Circle>`, `<Rect>`, `<SvgText>`… from `components/svg`
3. **An icon from lucide/Tabler/react-icons goes in `<Icon>`** (`components/icon`) — `<Icon size={5} color="amber-500"><Sun /></Icon>`. `size` is the ÷4 scale (the set's own `size` prop is pixels), and no `label` means `aria-hidden`. SVG you draw yourself is `<Svg>`, not `<Icon>`. An icon from any other set comes through the same `<Icon>`: `unplugin-icons` (`~icons/<set>/<name>`) at build time, `@iconify/react` when the name is data
4. **NEVER `<Box display="flex/grid">`** — use `<Flex>` / `<Grid>` components
5. **fontSize divider is 16** (not 4): `fontSize={14}` → 14px
6. **Spacing divider is 4**: `p={4}` → 16px (1rem)
7. **Border width and lineHeight are direct px**: `b={1}` → 1px. **borderRadius uses divider 4**: `borderRadius={2}` → 8px
8. **A gradient fill is a value, not an attribute**: `fill="url(#sky)"`, `stroke="var(--chart-1)"`, `clipPath="url(#frame)"` — so it can be themed and hovered. **A dashboard shape is `components/chart`**: `<Sparkline data={[…]}/>`, `<ProgressRing value={0.6}/>`, `<Gauge>`, `<MiniDonut>` — Box props, no chart library
9. **A CSS variable is a prop too**: `vars={{ 'color-revenue': 'sky-500' }}` declares `--color-revenue` on the element and everything inside it — the answer for markup this library does not render. **A third-party chart goes in `<ChartContainer series={['revenue', 'cost']}>`** (`components/chart`), which declares `--chart-1..6` in both themes and one `--color-<series>` per series, so `<Line stroke="var(--color-revenue)"/>` is all the chart ever says about colour
10. **SVG lengths have no divider and no unit**: `strokeWidth={2}` → `stroke-width: 2` (user units), same for `strokeDasharray`/`strokeDashoffset` and the geometry props `cx`/`cy`/`r`/`rx`/`ry`/`x`/`y`. `<Rect width={40} height={40}>` and `<Path d="M…">` take those as the SVG attributes they are — the Box props of those names mean something else
11. **HTML attributes go in `props` prop**: `<Link props={{ href: '/about' }}>` not `<Link href>`
12. **Size shortcuts**: `width="fit"` = 100%, `width="fit-screen"` = 100vw, `width="1/2"` = 50%

Full reference: `src/BOX_AI_CONTEXT.md` or invoke `/react-box` skill.
