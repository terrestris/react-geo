const path = require('path');
const fs = require('fs');
const webpackCommonConf = require('./webpack.common.config.js');

module.exports = {
  title: 'react-geo',
  styleguideDir: './build/styleguide',
  template: {
    favicon: 'https://terrestris.github.io/react-geo/assets/favicon.ico'
  },
  ignore: [
    '**/__tests__/**',
    '**/*.test.{js,jsx,ts,tsx}',
    '**/*.spec.{js,jsx,ts,tsx}',
    '**/*.d.ts',
    '**/src/**/*.example.jsx'
  ],
  usageMode: 'expand',
  getExampleFilename(componentPath) {
    return componentPath.replace(/\.jsx?$/, '.example.md')
  },
  getComponentPathLine(componentPath) {
    const name = path.basename(componentPath, '.jsx')
    return `import { ${name} } from '@terrestris/react-geo';`
  },
  require: [
    'babel-polyfill',
    'whatwg-fetch',
    'ol/ol.css'
  ],
  webpackConfig: webpackCommonConf,
  sections: [{
    name: 'Introduction',
    content: 'README.md'
  }, {
    name: 'Components',
    sections: [{
      name: 'Buttons',
      components: 'src/Button/**/*.jsx'
    }, {
      name: 'CircleMenu',
      components: 'src/CircleMenu/**/*.jsx'
    }, {
      name: 'Containers',
      components: 'src/Container/**/*.jsx'
    }, {
      name: 'Fields',
      components: 'src/Field/**/*.jsx'
    }, {
      name: 'Grids',
      components: 'src/Grid/**/*.jsx'
    }, {
      name: 'HigherOrderComponents',
      components: 'src/HigherOrderComponent/**/*.jsx'
    }, {
      name: 'LayerTree',
      components: 'src/LayerTree/**/*.jsx'
    }, {
      name: 'LayerTreeNode',
      components: 'src/LayerTreeNode/**/*.jsx'
    }, {
      name: 'Legend',
      components: 'src/Legend/**/*.jsx'
    }, {
      name: 'Map',
      components: 'src/Map/**/*.jsx'
    }, {
      name: 'Panel',
      components: 'src/Panel/**/*.jsx'
    }, {
      name: 'Slider',
      components: 'src/Slider/**/*.jsx'
    }, {
      name: 'Toolbar',
      components: 'src/Toolbar/**/*.jsx'
    }, {
      name: 'UserChip',
      components: 'src/UserChip/**/*.jsx'
    }, {
      name: 'Window',
      components: 'src/Window/**/*.jsx'
    }]
  }]
};
