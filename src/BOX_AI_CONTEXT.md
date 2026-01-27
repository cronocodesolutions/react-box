# @cronocode/react-box - AI Assistant Context

Reference document for AI assistants helping developers use this runtime CSS-in-JS library.

---

## CRITICAL RULES (Read First!)

### Rule #1: NEVER Use Inline Styles

**WRONG** - Using `style` attribute:

```tsx
// DO NOT DO THIS
<Box style={{ minHeight: "100vh", width: "100%" }} />
<Box style={{ pointerEvents: "none" }} />
<Box style={{ alignItems: "center" }} />
<Box style={{ maxWidth: "1200px" }} />
```

**CORRECT** - Using Box props:

```tsx
// DO THIS INSTEAD
<Box minHeight="fit-screen" width="fit" />
<Box pointerEvents="none" />
<Box ai="center" />
<Box maxWidth={300} />
```

**If a prop doesn't exist for a CSS property**, create it using `Box.extend()` in your boxExtends.ts file. Never fall back to inline styles.

### Common Style-to-Prop Conversions

| Inline Style (WRONG)                          | Box Prop (CORRECT)                    |
| --------------------------------------------- | ------------------------------------- |
| `style={{ width: "100%" }}`                   | `width="fit"`                         |
| `style={{ width: "100vw" }}`                  | `width="fit-screen"`                  |
| `style={{ height: "100%" }}`                  | `height="fit"`                        |
| `style={{ height: "100vh" }}`                 | `height="fit-screen"`                 |
| `style={{ minHeight: "100vh" }}`              | `minHeight="fit-screen"`              |
| `style={{ maxWidth: "1200px" }}`              | `maxWidth={300}` (300/4=75rem=1200px) |
| `style={{ alignItems: "center" }}`            | `ai="center"`                         |
| `style={{ justifyContent: "space-between" }}` | `jc="between"`                        |
| `style={{ flexDirection: "column" }}`         | `d="column"`                          |
| `style={{ pointerEvents: "none" }}`           | `pointerEvents="none"`                |
| `style={{ cursor: "pointer" }}`               | `cursor="pointer"`                    |
| `style={{ overflow: "hidden" }}`              | `overflow="hidden"`                   |
| `style={{ position: "relative" }}`            | `position="relative"`                 |
| `style={{ zIndex: 10 }}`                      | `zIndex={10}`                         |
| `style={{ opacity: 0.5 }}`                    | `opacity={0.5}`                       |

### When a Prop Doesn't Exist

If you need a CSS property that doesn't have a Box prop, extend Box instead of using inline styles:

```tsx
// boxExtends.ts - Create new props for missing CSS properties
import Box from '@cronocode/react-box';

export const { extendedProps, extendedPropTypes } = Box.extend(
  {}, // CSS variables (if needed)
  {
    // Add new props
    aspectRatio: [
      {
        values: ['auto', '1/1', '16/9', '4/3', '3/2'] as const,
        styleName: 'aspect-ratio',
        valueFormat: (value) => value,
      },
    ],
    backdropBlur: [
      {
        values: ['none', 'sm', 'md', 'lg'] as const,
        styleName: 'backdrop-filter',
        valueFormat: (value) => {
          const map = { none: 'none', sm: 'blur(4px)', md: 'blur(8px)', lg: 'blur(16px)' };
          return map[value];
        },
      },
    ],
  },
  {}, // Extended existing props (if needed)
);

// Now use the new props
<Box aspectRatio="16/9" backdropBlur="md" />;
```

### Rule #2: ALWAYS Use Component Shortcuts

**⚠️ NEVER use `<Box tag="...">` when a semantic component exists!**

The `tag` prop should ONLY be used for rare HTML elements that don't have a component shortcut (e.g., `<Box tag="datalist">`). For all common elements, use the corresponding component.

**WRONG** - Using `tag` prop for common elements:

