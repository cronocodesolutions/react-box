import { defineConfig } from 'vite';
import reactPlugin from '@vitejs/plugin-react';
import IdentityFactory from '@cronocode/identity-factory';
import dts from 'vite-plugin-dts';
import path from 'path';

// @ts-ignore
import variables from './src/css.variables';

const identity = new IdentityFactory();

export default defineConfig({
  plugins: [
    dts({
      beforeWriteFile(filePath, content) {
        const { dir } = path.parse(filePath);

        return { filePath: dir.includes('components') ? `${dir}.d.ts` : filePath, content: content.replace(/..\/..\//g, '../') };
      },
    }),
    reactPlugin(),
  ],
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
      entry: path.resolve(__dirname, './src/index.ts'),
      fileName: (format) => 'index.js',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', 'react/jsx-runtime'],
      output: {
        inlineDynamicImports: false,
        manualChunks(id: string) {
          if (id.endsWith('src/index.ts')) {
            return 'index';
          }

          if (id.includes('box.tsx') || id.includes('box.module.css')) {
            return 'box';
          }

          if (id.includes('/src/components/')) {
            const re = new RegExp('(.*)src/components/(.*)');
            const result = re.exec(id)[2].split('/')[0];

            return result;
          }

          return 'utils';
        },

        chunkFileNames(chunkInfo) {
          if (chunkInfo.name === 'index') {
            return '[name].js';
          }

          if (chunkInfo.name === 'box') {
            return '[name].js';
          }

          if (chunkInfo.name === 'utils') {
            return 'utils/[name].js';
          }

          return 'components/[name].js';
        },
      },
    },
  },
});
