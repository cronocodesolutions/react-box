---
name: cronocode-react-box
description: '@cronocode/react-box expert — runtime CSS-in-JS library. Use when working with react-box Box component, CSS props, Flex/Grid/Button/Dropdown/DataGrid components, Box.extend(), Box.components(), or theme system. Also handles installation, updates, and package manager detection.'
---

# @cronocode/react-box AI Skill

Runtime CSS-in-JS library. `Box` accepts 165 CSS props → generates CSS classes at runtime. Same values share a class.

## Installation & Package Management

Detect package manager via lock files: `pnpm-lock.yaml` → pnpm, `yarn.lock` → yarn, `bun.lockb` → bun, else npm.

| Manager | Install                            | Update                              |
| ------- | ---------------------------------- | ----------------------------------- |
| npm     | `npm install @cronocode/react-box` | `npm update @cronocode/react-box`   |
| yarn    | `yarn add @cronocode/react-box`    | `yarn upgrade @cronocode/react-box` |
| pnpm    | `pnpm add @cronocode/react-box`    | `pnpm update @cronocode/react-box`  |
| bun     | `bun add @cronocode/react-box`     | `bun update @cronocode/react-box`   |

Check latest: `npm view @cronocode/react-box version`

## Critical Rules

1. **NEVER `style={{ }}`** — use Box props. Missing prop? `Box.extend()`. `style` is top-level only — never inside breakpoints/pseudo-classes/theme
2. **NEVER `<Box tag="...">`** for common elements — use `<Button>`, `<Link>`, `<H1>`, `<P>`, `<Nav>`, etc.
3. **NEVER `<Box display="flex/grid">`** — use `<Flex>` / `<Grid>`
4. **HTML attrs in `props`**: `<Link props={{ href: '/about' }}>` not `<Link href>` — `data-*`/`aria-*` too (a top-level `data-state` typechecks and is dropped)

## Numeric Value Formatters

| Category                                                | Divider | Example → CSS                                      |
| ------------------------------------------------------- | ------- | -------------------------------------------------- |
| Spacing (`p`,`m`,`gap`,`px`,`py`…)                      | 4       | `p={4}` → 1rem (16px)                              |
| fontSize                                                | **16**  | `fontSize={14}` → 0.875rem (14px)                  |
| width/height/min/max (numeric)                          | 4       | `width={20}` → 5rem (80px)                         |
| Border (`b`,`bx`,`by`…)                                 | px      | `b={1}` → 1px                                      |
| borderRadius                                            | 4       | `borderRadius={2}` → 0.5rem (8px)                  |
| lineHeight / letterSpacing                              | px      | `lineHeight={24}` → 24px                           |
| SVG lengths (`strokeWidth`,`strokeDasharray`,`r`,`cx`…) | none    | `strokeWidth={2}` → `stroke-width: 2` (user units) |
| Times (`animationDuration`,`transitionDelay`…)          | none    | `animationDuration={1100}` → `1100ms`              |

## Component Shortcuts

| Instead of…                          | Use                                    | Import                                                           |
| ------------------------------------ | -------------------------------------- | ---------------------------------------------------------------- |
| `<Box display="flex/grid">`          | `<Flex>`/`<Grid>`                      | `components/flex`, `components/grid`                             |
| `<Box tag="button/input/textarea">`  | `<Button>`/`<Textbox>`/`<Textarea>`    | `components/button`, `components/textbox`, `components/textarea` |
| `<Box tag="a/img/label">`            | `<Link>`/`<Img>`/`<Label>`             | `components/semantics`                                           |
| `<Box tag="h1..h6/p/span">`          | `<H1>..<H6>`/`<P>`/`<Span>`            | `components/semantics`                                           |
| `<Box tag="ul/ol/li">`               | `<Ul>`/`<Ol>`/`<Li>`                   | `components/semantics`                                           |
| `<Box tag="nav/header/footer/main">` | `<Nav>`/`<Header>`/`<Footer>`/`<Main>` | `components/semantics`                                           |
| `<Box tag="section/article/aside">`  | `<Section>`/`<Article>`/`<Aside>`      | `components/semantics`                                           |
| `<Box tag="form">`                   | `<Form>`                               | `components/form`                                                |
| `<Box tag="svg/path/circle/rect">`   | `<Svg>`/`<Path>`/`<Circle>`/`<Rect>`   | `components/svg`                                                 |
| a lucide/Tabler icon, styled         | `<Icon>`                               | `components/icon`                                                |
| a sparkline, ring, gauge or donut    | `<Sparkline>`/`<ProgressRing>`/…       | `components/chart`                                               |
| a themed Recharts (or any) chart     | `<ChartContainer>`                     | `components/chart`                                               |

Also: `Mark`, `Figure`, `Figcaption`, `Details`, `Summary`, `Menu`, `Time`. All from `@cronocode/react-box/components/...`.

`<Form<T> onSubmit={(values, e) => …}>` reads its own named fields on submit (after `preventDefault()`): a value per
named input, a boolean for a lone checkbox/radio, an array for a repeated name, and `name="a.b"` nests. `T` is the shape you
expect, not a check against the fields.

## Props

