# react-geo  <a href="https://terrestris.github.io/react-geo/"><img align="left" src="./assets/logo.svg" width="70px" /></a>

[![Build Status](https://travis-ci.org/terrestris/react-geo.svg?branch=master)](https://travis-ci.org/terrestris/react-geo)
[![Coverage Status](https://coveralls.io/repos/github/terrestris/react-geo/badge.svg?branch=master)](https://coveralls.io/github/terrestris/react-geo?branch=master)
[![license: 2-Clause BSD](https://img.shields.io/badge/license-2--Clause%20BSD-brightgreen.svg)](https://opensource.org/licenses/BSD-2-Clause)
[![Known Vulnerabilities](https://snyk.io/test/github/terrestris/react-geo/badge.svg)](https://snyk.io/test/github/terrestris/react-geo)
[![Greenkeeper badge](https://badges.greenkeeper.io/terrestris/react-geo.svg)](https://greenkeeper.io/)
[![devDependencies Status](https://david-dm.org/terrestris/react-geo/dev-status.svg)](https://david-dm.org/terrestris/react-geo?type=dev)
[![dependencies Status](https://david-dm.org/terrestris/react-geo/status.svg)](https://david-dm.org/terrestris/react-geo)

A set of geo related components to use in combination with [react](https://github.com/facebook/react), [antd](https://github.com/ant-design/ant-design) and [ol](https://github.com/openlayers/openlayers).

## Examples and API documentation

Visit [https://terrestris.github.io/react-geo/docs/latest/index.html](https://terrestris.github.io/react-geo/docs/latest/index.html)

## Workshop

Visit [https://terrestris.github.io/react-geo-ws/](https://terrestris.github.io/react-geo-ws/)

## Installation

```javascript static
npm i @terrestris/react-geo
```

### Requirements

react-geo is designed to be used with es6-modules.
To use a component just import it like we do it in the [examples](https://terrestris.github.io/react-geo/docs/latest/index.html):

```javascript static
import {
  CircleMenu,
  SimpleButton,
  MapComponent,
  MapProvider,
  mappify
} from '@terrestris/react-geo';
```

The use of [webpack](https://www.npmjs.com/package/webpack) and [babel](https://www.npmjs.com/package/babel-core) is recommended. You need to configure a [less-loader](https://www.npmjs.com/package/less-loader) inside your webpack-config to receive `react-geo` specific styling.

```javascript static
module: {
  loaders: [{
    test: /\.less$/,
    loaders: [
      'style-loader',
      'css-loader',
      {
        loader: 'less-loader',
        options: {
          modifyVars: CustomAntThemeModifyVars(),
          javascriptEnabled: true // Less version > 3.0.0
        }
      }
    ]
  }]
}
```

## Base application

Check out the [react-geo-baseclient](https://github.com/terrestris/react-geo-baseclient) for a fully working
web-mapping application based on `react-geo`.

## Development requirements

* Node.js 8 or later
* npm 6.8.0 or later
* Git 2.11 or later

## Development notes

If you like to develop a react-geo component out of your project make use of [npm link](https://docs.npmjs.com/cli/link):

In react-geo:

```javascript static
npm link
```

In your project:

```javascript static
npm link @terrestris/react-geo
```
