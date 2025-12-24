# Contributing to @cronocode/react-box

A comprehensive guide for senior software engineers contributing to this runtime CSS-in-JS library.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Project Structure](#project-structure)
3. [Core Concepts](#core-concepts)
4. [CSS Generation Engine](#css-generation-engine)
5. [Theme System](#theme-system)
6. [Development Workflow](#development-workflow)
7. [Adding New CSS Properties](#adding-new-css-properties)
8. [Creating Components](#creating-components)
9. [Type System](#type-system)
10. [Testing](#testing)
11. [Build & Publishing](#build--publishing)

---

## Architecture Overview

React-Box is a **runtime CSS generation library** that converts React component props into CSS classes. Key architectural decisions:

- **No CSS files**: All styles are generated at runtime and injected into `<style id="crono-box">` in `document.head`
- **Single class per value**: If the same prop value (e.g., `p={3}`) is used in multiple components, only ONE CSS class is generated
- **TypeScript-first**: Deep type extraction provides full IDE autocomplete for all valid prop combinations
- **Memoized rendering**: Box component uses `React.memo` and `forwardRef` for optimal performance

### Data Flow

```
Box props → useStyles() → useComponents() → StylesContext → CSS injection → DOM
     ↓
 Component styles merged with props
     ↓
 Class names generated via IdentityFactory
     ↓
 CSS rules grouped by breakpoint/pseudo-class weight
     ↓
 Injected into <style> tag
```

---

## Project Structure

```
react-box/
├── src/                          # Library source (published to npm)
│   ├── box.ts                    # Main Box component
│   ├── types.ts                  # TypeScript type exports
│   ├── ssg.ts                    # Server-side rendering support
│   ├── array.ts                  # Array prototype extensions
│   │
│   ├── core/                     # Core styling engine
│   │   ├── boxStyles.ts          # CSS property definitions (~144 props)
│   │   ├── boxStylesFormatters.ts # Value formatters (px, rem, etc.)
│   │   ├── useStyles.ts          # Main hook for style processing
│   │   ├── variables.ts          # CSS variables (colors, sizes)
│   │   ├── classNames.ts         # Conditional className utility
│   │   ├── coreTypes.ts          # Core TypeScript types
│   │   ├── boxConstants.ts       # Constants (REM divider, etc.)
│   │   │
│   │   ├── extends/              # Extension system
│   │   │   ├── boxExtends.ts     # Box.extend() and Box.components()
│   │   │   ├── boxComponents.ts  # Default component styles
│   │   │   └── useComponents.ts  # Component style resolution hook
│   │   │
│   │   └── theme/                # Theme system
│   │       ├── theme.tsx         # Theme provider component
│   │       └── themeContext.ts   # React context
│   │
│   ├── components/               # Pre-built components
│   │   ├── button.tsx
│   │   ├── checkbox.tsx
│   │   ├── dropdown.tsx
│   │   ├── textbox.tsx
│   │   ├── textarea.tsx
│   │   ├── radioButton.tsx
│   │   ├── tooltip.tsx
│   │   ├── form.tsx
│   │   ├── flex.tsx
│   │   ├── grid.tsx
│   │   ├── semantics.tsx         # Semantic HTML components
│   │   ├── baseSvg.tsx
│   │   └── dataGrid/             # Complex DataGrid component
│   │
│   ├── hooks/                    # React hooks
│   │   ├── useVisibility.ts
│   │   └── usePortalContainer.ts
│   │
│   ├── icons/                    # SVG icon components
│   │
│   └── utils/                    # Utility functions
│       ├── box/boxUtils.ts
│       ├── object/objectUtils.ts
│       ├── form/
│       ├── string/
│       ├── fn/
│       └── memo.ts
│
├── pages/                        # Demo/documentation website
│
├── vite.config.ts                # Library build config
├── pages.vite.config.ts          # Pages build config
├── tsconfig.json                 # TypeScript config
└── eslint.config.js              # ESLint config
```

---

## Core Concepts

### 1. CSS Property Definitions (boxStyles.ts)

Each CSS property is defined as an array of `BoxStyle` objects:

```typescript
// src/core/boxStyles.ts
export const cssStyles = {
  /** The padding shorthand CSS property */
  p: [
    {
      values: 0,                          // Accepts any number
      styleName: 'padding',               // CSS property name
      valueFormat: BoxStylesFormatters.Value.rem,  // How to format value
    },
  ],

  /** Values can be string literals for restricted options */
  display: [
    {
      values: ['block', 'flex', 'inline', 'grid', 'none', ...] as const,
    },
  ],

  /** Multiple CSS properties from single prop */
  bx: [
    {
      values: 0,
      styleName: 'border-inline-width',   // Single string or array
      valueFormat: BoxStylesFormatters.Value.px,
    },
  ],
};
```

### 2. Value Formatters (boxStylesFormatters.ts)

Formatters convert prop values to CSS values:

```typescript
// src/core/boxStylesFormatters.ts
export namespace BoxStylesFormatters {
  export namespace Value {
    export const rem = (v: number) => `${v / DEFAULT_REM_DIVIDER}rem`;
    export const px = (v: number) => `${v}px`;
    export const fraction = (v: string) => {
      /* '1/2' → '50%' */
    };
    export const gridColumns = (v: number) => `repeat(${v}, minmax(0, 1fr))`;
  }
}
```

### Understanding Numeric Prop Values

**Important**: Most numeric props use specific formatters that transform the value. Understanding these transformations is critical for choosing correct values.

| Prop Type                       | Formatter | Divider | Example            | CSS Output                    |
| ------------------------------- | --------- | ------- | ------------------ | ----------------------------- |
| Spacing (`p`, `m`, `gap`, etc.) | rem       | 4       | `p={4}`            | `padding: 1rem` (16px)        |
| Font size (`fontSize`)          | rem       | **16**  | `fontSize={14}`    | `font-size: 0.875rem` (≈14px) |
| Border width (`b`, `bx`, `by`)  | px        | -       | `b={1}`            | `border-width: 1px`           |
| Width/Height (numeric)          | rem       | 4       | `width={20}`       | `width: 5rem` (80px)          |
| Border radius (`borderRadius`)  | px        | -       | `borderRadius={8}` | `border-radius: 8px`          |

**Common mistake**: Using small values for `fontSize` like `fontSize={3}` results in `3/16 = 0.1875rem ≈ 3px` - nearly invisible text!

**Practical fontSize values**:

- `fontSize={12}` → 0.75rem ≈ 12px (small text)
- `fontSize={14}` → 0.875rem ≈ 14px (body text)
- `fontSize={16}` → 1rem = 16px (default)
- `fontSize={18}` → 1.125rem ≈ 18px (large text)
- `fontSize={24}` → 1.5rem = 24px (heading)

**Practical spacing values** (divider is 4, so value × 4 = pixels):

- `p={1}` → 0.25rem = 4px
- `p={2}` → 0.5rem = 8px
- `p={3}` → 0.75rem = 12px
- `p={4}` → 1rem = 16px

### 3. CSS Variables (variables.ts)

Color palette and other variables are defined as CSS custom properties:

```typescript
// src/core/variables.ts
namespace Variables {
  export const colors = {
    'gray-50': '#f9fafb',
    'gray-100': '#f3f4f6',
    // ... Tailwind-like color palette
    'violet-500': '#8b5cf6',
  };

  export const percentages = {
    '1/2': '50%',
    '1/3': '33.333333%',
    // ...
  };

  export function getVariableValue(name: string): string;
  export function setUserVariables(vars: Record<string, string>): void;
}
```

### 4. Pseudo-Classes & Breakpoints

Pseudo-classes have **weights** for CSS specificity:

```typescript
// src/core/boxStyles.ts
export const pseudoClassesWeight = {
  hover: 1,
  focus: 2,
  active: 4,
  disabled: 8,
  checked: 16,
  indeterminate: 32,
  required: 64,
  selected: 128,
  // ...
};

export const breakpoints = {
  sm: 640, // @media (min-width: 640px)
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1536,
};
```

Usage in components:

```tsx
<Box p={2} hover={{ bgColor: 'gray-100' }} sm={{ p: 4 }} md={{ p: 6, hover: { bgColor: 'gray-200' } }} />
```

### 5. Component System (boxComponents.ts)

Pre-defined component styles with variants:

```typescript
// src/core/extends/boxComponents.ts
const boxComponents = {
  button: {
    styles: {
      display: 'inline-flex',
      bgColor: 'violet-500',
      p: 3,
      hover: { bgColor: 'violet-600' },
      disabled: { cursor: 'not-allowed', bgColor: 'violet-50' },
    },
    variants: {
      primary: { bgColor: 'blue-500' },
      secondary: { bgColor: 'gray-500' },
    },
    children: {
      icon: { styles: { width: 4 } },
    },
  },
};
```

Usage:

```tsx
<Box component="button" variant="primary" />
<Box component="button.icon" />
```

### 6. Extension System

Users extend the library via `Box.extend()` and `Box.components()`:

```typescript
// User's boxExtends.ts
export const { extendedProps, extendedPropTypes } = Box.extend(
  // Custom CSS variables
  { 'brand-primary': '#ff6600' },

  // New props
  {
    customProp: [{ values: ['a', 'b'] as const, styleName: 'custom-property' }],
  },

  // Extend existing props with new values
  {
    bgColor: [{ values: ['brand-primary'] as const }],
  },
);

// User's boxComponents.ts
Box.components({
  button: {
    styles: { bgColor: 'brand-primary' },
  },
});
```

---

## CSS Generation Engine

### Incremental CSS Injection (useStyles.ts)

The library uses **incremental CSS generation** via `CSSStyleSheet.insertRule()` for optimal performance:

```typescript
// src/core/useStyles.ts

// CSS rules are inserted incrementally, not by replacing innerHTML
stylesheet.insertRule(cssRule, insertIndex);
```

Key mechanisms:

1. **Rule tracking**: Each unique prop combination generates a class name via `IdentityFactory`
2. **Deduplication**: Same prop values across components share the same CSS class
3. **Batched insertion**: Styles accumulated during render, flushed in `useLayoutEffect`
4. **Weight-based ordering**: Rules sorted by pseudo-class weight for correct specificity

### Default Base Styles

The library injects default reset styles on initialization:

```typescript
const defaultRules = [
  `:root{${Variables.generateVariables()}}`,
  `:root{--borderColor: black;--outlineColor: black;...}`,
  `#crono-box {position: absolute;top: 0;left: 0;height: 0;z-index:99999;}`,
  `html{font-size: 16px;font-family: Arial, sans-serif;}`,
  `body{margin: 0;line-height: var(--lineHeight);font-size: var(--fontSize);}`,
  `a,ul{all: unset;}`,
  `button{color: inherit;}`, // Reset user-agent button color
  // ... box and svg base classes
];
```

### Pending Variables System

CSS variables are loaded lazily. When a new color/variable is used for the first time:

```typescript
// src/core/variables.ts
const _pendingVariables: Record<string, string> = {};

export function hasPendingVariables(): boolean;
export function getPendingVariables(): Record<string, string>; // Returns and clears pending
```

The `flush()` function in useStyles checks for pending variables and inserts a new `:root` rule:

```typescript
// In flush()
if (Variables.hasPendingVariables()) {
  const pendingVars = Variables.getPendingVariables();
  const rootRule = `:root{${Object.entries(pendingVars)
    .map(([k, v]) => `--${k}:${v}`)
    .join(';')}}`;
  stylesheet.insertRule(rootRule, baseRulesCount);
}
```

This ensures variables are defined before they're used in CSS rules, even when navigating between pages.

### Navigation/Route Change Handling

When navigating between pages in a SPA, components may re-render with styles that were already generated but need to be re-applied. The `useStyles` hook handles this via:

```typescript
// propsToUse triggers effect when component styles change
useLayoutEffect(() => {
  flush();
}, [propsToUse]);
```

---

## Theme System

### Theme Provider (Box.Theme)

The theme system uses CSS class names (`.dark`, `.light`) applied to container elements:

```tsx
<Box.Theme value="dark">
  <App /> {/* All children inherit dark theme */}
</Box.Theme>
```

### Theme-Aware Styles

Components can define theme-specific styles using the `theme` prop:

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

### CSS Selector Generation for Themes

Theme styles generate CSS selectors with the theme class as ancestor:

```css
/* Base styles */
.className {
  background-color: white;
  color: #111827;
}

/* Theme-specific styles */
.dark .className {
  background-color: #111827;
  color: #f3f4f6;
}
```

### Nested Theme + Pseudo-Class Styles

Themes can contain pseudo-class styles:

```tsx
<Box
  bgColor="white"
  hover={{ bgColor: 'gray-100' }}
  theme={{
    dark: {
      bgColor: 'gray-900',
      hover: { bgColor: 'gray-800' },
    },
  }}
/>
```

Generates:

```css
.className {
  background-color: white;
}
.className:hover {
  background-color: #f3f4f6;
}
.dark .className {
  background-color: #111827;
}
.dark .className:hover {
  background-color: #1f2937;
}
```

### Group Hover with Themes (hoverGroup)

For parent-child hover relationships (e.g., highlighting a cell when row is hovered):

```tsx
// Parent element defines the group
<Box className="grid-row">
  {/* Child responds to parent hover */}
  <Box
    bgColor="white"
    hoverGroup={{
      'grid-row': { bgColor: 'gray-100' },
    }}
    theme={{
      dark: {
        bgColor: 'gray-900',
        hoverGroup: {
          'grid-row': { bgColor: 'gray-800' },
        },
      },
    }}
  />
</Box>
```

Generates:

```css
.className {
  background-color: white;
}
.grid-row:hover .className {
  background-color: #f3f4f6;
}
.dark .className {
  background-color: #111827;
}
.dark .grid-row:hover .className {
  background-color: #1f2937;
}
```

### Portal Container Theming

Components rendered in portals (tooltips, dropdowns) need theme awareness. The `usePortalContainer` hook automatically applies the current theme class:

```typescript
// src/hooks/usePortalContainer.ts
export default function usePortalContainer() {
  const theme = Theme.useTheme(); // Get current theme from context

  // Apply theme class to portal container
  container.className = theme ?? '';
}
```

This ensures portal content inherits correct theme colors.

---

## Development Workflow

### Setup

```bash
# Clone and install
git clone https://github.com/cronocodesolutions/react-box.git
cd react-box
npm install

# Start dev server (pages)
npm run dev

# Type check
npm run compile

# Run tests
npm test

# Lint
npm run lint
```

### Key Scripts

| Script                | Description                      |
| --------------------- | -------------------------------- |
| `npm run dev`         | Start Vite dev server for pages/ |
| `npm run build`       | Build library to dist/           |
| `npm run build:pages` | Build demo website               |
| `npm run compile`     | TypeScript type check only       |
| `npm test`            | Run Vitest tests                 |
| `npm run lint`        | ESLint check                     |

---

## Adding New CSS Properties

### Step 1: Add Property Definition

```typescript
// src/core/boxStyles.ts

export const cssStyles = {
  // ... existing props

  /** The aspect-ratio CSS property */
  aspectRatio: [
    {
      values: ['auto', '1/1', '16/9', '4/3', '3/2', '21/9'] as const,
      styleName: 'aspect-ratio',
    },
    {
      values: 0, // Also accept numbers
      styleName: 'aspect-ratio',
    },
  ],
};
```

### Step 2: Add Value Formatter (if needed)

```typescript
// src/core/boxStylesFormatters.ts

export namespace BoxStylesFormatters {
  export namespace Value {
    // Add new formatter if values need transformation
    export const aspectRatio = (v: string) => v.replace('/', ' / ');
  }
}
```

### Step 3: Types are Auto-Generated

The type system in `types.ts` automatically extracts types from `cssStyles`:

```typescript
// types.ts - No changes needed!
type ExtractBoxStylesInternal<T extends Record<string, BoxStyle[]>> = {
  [K in keyof T]?: BoxStylesType<ArrayType<T[K]>['values']>;
};
export type BoxStyles = ExtractBoxStylesInternal<typeof cssStyles>;
```

### Step 4: Add to Variables (if color/size-based)

```typescript
// src/core/variables.ts

namespace Variables {
  export const aspectRatios = {
    square: '1 / 1',
    video: '16 / 9',
    // ...
  };
}
```

---

## Creating Components

### Simple Wrapper Component

```typescript
// src/components/card.tsx
import Box, { BoxProps } from '../box';

export default function Card<TTag extends keyof React.JSX.IntrinsicElements = 'div'>(
  props: BoxProps<TTag, 'card'>
) {
  return <Box component="card" {...props} />;
}
```

### Add Default Styles

```typescript
// src/core/extends/boxComponents.ts

const boxComponents = {
  // ... existing components

  card: {
    styles: {
      display: 'flex',
      d: 'column',
      p: 4,
      bgColor: 'white',
      borderRadius: 2,
      shadow: 'medium',
    },
    variants: {
      bordered: { b: 1, borderColor: 'gray-200', shadow: 'none' },
      elevated: { shadow: 'large' },
    },
    children: {
      header: {
        styles: { fontSize: 18, fontWeight: 600, mb: 3 },
      },
      body: {
        styles: { flex: 1 },
      },
      footer: {
        styles: { mt: 3, pt: 3, bt: 1, borderColor: 'gray-100' },
      },
    },
  },
};
```

### Export from Entry Point

```typescript
// vite.config.ts - Add to entry points
entry: {
  // ... existing entries
  'components/card': 'src/components/card.tsx',
},
```

---

## Type System

### Key Type Files

1. **types.ts** - Public type exports
2. **coreTypes.ts** - Internal utility types
3. **box.d.ts** - Generated declaration file

### Type Augmentation (for user extensions)

```typescript
// types.ts
export namespace Augmented {
  export interface BoxProps {} // Add new props
  export interface BoxPropTypes {} // Extend existing prop values
  export interface ComponentsTypes {} // Add component types
}
```

Users extend via declaration merging:

```typescript
// user's types.d.ts
import '@cronocode/react-box/types';

declare module '@cronocode/react-box/types' {
  namespace Augmented {
    interface BoxPropTypes {
      bgColor: 'brand-primary' | 'brand-secondary';
    }
    interface ComponentsTypes {
      myComponent: 'variantA' | 'variantB';
    }
  }
}
```

### Component Variant Extraction

```typescript
// types.ts - Complex type extraction for component variants

type ExtractVariants<T> = T extends { variants?: infer Variants }
  ? keyof Variants extends never
    ? never
    : Extract<keyof Variants, string>
  : never;

type ExtractChildrenNames<T, Prefix extends string = ''> = T extends { children?: infer Children }
  ? {
      [K in keyof Children & string]:
        | `${Prefix}${Prefix extends '' ? '' : '.'}${K}`
        | ExtractChildrenNames<Children[K], `${Prefix}${Prefix extends '' ? '' : '.'}${K}`>;
    }[keyof Children & string]
  : never;
```

This enables autocomplete for:

- `component="button"`
- `component="button.icon"`
- `variant="primary"`

---

## Testing

### Test Environment

- **Framework**: Vitest
- **DOM**: happy-dom
- **Utils**: @testing-library/react

### Example Test

```typescript
// src/components/button.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Button from './button';

describe('Button', () => {
  it('renders with default styles', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('_b'); // Base class
  });

  it('applies variant styles', () => {
    render(<Button variant="primary">Primary</Button>);
    // Check for generated class names
  });
});
```

### Running Tests

```bash
npm test

# With coverage
npm test -- --coverage
```

---

## Build & Publishing

### Build Output

```
dist/
├── box.mjs          # ESM entry
├── box.cjs          # CommonJS entry
├── box.d.ts         # Type declarations
├── core.mjs         # Core chunk (shared code)
├── core.cjs
├── ssg.mjs          # SSR support
├── ssg.cjs
├── ssg.d.ts
├── components/      # Individual component chunks
│   ├── button.mjs
│   ├── button.cjs
│   ├── button.d.ts
│   └── ...
└── types.d.ts       # Type exports
```

### Vite Build Configuration

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    lib: {
      entry: {
        box: 'src/box.ts',
        ssg: 'src/ssg.ts',
        'components/button': 'src/components/button.tsx',
        // ...
      },
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', 'react-dom/server'],
      output: {
        manualChunks: (id) => {
          // Chunk strategy for optimal tree-shaking
        },
      },
    },
  },
  plugins: [react(), dts({ exclude: ['**/*.test.*', 'pages/**'] })],
});
```

### Publishing Workflow

```bash
# 1. Update version in package.json
npm version patch|minor|major

# 2. Build
npm run build

# 3. Publish from dist/
cd dist
npm publish --access public
```

---

## Code Style

### ESLint + Prettier

- Print width: 140
- Single quotes
- Trailing commas: all
- Tab width: 2

### Naming Conventions

| Type              | Convention           | Example                                  |
| ----------------- | -------------------- | ---------------------------------------- |
| CSS Props (short) | camelCase            | `p`, `px`, `bgColor`                     |
| CSS Props (full)  | camelCase            | `borderRadius`, `fontSize`               |
| Components        | PascalCase           | `Button`, `DataGrid`                     |
| Hooks             | camelCase with `use` | `useStyles`, `useVisibility`             |
| Types             | PascalCase           | `BoxStyleProps`, `ComponentsAndVariants` |
| Variables         | camelCase            | `stylesToGenerate`, `componentsStyles`   |

### File Organization

- One component per file
- Tests next to source files: `button.tsx` → `button.test.tsx`
- Re-export from index where appropriate

---

## Common Contribution Tasks

### Add a New Shorthand Prop

1. Define in `boxStyles.ts` with JSDoc comment
2. Add formatter if needed in `boxStylesFormatters.ts`
3. Add to variables if value-based in `variables.ts`
4. Types auto-generate

### Add a New Component

1. Create component in `src/components/`
2. Add default styles in `boxComponents.ts`
3. Add entry point in `vite.config.ts`
4. Add to package.json exports
5. Create demo page in `pages/`

### Add a New Pseudo-Class

1. Add to `pseudoClasses` or `pseudo1`/`pseudo2` in `boxStyles.ts`
2. Assign weight in `pseudoClassesWeight`
3. Add to `pseudoClassesByWeight`
4. Types auto-generate

### Add Dark Theme Support to a Component

1. Add `theme: { dark: { ... } }` to the component's styles in `boxComponents.ts`
2. Include all color-related properties: `bgColor`, `color`, `borderColor`
3. Include theme variants for pseudo-classes like `hover`:
   ```typescript
   hover: { bgColor: 'gray-100' },
   theme: {
     dark: {
       hover: { bgColor: 'gray-800' },
     },
   },
   ```
4. For portal-based components (tooltips, dropdowns), ensure `usePortalContainer` is used
5. Test in both light and dark themes

### Fix Styling Bug

1. Check `useStyles.ts` for class generation logic
2. Check `boxStyles.ts` for property definition
3. Verify CSS output in browser DevTools (`<style id="crono-box">`)
4. Add test case

### Debug CSS Generation Issues

1. **Inspect generated styles**: Open DevTools → Elements → find `<style id="crono-box">`
2. **Check class names**: Inspect element to see generated class names (e.g., `_b`, `_2a`, etc.)
3. **Verify CSS variables**: Check `:root` rules in the style tag for variable definitions
4. **Navigation issues**: If styles don't apply after route change, check:
   - `propsToUse` dependency in useLayoutEffect
   - `hasPendingVariables()` being called in `flush()`
5. **Portal theming issues**: Verify `#crono-box` container has the correct theme class

---

## Performance Considerations

1. **Styles are cached**: Same prop values generate same class names (via IdentityFactory)
2. **Lazy generation**: CSS only generated when props are used
3. **Incremental insertion**: CSS rules added via `insertRule()` not innerHTML replacement
4. **Single flush**: Styles batched and flushed together with `useLayoutEffect`
5. **Component memoization**: Box uses `React.memo` to prevent unnecessary renders
6. **Deep merge optimization**: Component styles merged efficiently
7. **Pending variables**: New CSS variables added incrementally, not regenerating all

---

## Questions?

- GitHub Issues: https://github.com/cronocodesolutions/react-box/issues
- Review existing code patterns before adding new features
- Follow the established type extraction patterns for type safety
