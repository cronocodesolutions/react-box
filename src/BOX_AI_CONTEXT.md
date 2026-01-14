# @cronocode/react-box - AI Assistant Context

Reference document for AI assistants helping developers use this runtime CSS-in-JS library.

---

## Quick Overview

**What it is**: A React library that converts component props directly into CSS classes at runtime. No CSS files needed.

**Core component**: `Box` - a polymorphic component that accepts ~144 CSS props and renders any HTML element.

```tsx
import Box from '@cronocode/react-box';

// Basic usage
<Box p={4} bgColor="blue-500" color="white">Content</Box>

// Renders as different elements
<Box tag="button" p={3}>Button</Box>
<Box tag="a" props={{ href: '/link' }}>Link</Box>

// Alias components (recommended)
import Button from '@cronocode/react-box/components/button';
<Button p={3}>Button</Button>
```

---

## Critical: Numeric Value Formatters

**This is the #1 source of confusion.** Different props have different dividers:

| Prop Category | Divider | Formula | Example | CSS Output |
|--------------|---------|---------|---------|------------|
| Spacing (`p`, `m`, `gap`, `px`, `py`, `mx`, `my`, etc.) | 4 | value/4 rem | `p={4}` | `padding: 1rem` (16px) |
| Font size (`fontSize`) | **16** | value/16 rem | `fontSize={16}` | `font-size: 1rem` (16px) |
| Width/Height (numeric) | 4 | value/4 rem | `width={20}` | `width: 5rem` (80px) |
| Border width (`b`, `bx`, `by`, `bt`, `br`, `bb`, `bl`) | none | direct px | `b={1}` | `border-width: 1px` |
| Border radius (`borderRadius`) | none | direct px | `borderRadius={8}` | `border-radius: 8px` |

### Common fontSize Values
```tsx
fontSize={12}  // → 0.75rem ≈ 12px (small)
fontSize={14}  // → 0.875rem ≈ 14px (body)
fontSize={16}  // → 1rem = 16px (default)
fontSize={18}  // → 1.125rem ≈ 18px (large)
fontSize={24}  // → 1.5rem = 24px (h2)
fontSize={32}  // → 2rem = 32px (h1)
```

### Common Spacing Values (divider = 4)
```tsx
p={1}   // → 0.25rem = 4px
p={2}   // → 0.5rem = 8px
p={3}   // → 0.75rem = 12px
p={4}   // → 1rem = 16px
p={6}   // → 1.5rem = 24px
p={8}   // → 2rem = 32px
```

---

## Prop Reference

### Spacing
| Prop | CSS Property |
|------|-------------|
| `p` | padding |
| `px` | padding-left + padding-right |
| `py` | padding-top + padding-bottom |
| `pt`, `pr`, `pb`, `pl` | padding-top/right/bottom/left |
| `m` | margin |
| `mx`, `my` | margin horizontal/vertical |
| `mt`, `mr`, `mb`, `ml` | margin-top/right/bottom/left |
| `gap` | gap (flexbox/grid) |

### Layout
| Prop | CSS Property | Values |
|------|-------------|--------|
| `display` | display | `'flex'`, `'block'`, `'inline'`, `'grid'`, `'none'`, `'inline-flex'`, etc. |
| `d` | flex-direction | `'row'`, `'column'`, `'row-reverse'`, `'column-reverse'` |
| `wrap` | flex-wrap | `'wrap'`, `'nowrap'`, `'wrap-reverse'` |
| `items` | align-items | `'center'`, `'start'`, `'end'`, `'stretch'`, `'baseline'` |
| `justify` | justify-content | `'center'`, `'start'`, `'end'`, `'between'`, `'around'`, `'evenly'` |
| `flex` | flex | number or string |
| `grow` | flex-grow | number |
| `shrink` | flex-shrink | number |

### Sizing
| Prop | CSS Property | Accepts |
|------|-------------|---------|
| `width` | width | number (rem/4), string (`'auto'`, `'1/2'`, `'fit'`, `'fit-screen'`) |
| `height` | height | number (rem/4), string (`'auto'`, `'fit'`, `'fit-screen'`) |
| `minWidth`, `maxWidth` | min/max-width | number or string |
| `minHeight`, `maxHeight` | min/max-height | number or string |

