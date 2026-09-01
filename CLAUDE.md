# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

@cronocode/react-box is a React runtime CSS-in-JS library. The core `Box` component accepts 150 CSS props and generates CSS classes at runtime — no CSS files needed. Same prop values across components share a single CSS class.

## Commands

| Command                                    | Purpose                                                                                                      |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| `npm run dev`                              | Start Vite dev server for the demo pages                                                                     |
| `npm run dev:vanilla`                      | Start the framework-free example (`examples/vanilla`) — the core engine with no React                        |
| `npm run build`                            | Build library (ESM + CJS output to dist/)                                                                    |
| `npm run build:dev`                        | Build library without minification                                                                           |
| `npm run compile`                          | TypeScript type check (no emit)                                                                              |
| `npm test`                                 | Run all tests (Vitest)                                                                                       |
| `npm run test:coverage`                    | Run all tests and enforce the coverage budget on `src/core/`                                                 |
| `npm run test:watch`                       | Run tests in watch mode                                                                                      |
| `npm run test:a11y`                        | Run the axe sweep and the APG keyboard tests only                                                            |
| `npx vitest run src/path/to/file.test.tsx` | Run a single test file                                                                                       |
| `npm run lint`                             | ESLint check                                                                                                 |
| `npm run check:boundaries`                 | Fail if the core engine imports React or the RSC entry reaches a client hook (also prints the adapter ratio) |

Node version: v24 (pinned in .nvmrc).

## Architecture

### Core Styling Engine

`src/core/**` imports **no React** — ESLint and `npm run check:boundaries` both fail if it ever does. React lives in `src/react/**` (the binding, the theme provider, the shared hooks) plus the entry modules `src/box.ts`, `src/rsc.ts` and `src/ssg.ts`. When a core module seems to need a hook, give it an injectable policy instead — that is what `flushScheduler.ts` is. See CONTRIBUTING.md, "The core boundary".

