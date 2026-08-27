// Fails the build if anything under src/core reaches for React.
//
// `src/core` is the future `@box-kite/core` package: the style engine, the prop definitions, the
// formatters, the variables and the framework-free runtime helpers. It must be usable with no
// framework at all (vanilla DOM, an iframe widget, another framework's adapter), so a single
// `import 'react'` there is a real regression, not a style nit.
//
// ESLint's `no-restricted-imports` covers the common case; this check exists because it does not
// see `require()`, dynamic `import()`, JSX, or React's *global* namespace (`React.JSX.*` types need
// no import at all — that is exactly how `ExtractElementFromTag` hid in coreTypes.ts until CO5).
//
// Run: npm run check:boundaries
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = join(import.meta.dirname, '..');
const CORE = 'src/core';

const BANNED_SPECIFIER = /^(react|react-dom|use-sync-external-store)(\/|$)/;
const SPECIFIER = /(?:\bfrom|\bimport|\brequire)\s*\(?\s*['"]([^'"]+)['"]/g;
const REACT_GLOBAL = /\bReact\s*\./;

/** Every file under `dir`, as a repo-relative POSIX path. */
function walk(dir) {
  const out = [];

  for (const name of readdirSync(join(root, dir))) {
    const path = `${dir}/${name}`;

    if (statSync(join(root, path)).isDirectory()) out.push(...walk(path));
    else out.push(path);
  }

  return out;
}

/** Comments stripped, so prose may mention React.createElement without failing the check. */
function stripComments(source) {
  return (
    source
      .replace(/\/\*[\s\S]*?\*\//g, '')
      // Trailing comments too — but not the '//' inside a URL: truncating a string there could
      // hide a real import sitting after it on the same line.
      .replace(/(^|[\s;])\/\/[^\n]*/g, '$1')
  );
}

function checkFile(path) {
  const violations = [];

  if (/\.(tsx|jsx)$/.test(path)) {
    violations.push(`${path}: JSX file under ${CORE} — a framework-free module cannot render`);
  }

  const code = stripComments(readFileSync(join(root, path), 'utf8'));

  for (const [, specifier] of code.matchAll(SPECIFIER)) {
    if (BANNED_SPECIFIER.test(specifier)) violations.push(`${path}: imports '${specifier}'`);
  }

  if (REACT_GLOBAL.test(code)) {
    violations.push(`${path}: uses the global React namespace (React.*) — React-only types belong in src/react/reactTypes.ts`);
  }

  return violations;
}

/** Non-blank lines of non-test source, so the ratio stays comparable across releases. */
function measure(paths) {
  const files = paths.filter((p) => /\.tsx?$/.test(p) && !p.includes('.test.'));
  const lines = files.reduce(
    (sum, p) =>
      sum +
      readFileSync(join(root, p), 'utf8')
        .split('\n')
        .filter((l) => l.trim()).length,
    0,
  );

  return { files: files.length, lines };
}

const coreFiles = walk(CORE);
const violations = coreFiles.flatMap(checkFile);

if (violations.length) {
  console.error(`\n✖ ${CORE} must stay framework-free — ${violations.length} violation(s):\n`);
  for (const v of violations) console.error(`  ${v}`);
  console.error('\nMove React code into src/react/ and import it from there. See CONTRIBUTING.md, "The core boundary".\n');
  process.exit(1);
}

// Informational: the numbers published in the README architecture section. The binding is what a
// non-React adapter would have to reimplement; the helper hooks are React feature code that
// components happen to share, so they are counted separately rather than inflating the ratio.
const reactFiles = walk('src/react');
const isHook = (path) => path.startsWith('src/react/hooks/');

const core = measure(coreFiles);
const binding = measure([...reactFiles.filter((p) => !isHook(p)), 'src/box.ts', 'src/ssg.ts']);
const helpers = measure(reactFiles.filter(isHook));
const share = ((binding.lines / (core.lines + binding.lines)) * 100).toFixed(1);

console.log(`✔ ${CORE} is framework-free (${core.files} files, ${core.lines} lines, zero React references)`);
console.log(`  React binding: ${binding.files} files, ${binding.lines} lines — ${share}% of core + binding`);
console.log(`  React helper hooks: ${helpers.files} files, ${helpers.lines} lines (shared by components, outside the binding)`);
