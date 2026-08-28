# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

@cronocode/react-box is a React runtime CSS-in-JS library. The core `Box` component accepts ~144 CSS props and generates CSS classes at runtime — no CSS files needed. Same prop values across components share a single CSS class.

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
| `npx vitest run src/path/to/file.test.tsx` | Run a single test file                                                                                       |
| `npm run lint`                             | ESLint check                                                                                                 |
| `npm run check:boundaries`                 | Fail if the core engine imports React or the RSC entry reaches a client hook (also prints the adapter ratio) |

Node version: v24 (pinned in .nvmrc).

## Architecture

### Core Styling Engine

`src/core/**` imports **no React** — ESLint and `npm run check:boundaries` both fail if it ever does. React lives in `src/react/**` (the binding, the theme provider, the shared hooks) plus the entry modules `src/box.ts`, `src/rsc.ts` and `src/ssg.ts`. When a core module seems to need a hook, give it an injectable policy instead — that is what `flushScheduler.ts` is. See CONTRIBUTING.md, "The core boundary".

- `src/box.ts` — Main Box component (memoized, forwardRef, polymorphic via `tag` prop)
- `src/rsc.ts` — The `react-server` build of Box: same props, no hook, no effect, no DOM. Element mode is switched on when it loads, so a Server Component needs no configuration. Enforced by `scripts/check-rsc-boundary.mjs`
- `src/core.ts` — The engine with no React at all (`@cronocode/react-box/core`): `createStyleEngine()`, `engine.classNames(props)`, `createThemeController()`. `examples/vanilla` is a whole page built on it. Both the sources it reaches and the chunks it imports are checked for React
- `src/core/boxStyles.ts` — All CSS property definitions (~144 props). Types auto-generate from these definitions
- `src/core/boxStylesFormatters.ts` — Value formatters that convert prop values to CSS (rem, px, fractions, etc.)
- `src/core/engine/styleEngine.ts` — `createStyleEngine()`: all engine state (class-name cache, rule registry, identity factory, variables, prop and component registries) on an instance; generates class names and rules
- `src/core/engine/styleSink.ts` — Where the CSS goes: `cssom` (`insertRule`), `textContent`, `string` (server rendering, no DOM), or `element` (nowhere — the rules come back as `<style href precedence>` descriptors for the adapter to render). Every sink places a rule by its sort key, so they all produce the same cascade
- `src/core/hash.ts` — `stableHash()`: content-addressed identity for a rule (its `href`) and for a class name in element mode, where a counter cannot be shared between processes
- `src/core/engine/flushScheduler.ts` — _When_ pending rules reach the sink: an injectable `FlushScheduler` (microtask by default) plus `flushSync()`, so an adapter without effects still gets its CSS
- `src/core/engine/defaultEngine.ts` — The lazily-created default instance every public API delegates to
- `src/react/useStyles.ts` — The React binding: resolves class names during render, flushes from `useInsertionEffect` (ahead of every layout effect in the commit). Lives outside `src/core/` because core is React-free
- `src/react/resolveStyles.ts` — The same resolution with no hook at all, so a Server Component can render Box; `useStyles` is this plus the flush effect
- `src/react/styleElements.ts` — Descriptors → `<style href precedence>` elements (React 19 hoists and dedupes them)
- `src/react/boxProps.ts` / `src/react/boxTagProps.ts` — The prop shape and the tag-props assembly both Box builds share
- `src/core/variables.ts` — CSS variables (200+ Tailwind-like colors), lazy-loaded via pending variables system
- `src/core/classNames.ts` — Conditional className utility

### Numeric Value Formatters (critical)

Different props have different dividers — this is the #1 source of bugs:

- **Spacing** (`p`, `m`, `gap`, `px`, `py`, etc.): divider 4 → `p={4}` = 1rem = 16px
- **fontSize**: divider **16** → `fontSize={14}` = 0.875rem ≈ 14px
- **Border width** (`b`, `bx`, `by`): direct px → `b={1}` = 1px
- **borderRadius**: divider 4, same scale as spacing → `borderRadius={2}` = 0.5rem = 8px
- **lineHeight**: direct px → `lineHeight={24}` = 24px

### Extension & Component System

- `src/core/extends/boxExtends.ts` — `Box.extend()` for custom CSS variables, new props, extending existing prop values; `Box.components()` for component default styles with variants
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
- `button.tsx`, `textbox.tsx`, `checkbox.tsx`, `radioButton.tsx`, `textarea.tsx` — Form elements
- `dropdown.tsx`, `tooltip.tsx` — Overlays (use portals via `usePortalContainer`)
- `semantics.tsx` — Semantic HTML wrappers (H1-H6, P, Span, Link, Img, Nav, Header, Footer, etc.) via factory function
- `dataGrid/` — Complex data grid with sorting, filtering, grouping, virtualization

### SSR/SSG

- `src/ssg.ts` — `getStyles()`, `resetStyles()` and `renderToStaticMarkup()`. Needs no DOM: with no `document` in the process the engine collects CSS in memory

### Demo Site

- `pages/` — Full React SPA (React Router) showcasing all components, built with `npm run build:pages`

## Key Conventions

- **Never use inline `style` attributes** — always use Box props. If a prop doesn't exist, create it with `Box.extend()`
- **Always use component shortcuts** — `<Flex>` not `<Box display="flex">`, `<Button>` not `<Box tag="button">`, `<H1>` not `<Box tag="h1">`
- **HTML attributes go in `props` prop** — `<Link props={{ href: '/about' }}>` not `<Link href="/about">`
- **`src/core/` is framework-free** — no `react` import, no JSX, not even a `React.*` global type. New React code goes in `src/react/`
- Tests are colocated with source files (`*.test.tsx` next to `*.tsx`)
- Engine-level tests build their own isolated engine via `dev/engineHarness.ts` (readable class names + `textContent` sink) instead of the default instance, so they can assert exact rule text without interfering with each other
- One component per file, PascalCase component names, camelCase prop names
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
