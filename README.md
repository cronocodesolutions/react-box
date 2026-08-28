# React box

[![npm](https://img.shields.io/npm/v/@cronocode/react-box)](https://www.npmjs.com/package/@cronocode/react-box)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@cronocode/react-box)](https://bundlephobia.com/package/@cronocode/react-box)
[![Tests](https://github.com/box-kite/box-kite/actions/workflows/test.yml/badge.svg)](https://github.com/box-kite/box-kite/actions/workflows/test.yml)
[![license](https://img.shields.io/npm/l/@cronocode/react-box)](LICENSE)

This is a react base component which will reduce considerably necessity to write css code.

## Getting Started

1. Installation

```bash
npm install @cronocode/react-box
```

2. Use component

Sizes is equal to `1/4rem`

`padding={3}` means `1/4 * 3 => 0.75rem`

In the example below is creating a box with `maring: 0.5rem` and `padding: 1.75rem`

```JS
import Box from "@cronocode/react-box";

export default function Component(props: Props) {
  return (
    <Box className="custom-class" m={2} p={7}>
      basic example
    </Box>
  );
}
```

**NOTE**: Root `font-size` is set to `16px`

## Components

- **Box** - base component with a tons of props

```JS
import Box from "@cronocode/react-box";
```

<br/>

### Alias-shortcuts components

- **Flex** - this is a `Box` component with `display: flex` style

```JS
import Flex from "@cronocode/react-box/components/flex";
```

- **Button** - this is a `Box` component with html tag `button` and `onClick` prop

```JS
import Button from "@cronocode/react-box/components/button";
```

- **Textbox** - this is a `Box` component with html tag `input`

```JS
import Textbox from "@cronocode/react-box/components/textbox";
```

- **Tooltip** - this is useful when you need a position absolute and the parent has overflow hidden.

```JS
import Tooltip from "@cronocode/react-box/components/tooltip";
```

## Extend props

It is possible to add your own props to define your custom styles.
You need to do a few steps.

1. In a project root file you need to define your extends

```JS
import Box from "@cronocode/react-box";

export const { extendedProps, extendedPropTypes } = Box.extend(
  // css variables
  {
    dark: '#123123',
    light: '#ededed',
    cssVarName: 'cssVarValue',
    myShadow: '10px 5px 5px red',
    myGradient1: 'linear-gradient(#e66465, #9198e5)',
    myGradient2: 'linear-gradient(black, white)',
  },
  // new custom props
  {
    background: [
      {
        values: ['myGradient1', 'myGradient2'] as const,
        valueFormat: (value: string) => `var(--background${value})`,
      },
    ],
  },
  // extend values for existing props
  {
    color: [
      {
        values: ['dark', 'light'],
        valueFormat: (value, getVariableValue) => getVariableValue(value),
      },
    ],
  }
);
```

2. Now you have to add typings to the Box in order to have intellisense for you new props and value.
   You need to create a `box.d.ts`

```JS
import '@cronocode/react-box';
import { ExtractBoxStyles, ExtractComponentsAndVariants } from '@cronocode/react-box/types';
import { extendedProps, extendedPropTypes, components } from './path-to-your-b0x-extends-declaration';

declare module '@cronocode/react-box/types' {
  namespace Augmented {
    interface BoxProps extends ExtractBoxStyles<typeof extendedProps> {}
    interface BoxPropTypes extends ExtractBoxStyles<typeof extendedPropTypes> {}
    interface ComponentsTypes extends ExtractComponentsAndVariants<typeof components> {}
  }
}
```

## Theme for components

In the project root file (main.tsx) use `Theme.setup`

```JS
import Box from '@cronocode/react-box';

Box.components({
  button: {
    styles: {
      px: 4
    },
    variants: {
      mytheme: {
        px: 8
      }
    }
  },
  ...
})
```

All styles will be applied to Button component

```JS
import Button from '@cronocode/react-box/components/button';

function MyComponent() {
  return <Button>Click me</Button>
}
```

or is possible to use Button with specific variant

```JS
import Button from '@cronocode/react-box/components/button';

function MyComponent() {
  return <Button variant="mytheme">Click me</Button>
}
```

## Theme variables

In CSS file is possible to override default values for:

```CSS
  --borderColor: black;
  --outlineColor: black;
  --lineHeight: 1.2;
  --fontSize: 14px;
  --transitionTime: 0.25s;
```

## React Server Components (React 19)

Box renders inside a Server Component with no `'use client'` — the styles travel with the markup
instead of being injected by an effect. A server component just imports the package as usual:

```tsx
// app/page.tsx — a Server Component. No 'use client', no provider, no CSS import.
import Flex from '@cronocode/react-box/components/flex';
import { H1, P } from '@cronocode/react-box/components/semantics';

export default function Page() {
  return (
    <Flex d="column" gap={2} p={6} bgColor="slate-50" borderRadius={2}>
      <H1 fontSize={24}>Rendered on the server</H1>
      <P color="slate-600" sm={{ fontSize: 16 }}>
        Its CSS was hoisted into &lt;head&gt; by React, not inserted by a client runtime.
      </P>
    </Flex>
  );
}
```

The `react-server` export condition resolves to a build of Box that calls no hook, schedules no
effect and never touches the DOM: each generated rule comes back as a `<style href precedence>`
element rendered next to the markup, which React 19 hoists into `<head>` and dedupes by `href`.
That is also what makes it stream-safe — nothing has to wait for a commit that Suspense may split.

**Client components** (anything with `'use client'`) can use the same emission path, and should in an
RSC app, so their CSS is in the HTML too. One line, in a module the root layout imports:

```tsx
'use client';
import Box from '@cronocode/react-box';

Box.configure({ sink: 'element' }); // React 19 only — see below
```

Notes and limits:

- **The cascade comes from `@layer`, not from element order.** React hoists elements in render
  order, so a responsive rule could otherwise land ahead of the base rule it has to override. In
  this mode every rule is wrapped in a cascade layer (one per breakpoint × prop) and the base
  element declares the layer order once, up front — the order the elements end up in cannot change
  the result. The consequence worth knowing: **unlayered CSS of your own always wins** over Box
  props here, which matches where the library puts its `<style>` element in the other modes.
- **Declare `Box.extend()` props before the first render.** CSS appends a layer it meets for the
  first time after every layer already named, so a prop registered mid-render sorts after the
  built-ins.
- **Class names are content-hashed** in this mode instead of counted, so a class resolved on the
  server matches the one the client bundle resolves for the same props.
- **Still client-only:** hover-callback children (`{({ isHover }) => …}`) and `Box.Theme`, which
  needs state, storage and a media-query listener. Theme _styles_ are unaffected: a `theme` prop
  generates ancestor-scoped rules, so setting the theme class on `<html>` in a server component is
  enough.
- **Most pre-built components render on the server too.** `Flex`, `Grid`, `Button`, `Textbox`,
  `Textarea`, `RadioButton`, `BaseSvg` and the semantic tags (`H1`, `P`, `Link`, `Nav` …) are
  hook-free wrappers around Box, and their published chunks import the package by name — so the
  `react-server` condition reaches them and they resolve the same hook-free Box. Import them
  straight into a Server Component.
- **The stateful ones become client boundaries.** `Dropdown`, `Tooltip`, `DataGrid`, `Checkbox`,
  `Select` and `Form` hold state or measure the DOM, so their chunks ship a `'use client'` banner.
  A Server Component may still import one — the bundler opens the boundary for you — but it is
  hydrated like any client component, and its CSS is in the server-rendered HTML only if a client
  module of yours has already called `Box.configure({ sink: 'element' })`.
- **React 19 only.** On React 18 the elements cannot be hoisted and render inline; keep the default
  sink there (a documented App Router fallback for React 18 is still to come).
- **Cost:** one base element per page (the reset, `:root`, and the layer order — ~1.8 KB gzipped)
  plus one `<style>` element per distinct rule, deduped across every Box that uses it.

A whole Next.js App Router app built this way — streamed Suspense boundary, client island, theme
toggle, and a page of pre-built components rendered on the server — is in
[`examples/next-app`](examples/next-app): `npm run build:next-app` and `npm run smoke:next-app`,
which starts the production server and asserts on the HTML it serves.

## Behaviour primitives for your own components

Every accessible widget needs the same mechanics, and none of them are visible in the markup:
return focus to whatever opened a layer, move through a list with the arrow keys, close on Escape
or a press outside, hold a value the consumer may or may not own, generate ids that wire one
element to another. They are what this library's components are built from, and they ship on their
own for the patterns it does not cover:

```tsx
import { useControllableState, useDismiss, useFocusReturn, useIdentifier, useRovingFocus } from '@cronocode/react-box/a11y';
import VisuallyHidden from '@cronocode/react-box/components/visuallyHidden';

function Menu({ open, onOpenChange, items }) {
  const trigger = useRef(null);
  const popup = useRef(null);

  const roving = useRovingFocus({ count: items.length, textOf: (index) => items[index].label });

  useDismiss({ enabled: open, inside: [trigger, popup], onDismiss: (reason, event) => onOpenChange(false, { reason, event }) });
  useFocusReturn({ enabled: open, returnTo: trigger });
}
```

2.2 KB gzipped for all five hooks, and they pull in no styling engine — you can use them next to
any CSS you like. Changes are **event-sourced**: `onChange(value, { reason, event })` tells you
_why_ something closed (`'escape'`, `'outside-pointer'`, a reason of your own), which is what makes
a controlled component controllable in practice. Roles and ARIA are deliberately left to you: a
listbox and a menu navigate identically and are named completely differently.

Full reference: [docs/a11y-primitives.md](docs/a11y-primitives.md).

## Using the core without React

The engine that turns props into CSS has no framework in it, and it is published on its own:

```js
import { createStyleEngine } from '@cronocode/react-box/core';

const engine = createStyleEngine();

document.querySelector('#card').className = engine.classNames({
  p: 4,
  bgColor: 'blue-500',
  borderRadius: 2,
  hover: { bgColor: 'blue-600' },
  md: { p: 8 },
});
```

That is the whole runtime. The props are the ones `<Box>` takes — pseudo-classes, breakpoints,
themes, `component`/`variant` — and the CSS behind them is written to a `<style>` element the
engine creates, on its own microtask. Nothing has to be flushed, mounted or provided.

```js
const engine = createStyleEngine();

// Custom variables and props, the vanilla form of Box.extend()
engine.extend(
  { brand: '#6d28d9' },
  {},
  { bgColor: [{ styleName: 'background-color', values: ['brand'], valueFormat: (v, get) => get(v) }] },
);

// Component defaults with variants, the vanilla form of Box.components()
engine.components({ panel: { styles: { p: 6, borderRadius: 3 }, variants: { accent: { b: 2, borderColor: 'brand' } } } });

engine.classNames({ component: 'panel', variant: 'accent' });
engine.flushSync(); // only when computed styles are read in the same tick
engine.getStyles(); // the stylesheet as text, for static output
```

Theming is the same state machine `<Box.Theme>` runs, as a plain object:

```js
import { createThemeController } from '@cronocode/react-box/core';

// Reads prefers-color-scheme, restores a stored choice, writes the theme onto <html>, and follows
// the system preference until something overrides it. Theme rules are ancestor-scoped (`.dark .p-4`),
// so that one class name restyles everything inside.
const theme = createThemeController({ storageKey: 'theme' });

theme.subscribe((name) => console.log('theme is now', name));
theme.set('dark'); // theme.set(null) hands control back to the system
```

Notes:

- **The engine is explicit here.** The React entries share one lazily-created default instance so
  `Box` and `Box.extend()` agree with no configuration; a vanilla app has no such ambient thing to
  agree with, and separate instances are what keeps a widget independent of its host page.
- **No React reaches this entry**, in the sources or in the bundle — both are checked in CI. It is
  14 KB gzipped, all engine.
- `sink: 'string'` collects CSS in memory with no DOM (`getStyles()` reads it back), which is how
  server rendering works; `sink: 'element'` is the React 19 mode above and has no meaning here, so
  `classNames()` refuses to run in it.

A complete page — props, pseudo-classes, breakpoints, themes, `extend`, `components`, no framework
— is in [`examples/vanilla`](examples/vanilla): `npm run dev:vanilla`.

## Architecture

The styling engine is framework-free. Everything that generates CSS — the ~144 prop definitions,
the value formatters, class-name generation, rule ordering, the style sinks (CSSOM, `textContent`,
string for SSR, style elements for React 19), the flush scheduler, CSS variables and the theme
runtime — lives in `src/core/` and imports no React at all. CI fails the build if it ever does
(`npm run check:boundaries`), and it ships on its own as
[`@cronocode/react-box/core`](#using-the-core-without-react).

React is a thin adapter on top of it:

|                                                            | Files | Lines | Share    |
| ---------------------------------------------------------- | ----- | ----- | -------- |
| Core engine (`src/core/`, `core.ts`)                       | 19    | 4,694 | 90.3%    |
| React binding (`src/react/`, `box.ts`, `rsc.ts`, `ssg.ts`) | 12    | 505   | **9.7%** |

The binding is the whole React-specific surface: resolve class names during render, flush the
pending rules from `useInsertionEffect`, render the style elements of the Server-Component path,
and hold the theme state. React feature code the components share sits alongside it and is counted
separately — three helper hooks (`useVisibility`, `usePortalContainer`, `useVirtualization`) and
the six modules behind [`@cronocode/react-box/a11y`](#behaviour-primitives-for-your-own-components),
727 lines together. A Vue adapter would need its own arrow-key navigation for the same reason it
would need its own components, which says nothing about how much of the styling engine is
React-specific.

That ratio is not theoretical: the same engine is driven straight from the DOM in
[`examples/vanilla`](examples/vanilla) with no framework loaded, and from a server with no
`document` in `ssg.ts`. Numbers are printed by `npm run check:boundaries` and refreshed with the
code.

See [CONTRIBUTING.md](CONTRIBUTING.md#the-core-boundary) for the boundary rules and where new code
belongs.