### Colors (Tailwind-like palette)
| Prop | CSS Property |
|------|-------------|
| `bgColor` | background-color |
| `color` | color |
| `borderColor` | border-color |

**Color values**: `'gray-50'` through `'gray-900'`, same for `red`, `orange`, `yellow`, `green`, `teal`, `blue`, `indigo`, `purple`, `pink`, `violet`.

Also: `'white'`, `'black'`, `'transparent'`, `'inherit'`, `'currentColor'`

### Borders
| Prop | CSS Property |
|------|-------------|
| `b` | border-width (all sides) |
| `bx` | border-left-width + border-right-width |
| `by` | border-top-width + border-bottom-width |
| `bt`, `br`, `bb`, `bl` | individual sides |
| `borderRadius` | border-radius |
| `borderStyle` | border-style (`'solid'`, `'dashed'`, `'dotted'`, `'none'`) |

### Typography
| Prop | CSS Property |
|------|-------------|
| `fontSize` | font-size (divider: 16) |
| `fontWeight` | font-weight (`400`, `500`, `600`, `700`, etc.) |
| `lineHeight` | line-height |
| `textAlign` | text-align |
| `textDecoration` | text-decoration |
| `textTransform` | text-transform |
| `whiteSpace` | white-space |
| `overflow` | overflow |
| `textOverflow` | text-overflow |

### Positioning
| Prop | CSS Property |
|------|-------------|
| `position` | position (`'relative'`, `'absolute'`, `'fixed'`, `'sticky'`) |
| `top`, `right`, `bottom`, `left` | positioning offsets |
| `zIndex` | z-index |

### Effects
| Prop | CSS Property |
|------|-------------|
| `shadow` | box-shadow (`'small'`, `'medium'`, `'large'`, `'xl'`, `'none'`) |
| `opacity` | opacity |
| `cursor` | cursor |
| `pointerEvents` | pointer-events |
| `transition` | transition |
| `transform` | transform |

---

## Pseudo-Classes

Apply styles on interaction states:

```tsx
<Box
  bgColor="blue-500"
  hover={{ bgColor: 'blue-600' }}
  focus={{ outline: 'none', ring: 2 }}
  active={{ bgColor: 'blue-700' }}
  disabled={{ opacity: 0.5, cursor: 'not-allowed' }}
/>
```

**Available pseudo-classes**: `hover`, `focus`, `active`, `disabled`, `checked`, `indeterminate`, `required`, `selected`, `focusWithin`, `focusVisible`, `first`, `last`, `even`, `odd`, `empty`

---

## Responsive Breakpoints

Mobile-first breakpoints using min-width media queries:

```tsx
<Box
  p={2}           // Base (mobile)
  sm={{ p: 3 }}   // ≥640px
  md={{ p: 4 }}   // ≥768px
  lg={{ p: 6 }}   // ≥1024px
  xl={{ p: 8 }}   // ≥1280px
  xxl={{ p: 10 }} // ≥1536px
/>
```

**Combine with pseudo-classes**:
```tsx
<Box
  bgColor="white"
  hover={{ bgColor: 'gray-100' }}
  md={{
    bgColor: 'gray-50',
    hover: { bgColor: 'gray-200' }
  }}
/>
```

---

## Theme System

### Setting Up Themes

```tsx
import Box from '@cronocode/react-box';

function App() {
  return (
    <Box.Theme value="dark">
      <YourApp />
    </Box.Theme>
  );
}
```

### Theme-Aware Styles

```tsx
<Box
  bgColor="white"
  color="gray-900"
  theme={{
    dark: {
      bgColor: 'gray-900',
      color: 'gray-100',
    },
  }}
/>
```

### Theme + Pseudo-Classes

```tsx
<Box
  bgColor="white"
  hover={{ bgColor: 'gray-100' }}
  theme={{
    dark: {
      bgColor: 'gray-800',
      hover: { bgColor: 'gray-700' },
    },
  }}
/>
```

---

## Component System

### Using Built-in Components

```tsx
<Box component="button" variant="primary">Click me</Box>
<Box component="button.icon" />
```

### Pre-built Components

Import ready-to-use components:

