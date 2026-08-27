import reactPlugin from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
  return {
    plugins: [reactPlugin()],
    build: {
      emptyOutDir: true,
      minify: mode !== 'dev',
      // No explicit input: both scripts pass `./pages` as the root, so Vite's default
      // `<root>/index.html` is the entry. Naming it `pages/index.html` resolved against the root
      // (`pages/pages/index.html`), which made the dev server's dependency scan fail and skip
      // pre-bundling entirely.
    },
  };
});