```tsx
// ❌ DO NOT DO THIS - These are WRONG even though they work
<Box tag="img" props={{ src: logo, alt: "Logo" }} />   // WRONG!
<Box tag="a" props={{ href: "#" }}>Link</Box>          // WRONG!
<Box tag="button" onClick={...}>Click</Box>            // WRONG!
<Box tag="nav">...</Box>                               // WRONG!
<Box tag="h1" fontSize={32}>Title</Box>                // WRONG!
<Box tag="p">Text</Box>                                // WRONG!
<Box tag="span">Inline</Box>                           // WRONG!
<Box display="flex" gap={4}>...</Box>                  // WRONG!
<Box display="grid" gridCols={3}>...</Box>             // WRONG!
```

**CORRECT** - Using semantic components:

```tsx
// DO THIS INSTEAD
import { Img, Link, H1, Nav } from '@cronocode/react-box/components/semantics';
import Button from '@cronocode/react-box/components/button';
import Flex from '@cronocode/react-box/components/flex';
import Grid from '@cronocode/react-box/components/grid';

<Img props={{ src: logo, alt: "Logo" }} />
<Link props={{ href: "#" }}>Link</Link>
<Button onClick={...}>Click</Button>
<Flex gap={4}>...</Flex>
<Grid gridCols={3}>...</Grid>
<Nav>...</Nav>
<H1 fontSize={32}>Title</H1>
```

### Component Shortcuts Reference

| Instead of...          | Use...       | Import from                                 |
| ---------------------- | ------------ | ------------------------------------------- |
| `<Box display="flex">` | `<Flex>`     | `@cronocode/react-box/components/flex`      |
| `<Box display="grid">` | `<Grid>`     | `@cronocode/react-box/components/grid`      |
| `<Box tag="button">`   | `<Button>`   | `@cronocode/react-box/components/button`    |
| `<Box tag="input">`    | `<Textbox>`  | `@cronocode/react-box/components/textbox`   |
| `<Box tag="textarea">` | `<Textarea>` | `@cronocode/react-box/components/textarea`  |
| `<Box tag="a">`        | `<Link>`     | `@cronocode/react-box/components/semantics` |
| `<Box tag="img">`      | `<Img>`      | `@cronocode/react-box/components/semantics` |
| `<Box tag="h1">`       | `<H1>`       | `@cronocode/react-box/components/semantics` |
| `<Box tag="h2">`       | `<H2>`       | `@cronocode/react-box/components/semantics` |
| `<Box tag="h3">`       | `<H3>`       | `@cronocode/react-box/components/semantics` |
| `<Box tag="p">`        | `<P>`        | `@cronocode/react-box/components/semantics` |
| `<Box tag="span">`     | `<Span>`     | `@cronocode/react-box/components/semantics` |
| `<Box tag="nav">`      | `<Nav>`      | `@cronocode/react-box/components/semantics` |
| `<Box tag="header">`   | `<Header>`   | `@cronocode/react-box/components/semantics` |
| `<Box tag="footer">`   | `<Footer>`   | `@cronocode/react-box/components/semantics` |
| `<Box tag="main">`     | `<Main>`     | `@cronocode/react-box/components/semantics` |
| `<Box tag="section">`  | `<Section>`  | `@cronocode/react-box/components/semantics` |
| `<Box tag="article">`  | `<Article>`  | `@cronocode/react-box/components/semantics` |
| `<Box tag="aside">`    | `<Aside>`    | `@cronocode/react-box/components/semantics` |
| `<Box tag="label">`    | `<Label>`    | `@cronocode/react-box/components/semantics` |

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

| Prop Category                                           | Divider | Formula      | Example            | CSS Output               |
| ------------------------------------------------------- | ------- | ------------ | ------------------ | ------------------------ |
| Spacing (`p`, `m`, `gap`, `px`, `py`, `mx`, `my`, etc.) | 4       | value/4 rem  | `p={4}`            | `padding: 1rem` (16px)   |
| Font size (`fontSize`)                                  | **16**  | value/16 rem | `fontSize={16}`    | `font-size: 1rem` (16px) |
| Width/Height (numeric)                                  | 4       | value/4 rem  | `width={20}`       | `width: 5rem` (80px)     |
| Border width (`b`, `bx`, `by`, `bt`, `br`, `bb`, `bl`)  | none    | direct px    | `b={1}`            | `border-width: 1px`      |
| Border radius (`borderRadius`)                          | none    | direct px    | `borderRadius={8}` | `border-radius: 8px`     |

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

