import fs from 'fs';
import path from 'path';
import dts from 'vite-plugin-dts';
import { defineConfig } from 'vitest/config';
import { CLIENT_ONLY_COMPONENTS, PACKAGE_NAME, SERVER_SAFE_COMPONENTS, coreGraph, serverSafeModules } from './scripts/moduleGraph.mjs';

const files = fs
  .readdirSync(path.resolve(import.meta.dirname, './src/components'))
  .filter((fileName) => fileName.includes('.test') === false)
  .filter((fileName) => !fileName.startsWith('.'));

const componentsEntry = files.reduce((acc, fileName) => {
  acc[`components/${path.parse(fileName).name}`] = path.resolve(import.meta.dirname, 'src/components', fileName);

  return acc;
}, {});

const entry = {
  box: path.resolve(import.meta.dirname, './src/box.ts'),
  // The engine on its own, for consumers with no React at all — see src/core.ts.
  core: path.resolve(import.meta.dirname, './src/core.ts'),
  // The `react-server` condition of the main entry: the hook-free Box a Server Component gets.
  rsc: path.resolve(import.meta.dirname, './src/rsc.ts'),
  ssg: path.resolve(import.meta.dirname, './src/ssg.ts'),
  ...componentsEntry,
};

const extensions = {
  es: 'mjs',
  cjs: 'cjs',
};

// The chunk split is derived from what the entries actually reach — the same walks
// `npm run check:boundaries` uses, so a new module cannot be forgotten by one and not the other.
// `src/core.ts` reaches only framework-free modules; `src/rsc.ts` reaches those plus the hook-free
// React ones; everything else (the flush effect, the theme provider, the shared hooks) is client.
const frameworkFree = new Set(coreGraph().modules.keys());
const serverSafe = serverSafeModules();

const componentFile = (name: string) => path.resolve(import.meta.dirname, 'src/components', `${name}.tsx`);
const serverSafeFiles = new Set(SERVER_SAFE_COMPONENTS.map(componentFile));

/**
 * The pre-built components resolve Box through the package's own name, not `../box.mjs`.
 *
 * A relative import in a published chunk bypasses the `exports` map, so the `react-server`
 * condition never gets a chance to apply and a Server Component importing `Flex` was handed the
 * *client* Box — a module that calls `createContext` at import time, which the server build of
 * React does not export. The build failed with `createContext is not a function`, naming neither
 * the component nor the fix (bug #43).
 *
 * Emitting the package name instead puts the decision back where it belongs: the consumer's
 * bundler resolves it under its own conditions, so the same `flex.mjs` gets the hook-free Box in
 * a server graph and the client Box in a client one. Only the components that can render on a
 * server get this — the rest are pinned to the client graph by their `'use client'` banner, where
 * the relative path is already correct.
 */
const boxSelfReference = {
  name: 'box-self-reference',
  // Ahead of Vite's own resolver, which resolves `../box` to a file before a plugin can object.
  enforce: 'pre' as const,
  // Build only. A Vitest run imports the sources directly, with no package to resolve a name
  // against, and the same is true of the demo site's dev server.
  apply: 'build' as const,
  resolveId(source: string, importer?: string) {
    if (source !== '../box' || !importer) return null;

    return serverSafeFiles.has(path.resolve(importer)) ? { id: PACKAGE_NAME, external: true } : null;
  },
};

/**
 * `'use client'` on the components that cannot render on a server, so importing one from a Server
 * Component opens a client boundary instead of failing to resolve `useState`. It goes on at
 * render time rather than in the source: a directive in a source file makes rolldown (and every
 * consumer's Rollup) warn about module-level directives on every build, and the sources are also
 * what the demo site and the tests import, where the directive means nothing.
 */
const useClientBanner = {
  name: 'use-client-banner',
  apply: 'build' as const,
  renderChunk(code: string, chunk: { name: string }) {
    const component = chunk.name.startsWith('components/') && chunk.name.slice('components/'.length);

    if (!component || !CLIENT_ONLY_COMPONENTS.includes(component)) return null;

    // No sourcemap to shift — this build emits none.
    return { code: `'use client';\n${code}`, map: null };
  },
};

