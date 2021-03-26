module.exports = {
  extends: [
    '@terrestris/eslint-config-typescript',
    "plugin:testing-library/recommended",
    "plugin:jest-dom/recommended"
  ],
  plugins: [
    "testing-library",
    "jest-dom"
  ],
  rules: {
    'no-underscore-dangle': 'off'
  }
};
