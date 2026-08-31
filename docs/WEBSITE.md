# React Box Docs/Webapp Guide

Purpose: help AI contributors extend the docs/demo site under `pages/**`.

## Quick run/build

- Dev server (docs/demo): `npm run dev` (uses `pages.vite.config.ts`, serves `pages/`).
- Build the docs site: `npm run build:pages` (outputs into `dist-pages/` — deliberately not `dist/`,
  which holds the library build the package is published from). It is two passes: the Vite build,
  which writes a static shell per route plus `404.html`, `sitemap.xml`, `robots.txt` and `CNAME`
  (see "The site's address"), then `npm run prerender:pages`, which fills each shell with that
  route's HTML and CSS (see "Prerendering").

## Architecture

- Entry: [pages/main.tsx](pages/main.tsx) wraps the app in `BrowserRouter` and `Box.Theme` (system preference by default).
- Shell/Layout: [pages/app/layout.tsx](pages/app/layout.tsx) is the frame — sidebar, mobile header, theme toggle, table of contents, and the head manager.
- Routing: [pages/app/app.tsx](pages/app/app.tsx) turns the route table into `<Route>` elements.
- Theme & component presets for the site: [pages/extends.ts](pages/extends.ts) (custom gradients, BGs, component variants) loaded before app render.
- Page context (table of contents): [pages/pageContext.ts](pages/pageContext.ts) provides `setTocEntries` to page components.
- Global styles, fonts, syntax highlighting: [pages/index.css](pages/index.css).
- Icons: the site renders lucide through `<Icon>`, and the Iconify sets through `unplugin-icons` —
  `~icons/<set>/<name>` is compiled into a component at build time by the plugin in
  [pages.vite.config.ts](pages.vite.config.ts), out of the `@iconify-json/*` devDependencies, with
  the specifier's types coming from [pages/icons.d.ts](pages/icons.d.ts). It is the recipe the
  `/icon` page documents, so the page and the site prove each other; a new set is one more
  `@iconify-json/<set>` devDependency and nothing else.

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
takes over navigation. The shells carry the metadata; the prerender pass below puts the page in them.

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

## Prerendering

`npm run build:pages` finishes by running [scripts/prerender-pages.mjs](scripts/prerender-pages.mjs):
it builds [pages/entry-server.tsx](pages/entry-server.tsx) through this same config (`build.ssr`, into
`dist-pages-ssr/`), renders every route in Node, and writes the HTML into that route's shell together
with its CSS. `view-source` on any address shows the page, and the page paints with no JavaScript at
all. The CSS comes from the library's own SSG API — `getStyles()` over the string sink — so the docs
site is the reference implementation for it.

Four things keep hydration matching the HTML, and each is a trap if you touch it:

- **Class names are content-hashed on both sides** — `Box.configure({ classNames: 'stable' })` in
  `main.tsx` and in `entry-server.tsx`. A counter starting from zero in a second process names the
  same rules differently, and every element React adopted would mismatch.
- **The route's chunk is fetched before `hydrateRoot`.** Pages are dynamic imports (see "Route
  chunks"), `React.lazy` always suspends on its first render, and a hydration that suspends throws
  away the HTML it was supposed to adopt. `preloadPage` resolves the module first and
  [pages/app/routePages.ts](pages/app/routePages.ts) then renders it directly.
- **The theme is on `<html>` before the first paint.** The shell ships `class="light"` — the theme the
  prerendered HTML is rendered in, and what a reader with no JavaScript keeps — and an inline script in
  [pages/index.html](pages/index.html) swaps it for `dark` when the system asks. `<Box.Theme>` adopts
  the same value on its first commit.
- **Nothing may start at `opacity: 0`.** framer-motion renders `initial` on the server, so an entrance
  animation hides the prerendered page until React takes over. Page content is wrapped in
  [pages/components/reveal.tsx](pages/components/reveal.tsx), which animates a mount _after_ hydration
  and nothing else; an `AnimatePresence` that exists for a later swap takes `initial={false}`.

The pass fails the build rather than shipping an empty page: every route must produce HTML and CSS
above a floor, and its number of client-only Suspense boundaries must equal its `CLIENT_ISLANDS` entry
in the script — a ledger, so a new hole fails and a closed one is a line to delete. That check is what
caught an unguarded `window` in the DataGrid's column menu, which React had swallowed into a boundary
with nothing on stderr.

Two build-level traps it exposed, both fixed and both worth remembering:

- **`"sideEffects": false` in package.json is the _library's_ claim, and Rollup applies it to `pages/**`
  too.** `import './extends'`, whose exports the entry never reads, was dropped from the production
  build — so every `Box.extend()` and `Box.components()` registration the site makes did nothing on the
  built site, while the dev server (which does not tree-shake) showed them working. The field now names
  `pages/**` as the one place in this repo with side effects.
- **CSS imported by an async chunk is not linked in the prerendered HTML** — the chunk's loader writes
  that `<link>`, so code blocks painted unstyled until the JavaScript arrived. Site-wide CSS (the Prism
  theme) is imported from `main.tsx`, which puts it in the entry stylesheet.

## Route chunks

Every page is a dynamic import in [pages/app/routePages.ts](pages/app/routePages.ts), keyed by the
route table's paths, so a page the table names and the loaders miss is a type error. A reader of
/textbox no longer downloads the DataGrid, the 5 MB of mock rows behind it, Prism and Recharts: the
entry chunk is 118 KB gz where it was 1.22 MB. A page-only heavyweight import belongs in its own file
so the page's chunk carries it — the pattern `rechartsDemo.tsx` started.

## Code blocks

A `<Code>` block shows its example one of two ways, and the difference decides who checks it:

- **No `code` prop** — the block prints the live demo beside it, generated from the children by
  `reactToJsx`. It is the page's own JSX, so `npm run compile` already checks it and it cannot drift
  from what the reader sees running. Prefer this shape.
- **A `code` string** — hand-written, for what the page cannot render: imports, a `.d.ts`, a
  controlled-state example. `npm run check:docs` compiles every one of these
  ([scripts/check-docs-snippets.mjs](scripts/check-docs-snippets.mjs)) against the _published_
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
