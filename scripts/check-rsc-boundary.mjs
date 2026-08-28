// Fails the build if the React Server Components entry can no longer render on a server.
//
// `src/rsc.ts` is what the `react-server` export condition resolves to: the Box a Server Component
// gets when it imports the package. It renders with no hook, no effect and no DOM — its CSS leaves
// as `<style href precedence>` elements instead. That property is invisible in a normal test run
// (Vitest renders with the client React), and a single `useState` in any module it reaches turns
// every server render into React error #482 for consumers. So the graph is checked instead.
//
// The same graph decides the chunk split in `vite.config.ts`, so the built `rsc.mjs` inherits it.
//
// Run: npm run check:boundaries
import { BANNED_SPECIFIER, CLIENT_APIS, RSC_ENTRY, rscGraph } from './moduleGraph.mjs';

const violations = [];
const { modules, bare, unresolved } = rscGraph();

for (const [path, code] of modules) {
  for (const api of CLIENT_APIS) {
    if (new RegExp(String.raw`\b${api}\b`).test(code)) {
      violations.push(`${path}: uses ${api}() — there is no server dispatcher for it`);
    }
  }
}

for (const { path, specifier } of bare) {
  if (BANNED_SPECIFIER.test(specifier)) {
    violations.push(`${path}: imports '${specifier}' — not available to a Server Component`);
  }
}

for (const { path, specifier } of unresolved) {
  violations.push(`${path}: cannot resolve '${specifier}'`);
}

if (violations.length) {
  console.error(`\n✖ ${RSC_ENTRY} must render without a client runtime — ${violations.length} violation(s):\n`);
  for (const violation of violations) console.error(`  ${violation}`);
  console.error('\nKeep stateful code in the client Box (src/box.ts). See CONTRIBUTING.md, "The core boundary".\n');
  process.exit(1);
}

console.log(`✔ ${RSC_ENTRY} renders with no client hooks (${modules.size} modules in its graph)`);