```tsx
// Form components
import Button from '@cronocode/react-box/components/button';
import Textbox from '@cronocode/react-box/components/textbox';
import Checkbox from '@cronocode/react-box/components/checkbox';
import Dropdown from '@cronocode/react-box/components/dropdown';
import Tooltip from '@cronocode/react-box/components/tooltip';

// Layout
import Flex from '@cronocode/react-box/components/flex';  // Box with display="flex" (supports inline prop)
import Grid from '@cronocode/react-box/components/grid';  // Box with display="grid" (supports inline prop)

<Button variant="primary">Submit</Button>
<Textbox placeholder="Enter text..." />
<Flex gap={4} items="center">...</Flex>
<Flex inline gap={2}>Inline flex</Flex>
```

### Semantic HTML Components

Alias components for semantic HTML elements (from `components/semantics`):

```tsx
import {
  // Typography
  P, H1, H2, H3, H4, H5, H6, Span, Mark,
  // Structure
  Header, Footer, Main, Nav, Section, Article, Aside,
  // Other
  Label, Link, Img, Figure, Figcaption, Details, Summary, Menu, Time,
} from '@cronocode/react-box/components/semantics';

// These are Box aliases with the correct HTML tag
<H1 fontSize={32} fontWeight={700}>Title</H1>
<P color="gray-600">Paragraph text</P>
<Link props={{ href: '/about' }} color="blue-500">About</Link>
<Flex tag="nav" gap={4}>...</Flex>
```

### Custom Components with Box.components()

```tsx
// Define custom component styles
Box.components({
  card: {
    styles: {
      display: 'flex',
      d: 'column',
      p: 4,
      bgColor: 'white',
      borderRadius: 8,
      shadow: 'medium',
    },
    variants: {
      bordered: { b: 1, borderColor: 'gray-200', shadow: 'none' },
      elevated: { shadow: 'large' },
    },
    children: {
      header: { styles: { fontSize: 18, fontWeight: 600, mb: 3 } },
      body: { styles: { flex: 1 } },
    },
  },
});

// Use it
<Box component="card" variant="bordered">
  <Box component="card.header">Title</Box>
  <Box component="card.body">Content</Box>
</Box>
```

---

## Extension System

### Adding Custom Colors/Variables

```tsx
import Box from '@cronocode/react-box';

export const { extendedProps, extendedPropTypes } = Box.extend(
  // Custom CSS variables
  {
    'brand-primary': '#ff6600',
    'brand-secondary': '#0066ff',
  },

  // New props (optional)
  {},

  // Extend existing props with new values
  {
    bgColor: [
      {
        values: ['brand-primary', 'brand-secondary'] as const,
        styleName: 'background-color',
        valueFormat: (value, getVariable) => getVariable(value),
      },
    ],
    color: [
      {
        values: ['brand-primary', 'brand-secondary'] as const,
        styleName: 'color',
        valueFormat: (value, getVariable) => getVariable(value),
      },
    ],
  }
);

// Now use your custom colors
<Box bgColor="brand-primary" color="white">Branded</Box>
```

### TypeScript Type Augmentation

**Manual approach** (simple cases):

```typescript
// types.d.ts
import '@cronocode/react-box/types';

declare module '@cronocode/react-box/types' {
  namespace Augmented {
    interface BoxPropTypes {
      bgColor: 'brand-primary' | 'brand-secondary';
    }
    interface ComponentsTypes {
      card: 'bordered' | 'elevated';
    }
  }
}
```

**Generic approach** (recommended - auto-extracts types from your definitions):

```typescript
// types.d.ts
import { ExtractComponentsAndVariants, ExtractBoxStyles } from '@cronocode/react-box/types';
import { components } from './boxComponents';
import { extendedPropTypes, extendedProps } from './boxExtends';

declare module '@cronocode/react-box/types' {
  namespace Augmented {
    interface BoxProps extends ExtractBoxStyles<typeof extendedProps> {}
    interface BoxPropTypes extends ExtractBoxStyles<typeof extendedPropTypes> {}
    interface ComponentsTypes extends ExtractComponentsAndVariants<typeof components> {}
  }
}
```

---

## Common Patterns

### Flex Container
```tsx
import Flex from '@cronocode/react-box/components/flex';

<Flex d="column" gap={4} items="center" justify="between">
  {children}
</Flex>
```

