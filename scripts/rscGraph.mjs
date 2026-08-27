// The module graph of the React Server Components entry, and the React APIs it may not reach.
//
// `src/rsc.ts` is what the `react-server` export condition resolves to: the Box a Server Component
// gets when it imports the package. It renders with no hook, no effect and no DOM — its CSS leaves
// as `<style href precedence>` elements instead.
//
// Two consumers share this walk, and they need the same answer:
//   - `check-rsc-boundary.mjs` fails the build if any module in the graph calls a client hook.
//   - `vite.config.ts` puts exactly these modules in the chunk the entry imports, so the built
//     `rsc.mjs` cannot reach a client hook either. Under the `react-server` condition `react`
//     exports no `useState` and no effects at all, so a shared chunk that names them does not even
//     resolve for a consumer bundling a Server Component.
import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

const root = join(import.meta.dirname, '..');

export const RSC_ENTRY = 'src/rsc.ts';

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
 * Walk the entry's imports. Returns every module it reaches — repo-relative POSIX paths, mapped to
 * their comment-free source — plus the bare specifiers it pulls in and anything that would not
 * resolve.
 */
export function rscGraph() {
  const modules = new Map();
  const bare = [];
  const unresolved = [];
  const queue = [RSC_ENTRY];

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
