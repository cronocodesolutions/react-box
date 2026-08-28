import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import-x';
import prettierPlugin from 'eslint-plugin-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'import-x': importPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-namespace': 'off',
      'no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
          allowTernary: true,
          allowTaggedTemplates: true,
        },
      ],
      'import-x/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'never',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'no-unreachable': 'warn',
      'prettier/prettier': 'error',
    },
  },
  {
    // The styling engine is the future `@box-kite/core` package: framework-free by construction.
    // React belongs in the adapter (`src/react/**`) — see CONTRIBUTING.md, "The core boundary".
    // `npm run check:boundaries` enforces the same rule outside ESLint (JSX, React globals).
    files: ['src/core.ts', 'src/core/**/*.{ts,tsx}'],
    ignores: ['**/*.test.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: 'react', message: 'src/core must stay framework-free — put React code in src/react/.' },
            { name: 'react-dom', message: 'src/core must stay framework-free — put React code in src/react/.' },
          ],
          patterns: ['react/*', 'react-dom/*'],
        },
      ],
    },
  },
  {
    // The DataGrid engine must stay headless (framework-agnostic): no React, no DOM.
    // Rendering/adapter logic belongs in the components layer.
    files: ['src/components/dataGrid/models/**/*.ts'],
    ignores: ['**/*.test.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: 'react', message: 'DataGrid models must stay headless — keep React in the components/adapter layer.' },
            { name: 'react-dom', message: 'DataGrid models must stay headless — keep React in the components/adapter layer.' },
          ],
          patterns: ['react/*', 'react-dom/*'],
        },
      ],
    },
  },
);
