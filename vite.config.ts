import { defineConfig } from 'vite';
import reactPlugin from '@vitejs/plugin-react';
import IdentityFactory from '@cronocode/identity-factory';
import dts from 'vite-plugin-dts';
import variables from './src/css.variables';

const identity = new IdentityFactory();

export default defineConfig({
  plugins: [dts(), reactPlugin()],
  css: {
    postcss: {
      plugins: [
        require('autoprefixer'),
        require('postcss-simple-vars')({ silent: true, variables }),
        require('postcss-each'),
        require('postcss-calc'),
      ],
    },
    modules: {
      generateScopedName: (name: string, filename: string, css: string) => {
        return identity.getIdentity(name);
      },
    },
  },
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'react-box',
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-jsx-runtime'],
      output: {
        globals: {
          react: 'React',
        },
      },
    },
  },
});
