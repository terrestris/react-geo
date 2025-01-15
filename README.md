# react-geo  <a href="https://terrestris.github.io/react-geo/"><img align="left" src="./assets/logo.svg" width="70px" /></a>

[![npm version](https://img.shields.io/npm/v/@terrestris/react-geo.svg?style=flat-square)](https://www.npmjs.com/package/@terrestris/react-geo)
[![GitHub license](https://img.shields.io/github/license/terrestris/react-geo?style=flat-square)](https://github.com/terrestris/react-geo/blob/main/LICENSE)
[![Coverage Status](https://img.shields.io/coveralls/github/terrestris/react-geo?style=flat-square)](https://coveralls.io/github/terrestris/react-geo?branch=main)
![GitHub action build](https://img.shields.io/github/actions/workflow/status/terrestris/react-geo/on-push-main.yml?branch=main&style=flat-square)
[![Known Vulnerabilities](https://snyk.io/test/github/terrestris/react-geo/badge.svg)](https://snyk.io/test/github/terrestris/react-geo)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/terrestris/react-geo/blob/main/CONTRIBUTING.md)

`react-geo` is a JavaScript library providing a large number of components to build modern mapping applications. It is used in combination with [React](https://github.com/facebook/react), [OpenLayers](https://github.com/openlayers/openlayers) and [Ant Design](https://github.com/ant-design/ant-design).

## Installation

```javascript static
npm i --save @terrestris/react-geo
```

## Usage

For a full list of available components, their properties and examples see [here](https://terrestris.github.io/react-geo/docs/latest/index.html).

### TypeScript

The `react-geo` package includes TypeScript declarations as `*.d.ts` files. The build itself is included in ESM format (currently ES2022).

### Ant-Design ConfigProvider

`react-geo` supports [dynamic theming](https://ant.design/docs/react/customize-theme) of the Toggle Button via the antd `ConfigProvider`.

```tsx
<ConfigProvider
  theme={{
    cssVar: true,
    Component: {
      Button: {
        primaryActive: '#0958d9'
      }
    }
  }}
>
  //...
</ConfigProvider>
```

## Workshop

For a comprehensive introduction into the usage of `react-geo` you might want to have a look at our [tutorial](https://terrestris.github.io/react-geo-ws/).

## Starter application

Also don't miss the [create-react-geo-app (CRGA)](https://github.com/terrestris/create-react-geo-app) to quickly create a fully working
web-mapping application based on `react-geo`.

## Contribution

Contributions are much appreciated! 🥳

Read the [hints for developers](https://github.com/terrestris/react-geo/blob/main/CONTRIBUTING.md) to get started. We look forward to your contributions!

## License

`react-geo` is released under the BSD 2-Clause license. Please see the file [LICENSE](https://github.com/terrestris/react-geo/blob/main/LICENSE) in the root of this repository for more details.
