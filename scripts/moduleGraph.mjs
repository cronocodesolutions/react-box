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
// The checks (`check-core-boundary.mjs`, `check-rsc-boundary.mjs`) and the chunk split in
// `vite.config.ts` share the walk so they cannot disagree about what an entry reaches.
import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

const root = join(import.meta.dirname, '..');

export const RSC_ENTRY = 'src/rsc.ts';

export const CORE_ENTRY = 'src/core.ts';

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
 */
export function moduleGraph(entry) {
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
      if (resolved) queue.push(resolved);
      else unresolved.push({ path, specifier });
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
