module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-react'
  ],
  env: {
    test: {
      plugins: [
        '@babel/plugin-transform-modules-commonjs'
      ]
    },
    build: {
      plugins: [
        [
          'module-resolver',
          {
            resolvePath(sourcePath) {
              return sourcePath.replace('.jsx', '.js');
            }
          }
        ]
      ]
    }
  },
  plugins: [
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-proposal-class-properties',
    [
      'import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true
      },
      'import-antd'
    ],
    [
      'import',
      {
        libraryName: '@turf/turf',
        libraryDirectory: '../'
      },
      'import-turf'
    ]
  ]
};
