// Fails the build if the React Server Components entry can no longer render on a server. `src/rsc.ts`
// renders with no hook, no effect and no DOM — invisible in a normal test run (Vitest uses the client
// React), where one `useState` in any module it reaches turns every server render into React error #482,
// so the graph is checked instead. The pre-built components go through the same walk, one list at a time,
// and `vite.config.ts` decides the chunk split from these graphs, so the built chunks inherit them.
import {
  BANNED_SPECIFIER,
  CLIENT_APIS,
  CLIENT_ONLY_COMPONENTS,
  RSC_ENTRY,
  SERVER_SAFE_COMPONENTS,
  componentEntries,
  componentGraph,
  rscGraph,
} from './moduleGraph.mjs';

const violations = [];

/** The client APIs an entry's graph names, as `module: api` strings. */
function clientApis({ modules }) {
  const found = [];

  for (const [path, code] of modules) {
    for (const api of CLIENT_APIS) {
      if (new RegExp(String.raw`\b${api}\b`).test(code)) found.push({ path, api });
    }
  }

  return found;
}

function checkServerGraph(label, graph, hint) {
  for (const { path, api } of clientApis(graph)) {
    violations.push(`${label}: ${path} uses ${api}() — there is no server dispatcher for it. ${hint}`);
  }

  for (const { path, specifier } of graph.bare) {
    if (BANNED_SPECIFIER.test(specifier)) {
      violations.push(`${label}: ${path} imports '${specifier}' — not available to a Server Component. ${hint}`);
    }
  }

  for (const { path, specifier } of graph.unresolved) {
    violations.push(`${label}: ${path} cannot resolve '${specifier}'`);
  }
}

const rsc = rscGraph();
checkServerGraph(RSC_ENTRY, rsc, 'Keep stateful code in the client Box (src/box.ts).');

// Every published component belongs to exactly one list. A new one added to neither would go
// unchecked here and unbannered in the build, which is how bug #43 shipped in the first place.
const classified = [...SERVER_SAFE_COMPONENTS, ...CLIENT_ONLY_COMPONENTS];
for (const name of componentEntries()) {
  if (!classified.includes(name)) {
    violations.push(`src/components/${name}.tsx: not classified — add it to SERVER_SAFE_COMPONENTS or CLIENT_ONLY_COMPONENTS`);
  }
}
for (const name of classified) {
  if (!componentEntries().includes(name)) violations.push(`moduleGraph.mjs lists '${name}', which is not a component entry`);
}

for (const name of SERVER_SAFE_COMPONENTS) {
  const hint = `Move it to CLIENT_ONLY_COMPONENTS in scripts/moduleGraph.mjs if it truly needs a client runtime.`;
  checkServerGraph(`components/${name}`, componentGraph(name), hint);
}

// The other direction: a component listed as client-only that no longer needs to be. The banner
// costs consumers a bundler warning and costs their users a hydration boundary, so it should not
// outlive the hook that earned it.
for (const name of CLIENT_ONLY_COMPONENTS) {
  const graph = componentGraph(name);
  const needsClient = clientApis(graph).length > 0 || graph.bare.some(({ specifier }) => BANNED_SPECIFIER.test(specifier));

  if (!needsClient) {
    violations.push(`components/${name}: reaches no client API — move it to SERVER_SAFE_COMPONENTS so it can render on a server`);
  }
}

if (violations.length) {
  console.error(`\n✖ the server-rendering boundary is broken — ${violations.length} violation(s):\n`);
  for (const violation of violations) console.error(`  ${violation}`);
  console.error('\nSee CONTRIBUTING.md, "The core boundary".\n');
  process.exit(1);
}

console.log(
  `✔ ${RSC_ENTRY} renders with no client hooks (${rsc.modules.size} modules in its graph)`,
  `\n✔ ${SERVER_SAFE_COMPONENTS.length} pre-built components render on a server; ${CLIENT_ONLY_COMPONENTS.length} are client-only and say so`,
);