| Prop                   | CSS Property                  |
| ---------------------- | ----------------------------- |
| `p`                    | padding                       |
| `px`                   | padding-left + padding-right  |
| `py`                   | padding-top + padding-bottom  |
| `pt`, `pr`, `pb`, `pl` | padding-top/right/bottom/left |
| `m`                    | margin                        |
| `mx`, `my`             | margin horizontal/vertical    |
| `mt`, `mr`, `mb`, `ml` | margin-top/right/bottom/left  |
| `gap`                  | gap (flexbox/grid)            |

### Layout

| Prop      | CSS Property    | Values                                                                     |
| --------- | --------------- | -------------------------------------------------------------------------- |
| `display` | display         | `'flex'`, `'block'`, `'inline'`, `'grid'`, `'none'`, `'inline-flex'`, etc. |
| `d`       | flex-direction  | `'row'`, `'column'`, `'row-reverse'`, `'column-reverse'`                   |
| `wrap`    | flex-wrap       | `'wrap'`, `'nowrap'`, `'wrap-reverse'`                                     |
| `ai`      | align-items     | `'center'`, `'start'`, `'end'`, `'stretch'`, `'baseline'`                  |
| `jc`      | justify-content | `'center'`, `'start'`, `'end'`, `'between'`, `'around'`, `'evenly'`        |
| `flex`    | flex            | number or string                                                           |
| `grow`    | flex-grow       | number                                                                     |
| `shrink`  | flex-shrink     | number                                                                     |

### Sizing

| Prop                     | CSS Property   | Accepts                                                             |
| ------------------------ | -------------- | ------------------------------------------------------------------- |
| `width`                  | width          | number (rem/4), string (`'auto'`, `'1/2'`, `'fit'`, `'fit-screen'`) |
| `height`                 | height         | number (rem/4), string (`'auto'`, `'fit'`, `'fit-screen'`)          |
| `minWidth`, `maxWidth`   | min/max-width  | number or string                                                    |
| `minHeight`, `maxHeight` | min/max-height | number or string                                                    |

**Percentage/Fraction Values:**

All sizing, spacing, and positioning props accept percentage strings:

```tsx
// Sizing
width="33%"     // → 33%
height="50%"    // → 50%
minWidth="20%"  // → min-width: 20%
maxWidth="80%"  // → max-width: 80%
minHeight="10%" // → min-height: 10%
maxHeight="90%" // → max-height: 90%

// Spacing (margin, padding, gap)
p="5%"          // → padding: 5%
px="10%"        // → padding-left/right: 10%
m="10%"         // → margin: 10%
mt="5%"         // → margin-top: 5%
gap="2%"        // → gap: 2%

// Positioning
top="10%"       // → top: 10%
left="50%"      // → left: 50%
right="0%"      // → right: 0%
bottom="20%"    // → bottom: 20%

// Fraction shortcuts (width/height only)
width="1/2"   // → 50%
width="1/3"   // → 33.333%
width="2/3"   // → 66.666%
width="1/4"   // → 25%
width="3/4"   // → 75%

// Special values
width="fit"        // → 100%
width="fit-screen" // → 100vw
height="fit"       // → 100%
height="fit-screen"// → 100vh
```

### Colors (Tailwind-like palette)

| Prop          | CSS Property     |
| ------------- | ---------------- |
| `bgColor`     | background-color |
| `color`       | color            |
| `borderColor` | border-color     |

**Color values**: `'gray-50'` through `'gray-900'`, same for `red`, `orange`, `yellow`, `green`, `teal`, `blue`, `indigo`, `purple`, `pink`, `violet`.

