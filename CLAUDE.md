# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

@cronocode/react-box is a React runtime CSS-in-JS library. The core `Box` component accepts ~144 CSS props and generates CSS classes at runtime — no CSS files needed. Same prop values across components share a single CSS class.

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start Vite dev server for the demo pages |
| `npm run build` | Build library (ESM + CJS output to dist/) |
| `npm run build:dev` | Build library without minification |
| `npm run compile` | TypeScript type check (no emit) |
| `npm test` | Run all tests (Vitest) |
| `npm run test:watch` | Run tests in watch mode |
| `npx vitest run src/path/to/file.test.tsx` | Run a single test file |
| `npm run lint` | ESLint check |

Node version: v24 (pinned in .nvmrc).

## Architecture

### Core Styling Engine

- `src/box.ts` — Main Box component (memoized, forwardRef, polymorphic via `tag` prop)
- `src/core/boxStyles.ts` — All CSS property definitions (~144 props). Types auto-generate from these definitions
- `src/core/boxStylesFormatters.ts` — Value formatters that convert prop values to CSS (rem, px, fractions, etc.)
- `src/core/useStyles.ts` — Style processing hook: generates class names via IdentityFactory, injects CSS rules incrementally with `CSSStyleSheet.insertRule()`, batches flushes in `useLayoutEffect`
- `src/core/variables.ts` — CSS variables (200+ Tailwind-like colors), lazy-loaded via pending variables system
- `src/core/classNames.ts` — Conditional className utility

### Numeric Value Formatters (critical)

Different props have different dividers — this is the #1 source of bugs:
- **Spacing** (`p`, `m`, `gap`, `px`, `py`, etc.): divider 4 → `p={4}` = 1rem = 16px
- **fontSize**: divider **16** → `fontSize={14}` = 0.875rem ≈ 14px
- **Border width** (`b`, `bx`, `by`): direct px → `b={1}` = 1px
- **borderRadius**: direct px → `borderRadius={8}` = 8px
- **lineHeight**: direct px → `lineHeight={24}` = 24px

### Extension & Component System

- `src/core/extends/boxExtends.ts` — `Box.extend()` for custom CSS variables, new props, extending existing prop values; `Box.components()` for component default styles with variants
- `src/core/extends/boxComponents.ts` — Built-in component default styles
- `src/core/extends/useComponents.ts` — Merges component defaults with user-provided props

### Theme System

- `src/core/theme/theme.tsx` — `Box.Theme` provider component (auto-detects system preference, supports `use="global"|"local"`)
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

- `src/ssg.ts` — `getStyles()` and `resetStyles()` for server-side rendering

### Demo Site

- `pages/` — Full React SPA (React Router) showcasing all components, built with `npm run build:pages`

## Key Conventions

- **Never use inline `style` attributes** — always use Box props. If a prop doesn't exist, create it with `Box.extend()`
- **Always use component shortcuts** — `<Flex>` not `<Box display="flex">`, `<Button>` not `<Box tag="button">`, `<H1>` not `<Box tag="h1">`
- **HTML attributes go in `props` prop** — `<Link props={{ href: '/about' }}>` not `<Link href="/about">`
- Tests are colocated with source files (`*.test.tsx` next to `*.tsx`)
- One component per file, PascalCase component names, camelCase prop names
- Prettier: 140 char width, single quotes, trailing commas
- Import order enforced by ESLint: builtin → external → internal → parent → sibling → index (no blank lines between groups, alphabetized)

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
