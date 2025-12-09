import js from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import nodePlugin from 'eslint-plugin-node';
import prettierPlugin from 'eslint-plugin-prettier';
import globals from 'globals';

export default [
  // Базовые правила JavaScript
  js.configs.recommended,

  // Основные TypeScript файлы
  {
    files: ['src/**/*.ts'],
    ignores: ['**/*.case.ts', '**/*.test.ts', '**/*.spec.ts'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        project: './tsconfig.json',
      },
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.es2022,
      },
    },
    plugins: {
      '@typescript-eslint': ts,
      prettier: prettierPlugin,
      import: importPlugin,
      node: nodePlugin,
    },
    rules: {
      // Базовые правила TypeScript
      ...ts.configs.recommended.rules,

      // Prettier
      'prettier/prettier': 'error',

      // Сортировка импортов через ESLint
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],

      // Node.js специфичные правила
      'node/no-missing-import': 'off',

      // Строгие типы
      '@typescript-eslint/prefer-function-type': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',

      // Качество кода
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { 
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          ignoreRestSiblings: true,
          args: 'all',
        }
      ],
    },
  },

  // Тестовые файлы - добавляем глобальные переменные Jest
  {
    files: ['**/*.case.ts', '**/*.test.ts', '**/*.spec.ts'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.jest,
        ...globals.node,
        ...globals.browser,
        ...globals.es2022,
      },
    },
    plugins: {
      '@typescript-eslint': ts,
      prettier: prettierPlugin,
      import: importPlugin,
      node: nodePlugin,
    },
    rules: {
      // Базовые правила TypeScript
      ...ts.configs.recommended.rules,

      // Prettier
      'prettier/prettier': 'error',

      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
  },

  // Игнорируемые файлы
  {
    ignores: [
      'dist/**',
      'node_modules/**',
    ],
  },
];
