# React Box Docs/Webapp Guide

Purpose: help AI contributors extend the docs/demo site under `pages/**`.

## Quick run/build

- Dev server (docs/demo): `npm run dev` (uses `pages.vite.config.ts`, serves `pages/`).
- Build the docs site: `npm run build:pages` (outputs into `dist-pages/` — deliberately not `dist/`,
  which holds the library build the package is published from). The build writes a static shell per
  route plus `404.html`, `sitemap.xml`, `robots.txt` and `CNAME`; see "The site's address" below.

## Architecture

- Entry: [pages/main.tsx](pages/main.tsx) wraps the app in `BrowserRouter` and `Box.Theme` (system preference by default).
- Shell/Layout: [pages/app/layout.tsx](pages/app/layout.tsx) is the frame — sidebar, mobile header, theme toggle, table of contents, and the head manager.
- Routing: [pages/app/app.tsx](pages/app/app.tsx) turns the route table into `<Route>` elements.
- Theme & component presets for the site: [pages/extends.ts](pages/extends.ts) (custom gradients, BGs, component variants) loaded before app render.
- Page context (table of contents): [pages/pageContext.ts](pages/pageContext.ts) provides `setTocEntries` to page components.
- Global styles, fonts, syntax highlighting: [pages/index.css](pages/index.css).

## Routing & pages

- Every route lives once, in [pages/site/site.ts](pages/site/site.ts): its path, its name, and the
  description search engines and link previews show. [pages/app/app.tsx](pages/app/app.tsx) keys its
  page components by those paths through an exhaustive record, so a page without metadata — or
  metadata without a page — is a type error, and the sitemap can never fall behind the router.
- Pages live in [pages/pages/](pages/pages/); sidebar nav and grouping are hand-written in
  [pages/app/sidebar.tsx](pages/app/sidebar.tsx).
- Common page components: [pages/components/pageHeader.tsx](pages/components/pageHeader.tsx), [pages/components/code.tsx](pages/components/code.tsx).

## The site's address

`SITE_URL` in [pages/site/site.ts](pages/site/site.ts) is the only place the site's host is written
down. Everything address-bound is built from it by the `site-metadata` plugin in
[pages.vite.config.ts](pages.vite.config.ts):

- **A static shell per route** (`dist-pages/<route>/index.html`) carrying that route's title,
  description, canonical link and Open Graph tags. Without them GitHub Pages answers every route
  with `404.html` and an HTTP 404 — the app renders, but every URL the sitemap lists reports itself
  missing. Because Pages serves `<route>/index.html`, the served address ends in a slash, and that
  is the form the canonical links and the sitemap use.
- **`404.html`** — the same shell, titled "Page not found" and marked `noindex`.
- **`sitemap.xml`** (every route but the unlisted demos) and **`robots.txt`** (which allows the AI
  crawlers by name, and disallows nothing — a page a crawler may not fetch never gets to show it its
  `noindex`).
- **`CNAME`**, so a lost or overwritten GitHub Pages custom-domain setting shows up as a diff here.

[pages/site/documentHead.tsx](pages/site/documentHead.tsx) keeps the same tags correct after the app
takes over navigation. The shells are metadata only: prerendering the content is roadmap G3.

### Moving the site to another domain

1. Point DNS at GitHub Pages (apex + `www`), set the custom domain in the repository's Pages
   settings, and wait for the certificate before announcing anything.
2. Change `SITE_URL`. That is the whole repo-side change: canonicals, `sitemap.xml`, `robots.txt`
   and `CNAME` all follow, and `npm test` checks they moved together.
3. Repoint the links we own that are written by hand: `homepage` in `package.json`, the docs link in
   `README.md`, and `ARTICLE.md`.
4. Redirect the old host path-preservingly (301) — it cannot live in this repo, because GitHub Pages
   serves one custom domain per repository.
5. Add the new address to Search Console and file a change of address for the old one.

## Code blocks

A `<Code>` block shows its example one of two ways, and the difference decides who checks it:

- **No `code` prop** — the block prints the live demo beside it, generated from the children by
  `reactToJsx`. It is the page's own JSX, so `npm run compile` already checks it and it cannot drift
  from what the reader sees running. Prefer this shape.
- **A `code` string** — hand-written, for what the page cannot render: imports, a `.d.ts`, a
  controlled-state example. `npm run check:docs` compiles every one of these
  ([scripts/check-docs-snippets.mjs](scripts/check-docs-snippets.mjs)) against the *published*
  specifiers (`@cronocode/react-box/components/flex`) and without the site's own `Box.extend()`
  augmentation — so a snippet that only works because `pages/extends.ts` widened a prop fails, which
  is the point: the reader does not have that file. Two escape hatches, both visible in the page
  source:
  - `context="declare const data: Person[];"` — declarations the snippet is written against but does
    not show. Needed where a generic infers from them (a DataGrid over `any` resolves its row type to
    `object` and every cell access fails). Keep it to what the page genuinely owns.
  - `check={false}` — the block is deliberately not compilable code: an outline with `...` in it, a
    `declare module` augmentation, a walkthrough that needs one.

A snippet that uses a value or component name only the docs site registers is a bug, not a style
choice — bug #15 shipped a `colSpan` prop that has never existed, next to a demo using `gridColumn`.

## Patterns to follow

- Use `Box`/`Flex` components and theme variants from `pages/extends.ts` for consistent look (glass cards, gradients, etc.).
- For demos, prefer live component usage from `src/` (import relatively, e.g., `../../src/components/button`).
- To add a table of contents, call `const { setTocEntries } = useContext(PageContext)` inside the page; the layout renders it on xl+ breakpoints.
- Stick to existing motion patterns: `framer-motion` is already set up in `layout.tsx` for page transitions and the sidebar overlay.
- Use data fixtures from [pages/data/](pages/data/) for examples; avoid network calls.

## Adding a new doc/demo page

1. Create a component in [pages/pages/](pages/pages/) (export default React component). Use `PageHeader` + `Code` blocks for consistency.
2. Add its path, name and description to `siteRoutes` in [pages/site/site.ts](pages/site/site.ts), then
   the component to the `pages` record in [pages/app/app.tsx](pages/app/app.tsx) — the compiler asks
   for the second as soon as you write the first.
3. Add a menu entry in [pages/app/sidebar.tsx](pages/app/sidebar.tsx) unless the page is an unlisted
   demo, in which case mark it `indexable: false` so it stays out of the sitemap.
4. If you need custom theme tokens/variants, extend them in [pages/extends.ts](pages/extends.ts) (already imports `Box.extend` and `Box.components`).
5. Keep styling in JSX via Box props; only add to [pages/index.css](pages/index.css) for truly global rules.

## Testing/validation for site changes

- Run `npm run dev` for local QA; verify mobile sidebar, theme toggle, and page transitions.
- Ensure new demos render under both light/dark themes (toggle in header or via `Box.Theme`).
- Keep bundle-safe imports: use relative `../../src/...` paths, not package names, to avoid build/export issues in docs build.
- [pages/site/siteMeta.test.ts](pages/site/siteMeta.test.ts) and [pages/site/documentHead.test.tsx](pages/site/documentHead.test.tsx) cover the metadata; `npm test` runs them with the rest.
- `npm run check:docs` compiles every hand-written code block. CI runs it in the `checks` job, so a broken example fails the build rather than the reader's editor.

If you need deeper architectural details, see [CONTRIBUTING.md](CONTRIBUTING.md) for the library and reuse its patterns when writing demos.
