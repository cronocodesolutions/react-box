# React box

This is a react base component which will get rid of necessity in 90% (the percentage is just a guess =)) ) of times to write css code.

All what you need to do is to right your react components implementing the business logic and do not repeat the css styles for every html tag.

For example, in the web app hundreds if not thousands of `div`s have `padding:12px`. Using `Box` components is enough to write `<Box p={3} >...</Box>`

## Getting Started

1. Import styles

```
import "@cronocode/react-box/styles.css";
```

2. Use component

   In the example below is creating a box with `maring: 0.5rem` and `padding: 0.75rem`

   Root `font-size` is set to `16px`

```
import Box from "@cronocode/react-box";

export default function Component(props: Props) {
  return (
    <Box className="custom-class" m={2} p={3}>
      basic example
    </Box>
  );
}
```

## Components

- **Box** - base component [docs](docs/box.md)

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

## Theme variables

```
--lineHeight
--fontSize
--borderColor

and colors
```
