import fs from 'fs';
import path from 'path';
import dts from 'vite-plugin-dts';
import { defineConfig } from 'vitest/config';
import { rscGraph } from './scripts/rscGraph.mjs';

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
  // The `react-server` condition of the main entry: the hook-free Box a Server Component gets.
  rsc: path.resolve(import.meta.dirname, './src/rsc.ts'),
  ssg: path.resolve(import.meta.dirname, './src/ssg.ts'),
  ...componentsEntry,
};

const extensions = {
  es: 'mjs',
  cjs: 'cjs',
};

// The chunk split is derived from the `react-server` entry's own module graph — the same walk
// `npm run check:boundaries` uses. Whatever `src/rsc.ts` reaches goes into the chunk it imports;
// everything else React-facing (the flush effect, the theme provider, the shared hooks) goes into a
// client chunk it does not. Under the `react-server` condition `react` exports no `useState` and no
// effects at all, so a shared chunk that named them would not even resolve for a consumer bundling
// a Server Component — and deriving the split means a new hook-free module cannot be forgotten.
const serverSafe = new Set(rscGraph().modules.keys());

let currentFormat;

export default defineConfig(({ mode }) => {
  return {
    plugins: [dts({ entryRoot: './src', exclude: ['./pages/**', './src/**/*.test.*', './dev/**'] })],
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
        external: ['react', 'react-dom', 'react/jsx-runtime', 'react-dom/server', 'use-sync-external-store/shim'],
        // Required by `codeSplitting.includeDependenciesRecursively: false` below. Entry exports are
        // unaffected — an entry chunk is merely allowed to carry more than the entry declares.
        preserveEntrySignatures: 'allow-extension',
        output: {
          exports: 'named',
          // Rolldown ignores `manualChunks` (it is Rollup's option), so the split is declared here.
          // The one split that matters: the client binding — hooks, effects, the theme provider —
          // must stay out of the chunk the `react-server` entry imports. Under that condition
          // `react` exports no `useState` and no effects at all, so a shared chunk naming them
          // fails to resolve for a consumer bundling a Server Component. Everything else is left to
          // rolldown, which already gives each component entry its own chunk.
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
                  if (!source.includes('/src/') || /^src\/(box|rsc|ssg)\.ts$/.test(module)) return null;
                  // Component entries keep the chunks rolldown gives them, one per component.
                  if (module.startsWith('src/components/')) return null;

                  return serverSafe.has(module) ? 'core' : 'client';
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
        include: ['src/core/**', 'src/react/**'],
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
