module.exports = {
  extends: [
    '@terrestris/eslint-config-typescript',
    'plugin:testing-library/react',
    'plugin:jest-dom/recommended'
  ],
  plugins: [
    'testing-library',
    'jest-dom'
  ],
  rules: {
    'no-underscore-dangle': 'off',
    '@typescript-eslint/member-ordering': 'off'
  }
};
