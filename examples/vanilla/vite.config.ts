import path from 'path';
import { defineConfig } from 'vite';

// The example imports `@cronocode/react-box/core` by its published specifier — the same line a
// consumer writes — and this alias points that at the sources so the page reloads while the engine
// is edited. Nothing else is configured: there is no framework plugin because there is no framework.
export default defineConfig({
  resolve: {
    alias: {
      '@cronocode/react-box/core': path.resolve(import.meta.dirname, '../../src/core.ts'),
    },
  },
  build: {
    emptyOutDir: true,
  },
});
