import { defineConfig } from 'vite';
import reactPlugin from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  return {
    plugins: [reactPlugin()],
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
    build: {
      emptyOutDir: true,
      minify: mode !== 'dev',
      rollupOptions: {
        input: 'pages/index.html',
      },
    },
  };
});
