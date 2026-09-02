/**
 * Where the docs site lives. Everything address-bound is built from `SITE_URL` — the canonical links,
 * `sitemap.xml`, `robots.txt`, the `CNAME` — so moving to box-kite.dev is this constant plus the DNS
 * records (checklist in `docs/WEBSITE.md`). Nothing else in `pages/` may hard-code a host.
 */
export const SITE_URL = 'https://box.cronocode.com';

/** Second half of every document title, and the Open Graph site name. */
export const SITE_NAME = 'React Box';

export interface SiteRoute {
  /** The path react-router matches, and the one the sitemap prints. */
  path: string;
  /** First half of the document title — `Dropdown — React Box`. */
  name: string;
  /** The meta description, and the Open Graph description. */
  description: string;
  /** The whole `<title>`, for a route the `<name> — React Box` form does not suit. */
  title?: string;
  /** Unlisted demos set this to `false`: out of the sitemap, and `noindex` for crawlers. */
  indexable?: boolean;
}

/**
 * Every route the site serves, in nav order. Adding a page means adding an entry here: `app.tsx`
 * maps this list to its `<Route>` elements through an exhaustive record, so a route with no
 * metadata does not compile, and the sitemap can never fall behind the router.
 */
export const siteRoutes = [
  {
    path: '/',
    name: 'Introduction',
    title: 'React Box — build beautiful UIs without writing CSS',
    description:
      'A React library where every CSS property is a typed prop. Classes are generated at runtime and shared between components, so there is no stylesheet to import.',
  },
  {
    path: '/installation',
    name: 'Installation',
    description: 'Install react-box and render your first Box: two dependencies, no bundler plugin, and no stylesheet to import.',
  },
  {
    path: '/theme-setup',
    name: 'Theme Setup',
    description: 'Declare light and dark variants next to the styles they override, and switch them at runtime with Box.Theme.',
  },
  {
    path: '/server-components',
    name: 'React Server Components',
    description:
      "Box renders on the server with no 'use client', no provider and no stylesheet to import. Its CSS is part of the HTML React streams.",
  },
  {
    path: '/box',
    name: 'Box',
    description: 'The foundational component: 211 CSS properties as type-safe props, with the numeric formatters explained.',
  },
  {
    path: '/svg',
    name: 'SVG',
    description:
      'Fourteen SVG paint and stroke properties as typed Box props — dashes, caps, joins, fill rules and a stroke that ignores the scale, all themeable.',
  },
  {
    path: '/icon',
    name: 'Icon',
    description:
      'Box props on an icon somebody else drew — one adapter for lucide, Tabler, react-icons and a raw <svg>: sized on the ÷4 scale, themed, and named on purpose.',
  },
  {
    path: '/charts',
    name: 'Charts',
    description:
      'Sparklines, progress rings, gauges and mini donuts as Boxes — no chart library — plus the container that themes a Recharts chart with the variables it reads.',
  },
  {
    path: '/variants',
    name: 'State Variants',
    description:
      'Style by a data-* or aria-* attribute, by what an element contains, by where it sits among its siblings, or by what an ancestor or a sibling is doing.',
  },
  {
    path: '/pseudo-elements',
    name: 'Pseudo-Elements',
    description:
      'before, after, placeholder, selection, marker and four more as nested props — with the content a generated element needs supplied for you.',
  },
  {
    path: '/container-queries',
    name: 'Container Queries',
    description:
      'A component that answers to the space it was given rather than to the window: cq, six sizes and their complements, against the nearest container or a named one.',
  },
  {
    path: '/tailwind-parity',
    name: 'Tailwind Parity',
    description:
      'Every Tailwind v4.3 utility family against the props this library ships — what is covered, what is partial, and the one-line answer for the rest.',
  },
  {
    path: '/animation',
    name: 'Animation',
    description:
      'Keyframes, presets and transitions as typed props: Box.keyframes() takes Box props as its steps, and a preset stops on its own under reduced motion.',
  },
  {
    path: '/button',
    name: 'Button',
    description: 'A real button element with variants, sizes and states, styled entirely through Box props.',
  },
  {
    path: '/textbox',
    name: 'Textbox',
    description: 'A labelled text input for collecting user data, with the states and customization Box props give every element.',
  },
  {
    path: '/textarea',
    name: 'Textarea',
    description: 'A labelled multiline input for longer user data.',
  },
  {
    path: '/checkbox',
    name: 'Checkbox',
    description: 'A native checkbox that turns an option on, off or mixed, with the label markup included.',
  },
  {
    path: '/radiobutton',
    name: 'Radio Button',
    description:
      'One choice out of a set. RadioGroup is the APG pattern — a named group, a shared field name, and arrow keys between options.',
  },
  {
    path: '/switch',
    name: 'Switch',
    description:
      'An on/off control: a real checkbox input wearing role=switch, so screen readers say on and off and forms still submit it.',
  },
  {
    path: '/tooltip',
    name: 'Tooltip',
    description:
      'A description that appears on hover and on focus, wired to its trigger with aria-describedby — the APG tooltip, WCAG 1.4.13 rules included.',
  },
  {
    path: '/overlay',
    name: 'Overlay',
    description:
      'A portal rendered where it is declared, so its children escape overflow: hidden, clipped ancestors and stacking contexts.',
  },
  {
    path: '/dropdown',
    name: 'Dropdown',
    description: 'The APG select-only combobox: choose one option or many, from the keyboard as well as the mouse.',
  },
  {
    path: '/datagrid',
    name: 'Data Grid',
    description: 'A virtualized data grid with sorting, filtering, grouping, column resizing and full keyboard navigation.',
  },
  {
    path: '/flex',
    name: 'Flex',
    description: 'A shortcut component for display: flex, with alignment, direction and spacing props.',
  },
  {
    path: '/grid',
    name: 'Grid',
    description: 'A shortcut component for display: grid, with template, gap and placement props.',
  },
  {
    path: '/style-grouping',
    name: 'Style Grouping',
    description: 'Group several CSS properties under a single prop, each with its own value. One prop, one class name, many declarations.',
  },
  {
    path: '/colors',
    name: 'Colors',
    description:
      'The complete colour palette in OKLCH — twenty-six families of eleven steps — and the opacity modifier every colour value takes.',
  },
  {
    path: '/gradients-shadows',
    name: 'Gradients & Effects',
    description:
      'A gradient written as a value, with palette tokens for stops — plus the shadow layers, filter functions and masks that stack instead of overwriting each other.',
  },
  {
    path: '/ai-context',
    name: 'AI Assistant Context',
    description: 'One file that teaches an AI assistant the whole prop surface, the formatter rules and the patterns that trip it up.',
  },
] as const satisfies readonly SiteRoute[];

/** The union of every path the site serves — `app.tsx` keys its route components by it. */
export type SiteRoutePath = (typeof siteRoutes)[number]['path'];
