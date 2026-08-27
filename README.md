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
import Box from '@cronocode/react-box';
import { H1, P } from '@cronocode/react-box/components/semantics';

export default function Page() {
  return (
    <Box p={6} bgColor="slate-50" borderRadius={2}>
      <H1 fontSize={24}>Rendered on the server</H1>
      <P mt={2} color="slate-600" sm={{ fontSize: 16 }}>
        Its CSS was hoisted into &lt;head&gt; by React, not inserted by a client runtime.
      </P>
    </Box>
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
  enough. The pre-built components (`Flex`, `Button`, `Dropdown`, `DataGrid`, …) are client
  components today.
- **React 19 only.** On React 18 the elements cannot be hoisted and render inline; keep the default
  sink there (a documented App Router fallback for React 18 is still to come).
- **Cost:** one base element per page (the reset, `:root`, and the layer order — ~1.8 KB gzipped)
  plus one `<style>` element per distinct rule, deduped across every Box that uses it.

## Architecture

The styling engine is framework-free. Everything that generates CSS — the ~144 prop definitions,
the value formatters, class-name generation, rule ordering, the style sinks (CSSOM, `textContent`,
string for SSR, style elements for React 19), the flush scheduler, CSS variables and the theme
runtime — lives in `src/core/` and imports no React at all. CI fails the build if it ever does
(`npm run check:boundaries`).

React is a thin adapter on top of it:

|                                                            | Files | Lines | Share    |
| ---------------------------------------------------------- | ----- | ----- | -------- |
| Core engine (`src/core/`)                                  | 15    | 4,377 | 90.2%    |
| React binding (`src/react/`, `box.ts`, `rsc.ts`, `ssg.ts`) | 11    | 478   | **9.8%** |

The binding is the whole React-specific surface: resolve class names during render, flush the
pending rules from `useInsertionEffect`, render the style elements of the Server-Component path,
and hold the theme state. Three shared React hooks
(`useVisibility`, `usePortalContainer`, `useVirtualization`, 212 lines) sit alongside it for the
pre-built components to use.

That ratio is what makes a non-React target realistic rather than theoretical — the engine can be
driven straight from the DOM, from a server with no `document`, or from another framework's adapter.
Numbers are printed by `npm run check:boundaries` and refreshed with the code.

See [CONTRIBUTING.md](CONTRIBUTING.md#the-core-boundary) for the boundary rules and where new code
belongs.
