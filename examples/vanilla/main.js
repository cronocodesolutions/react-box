// The core style engine driving a page with no framework at all.
//
// Nothing here is React-adjacent: `engine.classNames(props)` returns a `class` attribute value and
// the CSS behind it is written to a `<style>` element the engine owns. The props are the same ones
// `<Box>` takes — the React binding is a wrapper around this call, not a different feature set.
import { createStyleEngine, createThemeController } from '@box-kite/react/core';

const engine = createStyleEngine();

// Custom variables and props — the vanilla form of `Box.extend()`. Three arguments: the variables,
// brand-new props, and extra values for props that already exist.
engine.extend(
  {
    brand: '#6d28d9',
    'brand-soft': '#ede9fe',
    'panel-shadow': '0 1px 2px rgba(15, 23, 42, 0.06), 0 8px 24px rgba(15, 23, 42, 0.08)',
  },
  {
    elevation: [
      {
        styleName: 'box-shadow',
        values: ['panel'],
        valueFormat: (value, getVariable) => getVariable(`${value}-shadow`),
      },
    ],
  },
  {
    bgColor: [
      {
        styleName: 'background-color',
        values: ['brand', 'brand-soft'],
        valueFormat: (value, getVariable) => getVariable(value),
      },
    ],
    borderColor: [
      {
        styleName: 'border-color',
        values: ['brand'],
        valueFormat: (value, getVariable) => getVariable(value),
      },
    ],
  },
);

// Component defaults with variants — the vanilla form of `Box.components()`. Used below through
// the `component` and `variant` props, exactly as in React.
engine.components({
  panel: {
    styles: {
      p: 6,
      borderRadius: 3,
      b: 1,
      borderColor: 'gray-200',
      bgColor: 'white',
      elevation: 'panel',
      theme: { dark: { bgColor: 'gray-800', borderColor: 'gray-700' } },
    },
    variants: {
      accent: { b: 2, borderColor: 'brand' },
    },
  },
});

/** An element whose class list comes from Box props. This function is the entire "framework". */
function el(tag, props, children = []) {
  const node = document.createElement(tag);
  node.className = engine.classNames(props);

  for (const child of [].concat(children)) {
    node.append(child);
  }

  return node;
}

/* ---------------------------------------------------------------- theming */

// Reads the system preference, restores a stored choice, writes the theme name onto `<html>` and
// follows `prefers-color-scheme` until something overrides it. Generated theme rules are
// ancestor-scoped (`.dark .p-4`), so that one class name is what restyles the whole page.
const theme = createThemeController({ storageKey: 'box-kite-vanilla-theme' });

function themeToggle() {
  const button = el('button', {
    component: 'button',
    theme: { dark: { bgColor: 'violet-500', hover: { bgColor: 'violet-400' } } },
  });

  const render = (name) => (button.textContent = name === 'dark' ? '☀ Light' : '☾ Dark');

  render(theme.theme);
  theme.subscribe(render);
  button.addEventListener('click', () => theme.set(theme.theme === 'dark' ? 'light' : 'dark'));

  return button;
}

/* ------------------------------------------------------------------- page */

const page = el('div', {
  minHeight: 'fit-screen',
  bgColor: 'gray-50',
  color: 'gray-900',
  p: 6,
  // Breakpoints are prop groups: everything under `md` applies from that width up.
  md: { p: 12 },
  theme: { dark: { bgColor: 'gray-900', color: 'gray-100' } },
});

const title = el('h1', { fontSize: 32, fontWeight: 700 });
title.textContent = 'Box Kite, without React';

const subtitle = el('p', { mt: 2, color: 'gray-500', theme: { dark: { color: 'gray-400' } } });
subtitle.textContent = 'Every class on this page came from engine.classNames(). No framework is loaded.';

const header = el('header', { display: 'flex', ai: 'center', jc: 'space-between', gap: 4, mb: 8 }, [
  el('div', {}, [title, subtitle]),
  themeToggle(),
]);

// A responsive card grid: one column, two from `md`, three from `lg`.
const cards = el('section', {
  display: 'grid',
  gap: 6,
  gridTemplateColumns: 1,
  md: { gridTemplateColumns: 2 },
  lg: { gridTemplateColumns: 3 },
});

const features = [
  ['Props to CSS at runtime', 'A prop value becomes a class the first time it is seen; every element after that reuses it.'],
  ['Pseudo-classes and breakpoints', 'hover, focus, active and every breakpoint are nested prop groups — hover a card to see it.'],
  ['Themes without a provider', 'Theme rules are ancestor-scoped, so a class name on <html> is the whole mechanism.'],
];

for (const [heading, body] of features) {
  const cardTitle = el('h2', { fontSize: 18, fontWeight: 600, mb: 2 });
  cardTitle.textContent = heading;

  const cardBody = el('p', { lineHeight: 24, color: 'gray-600', theme: { dark: { color: 'gray-300' } } });
  cardBody.textContent = body;

  cards.append(
    el(
      'article',
      {
        component: 'panel',
        variant: 'accent',
        cursor: 'default',
        // Pseudo-classes are prop groups too, and they nest inside a theme.
        hover: { bgColor: 'brand-soft', translateY: -1 },
        theme: { dark: { hover: { bgColor: 'gray-700' } } },
      },
      [cardTitle, cardBody],
    ),
  );
}

// `getStyles()` is the same call SSG uses: the whole stylesheet as text, at any moment.
const footer = el('footer', { mt: 10, fontSize: 14, color: 'gray-500' });
footer.textContent = `${engine.getStyles().split('}').length - 1} CSS rules generated for this page.`;

page.append(header, cards, footer);
document.getElementById('app').append(page);
