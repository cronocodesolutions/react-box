# React Box Docs/Webapp Guide

Purpose: help AI contributors extend the docs/demo site under `pages/**`.

## Quick run/build

- Dev server (docs/demo): `npm run dev` (uses `pages.vite.config.ts`, serves `pages/` via Vite HashRouter).
- Build docs to dist: `npm run build:pages` (outputs into `dist/`).

## Architecture

- Entry: [pages/main.tsx](pages/main.tsx) wraps the app in `HashRouter` and `Box.Theme` (default `dark`).
- Shell/Layout: [pages/app/app.tsx](pages/app/app.tsx) handles layout, routing, mobile sidebar, theme toggle, right sidebar host.
- Theme & component presets for the site: [pages/extends.ts](pages/extends.ts) (custom gradients, BGs, component variants) loaded before app render.
- Page context (right sidebar injection): [pages/pageContext.ts](pages/pageContext.ts) provides `setRightSidebar` to page components.
- Global styles, fonts, syntax highlighting: [pages/index.css](pages/index.css).

## Routing & pages

- Routes declared in [pages/app/app.tsx](pages/app/app.tsx); pages live in [pages/pages/](pages/pages/). Add a route + page component to expose new docs/demos.
- Sidebar nav & grouping: [pages/app/menuGrouping.tsx](pages/app/menuGrouping.tsx) + [pages/app/menuItem.tsx](pages/app/menuItem.tsx); rendered by [pages/app/sidebar.tsx](pages/app/sidebar.tsx).
- Common page components: [pages/components/pageHeader.tsx](pages/components/pageHeader.tsx), [pages/components/code.tsx](pages/components/code.tsx).

## Patterns to follow

- Use `Box`/`Flex` components and theme variants from `pages/extends.ts` for consistent look (glass cards, gradients, etc.).
- Keep routes hash-based (`HashRouter`) to support static hosting.
- For demos, prefer live component usage from `src/` (import relatively, e.g., `../../src/components/button`).
- To add a right sidebar, call `const { setRightSidebar } = useContext(PageContext)` inside the page and set a React node; `app.tsx` renders it on xl+ breakpoints.
- Stick to existing motion patterns: `framer-motion` is already set up in `app.tsx` for page transitions and sidebar overlay.
- Use data fixtures from [pages/data/](pages/data/) for examples; avoid network calls.

## Adding a new doc/demo page

1. Create a component in [pages/pages/](pages/pages/) (export default React component). Use `PageHeader` + `Code` blocks for consistency.
2. Add a route in [pages/app/app.tsx](pages/app/app.tsx) and a menu entry in [pages/app/menuGrouping.tsx](pages/app/menuGrouping.tsx).
3. If you need custom theme tokens/variants, extend them in [pages/extends.ts](pages/extends.ts) (already imports `Box.extend` and `Box.components`).
4. Keep styling in JSX via Box props; only add to [pages/index.css](pages/index.css) for truly global rules.

## Testing/validation for site changes

- Run `npm run dev` for local QA; verify mobile sidebar, theme toggle, and page transitions.
- Ensure new demos render under both light/dark themes (toggle in header or via `Box.Theme`).
- Keep bundle-safe imports: use relative `../../src/...` paths, not package names, to avoid build/export issues in docs build.

If you need deeper architectural details, see [CONTRIBUTING.md](CONTRIBUTING.md) for the library and reuse its patterns when writing demos.
