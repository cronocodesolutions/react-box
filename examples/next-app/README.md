# Box in a Server Component

A Next.js App Router app whose pages are **Server Components**: no `'use client'`, no provider, no
stylesheet to import. Every class in the HTML has its rule in the same response, because Box renders
each rule as a `<style href precedence>` element and React 19 hoists it into `<head>`.

```bash
npm run build            # in the repository root — the library itself
npm run build:next-app   # packs dist/, installs it here, runs `next build`
npm run smoke:next-app   # starts the production server and asserts on the HTML
npm run dev:next-app     # http://localhost:3010
```

The example depends on `@cronocode/react-box` as a **tarball built from `dist/`**
(`.local/react-box.tgz`, produced by `npm run pack:local`), not on the source. That is the point: it
exercises the published `exports` map, so the `react-server` condition is what decides which Box the
server graph gets — exactly as it would in a consumer's app. A directory dependency would be
symlinked and resolve its own copy of React from the repository root.

## What is where

| File                      | What it shows                                                                                    |
| ------------------------- | ------------------------------------------------------------------------------------------------ |
| `app/layout.tsx`          | Server Component. Sets the theme name on `<html>` — that is all theming needs on the server      |
| `app/page.tsx`            | Server Component. Props, pseudo-classes, breakpoints, themes; `force-dynamic` so it streams      |
| `app/streamedSection.tsx` | An `async` Server Component behind `<Suspense>` — its markup and its CSS arrive in a later chunk |
| `app/elementMode.ts`      | The one line a client bundle needs: `Box.configure({ sink: 'element' })`                         |
| `app/counter.tsx`         | A client island using `Flex`/`Button`, server-rendered with its CSS in the HTML                  |
| `app/themeToggle.tsx`     | `createThemeController()` from `@cronocode/react-box/core` — theme switching with no provider    |
| `smoke.mjs`               | The CI check: 10 assertions against the served HTML                                              |

## What the smoke test proves

Things no unit test can see, because Vitest renders with the client React and never runs a Next
server build:

- the pages carry no `'use client'` directive, and the build resolved the `react-server` entry;
- the base element (the reset, `:root`, and the cascade-layer order) is hoisted into `<head>`;
- every class in the markup has a rule in the response — nothing waits for a client runtime;
- class names are content hashes, so the server and the browser bundle resolve the same strings;
- a Suspense boundary streams its markup **and** its CSS, including a variable first used there;
- a client island's CSS is server-rendered too;
- the theme class on `<html>` selects real, ancestor-scoped rules.

Two details worth knowing when reading the HTML: React merges every style element of one precedence
group into a single `<style>` tag and lists what it merged in `data-href`, and styles that arrive
after the shell are streamed as `<style media="not all">` and enabled by React on the client.

## Limits this example runs into

The pre-built components (`Flex`, `Button`, `H1`, …) are client components, and the published chunks
carry no `'use client'` directive — so importing one **directly from a Server Component fails the
build**. Server components here use `Box` with a `tag` prop instead, and the islands import the
components normally. `Box.Theme` and hover-callback children are client-only for the same reason.
