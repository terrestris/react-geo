module.exports = {
  extends: [
    '@terrestris/eslint-config-typescript'
  ],
  plugins: [
    'markdown'
  ],
  overrides: [{
    files: [
      '**/*.{md,mkdn,mdown,markdown}'
    ],
    processor: 'markdown/markdown'
  }, {
    files: [
      '**/*.{md,mkdn,mdown,markdown}/*.{js,javascript,jsx,node}'
    ]
  }],
  env: {
    browser: true
  },
  rules: {
    '@typescript-eslint/semi': 'off'
  }
};
