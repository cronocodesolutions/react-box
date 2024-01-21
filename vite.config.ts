import { defineConfig, PluginOption } from 'vite';
import reactPlugin from '@vitejs/plugin-react';
import IdentityFactory from '@cronocode/identity-factory';
import dts from 'vite-plugin-dts';
import path from 'path';

// @ts-ignore
import boxStylesMixins from './buildHelpers/mixins/boxStyles';
// @ts-ignore
import svgStylesMixins from './buildHelpers/mixins/svgStyles';
// @ts-ignore
import moduleCssPlugin from './buildHelpers/plugins/moduleCssPlugin';

const identity = new IdentityFactory();
const jsonCache: Record<string, Record<string, string>> = {};

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      dts({
        entryRoot: './src',
      }),
      reactPlugin(),
      moduleCssPlugin(jsonCache, mode),
    ],
    css: {
      devSourcemap: mode === 'dev',
      postcss: {
        plugins: [
          require('postcss-mixins')({ mixins: { ...boxStylesMixins, ...svgStylesMixins } }),
          require('postcss-nested'),
          require('postcss-simple-vars')({ silent: true }),
          require('autoprefixer'),
          require('postcss-each'),
        ],
      },
      modules: {
        generateScopedName: (name: string, filename: string, css: string) => {
          if (name === 'hovertrue') return '_h';
          if (name === 'focustrue') return '_f';

          return mode === 'dev' ? name : identity.getIdentity(name);
        },
        getJSON: (cssFileName, json, outputFileName) => {
          jsonCache[cssFileName] = json;
        },
      },
    },
    build: {
      minify: mode !== 'dev',
      lib: {
        entry: path.resolve(__dirname, './src/index.ts'),
        fileName: () => 'index.js',
        formats: ['es'],
      },
      rollupOptions: {
        external: ['react', 'react-dom', 'react/jsx-runtime'],
        output: {
          inlineDynamicImports: false,
          manualChunks(id: string) {
            if (id.endsWith('src/index.ts')) {
              return 'index';
            }

            if (id.includes('/box.tsx')) {
              return 'box';
            }

            if (id.includes('/box.module.css')) {
              return 'box.module.css';
            }

            if (id.includes('/baseSvg.module.css')) {
              return 'baseSvg.module.css';
            }

            if (id.includes('/theme.ts')) {
              return 'theme';
            }

            if (id.includes('/src/components/')) {
              const re = new RegExp('(.*)src/components/(.*)');
              const result = re.exec(id)[2];

              if (result.includes('/')) {
                return `components/${result.split('/')[0]}`;
              }

              return `components/${result.split('.')[0]}`;
            }

            return 'utils';
          },
          chunkFileNames(chunkInfo) {
            return `[name].js`;
          },
        },
      },
    },
  };
});
