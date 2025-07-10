import fs from 'fs';
import path from 'path';
import dts from 'vite-plugin-dts';
import { defineConfig } from 'vitest/config';

const files = fs
  .readdirSync(path.resolve(__dirname, './src/components'))
  .filter((fileName) => fileName.includes('.test') === false)
  .filter((fileName) => !fileName.startsWith('.'));

const componentsEntry = files.reduce((acc, fileName) => {
  acc[`components/${path.parse(fileName).name}`] = path.resolve(__dirname, 'src/components', fileName);

  return acc;
}, {});

const entry = {
  box: path.resolve(__dirname, './src/box.ts'),
  ssg: path.resolve(__dirname, './src/ssg.ts'),
  ...componentsEntry,
};

const extensions = {
  es: 'mjs',
  cjs: 'cjs',
};

let currentFormat;

export default defineConfig(({ mode }) => {
  return {
    plugins: [dts({ entryRoot: './src', exclude: ['./pages/**', './src/**/*.test.*', './dev/**'] })],
    build: {
      minify: mode !== 'dev',
      lib: {
        entry,
        fileName: (format, entryName) => {
          currentFormat = format;
          return `${entryName}.${extensions[format]}`;
        },
        formats: ['es', 'cjs'],
      },
      rollupOptions: {
        external: ['react', 'react-dom', 'react/jsx-runtime', 'react-dom/server'],
        output: {
          inlineDynamicImports: false,
          exports: 'named',
          manualChunks(id: string) {
            if (id.includes('/components/')) {
              const re = new RegExp('(.*)src/components/(.*)');
              const result = re.exec(id)[2];

              if (result.includes('/')) {
                return `components/${result.split('/')[0]}`;
              }

              return `components/${result.split('.')[0]}`;
            }

            if (id.endsWith('src/box.ts')) {
              return 'box';
            }

            if (id.endsWith('src/ssg.ts')) {
              return 'ssg';
            }

            return 'core';
          },
          chunkFileNames: (_info) => `[name].${extensions[currentFormat]}`,
        },
      },
    },
    test: {
      environment: 'happy-dom',
      globals: true,
    },
  };
});
