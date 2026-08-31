/**
 * Fills the shells the site build writes with the HTML and CSS of each route.
 *
 * `pages.vite.config.ts` emits one shell per route carrying that route's metadata and an empty
 * `<div id="root">`; this pass renders the same tree the browser mounts into it, so `view-source` on
 * any address shows the page. It runs on the library's own SSG API — `getStyles()` over the string
 * sink — which makes the docs site the reference implementation for it.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'vite';

const ROOT = resolve(import.meta.dirname, '..');
const CLIENT_OUT = join(ROOT, 'dist-pages');
const SSR_OUT = join(ROOT, 'dist-pages-ssr');
const ROOT_DIV = '<div id="root"></div>';

/** Every route's CSS is at least this many bytes — a shell that got less than a stylesheet is a failure. */
const MIN_STYLES = 2000;
/** Smaller than the frame alone: the page rendered nothing at all. */
const MIN_HTML = 20_000;
/**
 * React's marker for a Suspense boundary whose content did not survive the server: it either threw or
 * suspended, and the browser has to render it. The HTML then ships the frame with a hole in it — which
 * is what an unguarded `window` did to three pages (bug #85) with nothing on stderr to say so.
 */
const CLIENT_ONLY_BOUNDARY = '<!--$!-->';

/**
 * Holes each route is allowed, and why. A ledger rather than a threshold, so it fails both ways: a new
 * hole is a page that quietly stopped prerendering, and a hole that closed is a line to delete here.
 */
const CLIENT_ISLANDS = {
  // The Recharts demo is `React.lazy` on purpose (SV7): 93 KB gz that only this page pays for, and a
  // chart that measures its container has nothing to draw without one.
  '/charts': 1,
};

async function serverBundle() {
  await build({
    configFile: join(ROOT, 'pages.vite.config.ts'),
    root: join(ROOT, 'pages'),
    mode: 'production',
    logLevel: 'warn',
    build: {
      ssr: 'entry-server.tsx',
      outDir: SSR_OUT,
      emptyOutDir: true,
      // `.mjs` so Node loads the bundle as ESM whatever the nearest package.json says.
      rollupOptions: { output: { entryFileNames: '[name].mjs' } },
    },
  });

  return import(pathToFileURL(join(SSR_OUT, 'entry-server.mjs')).href);
}

const { renderRoute, prerenderPaths, NOT_FOUND_PATH, PRERENDERED_STYLE_ID } = await serverBundle();

const shellFor = (path) => join(CLIENT_OUT, path === '/' ? '' : path.slice(1), 'index.html');

const targets = [
  ...prerenderPaths.map((path) => ({ path, file: shellFor(path) })),
  { path: NOT_FOUND_PATH, file: join(CLIENT_OUT, '404.html') },
];

const failures = [];
const rows = [];

for (const { path, file } of targets) {
  const shell = await readFile(file, 'utf8');
  const { html, styles } = await renderRoute(path);

  // Each of these has been silently true at some point in this file's life: a shell whose root div
  // was named differently, a page that rendered its frame and no content, a route whose CSS never
  // reached the sink. A prerender that quietly ships an empty page is worse than a failed build.
  if (!shell.includes(ROOT_DIV)) failures.push(`${file}: no ${ROOT_DIV} to fill`);
  const islands = html.split(CLIENT_ONLY_BOUNDARY).length - 1;
  const expected = CLIENT_ISLANDS[path] ?? 0;
  if (islands !== expected) failures.push(`${path}: ${islands} client-only boundaries, expected ${expected} — see CLIENT_ISLANDS`);
  if (html.length < MIN_HTML) failures.push(`${path}: ${html.length} bytes of HTML, expected at least ${MIN_HTML}`);
  if (styles.length < MIN_STYLES) failures.push(`${path}: ${styles.length} bytes of CSS, expected at least ${MIN_STYLES}`);

  const filled = shell
    // Function replacements: `$&` and `$'` are replacement patterns, and a docs page full of shell
    // snippets and CSS is exactly where those two characters turn up.
    .replace(ROOT_DIV, () => `<div id="root">${html}</div>`)
    // At the top of the head, which is where the engine puts its own element in the browser — so the
    // rules the first paint uses sit in the same place in the cascade as the ones that replace them.
    .replace('<head>', () => `<head><style id="${PRERENDERED_STYLE_ID}">${styles}</style>`);

  await writeFile(file, filled);

  rows.push({ route: path, html: html.length, css: styles.length, file: file.slice(dirname(CLIENT_OUT).length + 1) });
}

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;

for (const row of rows) {
  console.log(`  ${row.route.padEnd(20)} ${kb(row.html).padStart(10)} html  ${kb(row.css).padStart(10)} css  ${row.file}`);
}
console.log(`\nPrerendered ${rows.length} pages.`);

if (failures.length > 0) {
  console.error(`\nPrerender failed:\n${failures.map((failure) => `  - ${failure}`).join('\n')}`);
  process.exit(1);
}
