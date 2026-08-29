// What an entry module actually reaches, by walking its imports — and the React APIs some entries
// may not reach at all. Two entries are checked and chunked by this walk:
//
//   `src/core.ts` — the framework-free engine (`@cronocode/react-box/core`). It must reach no
//   React whatsoever, and its graph is what the `engine` chunk is built from, so a consumer with
//   no framework bundles none. A directory rule would not do: the engine reaches `src/utils/**`
//   and `src/types.ts`, which sit outside `src/core/` and were landing in a React chunk.
//
//   `src/rsc.ts` — what the `react-server` export condition resolves to: the Box a Server
//   Component gets. It renders with no hook, no effect and no DOM, its CSS leaving as
//   `<style href precedence>` elements. Under that condition `react` exports no `useState` and no
//   effects at all, so a chunk naming them would not even resolve for a consumer bundling a
//   Server Component.
//
//   `src/components/*.tsx` — the pre-built components, split into the ones that render on a
//   server and the ones that cannot. The hook-free ones reach Box through the package's own name
//   at build time (see `SERVER_SAFE_COMPONENTS`), so their walk stops at `src/box.ts`: that edge
//   belongs to the export map, and which Box it lands on is the consumer's condition to decide.
//
// The checks (`check-core-boundary.mjs`, `check-rsc-boundary.mjs`) and the chunk split in
// `vite.config.ts` share the walk so they cannot disagree about what an entry reaches.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

const root = join(import.meta.dirname, '..');

export const RSC_ENTRY = 'src/rsc.ts';

export const CORE_ENTRY = 'src/core.ts';

export const BOX_ENTRY = 'src/box.ts';

/** The package's own name — what the `../box` edge becomes in the built server-safe components. */
export const PACKAGE_NAME = '@cronocode/react-box';

/**
 * The pre-built components a Server Component can import and render *on the server*: no hook, no
 * effect, nothing but props forwarded to Box. Their built chunks import `@cronocode/react-box`
 * rather than `../box.mjs`, so the `react-server` condition applies and they get the hook-free
 * Box — which is the whole point: `<H1>` in a Server Component must not drag a client runtime in
 * behind it. Enforced by `check-rsc-boundary.mjs`, and loaded for real by `postbuild.mjs`.
 */
export const SERVER_SAFE_COMPONENTS = [
  'baseSvg',
  'button',
  'flex',
  'grid',
  'radioButton',
  'semantics',
  'textarea',
  'textbox',
  'visuallyHidden',
];

/**
 * The rest: they hold state, measure the DOM or portal into it. A Server Component may still
 * import one — their chunks carry a `'use client'` banner, so the bundler opens a client boundary
 * instead of failing to resolve `useState`. Nothing here renders *on* the server.
 */
export const CLIENT_ONLY_COMPONENTS = ['checkbox', 'dataGrid', 'dropdown', 'form', 'overlay', 'select', 'tooltip'];

/**
 * Entries that are hooks all the way down and so can only run on the client. They carry the same
 * `'use client'` banner the stateful components do: a Server Component importing `useDismiss`
 * should open a client boundary, not fail to resolve `useRef`.
 */
export const CLIENT_ONLY_ENTRIES = ['a11y'];

// Hooks and APIs React's server renderer has no dispatcher for. `useMemo`, `useCallback`, `useId`,
// `useDebugValue` and `use` are the ones it does support, so they are deliberately absent here.
export const CLIENT_APIS = [
  'useState',
  'useReducer',
  'useEffect',
  'useLayoutEffect',
  'useInsertionEffect',
  'useRef',
  'useImperativeHandle',
  'useContext',
  'useSyncExternalStore',
  'useTransition',
  'useDeferredValue',
  'useOptimistic',
  'useActionState',
  'useFormStatus',
  'createContext',
];

export const BANNED_SPECIFIER = /^(react-dom|use-sync-external-store)(\/|$)/;

const SPECIFIER = /(?:\bfrom|\bimport|\brequire)\s*\(?\s*['"]([^'"]+)['"]/g;

/** Comments stripped, and type-only imports with them: those are erased before anything runs. */
function stripped(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[\s;])\/\/[^\n]*/g, '$1')
    .replace(/\b(?:import|export)\s+type\s+[^;]*;/g, '');
}

/** The file a relative specifier points at, as a repo-relative POSIX path. */
function resolveSpecifier(fromFile, specifier) {
  const base = resolve(root, dirname(fromFile), specifier);
  const candidates = [base, `${base}.ts`, `${base}.tsx`, join(base, 'index.ts'), join(base, 'index.tsx')];
  const found = candidates.find((candidate) => existsSync(candidate) && statSync(candidate).isFile());

  return found ? relative(root, found).split(/[\\/]/).join('/') : null;
}

/**
 * Walk an entry's imports. Returns every module it reaches — repo-relative POSIX paths, mapped to
 * their comment-free source — plus the bare specifiers it pulls in and anything that would not
 * resolve.
 *
 * `stopAt` names modules the walk records as a bare package import instead of descending into:
 * the build turns those edges into package specifiers, so what lies beyond them is the consumer's
 * export condition to resolve, not ours.
 */
export function moduleGraph(entry, stopAt = new Set()) {
  const modules = new Map();
  const bare = [];
  const unresolved = [];
  const queue = [entry];

  while (queue.length) {
    const path = queue.shift();
    if (modules.has(path)) continue;

    const code = stripped(readFileSync(join(root, path), 'utf8'));
    modules.set(path, code);

    for (const [, specifier] of code.matchAll(SPECIFIER)) {
      if (!specifier.startsWith('.')) {
        bare.push({ path, specifier });
        continue;
      }

      const resolved = resolveSpecifier(path, specifier);
      if (resolved === null) unresolved.push({ path, specifier });
      else if (stopAt.has(resolved)) bare.push({ path, specifier: PACKAGE_NAME });
      else queue.push(resolved);
    }
  }

  return { modules, bare, unresolved };
}

/** The `react-server` entry's graph. */
export function rscGraph() {
  return moduleGraph(RSC_ENTRY);
}

/** The framework-free entry's graph. */
export function coreGraph() {
  return moduleGraph(CORE_ENTRY);
}

/** A component's graph, with the `../box` edge left to the export map. */
export function componentGraph(name) {
  return moduleGraph(`src/components/${name}.tsx`, new Set([BOX_ENTRY]));
}

/**
 * Every module that can end up in a server graph: the `react-server` entry's, plus the server-safe
 * components'. The chunk split reads this — a module only a component reaches (`stringUtils`, say)
 * would otherwise be classified client, and `semantics` would import a chunk naming `useState`.
 */
export function serverSafeModules() {
  const modules = new Set(rscGraph().modules.keys());

  for (const name of SERVER_SAFE_COMPONENTS) {
    for (const path of componentGraph(name).modules.keys()) modules.add(path);
  }

  return modules;
}

/** The component entries the build publishes, read from disk, so a new one cannot go unclassified. */
export function componentEntries() {
  return readdirSync(join(root, 'src/components'))
    .filter((fileName) => fileName.endsWith('.tsx') && !fileName.includes('.test.'))
    .map((fileName) => fileName.replace(/\.tsx$/, ''));
}