Also: `'white'`, `'black'`, `'transparent'`, `'inherit'`, `'currentColor'`

### Borders

| Prop                   | CSS Property                                               |
| ---------------------- | ---------------------------------------------------------- |
| `b`                    | border-width (all sides)                                   |
| `bx`                   | border-left-width + border-right-width                     |
| `by`                   | border-top-width + border-bottom-width                     |
| `bt`, `br`, `bb`, `bl` | individual sides                                           |
| `borderRadius`         | border-radius                                              |
| `borderStyle`          | border-style (`'solid'`, `'dashed'`, `'dotted'`, `'none'`) |

### Typography

| Prop             | CSS Property                                                 |
| ---------------- | ------------------------------------------------------------ |
| `fontSize`       | font-size (divider: 16)                                      |
| `fontWeight`     | font-weight (`400`, `500`, `600`, `700`, etc.)               |
| `lineHeight`     | line-height (number = pixels, e.g. `lineHeight={24}` → 24px) |
| `textAlign`      | text-align                                                   |
| `textDecoration` | text-decoration                                              |
| `textTransform`  | text-transform                                               |
| `whiteSpace`     | white-space                                                  |
| `overflow`       | overflow                                                     |
| `textOverflow`   | text-overflow                                                |

### Positioning

| Prop                             | CSS Property                                                 |
| -------------------------------- | ------------------------------------------------------------ |
| `position`                       | position (`'relative'`, `'absolute'`, `'fixed'`, `'sticky'`) |
| `top`, `right`, `bottom`, `left` | positioning offsets                                          |
| `zIndex`                         | z-index                                                      |

### Effects

| Prop            | CSS Property                                                    |
| --------------- | --------------------------------------------------------------- |
| `shadow`        | box-shadow (`'small'`, `'medium'`, `'large'`, `'xl'`, `'none'`) |
| `opacity`       | opacity                                                         |
| `cursor`        | cursor                                                          |
| `pointerEvents` | pointer-events                                                  |
| `transition`    | transition                                                      |
| `transform`     | transform                                                       |

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
  p={2} // Base (mobile)
  sm={{ p: 3 }} // ≥640px
  md={{ p: 4 }} // ≥768px
  lg={{ p: 6 }} // ≥1024px
  xl={{ p: 8 }} // ≥1280px
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
    hover: { bgColor: 'gray-200' },
  }}
/>
```

---

## Theme System

### Setting Up Themes

The `Box.Theme` component provides theme management with automatic detection based on system preferences.

**Auto-detect theme** (recommended):

```tsx
import Box from '@cronocode/react-box';

function App() {
  return (
    <Box.Theme>
      {/* Theme auto-detects from prefers-color-scheme: 'light' or 'dark' */}
      <YourApp />
    </Box.Theme>
  );
}
```

**Explicit theme**:

```tsx
<Box.Theme theme="dark">
  <YourApp />
</Box.Theme>
```

**Global vs Local theme**:

```tsx
// Global: Adds theme class to document.documentElement (affects entire page)
<Box.Theme theme="dark" use="global">
  <YourApp />
</Box.Theme>

// Local (default): Wraps children in a Box with theme class (scoped)
<Box.Theme theme="dark" use="local">
  <Section>Content</Section>
</Box.Theme>
```

### Using the Theme Hook

```tsx
import Box from '@cronocode/react-box';

function ThemeSwitcher() {
  const [theme, setTheme] = Box.useTheme();

  return <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>Current: {theme}</button>;
}

