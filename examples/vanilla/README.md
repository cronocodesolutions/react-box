# The core engine, without React

A plain HTML page styled entirely by `@cronocode/react-box/core`. No framework is loaded — the
page is `document.createElement` plus `engine.classNames(props)`, and the CSS is generated at
runtime into a `<style>` element the engine owns.

```bash
npm run dev:vanilla     # http://localhost:5173
npm run build:vanilla   # static output in examples/vanilla/dist
```

What it exercises, all through the same props `<Box>` takes:

| Feature                | Where                                                     |
| ---------------------- | --------------------------------------------------------- |
| Style props            | every `el(...)` call in `main.js`                          |
| Pseudo-classes         | `hover: { ... }` on the cards                              |
| Breakpoints            | `md: { ... }` / `lg: { ... }` on the page and the grid     |
| Themes                 | `theme: { dark: { ... } }` + `createThemeController()`     |
| Custom props/variables | `engine.extend(...)`                                       |
| Component defaults     | `engine.components(...)` with `component` / `variant`      |
| Static CSS output      | `engine.getStyles()` in the footer                         |

The import specifier is the published one; `vite.config.ts` aliases it to `src/core.ts` so the
example runs against the working tree. In a real app it resolves to the package and the config is
not needed at all.
