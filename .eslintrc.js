module.exports = {
  extends: [
    '@terrestris/eslint-config-typescript',
    '@terrestris/eslint-config-typescript-react',
    'plugin:testing-library/react',
    'plugin:jest-dom/recommended'
  ],
  plugins: [
    'testing-library',
    'jest-dom',
    'simple-import-sort'
  ],
  rules: {
    '@typescript-eslint/member-ordering': 'off',
    'no-underscore-dangle': 'off',
    'simple-import-sort/exports': 'warn',
    'simple-import-sort/imports': 'warn'
  }
};