let currentFormat;

export default defineConfig(({ mode }) => {
  return {
    plugins: [dts({ entryRoot: './src', exclude: ['./pages/**', './src/**/*.test.*', './dev/**'] }), boxSelfReference, useClientBanner],
    build: {
      minify: mode !== 'dev',
      lib: {
        entry,
        fileName: (format, entryName) => {
          currentFormat = format;
          return `${entryName}.${extensions[format]}`;
        },
        formats: ['es', 'cjs'],
      },
      rollupOptions: {
        external: [PACKAGE_NAME, 'react', 'react-dom', 'react/jsx-runtime', 'react-dom/server', 'use-sync-external-store/shim'],
        // Required by `codeSplitting.includeDependenciesRecursively: false` below. Entry exports are
        // unaffected — an entry chunk is merely allowed to carry more than the entry declares.
        preserveEntrySignatures: 'allow-extension',
        output: {
          exports: 'named',
          // Rolldown ignores `manualChunks` (it is Rollup's option), so the split is declared here.
          // Three groups, each answering a constraint an entry has:
          //   engine       — src/core/**, framework-free. The `/core` entry imports this and
          //                  nothing else, so a consumer with no React bundles no React.
          //   react-shared — the hook-free React modules both Boxes use (prop assembly, the
          //                  element-mode resolve) and the ones only a server-safe component
          //                  reaches. Server-safe, so the `react-server` entry and those
          //                  components may import it, but it does name `react` — hence not part
          //                  of `engine`.
          //   client       — hooks, effects, the theme provider. Under the `react-server`
          //                  condition `react` exports no `useState` and no effects at all, so a
          //                  chunk naming them would not even resolve for a consumer bundling a
          //                  Server Component. Nothing `src/rsc.ts` reaches may land here.
          // Everything else is left to rolldown, which already gives each component its own chunk.
          codeSplitting: {
            // Each module lands where the group says and nowhere else; without this a group also
            // swallows everything its modules import, which is how the core engine ended up inside
            // the client chunk. It is what `preserveEntrySignatures: 'allow-extension'` above buys.
            includeDependenciesRecursively: false,
            groups: [
              {
                name: (id: string) => {
                  const source = id.split(path.sep).join('/');
                  const module = source.slice(source.indexOf('/src/') + 1);

                  // Entry modules stay their own chunks — grouping them would drag one entry's
                  // imports (`react-dom/server`, say) into every other entry that shares the group.
                  if (!source.includes('/src/') || /^src\/(box|core|rsc|ssg)\.ts$/.test(module)) return null;
                  // Component entries keep the chunks rolldown gives them, one per component.
                  if (module.startsWith('src/components/')) return null;

                  // 'engine', not 'core': `core` is an entry name now (src/core.ts), and a chunk
                  // sharing it would fight the entry for `core.mjs`.
                  if (frameworkFree.has(module)) return 'engine';

                  return serverSafe.has(module) ? 'react-shared' : 'client';
                },
              },
            ],
          },
          chunkFileNames: (_info) => `[name].${extensions[currentFormat]}`,
        },
      },
    },
    test: {
      environment: 'happy-dom',
      globals: true,
      setupFiles: ['./dev/vitest.setup.ts'],
      coverage: {
        provider: 'v8',
        // The engine and its React binding are what every other roadmap item builds on, so they
        // are the only things under a budget. Components — and the helper hooks they share — are
        // covered by their own tests without a number attached.
        include: ['src/core.ts', 'src/core/**', 'src/react/**'],
        exclude: ['src/react/hooks/**'],
        reporter: ['text', 'json-summary'],
        thresholds: {
          statements: 90,
          branches: 85,
          functions: 90,
          lines: 90,
        },
      },
    },
  };
});
