// eslint.config.js
import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import { FlatCompat } from '@eslint/eslintrc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  // Global ignores
  {
    ignores: ['dist', 'node_modules', '.vite', 'coverage'],
  },
  // Base recommended configs
  js.configs.recommended,
  // TypeScript ESLint configs (these are already in flat config format)
  // Only apply non-type-checked rules globally
  ...tseslint.configs.recommended,
  // React Hooks config (flat config format)
  ...(reactHooks.configs.flat.recommended ? [reactHooks.configs.flat.recommended] : []),
  // Convert old-style configs to flat config format
  ...compat.extends('plugin:react/recommended', 'plugin:jsx-a11y/recommended'),
  // Global settings for React
  {
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  // Type-checked configs - only apply to source files
  ...tseslint.configs.recommendedTypeChecked.map((config) => ({
    ...config,
    files: ['src/**/*.{ts,tsx}'],
  })),
  ...tseslint.configs.strictTypeChecked.map((config) => ({
    ...config,
    files: ['src/**/*.{ts,tsx}'],
  })),
  ...tseslint.configs.stylisticTypeChecked.map((config) => ({
    ...config,
    files: ['src/**/*.{ts,tsx}'],
  })),
  // Main config for TypeScript/TSX files
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      globals: globals.browser,
    },
    plugins: {
      react,
      '@typescript-eslint': tsPlugin,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      import: importPlugin,
      'react-dom': reactDom,
      'react-x': reactX,
    },
    rules: {
      // ===== React Rules =====
      'react/jsx-uses-react': 'off', // Not needed with React 17+
      'react/react-in-jsx-scope': 'off', // Not needed with React 17+
      'react/prop-types': 'off', // TypeScript handles prop validation
      'react/display-name': 'off', // Not needed with TypeScript
      'react/jsx-key': 'error', // Prevent missing keys in lists
      'react/jsx-no-duplicate-props': 'error', // Prevent duplicate props
      'react/jsx-no-undef': 'error', // Prevent undefined variables in JSX
      'react/jsx-uses-vars': 'error', // Prevent unused variables in JSX
      'react/no-array-index-key': 'warn', // Warn about array index as key
      'react/no-danger': 'warn', // Warn about dangerouslySetInnerHTML
      'react/no-deprecated': 'warn', // Warn about deprecated React APIs
      'react/no-direct-mutation-state': 'error', // Prevent direct state mutation
      'react/no-unescaped-entities': 'error', // Prevent unescaped entities
      'react/no-unknown-property': 'error', // Prevent unknown DOM properties
      'react/self-closing-comp': 'error', // Enforce self-closing components
      'react/jsx-boolean-value': ['error', 'never'], // Enforce no boolean props without value
      'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }], // No unnecessary braces
      'react/jsx-fragments': ['error', 'syntax'], // Prefer <> over <React.Fragment>
      'react/jsx-no-useless-fragment': 'error', // No useless fragments
      'react/jsx-pascal-case': 'error', // Enforce PascalCase for components

      // ===== React Hooks Rules =====
      'react-hooks/rules-of-hooks': 'error', // Enforce Rules of Hooks
      'react-hooks/exhaustive-deps': 'warn', // Warn about missing dependencies

      // ===== TypeScript Rules =====
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-non-null-assertion': 'warn', // Warn about non-null assertions
      '@typescript-eslint/explicit-function-return-type': 'off', // Allow implicit return types
      '@typescript-eslint/explicit-module-boundary-types': 'off', // Allow implicit module boundaries
      '@typescript-eslint/no-explicit-any': 'warn', // Warn about any types
      '@typescript-eslint/no-unnecessary-type-assertion': 'warn', // Warn about unnecessary type assertions
      '@typescript-eslint/prefer-as-const': 'error', // Prefer 'as const' over type assertions
      '@typescript-eslint/no-array-constructor': 'error', // Prefer array literals
      '@typescript-eslint/no-duplicate-enum-values': 'error', // Prevent duplicate enum values
      '@typescript-eslint/no-extra-non-null-assertion': 'error', // Prevent extra non-null assertions
      '@typescript-eslint/no-misused-new': 'error', // Prevent misused new operator
      '@typescript-eslint/no-namespace': 'error', // Prevent namespaces
      '@typescript-eslint/no-this-alias': 'error', // Prevent this aliasing
      '@typescript-eslint/no-unused-expressions': 'error', // Prevent unused expressions
      '@typescript-eslint/prefer-namespace-keyword': 'error', // Prefer namespace keyword
      '@typescript-eslint/triple-slash-reference': 'error', // Prevent triple-slash references

      // ===== Import/Export Rules =====
      'import/no-unresolved': 'off', // TypeScript handles this
      'import/order': [
        'error',
        {
          groups: [
            'builtin', // Built-in types (e.g., path, fs)
            'external', // External packages (e.g., react, lodash)
            'internal', // Internal modules (if using path mapping)
            'parent', // Parent imports (../)
            'sibling', // Sibling imports (./)
            'index', // Index imports (./index)
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'import/no-duplicates': 'error', // Prevent duplicate imports
      'import/no-unused-modules': 'off', // Too slow for large projects
      'import/prefer-default-export': 'off', // Allow named exports

      // ===== JSX A11y Rules =====
      'jsx-a11y/anchor-is-valid': 'warn', // Warn about invalid anchors
      'jsx-a11y/alt-text': 'error', // Require alt text for images
      'jsx-a11y/aria-props': 'error', // Validate ARIA props
      'jsx-a11y/aria-proptypes': 'error', // Validate ARIA prop types
      'jsx-a11y/aria-unsupported-elements': 'error', // Prevent unsupported ARIA elements
      'jsx-a11y/role-has-required-aria-props': 'error', // Require ARIA props for roles
      'jsx-a11y/role-supports-aria-props': 'error', // Validate role ARIA props

      // ===== React X Rules =====
      'react-x/no-class-component': 'warn', // Prefer function components
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  // Config for config files (eslint.config.js, vite.config.ts, etc.)
  {
    files: ['*.config.{js,ts,mts}', '*.config.*.{js,ts,mts}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      import: importPlugin,
    },
    rules: {
      // Disable import resolution errors for config files
      'import/no-unresolved': 'off',
      // Allow non-null assertions in config files
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.mts'],
        },
      },
    },
  },
  // Prettier config (must be last to override other configs)
  eslintConfigPrettier,
];