### Card
```tsx
<Box p={4} bgColor="white" borderRadius={8} shadow="medium">
  {content}
</Box>
```

### Button
```tsx
import Button from '@cronocode/react-box/components/button';

<Button
  px={4}
  py={2}
  bgColor="blue-500"
  color="white"
  borderRadius={6}
  fontWeight={500}
  hover={{ bgColor: 'blue-600' }}
  disabled={{ opacity: 0.5, cursor: 'not-allowed' }}
>
  Click me
</Button>
```

### Input Field
```tsx
import Textbox from '@cronocode/react-box/components/textbox';

<Textbox
  placeholder="Enter text..."
  width="fit"
  px={3}
  py={2}
  b={1}
  borderColor="gray-300"
  borderRadius={6}
  focus={{ borderColor: 'blue-500', outline: 'none' }}
/>
```

### Grid Layout
```tsx
import Grid from '@cronocode/react-box/components/grid';

<Grid gridCols={3} gap={4}>
  {items.map(item => <Box key={item.id}>{item.content}</Box>)}
</Grid>
```

### Responsive Stack
```tsx
import Flex from '@cronocode/react-box/components/flex';

<Flex d="column" gap={2} md={{ d: 'row', gap: 4 }}>
  {children}
</Flex>
```

### Truncated Text
```tsx
<Box
  overflow="hidden"
  textOverflow="ellipsis"
  whiteSpace="nowrap"
>
  Long text that will be truncated...
</Box>
```

### Overlay/Modal Backdrop
```tsx
<Box
  position="fixed"
  top={0}
  left={0}
  right={0}
  bottom={0}
  bgColor="black"
  opacity={0.5}
  zIndex={50}
/>
```

**Note**: For tooltips, dropdowns, and popups that need to escape `overflow: hidden` containers, use the `Tooltip` component instead of manual `zIndex`. It uses React portals to render content outside the DOM hierarchy, avoiding z-index and overflow issues.

```tsx
import Tooltip from '@cronocode/react-box/components/tooltip';

<Tooltip content="Tooltip text">
  <Button>Hover me</Button>
</Tooltip>
```

---

## Group Hover (hoverGroup)

Style child elements when parent is hovered:

```tsx
// Parent with a className
<Flex className="card-row" gap={2}>
  {/* Child responds to parent hover */}
  <Box
    opacity={0}
    hoverGroup={{ 'card-row': { opacity: 1 } }}
  >
    Actions
  </Box>
</Flex>
```

---

## Server-Side Rendering (SSG/SSR)

```tsx
import { getStyles, resetStyles } from '@cronocode/react-box/ssg';

// After rendering your app, get generated styles
const cssString = getStyles();

// Inject into your HTML
<style id="crono-box">{cssString}</style>

// Reset for next request (in SSR)
resetStyles();
```

---

## Key Reminders for AI Assistants

1. **fontSize uses divider 16**, not 4. `fontSize={14}` → 14px, NOT 3.5px
2. **Spacing uses divider 4**. `p={4}` → 16px (1rem)
3. **Border width is direct px**. `b={1}` → 1px
4. **Colors are Tailwind-like**: `'gray-500'`, `'blue-600'`, etc.
5. **Breakpoints are mobile-first**: base → sm → md → lg → xl → xxl
6. **Theme styles nest**: `theme={{ dark: { hover: { ... } } }}`
7. **Use `tag` prop** to change the HTML element: `<Box tag="button">`
8. **HTML attributes go in `props`**: `<Box tag="a" props={{ href: '/link' }}>` - NOT directly as Box props
9. **Percentage widths**: Use strings like `width="1/2"` for 50%
10. **Full size shortcuts**: `width="fit"` = 100%, `width="fit-screen"` = 100vw
11. **Box is memoized** with `React.memo` - props comparison is efficient

---

## Debugging Tips

1. **Inspect styles**: Look for `<style id="crono-box">` in document head
2. **Check class names**: Elements get classes like `_b`, `_2a`, etc.
3. **Verify variables**: CSS variables are in `:root` rules
4. **Theme issues**: Ensure `<Box.Theme>` wraps your app
5. **Portal theming**: Tooltips/dropdowns use `#crono-box` container
