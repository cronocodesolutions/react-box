# Copilot / AI agent instructions for @cronocode/react-box

Short, actionable guidance so an AI assistant can be immediately productive in this repository.

## Quick context

- Library: a **runtime CSS-in-JS** React component library (`@cronocode/react-box`). Primary entry: `src/box.ts`.
- Runtime model: props -> `useStyles()` -> class generation -> CSS rules injected into `<style id="crono-box">`.

## Quick commands

- Install: `npm install`
- Dev site (docs/demo): `npm run dev` (serves `pages/` via Vite)
- Type check only: `npm run compile` (runs `tsc --noEmit`)
- Build library: `npm run build` (uses `vite.config.ts` to emit ESM + CJS)
- Build demo site: `npm run build:pages`
- Tests (watch): `npm test` (Vitest, `happy-dom` environment)
- Tests (CI / once): `npm run test:all`
- Lint: `npm run lint`

> Note: Vitest is configured with `environment: 'happy-dom'` (see `vite.config.ts` and `.vscode/settings.json`).

## High-value files to read first

- `src/box.ts` — main component (memo + forwardRef + extension API)
- `src/core/useStyles.ts` — core hook: transforms props → class names + CSS
- `src/core/boxStyles.ts` — canonical list of shorthand props and their formatters
- `src/core/boxStylesFormatters.ts` — value conversion helpers (rem, px, fraction)
- `src/core/variables.ts` — color/size maps and `getVariableValue`
- `src/core/extends/boxExtends.ts` & `boxComponents.ts` — component defaults, `Box.extend()` and `Box.components()`
- `src/core/theme/*` — theme provider (`Box.Theme` / `Box.useTheme`)
- `src/components/*` — component wrappers (e.g., `button.tsx`, `dataGrid/`)
- `pages/` — usage examples and interactive demos; use them as canonical examples
- `CONTRIBUTING.md` — authoritative workflows and patterns

## Project conventions & patterns (do this way)

- Shorthand prop naming: `p`, `px`, `b`, `bgColor`, `ai`, `d`, etc. Follow `boxStyles.ts` patterns.
- Value formatters: use existing `BoxStylesFormatters` (rem/px/fraction). Don't invent formats; add formatters if necessary.
- Pseudo-classes and breakpoints: use nested objects (e.g., `hover: { ... }`, `sm: { ... }`). Refer to `pseudoClassesWeight` and `breakpoints` in `boxStyles.ts`.
- Theme & component overrides: prefer `Box.components()` and `Box.extend()` rather than ad hoc hacks. Use the example in `pages/themeSetupPage.tsx`.
- Types: types are derived from `boxStyles` and `boxComponents`. For public augmentation, follow the module-augmentation examples in `pages/themeSetupPage.tsx` and `README.md` (`box.d.ts` pattern).
- Tests next to code: unit tests live alongside source files (`*.test.*`). Use `@testing-library/react` + `happy-dom` in tests.

## How to add features (checklist)

1. Update `src/core/boxStyles.ts` (add prop definition + JSDoc).
2. Add a formatter in `boxStylesFormatters.ts` if the value requires conversion.
3. Add variables to `src/core/variables.ts` if applicable (colors/percentages).
4. Add/extend component defaults in `src/core/extends/boxComponents.ts` (if new component or variant).
5. Add tests (near the new file) and a demo page in `pages/` to document usage.
6. Run `npm run compile`, `npm test`, and `npm run build` to validate types, tests, and packaging.
7. If adding a new top-level component, add an entry in `vite.config.ts` so the build exports it (see `entry` mapping).

## Packaging & CI notes

- Builds produce both `*.mjs` and `*.cjs` and `.d.ts` (see `vite.config.ts` and `package.json` `exports`).
- Post-build step copies `package.json`, `LICENSE`, and `README.md` into `dist/`.
- CI runs `npm run test:all` (see `.github/workflows/test.yml`).

## Tests and debugging tips

- Use `npm test` to run Vitest in watch mode (happy-dom DOM). Useful when editing `useStyles` or style generation.
- To debug CSS output, inspect the runtime `<style id="crono-box">` in demo site (`npm run dev`).
- For type errors, run `npm run compile`.

## Style & code quality

- ESLint + Prettier enforced. See `eslint.config.js` and `.vscode/settings.json` (`editor.formatOnSave` and auto fixers enabled).
- Avoid introducing unnecessary dependencies; core code is intentionally minimal and runtime-sensitive.

## Where to look for more details

- `CONTRIBUTING.md` — deep dive on architecture, examples, and best practices (this file is the canonical source).
- `pages/` demos — live examples to reproduce behaviors quickly.

---

If anything above is unclear or you'd like additional examples (e.g., a short PR checklist for component changes), tell me which sections to expand and I'll iterate.✅
