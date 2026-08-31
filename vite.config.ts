import fs from 'fs';
import path from 'path';
import dts from 'vite-plugin-dts';
import { defineConfig } from 'vitest/config';
import {
  CLIENT_ONLY_COMPONENTS,
  CLIENT_ONLY_ENTRIES,
  PACKAGE_NAME,
  SERVER_SAFE_COMPONENTS,
  componentPrivateModules,
  coreGraph,
  serverSafeModules,
} from './scripts/moduleGraph.mjs';

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
  // The behaviour primitives the accessible components are built from — see src/a11y.ts.
  a11y: path.resolve(import.meta.dirname, './src/a11y.ts'),
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

// The chunk split is derived from what the entries actually reach — the same walks `check:boundaries`
// uses, so a new module cannot be forgotten by one and not the other.
const frameworkFree = new Set(coreGraph().modules.keys());
// The leaves a single component owns — see `componentPrivateModules`.
const componentPrivate = componentPrivateModules();
const serverSafe = serverSafeModules();

const componentFile = (name: string) => path.resolve(import.meta.dirname, 'src/components', `${name}.tsx`);
const serverSafeFiles = new Set(SERVER_SAFE_COMPONENTS.map(componentFile));

/**
 * The pre-built components resolve Box through the package's own name. A relative import in a published
 * chunk bypasses the `exports` map, so a Server Component importing `Flex` was handed the *client* Box and
 * the build failed with `createContext is not a function`, naming neither the component nor the fix (bug
 * #43). By name, the consumer's own conditions decide — the same `flex.mjs` works in either graph.
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
 * `'use client'` on the components and entries that cannot render on a server, so importing one opens a
 * client boundary instead of failing to resolve `useState`. Added at render time rather than in the
 * source, where it would warn on every build and mean nothing to the tests and the demo site.
 */
const useClientBanner = {
  name: 'use-client-banner',
  apply: 'build' as const,
  renderChunk(code: string, chunk: { name: string }) {
    const component = chunk.name.startsWith('components/') && chunk.name.slice('components/'.length);
    const isClientEntry = CLIENT_ONLY_ENTRIES.includes(chunk.name);

    if (!isClientEntry && (!component || !CLIENT_ONLY_COMPONENTS.includes(component))) return null;

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
          // Rolldown ignores `manualChunks`, so the split is declared here. Three groups, each answering a
          // constraint: `engine` is framework-free (the `/core` entry imports it and nothing else); `react-shared`
          // is the hook-free React modules both Boxes use, server-safe but naming `react`; `client` is hooks and
          // effects, which under the `react-server` condition would not even resolve. Everything else is
          // rolldown’s to place, and it already gives each component its own chunk.
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
                  if (!source.includes('/src/') || /^src\/(a11y|box|core|rsc|ssg)\.ts$/.test(module)) return null;
                  // Component entries keep the chunks rolldown gives them, one per component.
                  if (module.startsWith('src/components/')) return null;

                  // Two leaves several groups need, pulled out rather than left to fall into `engine` or `client`: a module
                  // lives in one chunk, so `behavior` would otherwise import the whole engine to ask for a `document`.
                  // `platform` must stay React-free — the `/core` entry reaches it — hence the effect helpers are separate.
                  if (module.startsWith('src/utils/environment/') || module.startsWith('src/utils/dom/')) return 'platform';
                  if (module === 'src/react/effects.ts') return 'effects';

                  // A leaf only one component reaches goes in that component's own chunk: every group below is shared with
                  // something everybody imports, so a private leaf in one is paid for by consumers who cannot reach it.
                  // Rolldown inlines what it is not told to group, which is what `null` asks for.
                  if (componentPrivate.has(module)) return null;

                  // The markup the form controls share. Server-safe, but not part of `react-shared`: it is the one shared
                  // module that imports a *component* entry (`Flex`), and in `react-shared` that edge is a cycle — it left
                  // `semantics.mjs` reading `StringUtils` before it was defined.
                  if (module.startsWith('src/react/forms/')) return 'forms';

                  // 'engine', not 'core': `core` is an entry name now (src/core.ts), and a chunk
                  // sharing it would fight the entry for `core.mjs`.
                  if (frameworkFree.has(module)) return 'engine';

                  // The behaviour primitives reach nothing but React and each other. In `client` they would be correct and
                  // useless: `/a11y` would import the styling binding and the theme provider, so anyone wanting
                  // `useDismiss` alone would bundle the engine with it.
                  if (module.startsWith('src/react/a11y/')) return 'behavior';

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
      // Vitest's 5s default has no head-room for the heaviest renders here: the DataGrid a11y tests build a
      // virtualized grid and walk its whole role tree, and one timed out at 5.4s on a loaded machine while
      // passing in 4s alone. A hung test still fails, just later.
      testTimeout: 15_000,
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
