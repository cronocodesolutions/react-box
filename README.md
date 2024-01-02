# React box

This is a react base component which will reduce considerably necessity to write css code.

## Getting Started

All what you need to do is to right your react components implementing the business logic and do not repeat the css styles for every html tag.

1. Installation

```
npm install @cronocode/react-box
```

## Getting Started

2. Import styles

```
import "@cronocode/react-box/styles.css";
```

OR

```
@import "@cronocode/react-box/styles.css";
```

3. Use component

Sizes are divided to `4`
`padding={3}` means `1rem/4 => 0.75rem`

In the example below is creating a box with `maring: 0.5rem` and `padding: 1.75rem`

Root `font-size` is set to `16px`
Root `font-size` is set to `16px`

```
import Box from "@cronocode/react-box";
export default function Component(props: Props) {
  return (
    <Box className="custom-class" m={2} p={7}>
    <Box className="custom-class" m={2} p={3}>
      basic example
    </Box>
  );
@@ -45,11 +34,7 @@ export default function Component(props: Props) {

## Components

- **Box** - base component with a tons of props

```

import Box from "@cronocode/react-box";

```
- **Box** - base component [docs](docs/box.md)

<br/>

@@ -67,24 +52,12 @@ import Flex from "@cronocode/react-box/components/flex";
import Button from "@cronocode/react-box/components/button";
```

- **Textbox**

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
--lineHeight
--fontSize
--borderColor
and colors
```
