// @ts-check
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import importPlugin from 'eslint-plugin-import';
import eslintReact from 'eslint-plugin-react';
import eslintMarkdown from 'eslint-plugin-markdown';
import eslintTerrestris from '@terrestris/eslint-config-typescript';
import eslintReactTerrestris from '@terrestris/eslint-config-typescript-react';
import eslint from '@eslint/js';
import tsEslint from 'typescript-eslint';
import stylisticEslint from '@stylistic/eslint-plugin'

export default tsEslint.config({
  extends: [
    eslint.configs.recommended,
    ...tsEslint.configs.recommended,
    ...tsEslint.configs.stylistic,
    importPlugin.flatConfigs.recommended
  ],
  files: [
    '**/*.{ts,tsx}',
  ],
  ignores: [
    '**/*.spec.{ts,tsx}',
    '**/coverage/**/*.{js,ts*}',
    '**/dist/**/*.spec.{js,ts*}',
    '**/dist/**/*.{js,ts*}',
    '**/e2e-tests/**.ts',
    '**/global-setup.ts',
    '**/playwright.config.ts',
    '**/test/setup.ts',
    'src/Util/antdTestQueries.ts'
  ],
  settings: {
    react: {
      version: 'detect'
    }
  },
  languageOptions: {
    ecmaVersion: 2022,
    globals: globals.browser,
    parserOptions: {
      project: true,
      tsconfigRootDir: import.meta.dirname
    }
  },
  plugins: {
    'react-hooks': reactHooks,
    '@stylistic': stylisticEslint,
    react: eslintReact,
    '@typescript-eslint/eslint-plugin': tsEslint
  },
  rules: {
    ...eslintTerrestris.rules,
    ...eslintReactTerrestris.rules,
    ...reactHooks.configs.recommended.rules,
    ...eslintMarkdown.configs.recommended.rules,
    'no-debugger': 'error',
    'react/jsx-closing-tag-location': ['warn'],
    'react/jsx-closing-bracket-location': ['warn'],
    'react-hooks/rules-of-hooks': ['warn'],
    'react-hooks/exhaustive-deps': ['warn'],
    '@typescript-eslint/no-empty-object-type': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    'import/no-named-as-default': 'off',
    'import/no-unresolved': 'off',
    'import/named': 'off',
    'import/order': ['warn', {
      groups: [
        'builtin',
        'external',
        'parent',
        'sibling',
        'index',
        'object'
      ],
      pathGroups: [{
        pattern: 'react',
        group: 'external',
        position: 'before'
      }, {
        pattern: '@terrestris/**',
        group: 'external',
        position: 'after'
      }],
      pathGroupsExcludedImportTypes: ['react'],
      'newlines-between': 'always-and-inside-groups',
      alphabetize: {
        order: 'asc',
        caseInsensitive: true
      }
    }]
  }
});
