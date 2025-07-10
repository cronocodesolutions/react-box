import reactPlugin from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
  return {
    plugins: [reactPlugin()],
    build: {
      emptyOutDir: true,
      minify: mode !== 'dev',
      rollupOptions: {
        input: 'pages/index.html',
      },
    },
  };
});
