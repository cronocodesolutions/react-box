import reactPlugin from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

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
