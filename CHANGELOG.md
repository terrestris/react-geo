# [16.3.0](https://github.com/terrestris/react-geo/compare/v16.2.6...v16.3.0) (2022-04-05)


### Bug Fixes

* fix determination of currently visible layer ([a056715](https://github.com/terrestris/react-geo/commit/a05671554859b3e701a68b3915f3ea03f7fc8a20))


### Features

* warn if all passed layer are not visible ([d969fd7](https://github.com/terrestris/react-geo/commit/d969fd7e488e45cb2d615bcd83590915243fa598))

## [16.2.6](https://github.com/terrestris/react-geo/compare/v16.2.5...v16.2.6) (2022-04-01)


### Bug Fixes

* **DigitizeButton:** prefer modify over translate ([63040f8](https://github.com/terrestris/react-geo/commit/63040f8337c291c3f1f3276dbf14cd8395e3fd45))

## [16.2.5](https://github.com/terrestris/react-geo/compare/v16.2.4...v16.2.5) (2022-03-21)


### Bug Fixes

* desctructure geodesic prop in measure button ([2470d6f](https://github.com/terrestris/react-geo/commit/2470d6fff5e5c1d4222e5ab26333fda2a86c2bed))
* listen to correct interaction event on translate end ([951540d](https://github.com/terrestris/react-geo/commit/951540d6f338e579415c722d705eafff7e087a70))
* mark props of ToggleButton as partial in draw buttons ([158c658](https://github.com/terrestris/react-geo/commit/158c6587ee4ccfba117044dc517114b5f75be576))

## [16.2.4](https://github.com/terrestris/react-geo/compare/v16.2.3...v16.2.4) (2022-03-18)


### Bug Fixes

* enable `noImplicitAny` ([d18624e](https://github.com/terrestris/react-geo/commit/d18624eb1ac9a2653c7ce6fe2f2c3d7142c8d60e))
* remove unneeded type guard ([08d7479](https://github.com/terrestris/react-geo/commit/08d7479028c5567558b91dcc0cf1b1534fb837b4))
* types from dependency updates ([8c79103](https://github.com/terrestris/react-geo/commit/8c79103bf6eb1d105a8137e0730ca485a97ba9f4))

## [16.2.3](https://github.com/terrestris/react-geo/compare/v16.2.2...v16.2.3) (2022-03-14)


### Bug Fixes

* Add missing default exports ([644a44d](https://github.com/terrestris/react-geo/commit/644a44d52483bf5dee01d7180473316b1929bae2))
* Add missing exports and order entries ([4a28417](https://github.com/terrestris/react-geo/commit/4a28417724964962f9245cf5cfb5870440387950))

## [16.2.2](https://github.com/terrestris/react-geo/compare/v16.2.1...v16.2.2) (2022-03-01)


### Bug Fixes

* Fix strict null checks ([3c731b6](https://github.com/terrestris/react-geo/commit/3c731b6121a0f3fcf1d70bb1e5d857b5830c91bb))

## [16.2.1](https://github.com/terrestris/react-geo/compare/v16.2.0...v16.2.1) (2022-02-28)


### Bug Fixes

* Resolve some GitHub check annotations ([ff48d6b](https://github.com/terrestris/react-geo/commit/ff48d6b6984696012f97182ba8c4067dbc77b7ac))

# [16.2.0](https://github.com/terrestris/react-geo/compare/v16.1.0...v16.2.0) (2022-02-04)


### Bug Fixes

* remove unnecessary import ([ccf6712](https://github.com/terrestris/react-geo/commit/ccf6712bc8f753e2903df988ffb2119c707069fb))
* **digitization:** add new example json and change default color ([1cb354f](https://github.com/terrestris/react-geo/commit/1cb354fb7a7bc6002f816982788ff2b72e864315))
* **modifybutton:** add rudimentary tests ([20362b2](https://github.com/terrestris/react-geo/commit/20362b2b0bbee2b4e180af34877d5941de875080))
* **selectfeaturesbutton:** change order of operations if clearAfterSelect ([c875baa](https://github.com/terrestris/react-geo/commit/c875baa4452d94e83ac516b2edfbba1aaf6256bc))


### Features

* **modifybutton:** add modify button ([706f54b](https://github.com/terrestris/react-geo/commit/706f54bae6c957b76bf5792ea2ce9f6d7471bb7e))
* add some listeners ([0bac307](https://github.com/terrestris/react-geo/commit/0bac307f641e7478f3307145e77993bc0843765b))
* make feature text modal an own component ([9ce529d](https://github.com/terrestris/react-geo/commit/9ce529dbae283f7c8543a2ddfbb87805a14d0269))

# [16.1.0](https://github.com/terrestris/react-geo/compare/v16.0.1...v16.1.0) (2022-01-28)


### Bug Fixes

* **CopyButton:** cleanup example ([5f755d3](https://github.com/terrestris/react-geo/commit/5f755d361f3d3486bf4b5b69cb76904d36bda454))


### Features

* add DeleteButton ([722c79c](https://github.com/terrestris/react-geo/commit/722c79c5a66592218fc37e88b65b7ff80f3783b9))
* **CopyButton:** Add a CopyButton component ([7688564](https://github.com/terrestris/react-geo/commit/76885649fc75af9d4a94dae2ce0e90a7d4d6c01b))
* **SelectFeaturesButton:** persist features collection and prop `clearAfterSelect` ([d4a5c5c](https://github.com/terrestris/react-geo/commit/d4a5c5cf385dc7cf5bdd658aa69cf31038c6903e))

## [16.0.1](https://github.com/terrestris/react-geo/compare/v16.0.0...v16.0.1) (2022-01-19)


### Bug Fixes

* prevents double labels on measure polygon features ([0335840](https://github.com/terrestris/react-geo/commit/033584023ddf3c49af8a12186314b5a3b270b137))

# [16.0.0](https://github.com/terrestris/react-geo/compare/v15.4.0...v16.0.0) (2021-12-17)


### Features

* Update React to version 17 and update all dependencies and components to become compatible with it as well ([5b9075e](https://github.com/terrestris/react-geo/commit/5b9075e1047da57f49bfc86cda8829fd5dc0459a))


### BREAKING CHANGES

* This updates the peerDependency of React to version 17

# [15.4.0](https://github.com/terrestris/react-geo/compare/v15.3.0...v15.4.0) (2021-12-15)


### Features

* add geodesic option for measure tool, add comment on new option ([35cccb9](https://github.com/terrestris/react-geo/commit/35cccb921ec59fd5b1d3040c342fcd498f1c9849))
* add geodesic option for measure tool, Fix ES Lint ([96224e6](https://github.com/terrestris/react-geo/commit/96224e6a83a2166954832c0fcc7825ca73f212fb))

# [15.3.0](https://github.com/terrestris/react-geo/compare/v15.2.2...v15.3.0) (2021-11-26)


### Features

* Add a CopyButton component ([a982a83](https://github.com/terrestris/react-geo/commit/a982a83fa43c46da9ce887dae16f34824e10f138))
* **SelectFeaturesButton:** persist features collection and prop `clearAfterSelect` ([a1226ac](https://github.com/terrestris/react-geo/commit/a1226ac0d2501a3006a623308b210232dcab119d))

## [15.2.2](https://github.com/terrestris/react-geo/compare/v15.2.1...v15.2.2) (2021-10-04)


### Bug Fixes

* fix antd select dropdown clicks ([3e3d86e](https://github.com/terrestris/react-geo/commit/3e3d86ec0932a851859484389bd901962f6fa3a2))

## [15.2.1](https://github.com/terrestris/react-geo/compare/v15.2.0...v15.2.1) (2021-09-17)


### Bug Fixes

* linting ([89872b2](https://github.com/terrestris/react-geo/commit/89872b2a284be4959ca70d4693494a13ae3436fe))
* make use of actSetTimeout util ([0aefb8d](https://github.com/terrestris/react-geo/commit/0aefb8d38c77288eedbc88cbbd0782e63e718de9))
* revert checkbox value prop change ([1c73dbc](https://github.com/terrestris/react-geo/commit/1c73dbc9fcf895f3c5d98c95bbc4a5c707d639e4))

# [15.2.0](https://github.com/terrestris/react-geo/compare/v15.1.4...v15.2.0) (2021-09-13)


### Bug Fixes

* **selectfeaturesbutton:** unselect on button toggle ([0cd5611](https://github.com/terrestris/react-geo/commit/0cd561154d177c8412338b3837e80bdd6766e0fc))


### Features

* **SelectFeaturesButton:** Adds a button to select features from vector layers. ([c6af71d](https://github.com/terrestris/react-geo/commit/c6af71d97f3baf10d0af5b9a75ca998dc1930e86))

## [15.1.4](https://github.com/terrestris/react-geo/compare/v15.1.3...v15.1.4) (2021-09-07)


### Bug Fixes

* update structure to lockfileVersion 2 ([890e457](https://github.com/terrestris/react-geo/commit/890e457a79a8c5bebbe14516634dcbf60330eaf9))

## [15.1.3](https://github.com/terrestris/react-geo/compare/v15.1.2...v15.1.3) (2021-09-07)


### Bug Fixes

* avoid duplicated build stage on release ([14b6395](https://github.com/terrestris/react-geo/commit/14b6395102e55de5911eea0361c87cbb6456d8e6))

----------- autogenerated below - to change content, change release notes and recreate with command at end of this file ------------

## [v15.0.2] - 2021-05-03
released from master
## Bug fixing 
- Ensure that measure button is properly deactivated on unmount (#2188)

https://github.com/terrestris/react-geo/compare/v15.0.1...v15.0.2 

## [v15.0.1] - 2021-05-03
released from master
## Dependency updates

https://github.com/terrestris/react-geo/compare/v15.0.0...v15.0.1 

## [v15.0.0] - 2021-04-27
released from master
## Breaking Changes

* Include OpenLayer types via `@hanreev/types-ol`
* Init @terrestris/eslint-config-typescript #2105 (Breaking because some props of the `NominatimSearch` have been renamed. See upgrade notes below for details)

## Features

* Add prop `nameProperty` to `MultiLayerSlider` to set layer name attribute (#1957)

## Bugfixes

* Fix typing for `onSelect` in the `NominatimSearch` (#2074)
* Improves invoking the draw interactions (#2100)
* Fix CRS Combo (#2086)
* Fix selectedName state value of ToggleButton (#2172)
* Fix FeatureGrid Demo (#2151)
* Several dependency updates

## Update notes

* If existent please remove `@types/ol` via `npm uninstall @types/ol`
* Install `@hanreev/types-ol` via `npm i @hanreev/types-ol --save-dev`
* Add the following block to your `tsconfig.json` (`compilerOptions`):
```
"paths": {
  "ol": ["node_modules/@hanreev/types-ol/ol"],
  "ol/*": ["node_modules/@hanreev/types-ol/ol/*"]
}
```
* If you use the `NominatimSearch` the following props have changed
    * `viewbox` ➞ `viewBox`
    * `polygon_geojson` ➞ `polygonGeoJSON`
    * `addressdetails` ➞ `addressDetails`
    * `countrycodes` ➞ `countryCodes`

## Commit range

https://github.com/terrestris/react-geo/compare/v14.2.4...v15.0.0
 

## [v15.0.0-beta.3] - 2021-04-27
released from master
## Bug fixes
- Fix selectedName state value of ToggleButton (#2172)
- Fix FeatureGrid Demo (#2151)

## Dependency updates
- #2166
- #2169 
- #2170
- #2162
- #2161
- #2161
- #2160
- #2159
- #2154
- #2153
- #2150 
- #2151
- #2145
- #2146
- #2144
- #2142
- #2141
- #2139
- #2138
- #2134
- #2132
- #2131
- #2129
- #2128
- #2127
- #2126
- #2125
- #2123
- #2121
- #2119
- #2120
- #2118
- #2117

https://github.com/terrestris/react-geo/compare/v15.0.0-beta.2...v15.0.0-beta.3 

## [v15.0.0-beta.2] - 2021-03-29
released from master
## Breaking Changes

- Init @terrestris/eslint-config-typescript #2105 (Breaking change because some  props of the `NominatimSearch` have been renamed)

## Bugfixes

- Improves invoking the draw interactions #2100
- Fix CRS Combo #2086

## Features

- Add prop `nameProperty` to MultiLayerSlider to set layer name attribute #1957

https://github.com/terrestris/react-geo/compare/v15.0.0-beta.1...v15.0.0-beta.2 

## [v15.0.0-beta.1] - 2021-03-15
released from master
## Bugfixes

* Fix typing for `onSelect` in the `NominatimSearch` (#2074)
* Several dependency updates

https://github.com/terrestris/react-geo/compare/v15.0.0-beta.0...v15.0.0-beta.1 

## [v15.0.0-beta.0] - 2021-02-22
released from master
This is a prerelease of version 15.0.0 which mainly introduces better OpenLayers types via https://github.com/hanreev/types-ol

## Breaking Changes

* Include OpenLayer types via `@hanreev/types-ol`

## Required steps for updating

* If existent please remove `@types/ol` via `npm uninstall @types/ol`
* Install `@hanreev/types-ol` via `npm i @hanreev/types-ol --save-dev`
* Add the following block to your `tsconfig.json` (`compilerOptions`):
```
"paths": {
  "ol": ["node_modules/@hanreev/types-ol/ol"],
  "ol/*": ["node_modules/@hanreev/types-ol/ol/*"]
}
```

Commit range
-------------------
https://github.com/terrestris/react-geo/compare/v14.2.4...v15.0.0-beta.0 

## [v14.2.4] - 2021-02-02
released from master
## Bugfixes
- Fix event conflicts in `Panel` component in mobile mode  30c5f1eb
- Fix handling visibility of layer groups in tree  fbfdcae1
## Dependecies
- Bump @typescript-eslint/eslint-plugin-tslint from 4.14.1 to 4.14.2  da7852e9
- Bump eslint from 7.18.0 to 7.19.0  ece83dc4
- Bump @typescript-eslint/eslint-plugin-tslint from 4.14.0 to 4.14.1  66673002
- Bump @types/node from 14.14.21 to 14.14.22  4e7558f2
- Bump @ant-design/icons from 4.3.0 to 4.4.0  0239cc1e
- Bump enzyme-adapter-react-16 from 1.15.5 to 1.15.6  52180331
- Bump @typescript-eslint/eslint-plugin-tslint from 4.13.0 to 4.14.0  908adc1c
- Bump @types/lodash from 4.14.167 to 4.14.168  4ea43834
- Bump proj4 from 2.6.3 to 2.7.0  02326dd2
- Bump eslint from 7.17.0 to 7.18.0  a77b0fee
- Bump @types/node from 14.14.20 to 14.14.21  f944414a


https://github.com/terrestris/react-geo/compare/v14.2.3...v14.2.4 

## [v14.2.3] - 2021-01-14
released from master
## Features
- Allow headless usage of nominatim and wfs search  ce23dd792
- check if interaction exists in onToggle  b437a2ded
## Bugfixes
- Fix deploy path and version variable  74cf64407
## Dependecies
- Bump @typescript-eslint/eslint-plugin-tslint from 4.12.0 to 4.13.0  38465219b
- Bump fork-ts-checker-webpack-plugin from 6.0.8 to 6.1.0  39fc6f129
- Bump @types/jest from 26.0.19 to 26.0.20  c07a9d04e

https://github.com/terrestris/react-geo/compare/v14.2.2...v14.2.3 

## [v14.2.2] - 2021-01-07
released from master
## Features
- Add error message and custom handler for broken legends  130a1131f
## Bugfixes
- Make sure tree icons are aligned to the right (#1922)  36946dbaa

https://github.com/terrestris/react-geo/compare/v14.2.1...v14.2.2 

## [v14.2.1] - 2021-01-06
released from master
## Bugfixes
- Fix import of `OlCoordinate` in zoomToExtentButton  a2610cd3

https://github.com/terrestris/react-geo/compare/v14.2.0...v14.2.1 

## [v14.2.0] - 2021-01-06
released from master
## Features
- Enhancement of `zoomToExtentButton`: Define extent using `center` and `zoom` (#1917)

## Bugfixes
- Several fixes of `ToggleButton` class (#1734)


https://github.com/terrestris/react-geo/compare/v14.1.2...v14.2.0 

## [v14.1.2] - 2020-11-12
released from master
## Bugfix

- Fix handling of `null` children in `ToggleGroup` (#1825)

https://github.com/terrestris/react-geo/compare/v14.1.1...v14.1.2 

## [v14.1.1] - 2020-11-12
released from master
## Documentation

* Optimized styleguide configuration to enhance loading performance (#1736)

## Refactoring

* Enhanced ol interaction handling in the `DigitizeButton` (#1822)

https://github.com/terrestris/react-geo/compare/v14.1.0...v14.1.1 

## [v14.1.0] - 2020-08-24
released from master
## :new: Features:
- MapContext and useMap hook (#1649)  f112194

https://github.com/terrestris/react-geo/compare/v14.0.1...v14.1.0 

## [v14.0.1] - 2020-08-10
released from master
## Bugfixes

- Fixes a type definition error for OlCoordinate  27b96240

https://github.com/terrestris/react-geo/compare/v14.0.0...v14.0.1 

## [v14.0.0] - 2020-07-06
released from master
## :rotating_light: BREAKING CHANGES:
* Update to antd 4: Required version of **antd** is now `^4.0.0`   a58ec410

## :wrench: Bug Fixes and devsetup:

- Run travis for node version 14 as well  1ada624a
- Add transform ignore pattern for required modules  b99bcbba
- Fix LayerTree due to update to antd v4  49e5aae5
- Remove unsupported usage of useFixedHeader  1191579f
- Remove unused ref reference  144df71c
- Fix usage of fields (Select / AutoComplete) due to changed API in antd v4  7f6698c7
- Fix usage of icon prop due to antd 4 update  8d85ae0a
- Fix prop to match updated API  98b9ae71
- Add match media mock  3d975246
- Fix lint after replacing tslint  5201be91
- Replace tslint with eslint (plugin)  e3ae5221
- Fix ForkTsCheckerWebpackPlugin options after update  df6dcacd
- Fix less-loader options after update  f5970803
- Remove outdated version acorn, it seems not to be needed anymore  f591f72e
- Wrap private field in constant, babel seems to have some issues when accessing a component via a nested object key in the latest version  b4b6a762
- Add dependabot badge  6704a375
- Init dependabot configuration  d562c59f
- Remove the greenkeeper status  0c1e3a92

Changes: https://github.com/terrestris/react-geo/compare/v13.3.0...v14.0.0 

## [v13.0.4] - 2020-08-10
released from master
## Bugfixes

- Fixes a type definition error for OlCoordinate  27b96240

https://github.com/terrestris/react-geo/compare/v13.0.3...v13.0.4 

## [v13.0.3] - 2020-02-14
released from master
## Bugfixes

- Don't bundle requests in `CoordinateInfo` a2c8a06f

https://github.com/terrestris/react-geo/compare/v13.0.2...v13.0.3 

## [v13.0.2] - 2020-02-14
released from master
## Refactoring

- Request GFI with GML2 format in `CoordinateInfo` component (1733f05e)

https://github.com/terrestris/react-geo/compare/v13.0.1...v13.0.2 

## [v13.0.1] - 2020-02-14
released from master
### Bugfixes
- Add missing export for TimeLayerSliderPanel component (#1289)

https://github.com/terrestris/react-geo/compare/v13.0.0...v13.0.1 

## [v13.0.0] - 2020-02-13
released from master
## Breaking changes

* Minimum required node version 10 (for development) #1269

## Features

* Introduces the CoordinateInfo component #1287

https://github.com/terrestris/react-geo/compare/v12.1.0...v13.0.0 

## [v12.1.0] - 2019-12-20
released from master
## Features
- Introduces the TimeLayerSliderPanel for WMS-T layer  64744594

https://github.com/terrestris/react-geo/compare/v12.0.0...v12.1.0 

## [v12.0.0] - 2019-12-06
released from master
# v12.0.0

## :rotating_light: BREAKING CHANGES:
* Required version of **OpenLayers** is now `^6.0.0`

If you have problems with upgrading to v12 have a look at the [v12 migration guide](https://github.com/terrestris/react-geo/wiki/Version-12.0.0-migration-guide).

## :new: Features:
* All code has been rewritten/translated to **TypeScript**
  * Typings are included in the library.
* Google-like [**LayerSwitcher** ](https://terrestris.github.io/react-geo/docs/latest/index.html#layerswitcher-1)

Have a look at the release notes of the 12.0.0-beta releases for more details.
Or compare the whole changes of the new release here: https://github.com/terrestris/react-geo/compare/v11.4.4...v12.0.0 

## [v12.0.0-beta.8] - 2019-12-03
released from master
- Fixes tests of DigitizeButton  718fb93d
- Fixes typings of ToggleGroup  13a4630f
- Updates typings of Window  fea150ba
- Updates typings of UserChip  8541fb9f
- Updates typings of Toolbar  b774806b
- Updates typings of Slider components  64162a96
- Updates typings of Provider components  35401e70
- Updates typings of Panel components  28ba571d
- Updates typings for Map components  9dea5e6e
- Updates typings of Legend  e6278f38
- Updates typings of LayerTreeNode  bf896d9f
- Updates typings of LayerTree  bd033d30
- Updates typings of LayerSwitcher  4f440acd
- Updates typings of Grid components  3efc8305
- Update typings of Field components  a6dc2625
- Updates typings of Container components  074efffe
- Updates typings of CircleMenu  c179df44
- Updates typings of Buttons  23b30728

https://github.com/terrestris/react-geo/compare/v12.0.0-beta.7...v12.0.0-beta.8 

## [v12.0.0-beta.7] - 2019-11-21
released from master
- Adds tests for LayerSwitcher  5ee65a04
- Fixes some typing in TestUtil  60a8db7e
- Adds LayerSwitcher example  8f7968e6
- Adds styling enhancements and passThroughProps  da959dda
- Destroy map on unmonut  6c7f1862
- Introduces LayerSwitcher  6be9b5cf
- Make mapOpts optional  f057a3f5
- Remove withRef options to include wrappedinstance  116ab2c1
- Fixes coverage collection  f2c29a56
 

## [v12.0.0-beta.6] - 2019-11-19
released from master
- Avoids adding ref to wrapped functional components  88536587
- Further improvements to the HOC typings (#1249)  53d78fd3

https://github.com/terrestris/react-geo/compare/v12.0.0-beta.5...v12.0.0-beta.6 

## [v12.0.0-beta.5] - 2019-11-18
released from master
- Fixes typings for higher order components  a960a93c

https://github.com/terrestris/react-geo/compare/v12.0.0-beta.4...v12.0.0-beta.5 

## [v12.0.0-beta.4] - 2019-11-15
released from master
- Moves emitDeclarationOnly to package.json  d595ba19
- Readds emit of declartion files  ac22d3f6

https://github.com/terrestris/react-geo/compare/v12.0.0-beta.3...v12.0.0-beta.4 

## [v12.0.0-beta.3] - 2019-11-14
released from master
- Readds clean:dist  12b859d7
- Minor fixes for the UserChip  2969792d
- Use babel for transpilation  cf16749e

https://github.com/terrestris/react-geo/compare/v12.0.0-beta.1...v12.0.0-beta.3 

## [v12.0.0-beta.2] - 2019-11-13
released from master
- Use integratedTerminal for debugging jest  32f28393
- Enhancements to the UserChip  0a6883ac
- Fixes copying of files  ac758449

https://github.com/terrestris/react-geo/compare/v12.0.0-beta.1...v12.0.0-beta.2 

## [v12.0.0-beta.1] - 2019-11-12
released from master
- Updates ag-grid* and typescript  7d36aad0
- Adds missing data types in map functions  b4ed599d
- Readds linting of examples  2d8de6d6
- Removes jsx relevant configs  f0c1ebf5
- Pins typescript to version 3.6.x  74120aa0
- Adds antd css to styleguide  9c3eaa83
- Uses require for lodash and fixes ts issues  2a2f3da9
- Adds @types/lodash and downgrades acorn  ac52ddec
- Transforms TestUtil to TypeScript  7cb22e16
- Further enhancements to stylguidist  195961d0
- Removes eslint  29992a46
- Changes import syntax for react and prop-types  2fe75a9e
- Prepare styleguide  fdfdff2b
- Removes prop-types from ToggleButton  30a9428c
- Fixes MultiLayerSlider tests  de1ee576
- Fixes MapProvider  3e1328a3
- Fixes VisibleComponent test  1384721a
- Fixes WfsSearchInput ref in test  1ff3f113
- Removes unneeded test  45a9eac1
- Fixes DigitizeButton test  4604d95a
- Fixes ToggleButton tests  3e605f82
- Prepares jest  6d148c19
- Adapts imports  8e07008f
- Fixes some typescript bugs  9d5015c8
- Upgrades ag-grid  4a8fa77a
- Transforms ZoomToExtentButton to TypeScript  10a3f09a
- Transforms ZoomButton to TypeScript  0cd1cdfa
- Transforms UploadButton to TypeScript  eb53f302
- Transforms ToggleGroup to TypeScript  4628b3f3
- Transforms ToggleButton to TypeScript  c3ba81ce
- Transforms SimpleButton to TypeScript  2bb600e5
- Transforms MeasureButton to TypeScript  e1465195
- Transforms GeoLocationButton to TypeScript  791ecea2
- Transforms DigitizeButton to TypeScript  0847e4ca
- Transforms CircleMenu to TypeScript  464a171b
- Transforms AddWmsPanel to TypeScript  96055f09
- Transforms WfsSearchInput to TypeScript  39c1d566
- Transforms WfsSearch to TypeScript  2cd0c763
- Transforms ScaleCombo to TypeScript  a0d401d4
- Transforms NominatimSearch to TypeScript  c2668a05
- Transforms CRSCombo to TypeScript  653f7afa
- Transforms AgFeatureGrid to TypeScript  f82a6367
- Transforms FeatureGrid to TypeScript  559f33ef
- Transforms PropertyGrid to TypeScript  a1407e50
- Transforms DropTargetMap to TypeScript  d5d31d0f
- Transforms LoadifiedComponent to TypeScript  9f3b3cac
- Transforms MappifiedComponent to TypeScript  04ca7cac
- Transforms TimeLayerAware to TypeScript  bfd6dbe7
- Updates typescript related packages  fc9367f9
- Misc code improvements  9fe71a22
- Transforms VisibleComponent to TypeScript  1360c519
- Transforms LayerTree to TypeScript  7ba46bea
- Transforms LayerTreeNode to TypeScript  1fe25bdc
- Transforms Legend to TypeScript  46c56ae0
- Transforms FloatingMapLogo to TypeScript  055e69ee
- Transforms MapComponent to TypeScript  e4ee1a46
- Transforms Panel to TypeScript  a8cc2084
- Transforms Titlebar to TypeScript  d356bf1e
- Transforms MapProvider to TypeScript  51f8128b
- Transforms MultiLayerSlider to TypeScript  0b6c0d38
- Transforms LayerTransparencySlider to TypeScript  77fb988e
- Transforms TimeSlider to TypeScript  88af885a
- Adjust JS-Docs for TestUtil  b7a7249e
- Transforms Window to TypeScript  b7069161
- Adds @types/jest and @types/enzyme  7e84e1bc
- Transforms Toolbar to TypeScript  05834470
- Transforms UserChip to TypeScript  28e5ecf7
- Transforms constants to TypeScript  e5eeff29
- Setup TypeScript  34462daf
- Get the current style via helper method  68d799d7
- Fix NPE  91451359
- Update to ol 6.1.1  1de5e024
- fix feature animation on copy  32b8639f
- remove constrainResolution option from view.fit() method, move it to ol.View class instead  7768e5ca
- use valid rgb color value  7d2a8c02
- get rid of deprecated ol/pointer/PointerEvent class  0a707138
- upgrade ol to version 6.0.1  0f0053ca
- Update package-lock  9cc389c9
- Make use of jsdom in version 14 (instead of default 11)  d5f5c177
- Add jest-environment-jsdom-fourteen  735baa4c
- Update to the latest versions of ag-grid  4ebccd12
- Replace usage of invalid TileJSON layer  64019223
- Don't pass prop collapsed to html element  a252a509
- Update (selection of) dependencies  3a10b646
- Updates all dev dependencies to the latest versions  ec6a5943
- Fix test for LayerTreeNode, it needs to be rendered inside a Provider component (e.g. the Tree from rc-tree)  98a0ac54
- Update antd version  dcd46793
- Update react-rnd to v 10.0.0  7d0aabce

https://github.com/terrestris/react-geo/compare/v11.4.4...v12.0.0-beta.1 

## [v11.4.4] - 2019-08-08
released from master
### Devsetup

* Reintroduce package-lock.json (#1211)

### Bugfixes

* Unset the map's target on unmount (#1218)
* Several dependency updates

### Diff

https://github.com/terrestris/react-geo/compare/v11.4.3...v11.4.4 

## [v11.4.3] - 2019-06-25
released from master
- Readd no-console rule (disabled in eslint v6.0.0)  ca838213
- Remove unneeded eslint-plugin-html  733ccee5
- fix unsupported style property  29e477be
- Update gh-pages branch if tag has been created / for tagged release  a6b91749
- Refactor getOptionsFromMap to not manipulate state directly  b48bdd72
- Only consider zoomLevel prop in getDerivedState if prop is given  092c826f
- Execute for node v12 only  85970fd1
- Add script to execture npm run coveralls for specific node version  fc2a74d3
- Reenable call to update-gh-pages script and add node checked coveralls execution script  cd4bd929
- Run for node v12  05b3e2f5
- Add note about reac-geo-baseclient  5a0580c1

https://github.com/terrestris/react-geo/compare/v11.4.2...v11.4.3 

## [v11.4.2] - 2019-06-21
released from master
### Bugfixes

* Adapts import paths to be explicit  3218e903
* Remove unneeded calls to mockFn.mockReset and remove all calls to jest.resetAllMocks() and jest.restoreAllMocks()  abb78b1e
* Make use of xmldom and jest-canvas-mock in jest setup  afebff2a
* Add jest-canvas-mock and xmldom  1fcf96f3
* Replace canvas-prebuilt with canvas  d332bea4
* fix url-loader options definition  f4a453f7
* upgrade url-loader to v2.0.0  fa96227f
* fix method name after @terrestris/ol-util major upgrade  f18b57e0
* destructure map prop  3bbf7970
* Add engines section, see #1120 as well  f8c00551
* Add development requirements to README  d4e11aa5
* Remove extra whitespace  a13f79ab
* Update url ref  9683c75b
* Pass required context prop (due to update of antd/rc-tree)  10cd982b
* Several package updates
 

## [v11.4.1] - 2019-05-06
released from master
### Bugfixes
* Several fixes to the `MeasureButton` (#1115)
* Several dependency updates (see [here](https://github.com/terrestris/react-geo/compare/v11.4.0...v11.4.1#diff-b9cfc7f2cdf78a7f4b91a753d10865a2)) 

## [v11.4.0] - 2019-04-04
released from master
## Features
* Make `collapsed` property of Panel component configurable (#1103)

## Dependency updates
* babel7 v7.4.3 (#1101) 

## [v11.3.0] - 2019-04-02
released from master
### Features

* Add prop `idProperty` to `WfsSearch` (#1098)

### Devsetup

* Add shareable `settings.json` for VS Code (#1099)

### Bugfixes

* Several dependency updates. 

## [v11.2.0] - 2019-03-20
released from master
# Bugfixes
Fixup nominatim search by comparing strings #1083
Disable update of gh-pages branch #1074

# Devsetup
Several dependency updates 

## [v11.1.0] - 2019-02-22
released from master
### Features
- Adds leaf/folder css-class to TreeNode #1048
### Bugfixes
- Fix escape key for IE #1053 
### Dependency updates
- @terrestris/ol-util v2.1.0 (#1052)
- react v16.8.3, react-test-renderer v16.8.3, react-dom v16.8.3 (#1051)
- ol v5.3.1 (#1050) 

## [v11.0.2] - 2019-02-20
released from master
## Bugfixes
- Fix `onEscape` function call on window component (#1043 and #1046)

## Devsetup
- Several dependency updates 

## [v11.0.1] - 2019-02-20
released from master
## BugFixes
- Forces rebuildTreeNodes onExpand (#1032)
- Replace outdated babel plugin (#1011)
- Fix FeatureGrid (remote source) filter input (#1007)
- Styleguide fixes (#1006) 
- Fix VisibleComponent example (#1005)
- Fix FeatureGrid (remote source) example (#1004)
- Remove warnings in AgFeatureGrid example (#1003)
- Don't pass trackingOptions prop to ToggleButton (#1002)
- A valid state object (or null) must be returned in getDerivedStateFromProps (#992)

 

## [v11.0.0] - 2019-01-18
released from master
Semver release, no additional features / bugfixes. 

## [v10.5.0] - 2019-01-17
released from master
### Breaking change
* Rename property 'absolutelyPostioned' to 'absolutelyPositioned' (#940)
* Rename property 'trackingoptions' to 'trackingOptions' (#940)

### Bugfixes
* Rebuild tree nodes on moveend event of map if resolution changed (#987)
* Fix import of Rnd (#927).

### Features
* Use `React.PureComponent` more frequently (`LayerTreeNode` and `MapContainer`, #986)
* Allow style functions as draw style in `DigitizeButton` (#960)
* Introduces onClear method to NominatimSearch (#963)

### Devsetup
* Several dependency updates. 

## [v10.4.1] - 2018-10-25
released from master
### Bugfixes

* Update `base-util` and `ol-util` to make use of transpiled components (#934).
* Test more of the TimeLayerAwareHOC (#927).
* Import specific `lodash` functions to reduce bundle size (#918).
* Several depedency updates. 

## [v10.4.0] - 2018-09-28
released from master
### Devsetup
* Specify react version for linter (#893)
* Update several dependencies (#894)
* further dependencies updates

### Features
* Always cancel animation (#896)
* Before setting the extent, better cancel any animations (#897)
* Provide optional callback prop `onFeatureSelect` to be used with `ol.interaction.Select` (#907)
* Enhance label handling in `DigitizeButton` component (#910)

# Documentation
* Change references to OL documentation in comments to the latest format (#891)
* Several documentation updates (#895)
* Less strict PropTypes type & slightly enhanced docs(#899)

## [v10.3.0] - 2018-09-20
released from master
### Features
- Add callback props `onModalLabelOk` and `onModalLabelCancel` to DigitizeButton

#### dependencies
* react-dom 16.5.2

#### devDependencies
* react 16.5.2
* react-test-renderer 16.5.2
* webpack 4.19.1 

## [v9.4.1] - 2018-10-25
released from master
### Bugfixes

*  Update `base-util` and `ol-util` to make use of transpiled components (#935) 

## [v9.4.0] - 2018-09-28
released from ol4
### Features
* Provide optional callback prop `onFeatureSelect` to be used with `ol.interaction.Select` (#906)
* Enhance label handling in `DigitizeButton` component (#908)

## [v9.3.0] - 2018-09-20
released from master
### Features
- Add callback props `onModalLabelOk` and `onModalLabelCancel` to DigitizeButton for ol4 

-----
Autogenerated with:
```
curl https://api.github.com/repos/terrestris/react-geo/releases?per_page=50 | jq -r '.[] | "## [\(.tag_name)] - \(.published_at | strptime("%Y-%m-%dT%H:%M:%SZ") | strftime("%Y-%m-%d"))\nreleased from \(.target_commitish)\n\(.body) \n"'
```
After that, few releases need to be sorted correctly.
