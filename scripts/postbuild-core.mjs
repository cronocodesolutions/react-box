// Finishes the `@box-kite/core` build: writes the package manifest beside the bundle, and installs
// the result into `node_modules` so the rest of the pipeline can resolve it by name.
//
// That last part is not a convenience. `dist/react-shared.mjs` imports `@box-kite/core` now, so
// `postbuild.mjs`'s load check — the one that proves the `react-server` condition resolves — runs in a
// process that has to find the package. A copy rather than a symlink: Windows junctions and npm's own
// link handling disagree often enough that a real directory is the cheaper answer for 200 KB.
//
// Run: npm run build:core
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(import.meta.dirname, '..');
const out = join(root, 'dist-core');

if (!existsSync(join(out, 'core.mjs'))) {
  console.error('\n✖ dist-core/ is not built — this runs after `vite build --config vite.core.config.ts`.\n');
  process.exit(1);
}

const parent = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));

const manifest = {
  name: '@box-kite/core',
  version: parent.version,
  type: 'module',
  description:
    'The Box Kite styling engine, with no framework at all — runtime atomic CSS for a plain-DOM app, a Web Component or another framework.',
  main: './core.cjs',
  module: './core.mjs',
  types: './core.d.ts',
  exports: {
    '.': { types: './core.d.ts', import: './core.mjs', require: './core.cjs' },
    // The augmentation target: `declare module '@box-kite/core/types'` is where a project's own props
    // and components are declared, so it lives with the registry they extend rather than with a binding.
    './types': { types: './types.d.ts' },
  },
  sideEffects: false,
  keywords: ['box-kite', 'boxkite', 'css-in-js', 'atomic-css', 'runtime-css', 'styling', 'design-system', 'typescript'],
  repository: parent.repository,
  bugs: parent.bugs,
  homepage: parent.homepage,
  author: parent.author,
  license: parent.license,
};

writeFileSync(join(out, 'package.json'), `${JSON.stringify(manifest, null, 2)}\n`);
cpSync(join(root, 'core', 'README.md'), join(out, 'README.md'));
cpSync(join(root, 'LICENSE'), join(out, 'LICENSE'));

const installed = join(root, 'node_modules', '@box-kite', 'core');
rmSync(installed, { recursive: true, force: true });
mkdirSync(join(root, 'node_modules', '@box-kite'), { recursive: true });
cpSync(out, installed, { recursive: true });

console.log(`✔ @box-kite/core@${manifest.version} built and installed into node_modules for the load checks`);
