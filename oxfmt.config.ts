import { defineConfig } from 'oxfmt';
import ultracite from 'ultracite/oxfmt';

export default defineConfig({
  extends: [ultracite],
  singleQuote: true,
  ignorePatterns: ['migrations/*', '*.md', '.agents/skills/**', '.continue/**'],
  sortImports: {
    ignoreCase: true,
    newlinesBetween: false,
    order: 'asc',
  },
  sortTailwindcss: {
    stylesheet: 'src/styles/global.css',
  },
});
