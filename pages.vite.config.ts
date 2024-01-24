import { defineConfig } from 'vite';
import reactPlugin from '@vitejs/plugin-react';
import fs from 'fs';

// @ts-ignore
import { themeProps } from './pages/theme';
import Theme from './src/core/theme';

const result = Theme.setupAugmentedProps(themeProps, { namespacePath: '../src/core/types' });

fs.writeFileSync('./pages/box-theme.generated.css', result.variables);
fs.writeFileSync('./pages/box.generated.d.ts', result.boxDts);

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
