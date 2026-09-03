import path from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

/**
 * The `@box-kite/core` build: the engine and the types, with no React anywhere in the graph.
 * `npm run check:boundaries` proves the *sources* are framework-free; this is what makes that a
 * package a plain-DOM app, a Web Component or another framework's adapter can install on its own.
 *
 * One entry, so rolldown inlines the whole graph into `core.mjs` rather than splitting it — a chunk
 * boundary here would buy nothing and cost a file. The declarations do ship as a tree, because
 * `core.d.ts` and `types.d.ts` both reference the modules underneath them.
 */
export default defineConfig(({ mode }) => ({
  plugins: [dts({ entryRoot: './src', include: ['./src/core.ts', './src/types.ts', './src/core/**', './src/utils/**'] })],
  build: {
    outDir: 'dist-core',
    emptyOutDir: true,
    minify: mode !== 'dev',
    lib: {
      // Named `core`, not `index`: the file the package points at spells what it is, the way the
      // React package's `box.*` does, and it saves fighting the dts plugin over an entry filename.
      entry: { core: path.resolve(import.meta.dirname, './src/core.ts') },
      fileName: (format, entryName) => `${entryName}.${format === 'es' ? 'mjs' : 'cjs'}`,
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      // csstype is types-only, so nothing of it reaches the bundle; naming it here keeps a stray
      // value import from being inlined silently.
      external: ['csstype'],
      output: { exports: 'named' },
    },
  },
}));
