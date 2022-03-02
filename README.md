# react-geo  <a href="https://terrestris.github.io/react-geo/"><img align="left" src="./assets/logo.svg" width="70px" /></a>

[![npm version](https://img.shields.io/npm/v/@terrestris/react-geo.svg?style=flat-square)](https://www.npmjs.com/package/@terrestris/react-geo)
[![GitHub license](https://img.shields.io/github/license/terrestris/react-geo?style=flat-square)](https://github.com/terrestris/react-geo/blob/main/LICENSE)
[![Coverage Status](https://img.shields.io/coveralls/github/terrestris/react-geo?style=flat-square)](https://coveralls.io/github/terrestris/react-geo?branch=main)
![GitHub action build](https://img.shields.io/github/workflow/status/terrestris/react-geo/Test%20successful%20build%20of%20react-geo?style=flat-square)
[![Known Vulnerabilities](https://img.shields.io/snyk/vulnerabilities/github/terrestris/react-geo?style=flat-square)](https://snyk.io/test/github/terrestris/react-geo)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/terrestris/react-geo/blob/main/CONTRIBUTING.md)

`react-geo` is a JavaScript library providing a large number of components to build modern mapping applications. It is used in combination with [React](https://github.com/facebook/react), [OpenLayers](https://github.com/openlayers/openlayers) and [Ant Design](https://github.com/ant-design/ant-design).

## Installation

```javascript static
npm i --save @terrestris/react-geo
```

## Usage

For a full list of available components, their properties and examples see [here](https://terrestris.github.io/react-geo/docs/latest/index.html).

### TypeScript

The `react-geo` package includes TypeScript declarations as `*.d.ts` files.

### Webpack

If you're using [webpack](https://www.npmjs.com/package/webpack) as bundler you need to configure a [less-loader](https://www.npmjs.com/package/less-loader) inside your webpack-config to enable `react-geo` specific styling (see [here](https://ant.design/docs/react/customize-theme) for further details):

```javascript static
module: {
  rules: [{
    test: /\.less|\.css$/,
    loaders: [{
      loader: 'style-loader'
    }, {
      loader: 'css-loader',
    }, {
      loader: 'less-loader',
      options: {
        lessOptions: {
          modifyVars: {
            // Your less variable overrides…
          },
          javascriptEnabled: true
        }
      }
    }]
  }]
}
```

## Workshop

For a comprehensive introduction into the usage of `react-geo` you might want to have a look at our [tutorial](https://terrestris.github.io/react-geo-ws/).

## Base application

Also don't miss the [react-geo-baseclient](https://github.com/terrestris/react-geo-baseclient) as an example for a fully working
web-mapping application based on `react-geo`.

## Contribution

Contributions are much appreciated! 🥳

Read the [hints for developers](https://github.com/terrestris/react-geo/blob/main/CONTRIBUTING.md) to get started. We look forward to your contributions!

## License

`react-geo` is released under the BSD 2-Clause license. Please see the file [LICENSE](https://github.com/terrestris/react-geo/blob/main/LICENSE) in the root of this repository for more details.
