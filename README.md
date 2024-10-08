# React box

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
        valueFormat: (value, useVariable) => useVariable(value),
      },
    ],
  }
);
```

2. Now you have to add typings to the Box in order to have intellisense for you new props and value.
   You need to create a `box.d.ts`

```JS
import '@cronocode/react-box';
import { ExtractBoxStyles } from '@cronocode/react-box/types';
import { extendedProps, extendedPropTypes } from './path-to-your-b0x-extends-declaration';

declare module '@cronocode/react-box/types' {
  namespace Augmented {
    interface BoxProps extends ExtractBoxStyles<typeof extendedProps> {}
    interface BoxPropTypes extends ExtractBoxStyles<typeof extendedPropTypes> {}
  }
}
```

## Theme for components

In the project root file (main.tsx) use `Theme.setup`

```JS
import Theme from '@cronocode/react-box/theme';

Theme.setup({
  button: {
    styles: {
      px: 4
    },
    themes: {
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

or is possible to use Button with specific theme

```JS
import Button from '@cronocode/react-box/components/button';

function MyComponent() {
  return <Button theme="mytheme">Click me</Button>
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
