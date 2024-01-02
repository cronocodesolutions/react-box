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
    plugins: [reactPlugin(), moduleCssPlugin(jsonCache)],
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
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
      emptyOutDir: true,
      minify: mode !== 'dev',
      lib: {
        entry: path.resolve(__dirname, './src/index.ts'),
        fileName: (format) => 'index.js',
        formats: ['es'],
      },
      rollupOptions: {
        input: 'pages/index.html',
      },
    },
  };
});
