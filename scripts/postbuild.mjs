// Copy publish metadata, docs, and Claude skill/rules into dist/ after the library build, then
// check the one property of the output that no test can see: the `react-server` entry must not
// reach a client hook through any chunk it imports.
// Uses Node's fs (not shell cp/mkdir) so it runs identically on macOS, Linux, and Windows.
import { spawnSync } from 'node:child_process';
import { cpSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

// Ensure target directories exist (recursive = cross-platform `mkdir -p`).
mkdirSync('dist/.claude/skills/cronocode-react-box', { recursive: true });
mkdirSync('dist/.claude/rules', { recursive: true });

const copies = [
  ['package.json', 'dist/package.json'],
  ['LICENSE', 'dist/LICENSE'],
  ['README.md', 'dist/README.md'],
  ['src/BOX_AI_CONTEXT.md', 'dist/BOX_AI_CONTEXT.md'],
  ['.claude/skills/cronocode-react-box/SKILL.md', 'dist/.claude/skills/cronocode-react-box/SKILL.md'],
  ['.claude/rules/react-box-rules.md', 'dist/.claude/rules/react-box-rules.md'],
];

for (const [from, to] of copies) {
  cpSync(from, to);
}

// Load the built package the way a Server Component's bundler resolves it. `npm run
// check:boundaries` proves the *sources* of the `react-server` entry call no client hook; this
// proves the bundler did not undo it by putting the client binding in a chunk that entry imports.
// Node applies `--conditions=react-server` to `react` as well, and that build of React exports no
// `useState` and no effects at all — so a chunk naming one fails to load right here, exactly as it
// would fail in a consumer's build.
const loads = [
  ['ESM', 'module', `const box = (await import('@cronocode/react-box')).default; assert(typeof box === 'function');`],
  ['CJS', 'commonjs', `const box = require('@cronocode/react-box').default; assert(typeof box === 'function');`],
];

for (const [format, inputType, code] of loads) {
  const script = `const assert = (ok) => { if (!ok) throw new Error('the entry did not export a component'); };\n${code}`;
  const result = spawnSync(process.execPath, ['--conditions=react-server', `--input-type=${inputType}`, '-e', script], {
    cwd: 'dist',
    encoding: 'utf8',
  });

  if (result.status !== 0) {
    console.error(`\n✖ the react-server entry does not load as ${format} — a client-only React API reached its chunk:\n`);
    console.error(result.stderr?.trim());
    console.error('\nFix the chunk split in vite.config.ts (codeSplitting.groups). See CONTRIBUTING.md, "The core boundary".\n');
    process.exit(1);
  }
}

console.log('✔ dist loads under the react-server condition (ESM and CJS)');

// The other half of the boundary, on the built output this time. `npm run check:boundaries` proves
// `src/core` names no React; this proves the bundler did not hand the framework-free entry a chunk
// that does. It is the same failure the react-server check catches, one entry over: the split used
// to be derived from the react-server module graph alone, and everything outside it — the theme
// runtime included — went to the client chunk, which `/core` then imported.
const REACT_SPECIFIER = /(?:from\s*|require\(\s*)["'](react(?:-dom)?(?:\/[^"']*)?)["']/g;

/** The chunk, plus every chunk it imports, as `[path, source]`. */
function chunkGraph(entry) {
  const seen = new Map();
  const queue = [entry];

  while (queue.length) {
    const file = queue.shift();
    if (seen.has(file)) continue;

    const code = readFileSync(join('dist', file), 'utf8');
    seen.set(file, code);

    for (const [, specifier] of code.matchAll(/(?:from\s*|require\(\s*)["'](\.\/[^"']+)["']/g)) {
      queue.push(specifier.slice(2));
    }
  }

  return seen;
}

for (const entry of ['core.mjs', 'core.cjs']) {
  const offenders = [...chunkGraph(entry)]
    .flatMap(([file, code]) => [...code.matchAll(REACT_SPECIFIER)].map(([, specifier]) => `${file} imports '${specifier}'`))
    .filter((value, index, all) => all.indexOf(value) === index);

  if (offenders.length) {
    console.error(`\n✖ the framework-free entry (${entry}) reaches React through its chunks:\n`);
    for (const offender of offenders) console.error(`  ${offender}`);
    console.error('\nFix the chunk split in vite.config.ts (codeSplitting.groups). See CONTRIBUTING.md, "The core boundary".\n');
    process.exit(1);
  }
}

console.log('✔ the /core entry bundles no React (ESM and CJS)');
