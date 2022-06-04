import { defineConfig } from 'vite';
import reactPlugin from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [reactPlugin()],
  build: {
    lib: {
      entry: './src/box.tsx',
      name: 'react-box',
      fileName: (format) => `react-box.${format}.js`,
    },
    rollupOptions: {
      external: ['react'],
      output: {
        globals: {
          react: 'React',
        },
      },
    },
  },
});
