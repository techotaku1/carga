import { defineConfig } from 'oxlint';
import core from 'ultracite/oxlint/core';
// github, sonarjs and react-doctor moved to this opt-in preset in ultracite 7.9.
import jsPlugins from 'ultracite/oxlint/js-plugins';
import next from 'ultracite/oxlint/next';
import react from 'ultracite/oxlint/react';

export default defineConfig({
  extends: [core, react, next, jsPlugins],
  ignorePatterns: ['.agents/**', '.claude/**', '.continue/**'],
  rules: {
    'no-warning-comments': 'off', // Allow TODO and FIXME comments
    'no-inline-comments': 'off', // Allow nearby comments

    'sort-keys': 'off',
    'func-style': 'off',

    'typescript/no-unsafe-assignment': 'off', // Allow implicit `any` assignments
    'typescript/no-unsafe-member-access': 'off', // Allow member access on implicit `any` values
    'typescript/strict-boolean-expressions': 'off', // Allow non-boolean conditional checks
    'typescript/consistent-type-definitions': ['error', 'type'], // Use `type` instead of `interface`
    'typescript/no-misused-promises': 'off', // React Hook Form's handleSubmit returns a Promise-typed handler
    'typescript/strict-void-return': 'off', // Allow functions returning Promise<void> where void functions are expected
    'typescript/prefer-regexp-exec': 'off', // Allow use of String#match

    'unicorn/filename-case': 'off', // Impossible to enforce consistent filename case due to multiple conventions

    'eslint/prefer-named-capture-group': 'off',

    'github/a11y-aria-label-is-well-formatted': 'off',
    'github/filenames-match-regex': 'off',
    'github/js-class-name': 'off',
    'github/no-then': 'off',

    'sonarjs/fixme-tag': 'off',
    'sonarjs/function-name': 'off',
    'sonarjs/no-duplicate-string': 'off',
    'sonarjs/no-os-command-from-path': 'off',
    'sonarjs/no-wildcard-import': 'off',
    'sonarjs/todo-tag': 'off',

    'react/jsx-handler-names': 'off',

    // Pages and layouts use `export default async function`, matching the Next.js docs; components elsewhere are arrows.
    'react/function-component-definition': 'off',

    // Hydration-safe pattern: browser-only localStorage values (driver list, other-cost label) are read after mount.
    'react/set-state-in-effect': 'off',

    // react-hook-form `watch` and TanStack Table return unmemoizable functions; React Compiler skips those components safely.
    'react/incompatible-library': 'off',

    'react-doctor/js-combine-iterations': 'off',
    'react-doctor/js-hoist-intl': 'off',
    'react-doctor/nextjs-missing-metadata': 'off',
    'react-doctor/no-initialize-state': 'off',
    'react-doctor/rendering-hydration-mismatch-time': 'off',
    'react-doctor/rendering-hydration-no-flicker': 'off',
    'react-doctor/rerender-defer-reads-hook': 'off',

    'typescript/no-deprecated': 'off',

    // --- JSDoc Rules ---
    'jsdoc/require-param': 'error',
    'jsdoc/require-param-description': 'error',
    'jsdoc/require-returns': 'error',
    'jsdoc/require-returns-description': 'error',
  },
  overrides: [
    {
      // Route modules must export metadata, `generateMetadata` and route config next to the default component.
      files: ['src/app/**/*.{ts,tsx}'],
      rules: { 'react-doctor/only-export-components': 'off' },
    },
    {
      // `'use cache'` functions must be async even when nothing is awaited.
      files: ['src/app/sitemap.ts'],
      rules: { 'eslint/require-await': 'off' },
    },
  ],
  options: {
    reportUnusedDisableDirectives: 'error',
  },
});
