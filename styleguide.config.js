const path = require('path');
const webpackCommonConf = require('./webpack.common.config.js');
const reactDogGenTypeScript = require('react-docgen-typescript');

module.exports = {
  title: 'react-geo',
  styleguideDir: './build/styleguide',
  webpackConfig: webpackCommonConf,
  usageMode: 'expand',
  template: {
    favicon: 'https://terrestris.github.io/react-geo/assets/favicon.ico'
  },
  propsParser: reactDogGenTypeScript
    .withCustomConfig('./tsconfig.json', {
      savePropValueAsString: true,
      propFilter: (prop) => {
        if (prop.parent) {
          return !prop.parent.fileName.includes('node_modules');
        }
        return true;
      }
    }).parse,
  ignore: [
    '**/__tests__/**',
    '**/*.spec.{js,jsx,ts,tsx}',
    '**/*.d.ts'
  ],
  theme: {
    sidebarWidth: 350
  },
  getExampleFilename(componentPath) {
    return componentPath.replace(/\.tsx?$/, '.example.md');
  },
  skipComponentsWithoutExample: true,
  getComponentPathLine(componentPath) {
    const name = path.basename(componentPath, '.js');
    const dir = path.dirname(componentPath).replace('src', 'dist');
    return `import ${name} from '@terrestris/react-geo/${dir}/${name}';`;
  },
  moduleAliases: {
    '@terrestris/react-geo': path.resolve(__dirname, 'src')
  },
  require: [
    '@babel/polyfill',
    'whatwg-fetch',
    'ol/ol.css'
  ],
  sections: [{
    name: 'Introduction',
    content: 'README.md'
  }, {
    name: 'Components',
    sections: [{
      name: 'Buttons',
      components: 'src/Button/**/*.tsx'
    }, {
      name: 'CircleMenu',
      components: 'src/CircleMenu/**/*.tsx'
    }, {
      name: 'Containers',
      components: 'src/Container/**/*.tsx'
    }, {
      name: 'Context',
      components: 'src/Context/**/*.tsx'
    }, {
      name: 'CoordinateInfo',
      components: 'src/CoordinateInfo/**/*.tsx'
    }, {
      name: 'Fields',
      components: 'src/Field/**/*.tsx'
    }, {
      name: 'Grids',
      components: 'src/Grid/**/*.tsx'
    }, {
      name: 'Hooks',
      components: 'src/Hook/**/*.ts'
    }, {
      name: 'HigherOrderComponents',
      components: 'src/HigherOrderComponent/**/*.tsx'
    }, {
      name: 'LayerSwitcher',
      components: 'src/LayerSwitcher/**/*.tsx'
    }, {
      name: 'LayerTree',
      components: 'src/LayerTree/**/*.tsx'
    }, {
      name: 'LayerTreeNode',
      components: 'src/LayerTreeNode/**/*.tsx'
    }, {
      name: 'Legend',
      components: 'src/Legend/**/*.tsx'
    }, {
      name: 'Map',
      components: 'src/Map/**/*.tsx'
    }, {
      name: 'Panel',
      components: 'src/Panel/**/*.tsx'
    }, {
      name: 'Slider',
      components: 'src/Slider/**/*.tsx'
    }, {
      name: 'Toolbar',
      components: 'src/Toolbar/**/*.tsx'
    }, {
      name: 'UserChip',
      components: 'src/UserChip/**/*.tsx'
    }, {
      name: 'Window',
      components: 'src/Window/**/*.tsx'
    }]
  }]
};