**Spacing**: `p`/`px`/`py`/`pt`/`pr`/`pb`/`pl`, `m`/`mx`/`my`/`mt`/`mr`/`mb`/`ml`, `gap`
**Layout**: `display`, `d` (flex-direction), `wrap`, `ai` (align-items), `jc` (justify-content), `flex`/`grow`/`shrink`, `container`/`containerName`/`containerType` (a query container — see `cq`)
**Sizing**: `width`/`height` — number (÷4=rem), `'auto'`, `'fit'` (100%), `'fit-screen'` (100vw/vh), fractions (`'1/2'`…), `'33%'`. `minWidth`/`maxWidth`/`minHeight`/`maxHeight` same. All accept `"5%"`.
**Colors**: `bgColor`/`color`/`borderColor`/`outlineColor`/`fill`/`stroke` — Tailwind's OKLCH palette, 26 families × 11 steps `'50'`..`'950'` (slate/gray/zinc/neutral/stone/mauve/mist/olive/taupe/red/orange/amber/yellow/lime/green/emerald/teal/cyan/sky/blue/indigo/violet/purple/fuchsia/pink/rose), plus `'white'`/`'black'`/`'transparent'`/`'currentColor'`. **Opacity modifier on any colour value**: `bgColor="blue-500/40"` → `color-mix(in oklab, var(--blue-500) 40%, transparent)` — the mix wraps the *variable*, so it stays themed and shared; unlike `opacity` it fades one declaration, not the element. Works in `vars` and on a `Box.extend()` variable (`"brand/30"`); an unknown token or a percentage outside 0–100 emits nothing
**Borders**: `b`/`bx`/`by`/`bt`/`br`/`bb`/`bl` (px), `borderRadius` (÷4), `borderStyle`
**Text**: `fontSize` (÷16), `fontWeight`, `lineHeight` (px), `textAlign`/`textDecoration`/`textTransform`/`whiteSpace`/`textOverflow`, `textWrap`
**Position**: `position`, `top`/`right`/`bottom`/`left`/`inset`, `zIndex`
**SVG paint & stroke**: `fill`/`stroke` (a colour variable, or a reference CSS resolves itself — `url(#sky)` for a gradient, pattern or `<ClipPath>`, `var(--chart-1)` for somebody else's variable; `clipPath` takes `url(#…)` the same way, and anything else emits no rule at all), `fillOpacity`/`strokeOpacity` (0–1 in tenths), `fillRule`, `strokeWidth`/`strokeDasharray`/`strokeDashoffset`/`strokeMiterlimit` (**user units — no divider**; a dash pattern with a gap is a string, `"12 4"`), `strokeLinecap`, `strokeLinejoin`, `paintOrder`, `vectorEffect`, `shapeRendering`. All inherited except `vectorEffect`, so set them on the `<svg>` (`Svg`) rather than on every shape.

**SVG text**: `textAnchor` (`start`/`middle`/`end` — which part of a label sits on its `x`) and `dominantBaseline` (`alphabetic`/`central`/`hanging`/… — which part sits on its `y`). `textAnchor` is inherited; `dominantBaseline` is not, so like `vectorEffect` its rule targets the element _and_ its descendants and still works on the `<svg>`.

**SVG geometry** (SVG 2, all **user units — no divider**, or a percentage): `cx`/`cy` (`<circle>`, `<ellipse>`), `r` (`<circle>`), `rx`/`ry` (`<ellipse>` radii, `<rect>` corners; also `auto`), `x`/`y` (`<rect>`, `<image>`, `<use>`, `<foreignObject>`, nested `<svg>` — **not** `<text>`). They are real CSS, so they transition: `<Circle r={38} hover={{ r: 40 }} />` is a whole animation. Not inherited — put them on the shape. A `<rect>`'s `width`/`height` are NOT in this family (those prop names are the ÷4 layout scale), which is why `<Rect>` claims them back as its own attributes — `<Rect width={40} height={40} />`. A path's `d` stays an attribute too (no Safari support), and `<Path d="M…" />` is how you write it.

**SVG elements** (`@cronocode/react-box/components/svg`, 20 components, server-safe): `Svg`, `G`, `Defs`, `Path`, `Circle`, `Ellipse`, `Rect`, `Line`, `Polyline`, `Polygon`, `SvgText`, `TSpan`, `LinearGradient`, `RadialGradient`, `Stop`, `ClipPath`, `Mask`, `Use`, `SvgSymbol`, `Marker` — so a drawing never writes `tag`. Each one is a Box and takes every prop above. **Each also settles the names SVG and Box both use, for its own element**: `Path`'s `d` is path data, `Rect`'s `width`/`height` are user units, `SvgText`/`TSpan`'s `x`/`y`/`dx`/`dy` are attributes (CSS geometry does not apply to text), `RadialGradient`'s `cx`/`cy`/`r` are attributes (nor to a gradient) — while `Circle`'s `cx` stays CSS and transitions. `transform` is a prop on every shape and group. `Svg` takes `viewBox`/`preserveAspectRatio`/`width`/`height` as attributes (so no ÷4 layout `width` on it) and a `label` prop: no label means `aria-hidden`, a label means `role="img"` with that name. A paint server is a value, not an attribute: `fill="url(#sky)"`, `clipPath="url(#frame)"` — themed and hoverable like any other paint. A themed gradient stop is `<Stop stopColor="currentColor" color="amber-300" />`. `BaseSvg` is deprecated — it is `Svg` with a 24×24 preset.

**Icons** (`@cronocode/react-box/components/icon`, server-safe): `<Icon size={5} color="amber-500" label="Sunny"><Sun /></Icon>` — Box props on an icon somebody else drew, wrapping exactly one element from lucide, Tabler, react-icons, or a raw `<svg>`. It resolves the props to a class and puts that on the icon's own `<svg>`, so it knows no set's API: `size` is the ÷4 scale (`size={6}` is 24px, the default; an icon set's own `size` counts in pixels, so `size={20}` becomes `size={5}`) and it lands in the _class_, where a CSS declaration outranks the `width`/`height` attributes the set writes for itself. `strokeWidth` is likewise the ordinary Box prop, so it can change on hover or at a breakpoint. No `label` means `aria-hidden`, a `label` means `role="img"` — the same rule `Svg` follows. **Prefer `Svg` over wrapping one in `Icon`**: `Svg` takes these props directly. (Wrapping works — `Icon` asks the child which convention it follows and routes `role`/`aria-label` into `props` for a component of ours — but it is a layer nobody needs.) The hook underneath is public — `useClassNames(props)` from the main entry returns `{ className, styles }` for anything Box cannot render (a `motion.div`, a `NavLink`); render `styles` beside the element (it is defined in element mode only). **Beyond lucide**: Iconify's 300k+ icons in 200+ sets reach the same `<Icon>`, the choice being only when the icon becomes markup — paste one icon's SVG (no dependency, server-renders); `unplugin-icons` for a set at build time (`npm i -D unplugin-icons @iconify-json/<set> @svgr/core @svgr/plugin-jsx`, plugin with `{ compiler: 'jsx', jsx: 'react' }`, `/// <reference types="unplugin-icons/types/react" />` in a `.d.ts`, then `import SiGithub from '~icons/simple-icons/github'`); or `@iconify/react` when the name is data — it fetches in the browser, so it is a client component and the server sends no icon. Turbopack runs no unplugin: under Next.js 16 the build-time recipe needs `next build --webpack`.

**Charts** (`@cronocode/react-box/components/chart`, server-safe): `Sparkline`, `ProgressRing`, `Gauge`, `MiniDonut` — micro-primitives over the SVG components, **not a chart library** (no axes, no legends, no data transformations; theme Recharts for that). Each is an `Svg`, so `width`/`height` are the attributes, the paint is inherited by the shapes inside (default stroke `currentColor`, so `color="sky-500"` recolours one), and every prop, pseudo-class, breakpoint and theme works. `<Sparkline data={[4, 9, 6, 12]} variant="line|area|bar" min={0} max={20} />` — it fills its box (`preserveAspectRatio="none"` + `vectorEffect="non-scaling-stroke"`, so the line stays one width thick at any size), and `min`/`max` fix the axis so a column of rows is comparable. `<ProgressRing value={0.62} thickness={10} trackOpacity={0.2} />` and `<Gauge value={0.4} sweep={270} start={225} />` (degrees clockwise from twelve o'clock; `sweep={360}` is a ring) draw the value as a dash on the arc — a style prop, so it **eases between values with no animation code**; the fraction is rounded to half a percent, because a dash length lands in a class name. `<MiniDonut data={[5, 3, 2]} colors={['sky-500', 'var(--chart-2)']} />` gives each value its share of the circle. `children` is SVG drawn after the chart (an `SvgText` in the middle, a `Defs` with a gradient); `label` names it `role="img"`, and without one it is `aria-hidden` — leave a sparkline beside its own number unnamed, name one that _is_ the data. Cheap in a grid: the shape is the `d` attribute (no CSS at all, so 10,000 rows share every rule) while the paint is a class. A DataGrid cell renderer is a component — define it outside the render.

**Theming a chart library** — `<ChartContainer>` (same entry, server-safe): the bridge for Recharts and anything
else that takes a colour. It declares `--chart-1` … `--chart-6` in both themes plus one `--color-<series>` per
series, so the chart itself names no colour at all: `series={['revenue', 'cost']}` (the palette in order) or
`series={{ revenue: 'emerald-600' }}` (your own paint), then `<Line stroke="var(--color-revenue)" />` inside. A
series name becomes part of a custom-property name, so it has to be a CSS identifier — a dot-path `dataKey` is
skipped. Overriding a slot needs no prop of its own, because the container is a Box:
`vars={{ 'chart-1': 'teal-600' }}`, `theme={{ dark: { vars: { 'chart-1': 'teal-400' } } }}`, and any other name
the chart reads (`--chart-grid`, `--chart-label` for axes) is declared the same way. The names are the ones the
ecosystem already uses, so a chart lifted from shadcn's charts works unchanged. It adds no role and no ARIA.

**Custom properties**: `vars` — the one prop whose declaration _names_ come from its value.
`vars={{ 'color-revenue': 'sky-500', 'chart-gap': '4px' }}` declares `--color-revenue: var(--sky-500)` and
`--chart-gap: 4px` on the element, inherited by everything inside it — including markup this library never
rendered (a chart library, a third-party widget). A colour token resolves to the variable behind it; every other
value is written out as it stands. Names may carry a leading `--` or not. It is an ordinary prop, so it nests in
`theme`/`hover`/a breakpoint and lands in a **class** — two subtrees declaring the same variables share one rule,
and nothing needs a `<style>` tag or an `id` to scope it. A name that is not a CSS identifier, or a value
containing `;` or a brace, is skipped (that entry only, not the whole record).

**Animation & transitions**: every Box already transitions `all` over `--transitionTime` (0.25s), which is why a `hover` colour fades
unasked. `animation` takes a preset — `'spin'`/`'pulse'`/`'bounce'`/`'ping'`/`'none'`, keyframes included, durations riding
`--transitionTime` so `prefers-reduced-motion` stops them for free. Longhands (declared after it, so they win): `animationName`,
`animationDuration`/`animationDelay` (**milliseconds, no divider** — `animationDuration={1100}`), `animationIterationCount` (number or
`'infinite'`), `animationDirection`, `animationFillMode`, `animationPlayState`, `animationTimingFunction`. Name a duration in ms and you
own reduced motion: add `motionReduce={{ animationName: 'none' }}`. `transition` narrows what transitions to a group — `'colors'`,
`'opacity'`, `'shadow'`, `'transform'`, `'size'`, `'filter'` (or `'all'`/`'none'`) — with `transitionDuration`/`transitionDelay` in ms and
`transitionTimingFunction` taking the keywords plus computed curves (`'cubic-bezier(0.4, 0, 0.6, 1)'`, `'steps(4, end)'`,
`'linear(0, 0.5, 1)'`; a typo emits no rule). **Springs** are four sampled curves — `'spring'` (540ms), `'spring-gentle'` (660ms),
`'spring-bouncy'` (880ms, 20% overshoot), `'spring-snappy'` (420ms) — and a spring is a curve _and_ a settling time, so name it on both
props: `<Box transition="transform" transitionTimingFunction="spring-bouncy" transitionDuration="spring-bouncy" hover={{ scale: 1.1 }} />`.
The durations ride `--transitionTime`, so reduced motion stops a spring too; `Box.spring({ stiffness, damping, mass, velocity })` returns
`{ easing, duration }` for one of your own. The curve is fixed once sampled (an interrupted transition restarts rather than carrying its
velocity — that is framer-motion's job), and every `linear()` is written with an `ease-out` under it for the ~13% of browsers without it. **`Box.keyframes()`** registers sequences whose steps are Box props —
`Box.keyframes({ 'slide-in': { from: { opacity: 0, translateY: 3 }, to: { opacity: 1, translateY: 0 } } })`, stops keyed `'from'`/`'to'`/`'50%'`
— written into the stylesheet the first time a rule names one, and exactly once, so an unused sequence costs nothing; it reaches
`getStyles()` and element mode, so a Server Component animates with no client JS. **Transforms compose**: `translateX`/`translateY` (÷4,
fractions, percentages) both feed one `translate` and still transition _and_ animate (the base stylesheet registers both axes with
`@property`, or a keyframe moving them would jump), `rotate={45}` (degrees) and `scale={1.05}` (unitless) are their own
properties — only `flip` and `scale` collide, both writing `scale`. **`startingStyle` is an entrance with no JavaScript**: a nested block of
plain props (`startingStyle={{ opacity: 0, translateY: 2 }}`) saying what they start from the first time the element is styled — mounted, or
shown from `display: none`. It compiles to `@starting-style`, nests inside a breakpoint/pseudo-class/theme rather than around one
(`md: { startingStyle: … }`), and a browser without the at-rule shows the element finished. Its declarations are emitted `!important` — a
starting rule at `.x` would otherwise lose on specificity to the value it starts from at `.dark .x` or `.x[data-state="open"]` and nothing
would transition at all; the importance reaches nothing but the before-change style. `Tooltip` and the `Dropdown` popup already carry
one. For the way back out React unmounts too fast to animate, so either hide instead — `transitionBehavior="allow-discrete"` lets `display`
transition, flipping it at the _end_, so `<Box display={open ? 'block' : 'none'} opacity={open ? 1 : 0} transitionBehavior="allow-discrete"
startingStyle={{ opacity: 0 }} />` animates both directions — or hold the node with **`<Presence present>`**
(`components/presence`): a render prop handed `{ present, state, ref, props }` that keeps rendering its child with `present: false` until the
child's own CSS says the transition is over, then lets React remove it. `ref` goes on the element carrying the transition (its computed
`transition-duration`/`animation-duration` _is_ the wait — not a `transitionend` listener, which fires once per property), `props` is
`{ 'data-state': 'open' | 'closed' }`. Under `prefers-reduced-motion` the measured wait is `0` and the node leaves in the same commit.
`Tooltip`, the `Dropdown` popup and the DataGrid column menu are built on it. `interpolateSize="allow-keywords"` on a container is what makes
`height: auto` animate inside it (inherited; Chromium-only, elsewhere it snaps). `Box.configure({ transition: 'colors' | false })` changes
what the base class transitions, before the first render.

**Gradients**: `bgGradient` — a gradient as a *value*, written as a record, so its stops are palette tokens and it is
themed, takes the opacity modifier and shares one class. The key names the kind and carries its geometry:
`{ linear: 'r', colors: ['blue-500', 'pink-500'] }` (a direction `t`/`tr`/`r`/`br`/`b`/`bl`/`l`/`tl`, or a number of
degrees — `{ linear: 135, … }`), `{ radial: 'circle' | 'ellipse' | true, at: 'top left', … }`, `{ conic: 45 | true, … }`.
Exactly one kind; `at` centres a radial or conic gradient, never a linear one. A stop is any colour value —
`'blue-500/40'`, `'transparent'`, `'var(--chart-1)'` — or a `[colour, position]` pair (`['sky-500', '20%']`), **two
minimum**. `interpolate` names the space: `'srgb'`, `'hsl'`, `'oklab'`, `'oklch'`, `'hsl-longer'`, `'oklch-longer'` —
`'oklch'` is what keeps two stops out of the grey middle sRGB drags them through, and a `-longer` hue turns two stops
into a spectrum. The record is judged **whole**: one unknown stop, one misspelt key (`interpolat`), two kinds at once,
and the value emits no rule and no class name. It writes `background-image`, so `bgGradient` and `bgImage` are the
same property — use one.

**Shadows stack, four at a time**: `box-shadow` is one property, so each layer sets its own custom property and all
four write the same composed declaration — a ring and an elevation coexist instead of the last rule winning.
`shadow`: `'xxs'`/`'xs'`/`'sm'`/`'md'`/`'lg'`/`'xl'`/`'xxl'` on Tailwind's elevation scale, plus the three original presets
`'small'`/`'medium'`/`'large'` (which carry their own colour), plus `'none'`. `insetShadow`: `'xxs'`/`'xs'`/`'sm'`, drawn
inside the border box. `ring`/`insetRing` are a **width in px**, not a scale — `ring={2}` — and unlike `outline` a ring
joins the stack, follows `borderRadius` and costs no layout. Each layer takes a colour of its own: `shadowColor`,
`insetShadowColor`, `ringColor` (`currentColor` by default), `insetRingColor` — every colour value, modifier included
(`shadowColor="blue-500/40"`). A colour prop **shows nothing on its own**, the way `borderColor` does with no border
width. `'none'` — or `0` on a ring — clears just that layer. `textShadow` (`'xxs'`…`'lg'`, `'none'`) with
`textShadowColor` is the text-side pair, and `transition="shadow"` covers `box-shadow` and `text-shadow` both.

**Effects**: `opacity`, `cursor`, `pointerEvents`, `userSelect`, `overflow`

## Pseudo-Classes, Breakpoints, State Variants & Container Queries

```tsx
<Box bgColor="blue-500" hover={{ bgColor: 'blue-600' }} disabled={{ opacity: 0.5 }} />
// Pseudo: hover, focus (:focus-within), focusVisible, hasFocus, active, valid, invalid, optional,
//   disabled, checked, indeterminate, required, selected, hasChecked, hasRequired, hasDisabled
// Responsive (mobile-first): sm(640) md(768) lg(1024) xl(1280) xxl(1536)
<Box p={2} md={{ p: 4, hover: { bgColor: 'gray-200' } }} />
// A11y preferences, same shape as a breakpoint, and they beat every breakpoint in the cascade:
//   motionReduce (prefers-reduced-motion: reduce), forcedColors (forced-colors: active),
//   contrastMore (prefers-contrast: more). Not nestable in a breakpoint or in each other.
// Reduced motion is already the default — the preference sets --transitionTime to 0s, so every
// Box stops animating. Declare motionReduce only to replace a movement or keep a safe one.
<Box transitionDuration={150} motionReduce={{ transition: 'none' }} forcedColors={{ b: 1 }} />
// Forced colours keep only the system colours, so they are values on every colour prop: Canvas,
// CanvasText, ButtonFace, ButtonText, Highlight, HighlightText, GrayText, LinkText (keywords, not tokens).
<Box forcedColors={{ bgColor: 'ButtonFace', color: 'ButtonText' }} />
// State variants — a selector fragment on the element's own class, so a state your code sets is CSS,
// not a ternary. Record key = the selector; a key the grammar rejects drops its block, like a bad value.
//   dataAttr {'state=open'} → [data-state="open"], {'loading'} → [data-loading]
//   ariaAttr {'selected'} → [aria-selected="true"] (bare key means ="true"), {'sort=ascending'}
//   has {':checked'} → :has(:checked)   ·   not {hover} → :not(:hover), keyed by pseudo name
// The attribute itself still goes in `props`. Everything else nests around them, either direction.
<Box props={{ 'data-state': state }} dataAttr={{ 'state=busy': { bgColor: 'amber-500' } }}
  md={{ hover: { ariaAttr: { selected: { color: 'white' } } } }} />
// Pseudo-elements — CSS allows ONE per selector, so it is a slot: a second nested one is a type error,
// and it lands last on the element's own compound (on the target, not on a group's ancestor).
//   before, after (both come with content: '' — a generated element with none renders nothing),
//   placeholder, selection, marker, firstLine, firstLetter, backdrop, fileButton
//   marker/selection also name descendants, so they go on the <Ul> or the <P>
// content: 'empty' → ''  ·  'New' → "New" (text is quoted for you)  ·  'attr(data-x)'/'counter(s)'/
//   'url(...)'/'var(--x)'/'"Step " counter(step)' written out as CSS  ·  'none' turns it off.
//   A value that cannot be quoted or parsed produces no rule and no class name.
<Box position="relative" before={{ position: 'absolute', inset: 0, bgColor: 'indigo-500' }}
  hover={{ before: { width: 'fit' } }} after={{ content: 'attr(data-count)' }} />
// On Textbox/Textarea the name means both: a string is the attribute, an object the styles; both at
// once puts the text in `props`. `placeholderStyles` is the old name for `placeholder` and still works.
<Textbox props={{ placeholder: 'Search…' }} placeholder={{ color: 'slate-400' }} />
// Container queries — the same question, asked of the element's own container. `container` makes one
// (true → container-type: inline-size; a name → container: <name> / inline-size), containerName and
// containerType ('inline-size' | 'size' | 'normal') are the longhands. `cq` queries the NEAREST one,
// keyed by size: xs(20rem) sm(24) md(28) lg(32) xl(36) xxl(42), each with a complement maxXs…maxXxl
// (`not (min-width: …)`, so md and maxMd never both match), and `'name/md'` for a named container.
// Ranked after every breakpoint and before every preference; one at-rule block per rule, so cq and a
// breakpoint do not nest in each other. A name that is not a CSS ident drops its block.
<Flex container="card">
  <Box cq={{ sm: { d: 'row' }, maxSm: { display: 'none' }, 'card/xl': { p: 6 } }} />
</Flex>
```

## Theme System

```tsx
<Box.Theme>                            {/* auto-detect system */}
<Box.Theme theme="dark" use="global">  {/* explicit + applies to <html> */}
<Box.Theme storageKey="app-theme">     {/* persists to localStorage */}
// Hook: const [theme, setTheme] = Box.useTheme();
// setTheme('dark') | setTheme(null) resets to auto
<Box bgColor="white" theme={{ dark: { bgColor: 'gray-900', hover: { bgColor: 'gray-700' } } }} />
// App-wide styles on <html> (only with use="global"). Use for inheritable CSS (scrollbarColor, fontFamily, color):
<Box.Theme use="global" globalStyles={{ scrollbarColor: ['violet-500','transparent'],
  theme: { dark: { scrollbarColor: ['violet-700','gray-900'] } } }} />
```

**Props**: `theme?` (string), `use?` (`'global'`|`'local'`), `storageKey?`, `globalStyles?` (BoxStyleProps — `<html>`, requires `use="global"`). Sets `data-theme` attr + class.

## Component System

```tsx
<Box component="card" variant="bordered">
  <Box component="card.header">Title</Box>
</Box>;

export const components = Box.components({
  card: {
    styles: { display: 'flex', d: 'column', p: 4, bgColor: 'white', borderRadius: 8, shadow: 'medium' },
    variants: { bordered: { b: 1, borderColor: 'gray-200', shadow: 'none' } },
    children: { header: { styles: { fontSize: 18, fontWeight: 600 } } },
  },
  subgrid: { extends: 'datagrid', styles: { b: 0, shadow: 'none' } },
});
```

## Extension System

```tsx
export const { extendedProps, extendedPropTypes } = Box.extend(
  { 'brand-primary': '#ff6600' }, // CSS variables
  { aspectRatio: [{ values: ['16/9'] as const, styleName: 'aspect-ratio', valueFormat: (v) => v }] }, // New props
  {
    bgColor: [
      {
        values: ['brand-primary'] as const,
        styleName: 'background-color', // Extend existing
        valueFormat: (v, getVar) => getVar(v),
      },
    ],
  },
);
// TypeScript: declare module '@cronocode/react-box/types' { namespace Augmented {
//   interface BoxProps extends ExtractBoxStyles<typeof extendedProps> {}
//   interface BoxPropTypes extends ExtractBoxStyles<typeof extendedPropTypes> {}
//   interface ComponentsTypes extends ExtractComponentsAndVariants<typeof components> {} }}
```

## Dropdown

The APG combobox — select-only by default, the editable one with `isSearchable`. **Always pass `label`** (or your own `aria-label` via `props`) — a combobox is
not named by its content, so without one it has no accessible name. Never add `role="combobox"`/`role="option"`
by hand; the component supplies the whole pattern.

```tsx
import Dropdown from '@cronocode/react-box/components/dropdown';
<Dropdown<string> label="Fruit" defaultValue="a" onChange={(value, values) => {}}>
  <Dropdown.Unselect>Pick...</Dropdown.Unselect>
  <Dropdown.Item value="a">Alpha</Dropdown.Item>
</Dropdown>;
// Multiple: <Dropdown label="Fruit" multiple showCheckbox isSearchable searchPlaceholder="Search...">
//   <Dropdown.SelectAll>All</Dropdown.SelectAll> <Dropdown.EmptyItem>No results</Dropdown.EmptyItem>
//   <Dropdown.Display>{(values) => `${values.length} selected`}</Dropdown.Display>
```

**Props**: `label`/`labelProps`, `value`/`defaultValue`, `multiple`, `isSearchable`, `searchPlaceholder`, `hideIcon`, `showCheckbox`, `name`, `onChange`, `itemsProps`, `iconProps`, `variant` (propagates to children). All BoxProps.
**Sub-components**: `Item<T>` (requires `value`; `disabled` is skipped by the arrows), `Unselect`, `SelectAll`, `EmptyItem`, `Display` (static or `(values, isOpen) => ReactNode`).
**Keyboard (select-only)**: closed — Down/Up/Enter/Space/Home/End open, a printable character opens at the first match. Open — arrows move, Home/End jump, typing searches, Enter/Space choose, Escape closes unchanged, Tab chooses then leaves. DOM focus stays on the trigger throughout (`aria-activedescendant`).
**Keyboard (`isSearchable`)**: the `<input>` is the combobox, so printable keys type (no typeahead), Space types a space, Home/End and Left/Right move the caret and drop the highlight, only Down/Up reach the listbox, Enter chooses the highlighted option, and Escape closes before a second Escape clears the field. The field shows the selection as its value, unless a `Dropdown.Display` is drawing it.
**Style tree**: `dropdown` > `items`, `item` (variants: compact, multiple, highlighted), `unselect`, `selectAll`, `emptyItem`, `icon`.

## Select

Data-driven dropdown — `data` + `def` instead of children. Shares `dropdown.*` style tree.

```tsx
import Select from '@cronocode/react-box/components/select';
<Select<User, number>
  label="User"
  data={users}
  def={{ valueKey: 'id', displayKey: 'name', placeholder: 'Pick...' }}
  value={selected}
  onChange={(value) => setSelected(value!)}
/>;
```

**SelectDef**: `valueKey` (required), `displayKey`, `display` (`(row) => ReactNode`), `selectedDisplay` (`(rows, isOpen) => ReactNode`), `placeholder`, `selectAllText`, `emptyText`.
Also: `data`, `label`/`labelProps`, `value`/`defaultValue`, `multiple`, `isSearchable`, `searchPlaceholder`, `showCheckbox`, `hideIcon`, `name`, `onChange`, `itemsProps`, `iconProps`, `variant`, BoxProps. Same combobox pattern as Dropdown — including needing a name, and `isSearchable` switching it to the editable one.

## DataGrid

```tsx
import DataGrid from '@cronocode/react-box/components/dataGrid';
<DataGrid
  data={users}
  def={{
    rowKey: 'id',
    topBar: true,
    bottomBar: true,
    globalFilter: true,
    rowSelection: { pinned: true },
    showRowNumber: { pinned: true },
    rowHeight: 40,
    visibleRowsCount: 15,
    columns: [
      { key: 'name', header: 'Name', filterable: true },
      { key: 'age', header: 'Age', width: 80, align: 'right', filterable: { type: 'number' } },
      { key: 'status', header: 'Status', filterable: { type: 'multiselect' } },
      { key: 'country', header: 'Country', pin: 'RIGHT' },
      {
        key: 'actions',
        header: '',
        width: 80,
        sortable: false,
        contextMenu: false,
        Cell: ({ cell }) => <Button onClick={() => edit(cell.row.data)}>Edit</Button>,
      },
    ],
    rowDetail: { content: (row) => <Details row={row} />, expandOnRowClick: true, expandColumnHeader: 'Details' },
    contextMenu: { sort: true, pin: true, group: false },
    resizerStyle: 'hover',
  }}
  onSelectionChange={(e) => console.log(e.selectedRowKeys)}
/>;
```

**DataGridProps**: `data`, `def`, `component` (default `'datagrid'`), `loading`, `filters` (predicate[]), `page`/`onPageChange`, `onSortChange`, `onServerStateChange` (`{ page, pageSize, sortColumn, sortDirection, columnFilters, globalFilterValue }`), `onSelectionChange` (`{ action, selectedRowKeys, affectedRowKeys, isAllSelected }`), `expandedRowKeys`/`onExpandedRowKeysChange`, `globalFilterValue`/`onGlobalFilterChange`, `columnFilters`/`onColumnFiltersChange`.

**GridDefinition**: `columns` (required), `rowKey`, `rowHeight` (px, default 48), `visibleRowsCount` (number/`'all'`), `showRowNumber` (bool/`{ pinned?, width? }`), `rowSelection` (bool/`{ pinned? }`), `rowDetail` (`{ content, height?, expandOnRowClick?, pinned?, expandColumnWidth?, expandColumnHeader? }`), `pagination` (`{ totalCount, pageSize? }`), `topBar`/`bottomBar`, `title`/`topBarContent`, `globalFilter`, `globalFilterKeys`, `sortable`/`resizable` (default true), `contextMenu` (bool/`{ sort?, pin?, group? }`, default true), `resizerStyle` (`'visible'`/`'hover'`/`'hidden'`), `noDataComponent`.

**ColumnType**: `key`, `header`, `width` (px, default 200), `align`, `pin` (`'LEFT'`/`'RIGHT'`), `columns` (grouped headers), `Cell` (`({ cell }) => ReactNode`), `sortable`/`resizable` (override grid), `flexible`, `filterable` (`true`=text, `{ type: 'number' }`, `{ type: 'multiselect' }`), `contextMenu` (override grid).

**Server-side**: `def={{ pagination: { totalCount }, bottomBar: true }}` + `page={page}` + `onServerStateChange={fetchData}`.

**Accessibility (A7, A10)**: the APG grid pattern, over a virtualized body — supplied whole, so add no roles and no `tabIndex`. The scrolling element is `role="grid"` (header and body are `rowgroup`s, rows `role="row"`, cells `role="gridcell"`/`columnheader`, scroll spacers `presentation`). `aria-rowcount`/`-colcount` describe the _whole_ grid and `aria-rowindex`/`-colindex` place each rendered cell in it, header rows first. Also `aria-sort` on sortable headers, `aria-selected` on rows only with `rowSelection`, `aria-busy` while `loading`, `aria-expanded` on group and expanded rows, and a live region announcing the selection count. Keyboard: one cell in the tab order; arrows move it, Home/End along the row, Ctrl+Home/End to the corners (scrolling to unrendered rows), PageUp/Down by a screenful, Enter/Space sorts a header or steps into the cell’s control, F2 always steps in, Escape steps back out. Down/Up keep the _column_ rather than the cell ordinal, so they land under where they started even through a grouped header. The column resizer is APG's window splitter — `role="separator"` with `aria-valuenow`/`-valuemin`/`-valuemax` in pixels; Tab or F2 reaches it, the arrows move it 16px, Home/End go to the narrowest the grid allows and to the grid's own width. Every control the grid draws names itself after what it acts on ("Select row 4", "Column options for Age"); the column menu is the APG menu button. **Give it `def.title`** — a grid is not named by its rows. Known gap: Tab does not yet stay inside the grid.

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
**SSR**: `import { getStyles, resetStyles } from '@cronocode/react-box/ssg'` — render, read `getStyles()` into `<style id="crono-styles">`, then `resetStyles()`. Needs no DOM.
**Server Components (React 19)**: works with no `'use client'` and no setup — the `react-server` entry renders Box hook-free and its CSS ships as `<style href precedence>` elements React hoists into `<head>`. Client components in the same app: `Box.configure({ sink: 'element' })` once in a `'use client'` module. Hook-free components (`Flex`, `Grid`, `Button`, `Textbox`, `Textarea`, `RadioButton`, `Icon`, the SVG elements, semantic tags) render on the server too — import them straight into a Server Component; `Dropdown`/`Tooltip`/`Overlay`/`DataGrid`/`Checkbox`/`Switch`/`RadioGroup`/`Select`/`Form` ship a `'use client'` banner, so importing one just opens a client boundary. Client-only: hover-callback children, `Box.Theme` — but `theme={{ dark: {...} }}` styles work server-side (set the theme class on `<html>`). Element-mode rules are in `@layer`, so your own unlayered CSS wins. React 18: keep the default sink.
**Accessible behaviour** (`@cronocode/react-box/a11y`, 2.2 KB gz, client-only): `useControllableState` (controlled/uncontrolled with `onChange(value, { reason, event })` — `'escape'`, `'outside-pointer'`, yours), `useDismiss({ enabled, inside: [triggerRef, popupRef], onDismiss })` (Escape reaches the innermost layer only; pass the trigger or it dismisses and reopens in one press), `useFocusReturn({ enabled, returnTo })`, `useRovingFocus({ count, orientation, textOf, onSelect })` → `{ activeIndex, onKeyDown, itemProps(i), activeItem() }` (arrows, Home/End, typeahead, disabled skipped; `focusItems: false` for `aria-activedescendant`), `useIdentifier('select')` (React's `useId`, usable as a selector). They supply mechanics, never roles or ARIA. `VisuallyHidden` (`@cronocode/react-box/components/visuallyHidden`) is a Box that clips itself away instead of hiding, so it stays in the accessibility tree — and it renders on a server.
**Config**: `Box.configure({ sink: 'cssom' | 'textContent' | 'string' | 'element', classNames: 'hashed' | 'readable' | 'stable' })` — before the first render.
**Portals**: `Overlay` (`components/overlay`) renders children into `#crono-box` at the place it is declared — escapes `overflow: hidden` and clipped ancestors, no ARIA and no open state.
**Form controls** (`components/checkbox`, `components/switch`, `components/radioGroup`, `components/radioButton`): real native inputs, so focus, the checked state and form submission come from the platform. `label` is the prop that matters — it renders the text inside a `<label>` wrapping the input, so there is no `htmlFor`/`id` pair and the whole row is clickable; `labelProps` styles that label, every other Box prop styles the control. `<Checkbox label="Accept the terms" name="terms" />`, `<Checkbox label="Select all" indeterminate />` (sets the DOM property **and** `aria-checked="mixed"`), `<Switch label="Email notifications" name="notify" />` (`role="switch"`; Space and Enter both toggle, Enter does not submit the form). `<RadioGroup label="Plan" name="plan" defaultValue="free" onChange={(v, { reason }) => …}>` with `<RadioGroup.Item value="free" label="Free" />` children: `role="radiogroup"` named by the label, one shared `name` (generated if omitted), `orientation` `vertical`|`horizontal`, arrows move **and** select with wrapping and disabled items skipped, and Tab enters/leaves the set once — the platform's own tab order is left alone. `RadioButton` alone is a plain radio and still renders on a server. `checked`/`disabled`/`indeterminate` are each a state _and_ a pseudo-class style prop: pass a boolean, or `[state, styles]` for both.
**Tooltip** (`components/tooltip`): the APG pattern on that layer. `<Tooltip content="Deletes the row">{(trigger) => <Button {...trigger}>Delete</Button>}</Tooltip>` — the child is a render prop because `aria-describedby` has to land on the control itself; the bag is `{ ref, props }`, so one spread on a Box component, or `<button ref={trigger.ref} {...trigger.props}>` on a plain one. The `ref` is what positions the bubble under the trigger. Gives you `role="tooltip"`, the describedby wiring while open, hover **and** focus opening (`openDelay` 300 ms, focus ignores it), Escape with focus left in place, and WCAG 1.4.13: the pointer can travel onto the bubble (`closeDelay` 150 ms) and nothing hides it on a timer. `open`/`defaultOpen`/`onOpenChange(open, { reason })` with reasons `hover`|`focus`|`pointer-leave`|`blur`|`escape`; other Box props style the bubble.
