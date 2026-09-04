# This package moved to `@box-kite/react`

`@cronocode/react-box` is now **Box Kite**, published as [`@box-kite/react`](https://www.npmjs.com/package/@box-kite/react). Same library, same API, new name.

This `3.4.0` is a compatibility bridge: every entry re-exports the new package, so an `npm update` cannot break a build that has not migrated yet. It receives no further changes.

## Migrating

```bash
npm uninstall @cronocode/react-box
npm install @box-kite/react
```

Then one find-and-replace across your source:

```
@cronocode/react-box   →   @box-kite/react
```

Most subpaths keep their name, so `@cronocode/react-box/components/flex` becomes `@box-kite/react/components/flex`, and `/rsc`, `/a11y` and `/ssg` are unchanged apart from the prefix.

Two moved to a package of their own, because the engine is now published separately for apps with no React in them:

| was                          | is                     |
| ---------------------------- | ---------------------- |
| `@cronocode/react-box/core`  | `@box-kite/core`       |
| `@cronocode/react-box/types` | `@box-kite/core/types` |

`@box-kite/react` depends on `@box-kite/core`, so installing the React package still gets you both.

## Three things the bridge does not forward

**Type augmentation.** If you extend the prop types with `Box.extend()`, the `declare module` string must be changed by hand — TypeScript augments the module you name, and a re-export cannot pass that through:

```ts
// before
declare module '@cronocode/react-box/types' { ... }
// after
declare module '@box-kite/core/types' { ... }
```

The target is the **core** package: the types are derived from the prop registry, so they live with it
rather than with a framework binding.

**Two DOM ids changed**, and both are documented debugging landmarks, so anything selecting them in a test or a global stylesheet needs updating:

| was                             | is                             |
| ------------------------------- | ------------------------------ |
| `<style id="crono-styles">`     | `<style id="box-kite-styles">` |
| `#crono-box` (portal container) | `#box-kite-portal`             |

**The warning prefix** the runtime logs is `[box-kite]` rather than `[react-box]`, which matters if you assert on it.

Nothing else changes: `Box`, `Box.extend()`, `Box.components()`, `Box.Theme`, `Box.configure()`, every prop, every component and every class name are exactly what they were.

## Links

- Docs: <https://box-kite.dev>
- Source: <https://github.com/box-kite/box-kite>
