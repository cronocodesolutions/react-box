# React box

This is a react base component which will reduce considerably necessity to write css code.

## Getting Started

1. Installation

```
npm install @cronocode/react-box
```

2. Use component

Sizes is equal to `1/4rem`

`padding={3}` means `1/4 * 3 => 0.75rem`

In the example below is creating a box with `maring: 0.5rem` and `padding: 1.75rem`

```
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

```
import Box from "@cronocode/react-box";
```

<br/>

### Alias-shortcuts components

- **Flex** - this is a `Box` component with `display: flex` style

```
import Flex from "@cronocode/react-box/components/flex";
```

- **Button** - this is a `Box` component with html tag `button` and `onClick` prop

```
import Button from "@cronocode/react-box/components/button";
```

- **Textbox** - this is a `Box` component with html tag `input`

```
import Textbox from "@cronocode/react-box/components/textbox";
```

- **Tooltip** - this is useful when you need a position absolute and the parent has overflow hidden.

```
import Tooltip from "@cronocode/react-box/components/tooltip";
```

## Theme variables

```
  --borderColor: black;
  --outlineColor: black;
  --lineHeight: 1.2;
  --fontSize: 14px;
  --transitionTime: 0.25s;
```