- `src/box.ts` — Main Box component (memoized, forwardRef, polymorphic via `tag` prop)
- `src/rsc.ts` — The `react-server` build of Box: same props, no hook, no effect, no DOM. Element mode is switched on when it loads, so a Server Component needs no configuration. Enforced by `scripts/check-rsc-boundary.mjs`
- `src/a11y.ts` — The behaviour primitives (`@cronocode/react-box/a11y`): `useControllableState` (change reasons), `useDismiss` (Escape + outside pointer, layered), `useFocusReturn`, `useRovingFocus` (arrows/Home/End/typeahead, DOM focus or `aria-activedescendant`), `useIdentifier`. Sources in `src/react/a11y/**`, their own `behavior` chunk so the entry pulls in no engine; client-only, so the entry gets a `'use client'` banner. See `docs/a11y-primitives.md`
- `src/core.ts` — The engine with no React at all (`@cronocode/react-box/core`): `createStyleEngine()`, `engine.classNames(props)`, `createThemeController()`. `examples/vanilla` is a whole page built on it. Both the sources it reaches and the chunks it imports are checked for React
- `src/core/boxStyles.ts` — All CSS property definitions (150 props). Types auto-generate from these definitions
- `src/core/boxStylesFormatters.ts` — Value formatters that convert prop values to CSS (rem, px, fractions, etc.)
- `src/core/engine/styleEngine.ts` — `createStyleEngine()`: all engine state (class-name cache, rule registry, identity factory, variables, prop and component registries) on an instance; generates class names and rules
- `src/core/engine/styleSink.ts` — Where the CSS goes: `cssom` (`insertRule`), `textContent`, `string` (server rendering, no DOM), or `element` (nowhere — the rules come back as `<style href precedence>` descriptors for the adapter to render). Every sink places a rule by its sort key, so they all produce the same cascade
- `src/core/hash.ts` — `stableHash()`: content-addressed identity for a rule (its `href`) and for a class name in element mode, where a counter cannot be shared between processes
- `src/core/engine/flushScheduler.ts` — _When_ pending rules reach the sink: an injectable `FlushScheduler` (microtask by default) plus `flushSync()`, so an adapter without effects still gets its CSS
- `src/core/engine/defaultEngine.ts` — The lazily-created default instance every public API delegates to
- `src/react/useStyles.ts` — The React binding: resolves class names during render, flushes from `useInsertionEffect` (ahead of every layout effect in the commit). Lives outside `src/core/` because core is React-free
- `src/react/resolveStyles.ts` — The same resolution with no hook at all, so a Server Component can render Box; `useStyles` is this plus the flush effect
- `src/react/styleElements.ts` — Descriptors → `<style href precedence>` elements (React 19 hoists and dedupes them)
- `src/react/boxProps.ts` / `src/react/boxTagProps.ts` / `src/react/boxClassNames.ts` — The prop shape, the tag-props assembly and the class-attribute assembly both Box builds share
- `src/react/effects.ts` — Which effect runs where: `useIsomorphicInsertionEffect` (the binding's flush) and `useIsomorphicLayoutEffect` (the primitives). Never hand-roll the `useInsertionEffect ?? useLayoutEffect` fallback again
- `src/utils/environment/environmentUtils.ts` — `isBrowser()`, `hasDocument()`, `documentOrNull()`, `documentRoot()`, `documentHead()`, `matchMedia()`. **Framework-free: use these instead of writing `typeof document === 'undefined'` anywhere**
- `src/utils/dom/domUtils.ts` — `elementOf()`/`htmlElementOf()` (ref or element) and `isEventInside()` (the click-outside check, composed path with a `contains` fallback)
- `src/core/variables.ts` — CSS variables (200+ Tailwind-like colors), lazy-loaded via pending variables system
- `src/core/animations.ts` — The values the animation props take that are more than a keyword: the four presets and their shorthands, the easing escape hatch (`cubic-bezier()`/`steps()`/`linear()`, a template type so the keywords keep their autocomplete), the four spring names, and the property groups `transition` accepts
- `src/core/springs.ts` — Spring physics as a value: a damped oscillator sampled into `linear()`, which both timing-function props already take, so a spring costs no runtime at all. `Box.spring({ stiffness, damping, mass, velocity })` returns `{ easing, duration }`; the four presets are the same function, sampled on first use and kept. A curve rounds to three decimals because the string lands in a class name and Node and the browser have to agree on it
- `src/core/engine/keyframes.ts` — The `@keyframes` registry behind `Box.keyframes()`: sequences whose steps are Box props, the four presets and the DataGrid sweep registered by default. Registration is free — the engine writes a sequence the first time a rule names it (`BoxStyle.keyframes` says which values name one), into the base stream, so it travels with `getStyles()` and rides the base element in element mode
- `src/core/classNames.ts` — Conditional className utility

### Numeric Value Formatters (critical)

Different props have different dividers — this is the #1 source of bugs:

- **Spacing** (`p`, `m`, `gap`, `px`, `py`, etc.): divider 4 → `p={4}` = 1rem = 16px
- **fontSize**: divider **16** → `fontSize={14}` = 0.875rem ≈ 14px
- **Border width** (`b`, `bx`, `by`): direct px → `b={1}` = 1px
- **borderRadius**: divider 4, same scale as spacing → `borderRadius={2}` = 0.5rem = 8px
- **lineHeight**: direct px → `lineHeight={24}` = 24px
- **CSS custom properties** (`vars`): the one prop whose declaration _names_ come from its value — `vars={{ 'color-revenue': 'sky-500' }}` emits `--color-revenue: var(--sky-500)`. A colour token resolves to the variable behind it, everything else is written out verbatim. It is how markup this library does not render gets styled (a chart library, a third-party widget), and because it is an ordinary prop the variables land in a class and nest in `theme`/`hover`/a breakpoint. A definition that declares `BoxStyle.declarations` writes its own rule body; `Variables.isCustomProperties` validates entry by entry, so one bad name drops one variable rather than the record
- **SVG paint references**: `fill`, `stroke` and `clipPath` take `url(#id)` and `var(--name)` beside the colour tokens, so a gradient or a pattern is a _value_ — themed, hoverable, responsive — rather than an attribute in `props`. A definition that declares `match` (`BoxStyle.match`, `Variables.isReference`) accepts exactly the values it names, so a typo emits nothing instead of a broken declaration
- **SVG lengths** (`strokeWidth`, `strokeDasharray`, `strokeDashoffset`, `strokeMiterlimit`, and the geometry props `cx`, `cy`, `r`, `rx`, `ry`, `x`, `y`): no divider and no unit — the number is SVG user units, so `strokeWidth={2}` = `stroke-width: 2` and `r={20}` = `r: 20`. A `<rect>`'s `width`/`height` are **not** in this family: those prop names are the ÷4 layout scale, which is why `<Rect>` (`components/svg`) claims them back as the SVG attributes they are
- **Animation and transition times** (`animationDuration`, `animationDelay`, `transitionDuration`, `transitionDelay`): direct milliseconds — `animationDuration={1100}` = `1100ms`. Two things escape it: the four `animation` presets and the four spring names, whose durations are multiples of `--transitionTime`, which is what makes them stop under `prefers-reduced-motion` with no opt-in. Naming a duration in ms is how a component takes that decision back (the DataGrid loader does). **A spring is a curve and a settling time**, so its name goes on the timing-function prop _and_ on the duration prop
- **The transform props are CSS longhands** (`translateX`/`translateY`/`rotate`/`scale`), so they compose instead of overwriting one `transform`. The two translate axes each set a custom property and both write the same `translate: var(--boxTranslateX, 0) var(--boxTranslateY, 0)`. A `var()` is substituted at computed-value time, so the composed value transitions — but **inside `@keyframes` an unregistered custom property animates discretely**, which is why the base stylesheet declares `@property` for both axes (`<length-percentage>`, initial `0`). Without those two lines a sequence moving `translateX` holds its first value and jumps at the end. `flip` and `scale` both write `scale`: use one

### Extension & Component System

- `src/core/extends/boxExtends.ts` — `Box.extend()` for custom CSS variables, new props, extending existing prop values; `Box.components()` for component default styles with variants; `Box.keyframes()` for `@keyframes` sequences
- `src/core/extends/boxComponents.ts` — Built-in component default styles
- `src/core/extends/useComponents.ts` — Merges component defaults with user-provided props

### Theme System

- `src/core/theme/themeRuntime.ts` — The framework-free half: reads/watches `prefers-color-scheme`, persists the choice, writes the theme class + `data-theme` onto an element
- `src/core/theme/themeController.ts` — The provider's state machine (explicit > stored > system, followed live) as a plain object, for consumers with no React
- `src/react/theme/theme.tsx` — `Box.Theme` provider component (auto-detects system preference, supports `use="global"|"local"`); React state and context over `themeRuntime`
- Theme styles generate ancestor-scoped selectors (`.dark .className`)
- Themes nest with pseudo-classes: `theme={{ dark: { hover: { ... } } }}`

### Components (src/components/)

Pre-built components wrap Box with the correct HTML tag. Each is a separate entry point (`@cronocode/react-box/components/...`):

- `flex.tsx` / `grid.tsx` — Layout (display flex/grid)
- `button.tsx`, `textbox.tsx`, `textarea.tsx` — Form elements
- `checkbox.tsx`, `switch.tsx`, `radioButton.tsx`, `radioGroup.tsx` — The A4 form controls: real native inputs, each with a `label` prop that renders the wrapping `<label>` itself. `Checkbox` reports `aria-checked="mixed"` alongside the `indeterminate` property; `Switch` is `role="switch"` over the same input (Enter toggles too); `RadioGroup` is the APG radio group — the role, the shared `name`, and the arrow keys — with `RadioGroup.Item` children. The shared `<label>` markup lives in `src/react/forms/labelledControl.tsx`
- `overlay.tsx` — The positioning primitive: a portal rendered at the place it is declared (via `usePortalContainer`), no ARIA and no open state. `Dropdown` and the DataGrid menu stand on it
- `tooltip.tsx` — The APG tooltip on top of `Overlay`: `role="tooltip"` + `aria-describedby`, hover and focus with delays, Escape, and the WCAG 1.4.13 rules (dismissible, hoverable, persistent). Trigger is a render prop
- `dropdown.tsx` — Select-only dropdown (A5 owns its ARIA)
- `semantics.tsx` — Semantic HTML wrappers (H1-H6, P, Span, Link, Img, Nav, Header, Footer, etc.) via factory function
- `svg.tsx` — One component per SVG element (`Svg`, `G`, `Defs`, `Path`, `Circle`, `Ellipse`, `Rect`, `Line`, `Polyline`, `Polygon`, `SvgText`, `TSpan`, `LinearGradient`, `RadialGradient`, `Stop`, `ClipPath`, `Mask`, `Use`, `SvgSymbol`, `Marker`), so SVG has an answer to "never `<Box tag=>`". **Each component settles the names SVG and Box both use, for its own element** — `Path`'s `d` is path data, `Rect`'s `width`/`height` are user units, `SvgText`'s `x`/`y` and `RadialGradient`'s `cx`/`cy`/`r` are attributes (CSS geometry reaches neither), while `Circle`'s `cx` stays the CSS prop. `Svg` also owns `viewBox`/`width`/`height` and a `label` prop: no label means `aria-hidden`, a label means `role="img"`
- `icon.tsx` — `Icon`: Box props on an icon somebody else drew (lucide, Tabler, react-icons, a raw `<svg>`). It clones the one element it is given and puts the engine's class on it, so it knows no icon set's API — `size` is the ÷4 scale and lands in the _class_, where CSS outranks the `width`/`height` attributes the set writes. Same naming rule as `Svg` (`label` → `role="img"`, otherwise `aria-hidden`, shared in `src/react/svg/svgNaming.ts`). The hook behind it, `useClassNames`, is exported from `src/box.ts` and `src/rsc.ts` — one per entry, so a component built on it stays server-safe. Icons outside lucide come through the same component: the docs site compiles Iconify sets at build time with `unplugin-icons` (wired into `pages.vite.config.ts`, types in `pages/icons.d.ts`), and `examples/next-app` runs the runtime `@iconify/react` bridge — Turbopack runs no unplugin, which is why the build-time recipe is the Vite side
- `chart.tsx` — The chart micro-primitives (`Sparkline`, `ProgressRing`, `Gauge`, `MiniDonut`) over the `components/svg` elements, server-safe. **Not a chart library** — no axes, no legends, no data transformations; the point is that a chart takes Box props. The geometry is framework-free in `src/utils/chart/chartUtils.ts` (components render, models decide). Two rules run through all four: **a data-driven shape is an attribute** (a sparkline's `d`, so 10,000 rows generate no CSS) while **paint is a class** (shared, so the rows share one rule); and a ring's fill is a **rounded fraction** (`ChartUtils.FRACTION_STEP`, half a percent) because a dash length lands in a class name and has to stay transitionable
- `chart.tsx` also holds **`ChartContainer`** — the theming bridge for a chart somebody else draws (SV7). It is a Box that declares `--chart-1` … `--chart-6` in both themes plus one `--color-<series>` per series, so a Recharts `<Line stroke="var(--color-revenue)">` names no colour and its dark mode belongs to the page. The mapping is in `ChartUtils.paletteVariables`/`seriesVariables`; the component only renders. Deliberately **one prop** (`series`): overriding a slot or naming a token the chart reads is `vars`/`theme`, because the container is a Box — and the variable names are the ecosystem's, so a chart copied from shadcn works unchanged
- `visuallyHidden.tsx` — Screen-reader-only content: clipped away rather than hidden, so it stays in the accessibility tree
- `dataGrid/` — Complex data grid with sorting, filtering, grouping, virtualization

### SSR/SSG

- `src/ssg.ts` — `getStyles()`, `resetStyles()` and `renderToStaticMarkup()`. Needs no DOM: with no `document` in the process the engine collects CSS in memory

### Demo Site

- `pages/` — Full React SPA (React Router) showcasing all components, built with `npm run build:pages` (into `dist-pages/`, never `dist/` — that is the library build)
- The build **prerenders every route**: `pages/entry-server.tsx` renders each page in Node on the library's own `getStyles()`, and `scripts/prerender-pages.mjs` writes that HTML and CSS into the route's shell — so a docs page paints with no JavaScript, and the site dogfoods the SSG path. Pages are one dynamic import each (`pages/app/routePages.ts`). The four rules that keep hydration matching the HTML — stable class names, the route chunk preloaded, the theme on `<html>` before the first paint, no content starting at `opacity: 0` — are in `docs/WEBSITE.md`, "Prerendering"

## Key Conventions

- **Never use inline `style` attributes** — always use Box props. If a prop doesn't exist, create it with `Box.extend()`
- **Always use component shortcuts** — `<Flex>` not `<Box display="flex">`, `<Button>` not `<Box tag="button">`, `<H1>` not `<Box tag="h1">`, `<Circle>` not `<Box tag="circle">`
- **HTML attributes go in `props` prop** — `<Link props={{ href: '/about' }}>` not `<Link href="/about">`
- **`src/core/` is framework-free** — no `react` import, no JSX, not even a `React.*` global type. New React code goes in `src/react/`
- Tests are colocated with source files (`*.test.tsx` next to `*.tsx`)
- Accessibility tests: `src/components/a11y.test.tsx` sweeps every component with axe against the fixtures in `dev/a11y/fixtures.tsx`, whose `knownViolations` ledger fails both on a new violation and on a listed one that stopped firing; `*.a11y.test.tsx` files hold the APG keyboard map, driven by `dev/a11y/keyboard.ts`. See `docs/a11y-testing.md`
- **Accessible behavior belongs in `src/react/a11y/`, not in a component** — focus return, list navigation, dismissal and controlled state are shared primitives (`docs/a11y-primitives.md`). A component supplies the roles and the ARIA; the hooks supply the mechanics
- Engine-level tests build their own isolated engine via `dev/engineHarness.ts` (readable class names + `textContent` sink) instead of the default instance, so they can assert exact rule text without interfering with each other
- One component per file, PascalCase component names, camelCase prop names
- **Comments are one or two lines** (the `terse-comments` skill has the sweep tooling) — say the thing the code cannot (the trap, the reason, the bug it came from) and stop. Four or five is for a module-level doc that genuinely needs it: a code example, two conventions meeting. Never restate what the next line does; a long explanation belongs in CONTRIBUTING.md, the docs site or the roadmap, where it is read on purpose
- Prettier: 140 char width, single quotes, trailing commas
- Import order enforced by ESLint: builtin → external → internal → parent → sibling → index (no blank lines between groups, alphabetized)

## Verification

After any code change, all of the following must pass before considering the work done:

1. `npm run compile` — TypeScript type check
2. `npm run lint` — ESLint check
3. `npm run check:boundaries` — `src/core/` must stay React-free
4. `npm run build` — Library build
5. `npm test` — All tests (or `npm run test:coverage` when touching `src/core/` or `src/react/`, which is what CI runs)

CI runs the test suite against React 18 and React 19 — both are in the supported peer range and the engine leans on layout effects, hydration and server rendering, which is exactly what changed between them.

## Adding New CSS Properties

1. Define in `src/core/boxStyles.ts` with JSDoc comment
2. Add formatter in `src/core/boxStylesFormatters.ts` if needed
3. Types auto-generate — no manual type changes needed

## Build & Publishing

- Vite library mode, dual ESM (.mjs) + CJS (.cjs) output
- Components get individual chunks for tree-shaking
- `react`, `react-dom` are external (peer dependencies)
- Published from `dist/` directory on GitHub Release (CI handles it)
- `vite-plugin-dts` generates `.d.ts` files

## Reference Documents

- `src/BOX_AI_CONTEXT.md` — Comprehensive prop reference, usage patterns, DataGrid API, and debugging tips
- `CONTRIBUTING.md` — Architecture deep-dive, CSS generation engine internals, and contribution workflows
