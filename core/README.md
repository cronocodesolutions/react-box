# @box-kite/core

The [Box Kite](https://box-kite.dev) styling engine, with no framework at all. It generates atomic CSS
at runtime and caches every rule by its content, so the same value anywhere in a page reuses one class.

This is the package a plain-DOM app, a Web Component or another framework's adapter installs.
**Using React? Install [`@box-kite/react`](https://www.npmjs.com/package/@box-kite/react) instead** —
it depends on this and re-exports it, so you get one copy of the engine and the `Box` component with it.

```bash
npm install @box-kite/core
```

```js
import { createStyleEngine } from '@box-kite/core';

const engine = createStyleEngine();

document.querySelector('#card').className = engine.classNames({
  p: 4,
  bgColor: 'blue-500',
  borderRadius: 2,
  hover: { bgColor: 'blue-600' },
});
```

That is the whole runtime: no build step, no provider, no effects. Rules reach the document on their own
microtask — `flushSync()` is for reading computed styles in the same tick, and `getStyles()` for static
output with no DOM in the process at all.

## Your own props and components

`BoxExtends.extend()` registers a prop or a value; the types come from the `/types` entry:

```ts
// types.d.ts
import { ExtractBoxStyles } from '@box-kite/core/types';
import { extendedProps } from './myProps';

declare module '@box-kite/core/types' {
  namespace Augmented {
    interface BoxProps extends ExtractBoxStyles<typeof extendedProps> {}
  }
}
```

`@box-kite/core/types` is the augmentation target for React projects too — the registry being extended
lives here, not in the binding.

## Links

- Docs: <https://box-kite.dev>
- Source: <https://github.com/box-kite/box-kite>

MIT
