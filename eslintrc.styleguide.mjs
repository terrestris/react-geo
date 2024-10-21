// @ts-check
import markdown from 'eslint-plugin-markdown';
import reactGeo from './eslint.config.mjs';
import tsEslint from 'typescript-eslint';

export default tsEslint.config({
  extends: [
    ...reactGeo,
    ...markdown.configs.recommended
  ],
  plugins: {
    'markdown': markdown
  },
  files: [
    'src/**/*.{md,mkdn,mdown,markdown}'
  ],
  processor: 'markdown/markdown',
  rules: {
    '@typescript-eslint/semi': 'off'
  }
});