// Must be used within Box.Theme provider
function App() {
  return (
    <Box.Theme>
      <ThemeSwitcher />
    </Box.Theme>
  );
}
```

### Theme-Aware Styles

Apply styles based on the active theme:

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

Combine theme styles with pseudo-classes:

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

### Theme + Responsive Breakpoints

Combine all three systems:

```tsx
<Box
  p={4}
  bgColor="white"
  md={{
    p: 6,
    bgColor: 'gray-50',
  }}
  theme={{
    dark: {
      bgColor: 'gray-900',
      md: {
        bgColor: 'gray-800',
      },
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
import RadioButton from '@cronocode/react-box/components/radioButton';
import Dropdown from '@cronocode/react-box/components/dropdown';
import Tooltip from '@cronocode/react-box/components/tooltip';

// Layout
import Flex from '@cronocode/react-box/components/flex';  // Box with display="flex" (supports inline prop)
import Grid from '@cronocode/react-box/components/grid';  // Box with display="grid" (supports inline prop)

<Button variant="primary">Submit</Button>
<Textbox placeholder="Enter text..." />
<Flex gap={4} ai="center">...</Flex>
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
</Box>;
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
  },
);

// Now use your custom colors
<Box bgColor="brand-primary" color="white">
  Branded
</Box>;
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

<Flex d="column" gap={4} ai="center" jc="between">
  {children}
</Flex>;
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
</Button>;
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
/>;
```

### Grid Layout

```tsx
import Grid from '@cronocode/react-box/components/grid';

<Grid gridCols={3} gap={4}>
  {items.map((item) => (
    <Box key={item.id}>{item.content}</Box>
  ))}
</Grid>;
```

### Responsive Stack

```tsx
import Flex from '@cronocode/react-box/components/flex';

<Flex d="column" gap={2} md={{ d: 'row', gap: 4 }}>
  {children}
</Flex>;
```

### Truncated Text

```tsx
<Box overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
  Long text that will be truncated...
</Box>
```

### Overlay/Modal Backdrop

```tsx
<Box position="fixed" top={0} left={0} right={0} bottom={0} bgColor="black" opacity={0.5} zIndex={50} />
```

**Note**: For tooltips, dropdowns, and popups that need to escape `overflow: hidden` containers, use the `Tooltip` component instead of manual `zIndex`. It uses React portals to render content outside the DOM hierarchy, avoiding z-index and overflow issues.

```tsx
import Tooltip from '@cronocode/react-box/components/tooltip';

<Tooltip content="Tooltip text">
  <Button>Hover me</Button>
</Tooltip>;
```

---

## Group Hover (hoverGroup)

Style child elements when parent is hovered:

```tsx
// Parent with a className
<Flex className="card-row" gap={2}>
  {/* Child responds to parent hover */}
  <Box opacity={0} hoverGroup={{ 'card-row': { opacity: 1 } }}>
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
<style id="crono-box">{cssString}</style>;

// Reset for next request (in SSR)
resetStyles();
```

---

## Key Reminders for AI Assistants

### ⚠️ MOST IMPORTANT (Common AI Mistakes)

1. **NEVER use `style={{ }}` attribute** - Always use Box props instead. If a prop doesn't exist, extend Box with `Box.extend()`
2. **NEVER use `<Box tag="...">` for common elements** - Use semantic components instead:
   - `<Box tag="a">` → `<Link>`
   - `<Box tag="img">` → `<Img>`
   - `<Box tag="button">` → `<Button>`
   - `<Box tag="h1/h2/h3">` → `<H1>/<H2>/<H3>`
   - `<Box tag="p">` → `<P>`
   - `<Box tag="nav/header/footer>` → `<Nav>/<Header>/<Footer>`
3. **NEVER use `<Box display="flex/grid">`** - Use `<Flex>` or `<Grid>` components instead

### Value Formatting

4. **fontSize uses divider 16**, not 4. `fontSize={14}` → 14px, NOT 3.5px
5. **Spacing uses divider 4**. `p={4}` → 16px (1rem)
6. **Border width is direct px**. `b={1}` → 1px
7. **lineHeight is direct px**. `lineHeight={24}` → 24px

### Syntax & Patterns

8. **Colors are Tailwind-like**: `'gray-500'`, `'blue-600'`, etc.
9. **Breakpoints are mobile-first**: base → sm → md → lg → xl → xxl
10. **Theme styles nest**: `theme={{ dark: { hover: { ... } } }}`
11. **HTML attributes go in `props`**: `<Link props={{ href: '/link' }}>` - NOT directly as Box props
12. **Percentage widths**: Use strings like `width="1/2"` for 50%
13. **Full size shortcuts**: `width="fit"` = 100%, `width="fit-screen"` = 100vw
14. **Box is memoized** with `React.memo` - props comparison is efficient

---

## DataGrid Component

A powerful data grid with sorting, filtering, grouping, row selection, column pinning, and virtualization.

### Import and Basic Usage

```tsx
import DataGrid from '@cronocode/react-box/components/dataGrid';

const data = [
  { id: 1, name: 'John', email: 'john@example.com', age: 30 },
  { id: 2, name: 'Jane', email: 'jane@example.com', age: 25 },
];

<DataGrid
  data={data}
  def={{
    columns: [
      { key: 'name', header: 'Name' },
      { key: 'email', header: 'Email' },
      { key: 'age', header: 'Age', align: 'right' },
    ],
  }}
/>;
```

### GridDefinition Props

| Prop | Type | Description |
|------|------|-------------|
| `columns` | `ColumnType[]` | Column definitions (required) |
| `rowKey` | `keyof TRow \| (row) => Key` | Unique key for each row |
| `rowHeight` | `number` | Row height in pixels (default: 36) |
| `visibleRowsCount` | `number` | Number of visible rows (default: 10) |
| `showRowNumber` | `boolean \| { pinned?: boolean; width?: number }` | Show row numbers |
| `rowSelection` | `boolean \| { pinned?: boolean }` | Enable row selection checkboxes |
| `topBar` | `boolean` | Show top bar with title and controls |
| `bottomBar` | `boolean` | Show bottom bar with row count |
| `title` | `ReactNode` | Title displayed in top bar |
| `topBarContent` | `ReactNode` | Custom content in top bar |
| `globalFilter` | `boolean` | Enable global search filter |
| `globalFilterKeys` | `Key[]` | Columns to search (default: all) |
| `sortable` | `boolean` | Enable sorting globally (default: true) |
| `resizable` | `boolean` | Enable column resizing globally (default: true) |
| `noDataComponent` | `ReactNode` | Custom empty state component |

### ColumnType Props

| Prop | Type | Description |
|------|------|-------------|
| `key` | `string \| number` | Column key matching data property (required) |
| `header` | `string` | Column header text |
| `width` | `number` | Column width in pixels |
| `align` | `'left' \| 'right' \| 'center'` | Text alignment |
| `pin` | `'LEFT' \| 'RIGHT'` | Pin column to side |
| `columns` | `ColumnType[]` | Nested columns for grouping |
| `sortable` | `boolean` | Override global sortable setting |
| `resizable` | `boolean` | Override global resizable setting |
| `flexible` | `boolean` | Participate in flex distribution (default: true) |
| `filterable` | `boolean \| FilterConfig` | Enable column filtering |
| `Cell` | `React.ComponentType<{ cell }>` | Custom cell renderer |

### DataGridProps

| Prop | Type | Description |
|------|------|-------------|
| `data` | `TRow[]` | Data array (required) |
| `def` | `GridDefinition` | Grid definition (required) |
| `loading` | `boolean` | Show loading state |
| `onSelectionChange` | `(event) => void` | Selection change callback |
| `globalFilterValue` | `string` | Controlled global filter |
| `onGlobalFilterChange` | `(value) => void` | Global filter change callback |
| `columnFilters` | `ColumnFilters` | Controlled column filters |
| `onColumnFiltersChange` | `(filters) => void` | Column filters change callback |

### Filter Types

```tsx
// Text filter (default) - fuzzy search
{ key: 'name', filterable: true }
{ key: 'name', filterable: { type: 'text', placeholder: 'Search...' } }

// Number filter - with comparison operators
{ key: 'age', filterable: { type: 'number', min: 0, max: 100 } }

// Multiselect filter - dropdown with checkboxes
{ key: 'status', filterable: { type: 'multiselect' } }
{ key: 'status', filterable: {
  type: 'multiselect',
  options: [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ]
}}
```

### Column Grouping (Nested Headers)

```tsx
columns: [
  {
    key: 'personal',
    header: 'Personal Info',
    columns: [
      { key: 'firstName', header: 'First Name' },
      { key: 'lastName', header: 'Last Name' },
    ],
  },
  {
    key: 'contact',
    header: 'Contact',
    columns: [
      { key: 'email', header: 'Email' },
      { key: 'phone', header: 'Phone' },
    ],
  },
]
```

### Custom Cell Renderer

```tsx
columns: [
  {
    key: 'status',
    header: 'Status',
    Cell: ({ cell }) => (
      <Box
        px={2}
        py={1}
        borderRadius={4}
        bgColor={cell.value === 'active' ? 'green-100' : 'red-100'}
        color={cell.value === 'active' ? 'green-800' : 'red-800'}
      >
        {cell.value}
      </Box>
    ),
  },
  {
    key: 'actions',
    header: 'Actions',
    Cell: ({ cell }) => (
      <Button onClick={() => handleEdit(cell.row)}>Edit</Button>
    ),
  },
]
```

The `cell` object provides:
- `cell.value` - Cell value
- `cell.row` - Full row data
- `cell.column` - Column model

### Row Selection

```tsx
<DataGrid
  data={data}
  def={{
    rowSelection: true,  // or { pinned: true } to pin checkbox column
    columns: [...],
  }}
  onSelectionChange={(event) => {
    console.log('Selected keys:', event.selectedRowKeys);
    console.log('Action:', event.action); // 'select' | 'deselect'
    console.log('All selected:', event.isAllSelected);
  }}
/>
```

### Sorting and Resizing Control

```tsx
// Disable globally
def={{
  sortable: false,
  resizable: false,
  columns: [...]
}}

// Override per column
def={{
  sortable: false,  // Global: no sorting
  columns: [
    { key: 'id', header: 'ID' },  // Not sortable (inherits global)
    { key: 'name', header: 'Name', sortable: true },  // Sortable (override)
  ]
}}
```

### Flexible Column Sizing

Columns automatically fill available space proportionally. Use `flexible: false` for fixed-width columns.

```tsx
columns: [
  { key: 'id', header: 'ID', width: 60, flexible: false },  // Fixed at 60px
  { key: 'name', header: 'Name', width: 200 },  // Flexes (200 base)
  { key: 'email', header: 'Email', width: 300 },  // Flexes more (300 base)
]
```

### Custom Empty State

```tsx
def={{
  columns: [...],
  noDataComponent: (
    <Flex d="column" ai="center" gap={4} p={8}>
      <Box fontSize={48}>📭</Box>
      <Box color="gray-500">No records found</Box>
    </Flex>
  ),
}}
```

### Full-Featured Example

```tsx
<DataGrid
  data={users}
  def={{
    title: 'Users Table',
    topBar: true,
    bottomBar: true,
    globalFilter: true,
    rowSelection: { pinned: true },
    showRowNumber: { pinned: true },
    rowHeight: 40,
    visibleRowsCount: 10,
    columns: [
      {
        key: 'personal',
        header: 'Personal',
        columns: [
          { key: 'name', header: 'Name', filterable: true },
          { key: 'age', header: 'Age', width: 80, align: 'right', filterable: { type: 'number' } },
        ],
      },
      { key: 'email', header: 'Email', width: 250, filterable: true },
      { key: 'status', header: 'Status', filterable: { type: 'multiselect' } },
      { key: 'country', header: 'Country', pin: 'RIGHT' },
    ],
  }}
  onSelectionChange={(e) => setSelected(e.selectedRowKeys)}
/>
```

---

## Debugging Tips

1. **Inspect styles**: Look for `<style id="crono-box">` in document head
2. **Check class names**: Elements get classes like `_b`, `_2a`, etc.
3. **Verify variables**: CSS variables are in `:root` rules
4. **Theme issues**: Ensure `<Box.Theme>` wraps your app
5. **Portal theming**: Tooltips/dropdowns use `#crono-box` container
