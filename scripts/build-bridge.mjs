// Builds the compatibility bridge: `@cronocode/react-box@3.4.0`, every entry re-exporting
// `@box-kite/react`. It exists so an `npm update` cannot break a build that has not migrated yet;
// `npm deprecate` is what actually moves people.
//
// The re-exports are generated from the built `dist/`, not written by hand: `export *` does not carry
// a default, and `export { default }` from a module that has none is a link-time error — so which
// entries have one is read from the real thing rather than remembered.
//
// Run: npm run build:bridge (after npm run build)
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = join(import.meta.dirname, '..');
const out = join(root, 'dist-bridge');

if (!existsSync(join(root, 'dist', 'package.json'))) {
  console.error('\n✖ dist/ is not built — run `npm run build` first.\n');
  process.exit(1);
}

const target = JSON.parse(readFileSync(join(root, 'dist', 'package.json'), 'utf8'));
const TARGET_NAME = target.name;
const BRIDGE_NAME = '@cronocode/react-box';
const BRIDGE_VERSION = '3.4.0';
const CORE_NAME = '@box-kite/core';

const components = readdirSync(join(root, 'src', 'components'))
  .filter((name) => name.endsWith('.tsx') && !name.includes('.test'))
  .map((name) => `components/${name.replace('.tsx', '')}`);

const entries = ['box', 'rsc', 'a11y', 'core', 'ssg', ...components];

rmSync(out, { recursive: true, force: true });

for (const entry of entries) {
  const built = entry === 'core' ? join(root, 'dist-core', 'core.mjs') : join(root, 'dist', `${entry}.mjs`);
  const module = await import(pathToFileURL(built).href);
  const hasDefault = Object.keys(module).includes('default');
  // `/rsc` is named explicitly rather than left to the consumer's conditions: the bridge's own `.`
  // export already routes react-server here, and an explicit `/rsc` import must not get the client Box.
  // `/core` went to a package of its own, so the old subpath forwards across the family.
  const from = entry === 'box' ? TARGET_NAME : entry === 'core' ? CORE_NAME : `${TARGET_NAME}/${entry}`;

  const esm = [`export * from '${from}';`, hasDefault ? `export { default } from '${from}';` : ''].filter(Boolean).join('\n');
  const cjs = `module.exports = require('${from}');`;
  const dts = esm;

  for (const [extension, source] of [
    ['mjs', esm],
    ['cjs', cjs],
    ['d.ts', dts],
  ]) {
    const file = join(out, `${entry}.${extension}`);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, `${source}\n`);
  }
}

// Types-only entry: it carries no runtime, and a consumer's `declare module` cannot be forwarded
// through a re-export — which is why the README names it as the one thing the bridge does not cover.
mkdirSync(out, { recursive: true });
writeFileSync(join(out, 'types.d.ts'), `export * from '${CORE_NAME}/types';\n`);

const manifest = {
  name: BRIDGE_NAME,
  version: BRIDGE_VERSION,
  type: 'module',
  description: `Renamed to ${TARGET_NAME}. This version re-exports it so an existing build keeps working; install ${TARGET_NAME} instead.`,
  main: './box.cjs',
  module: './box.mjs',
  types: './box.d.ts',
  exports: {
    '.': {
      'react-server': { types: './rsc.d.ts', import: './rsc.mjs', require: './rsc.cjs' },
      types: './box.d.ts',
      import: './box.mjs',
      require: './box.cjs',
    },
    './rsc': { types: './rsc.d.ts', import: './rsc.mjs', require: './rsc.cjs' },
    './a11y': { types: './a11y.d.ts', import: './a11y.mjs', require: './a11y.cjs' },
    './core': { types: './core.d.ts', import: './core.mjs', require: './core.cjs' },
    './ssg': { types: './ssg.d.ts', import: './ssg.mjs', require: './ssg.cjs' },
    './components/*': { types: './components/*.d.ts', import: './components/*.mjs', require: './components/*.cjs' },
    './types': { types: './types.d.ts' },
  },
  // Exact, not a range: the bridge forwards one published surface and nothing else. Both packages,
  // because `/core` and `/types` now resolve across the family.
  dependencies: { [CORE_NAME]: target.version, [TARGET_NAME]: target.version },
  peerDependencies: target.peerDependencies,
  repository: target.repository,
  bugs: target.bugs,
  homepage: target.homepage,
  author: target.author,
  license: target.license,
  keywords: target.keywords,
};

writeFileSync(join(out, 'package.json'), `${JSON.stringify(manifest, null, 2)}\n`);
cpSync(join(root, 'bridge', 'README.md'), join(out, 'README.md'));
cpSync(join(root, 'LICENSE'), join(out, 'LICENSE'));

console.log(`✔ bridge built: ${BRIDGE_NAME}@${BRIDGE_VERSION} → ${TARGET_NAME}@${target.version} (${entries.length} entries + types)`);
console.log('  publish with: npm publish ./dist-bridge --access public');
console.log(`  then: npm deprecate ${BRIDGE_NAME} "renamed: npm i ${TARGET_NAME}"`);
