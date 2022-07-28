import { defineConfig } from 'vite';
import reactPlugin from '@vitejs/plugin-react';
import IdentityFactory from '@cronocode/identity-factory';
import dts from 'vite-plugin-dts';
import variables from './src/css.variables';
import path from 'path';

const identity = new IdentityFactory();

export default defineConfig({
  plugins: [
    dts({
      beforeWriteFile(filePath, content) {
        const { dir } = path.parse(filePath);

        return { filePath: dir.includes('components') ? `${dir}/index.d.ts` : filePath, content };
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
      entry: './src/box.tsx',
      name: 'react-box',
      fileName: (format) => `index.${format}.js`,
      formats: ['es'],
    },
    rollupOptions: {
      input: {
        box: path.resolve(__dirname, 'src/box.tsx'),
        button: path.resolve(__dirname, 'src/components/button/button.tsx'),
        flex: path.resolve(__dirname, 'src/components/flex/flex.tsx'),
      },
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
        exports: 'named',
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'box') {
            return '[name].js';
          }

          return 'components/[name].js';
        },
        chunkFileNames: 'chunk/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (/\.css$/.test(assetInfo.name)) {
            return 'styles.css';
          }

          return 'components/asset-[name]-[hash].[ext]';
        },
      },
    },
  },
});
