# [32.4.0](https://github.com/terrestris/react-geo/compare/v32.3.1...v32.4.0) (2025-10-15)


### Bug Fixes

* remove duplicated CSS instructions ([09cedba](https://github.com/terrestris/react-geo/commit/09cedbaf6e619b2ee05a7e0e159d12b0e55ddc3b))
* remove duplicated semicolon ([7b612f4](https://github.com/terrestris/react-geo/commit/7b612f4f8d68225f4e568efbf21e968cdf0f0e3d))


### Features

* add keyboard support for BackgroundLayerChooser and BackgroundLayerPreview ([ab20dd4](https://github.com/terrestris/react-geo/commit/ab20dd45e57f775cfcf1a751e866875ad4a95548))

## [32.3.1](https://github.com/terrestris/react-geo/compare/v32.3.0...v32.3.1) (2025-10-09)


### Bug Fixes

* conflate dublicated unittests ([2860ce9](https://github.com/terrestris/react-geo/commit/2860ce981f5820f5e95dec97fdaa95a735adf498))

# [32.3.0](https://github.com/terrestris/react-geo/compare/v32.2.0...v32.3.0) (2025-08-12)


### Features

* allow search field with external data display ([e2d51e7](https://github.com/terrestris/react-geo/commit/e2d51e7e16de7b43d944601f31007c0c6afc4710))

# [32.2.0](https://github.com/terrestris/react-geo/compare/v32.1.1...v32.2.0) (2025-06-26)


### Features

* adds property to customize format string of marks ([7800140](https://github.com/terrestris/react-geo/commit/7800140a5294c068d63a447f4267534ffec34a1b))
* use duration string if passed to timeslider ([fb126ca](https://github.com/terrestris/react-geo/commit/fb126caf20ef0ac7459674c6a930f9d4120e8cae))

## [32.1.1](https://github.com/terrestris/react-geo/compare/v32.1.0...v32.1.1) (2025-06-05)


### Bug Fixes

* readd support for wmts layers/sources ([65d6aee](https://github.com/terrestris/react-geo/commit/65d6aee6626c1c8b3513a43b750a7325b5ba22ab))

# [32.1.0](https://github.com/terrestris/react-geo/compare/v32.0.0...v32.1.0) (2025-06-05)


### Features

* allow to pass custom title renderer ([ddc1d16](https://github.com/terrestris/react-geo/commit/ddc1d16d8f67bd0820eb29935a8d658ff770d4b0))

# [32.0.0](https://github.com/terrestris/react-geo/compare/v31.0.1...v32.0.0) (2025-05-21)


### Bug Fixes

* fire delete event after removal of feature from source ([cf4d375](https://github.com/terrestris/react-geo/commit/cf4d3756edd6e96103a20b9b9964f81ef28d2a42))
* fire digitize buttons end-events after the action is performed ([3d227e8](https://github.com/terrestris/react-geo/commit/3d227e8c66930b0ef479c807ed2c2c3d257831cf))


### BREAKING CHANGES

* The `onFeatureRemove` callback of the `DeleteButton` and the `onFeatureCopy`callback of the
`CopyButton` are now called AFTER the action has been performed
* The `onFeatureRemove` callback of the `DeleteButton` is now called AFTER the feature has been removed.

## [31.0.1](https://github.com/terrestris/react-geo/compare/v31.0.0...v31.0.1) (2025-05-21)


### Bug Fixes

* **deps:** update react-util ([eb3a98e](https://github.com/terrestris/react-geo/commit/eb3a98e8946ca7e147d5250016da86b51e893672))

# [31.0.0](https://github.com/terrestris/react-geo/compare/v30.2.1...v31.0.0) (2025-05-20)


### Bug Fixes

* allow to override column definition again ([815e2e0](https://github.com/terrestris/react-geo/commit/815e2e00c0f90407ae0bcf4edeeaa7093549e9f7))


### BREAKING CHANGES

* Make use of the "columnDefs" instead of the "columns" prop if needed

## [30.2.1](https://github.com/terrestris/react-geo/compare/v30.2.0...v30.2.1) (2025-04-14)


### Bug Fixes

* expose onCutEnd callback in DrawCutButton ([0c8baf4](https://github.com/terrestris/react-geo/commit/0c8baf450cc778e1d063f2f117588123216d4cb5))

# [30.2.0](https://github.com/terrestris/react-geo/compare/v30.1.1...v30.2.0) (2025-04-14)


### Features

* **DrawCutButton:** highlight the cut geometry ([0cf52f1](https://github.com/terrestris/react-geo/commit/0cf52f1277fd4b1c3c17301942b25326b70925b7))

## [30.1.1](https://github.com/terrestris/react-geo/compare/v30.1.0...v30.1.1) (2025-04-14)


### Bug Fixes

* set current promise to undefined after resolving it ([d63a9b4](https://github.com/terrestris/react-geo/commit/d63a9b43d5bee44678b7ef3ae3f6ad1279b37cfe))

# [30.1.0](https://github.com/terrestris/react-geo/compare/v30.0.1...v30.1.0) (2025-04-10)


### Bug Fixes

* typings tue to update of OpenLayers to 10.5.0 and pin ol-mapbox-style version ([291bacc](https://github.com/terrestris/react-geo/commit/291bacc7c8ae092f1f9fc6d6f5699d32b99283b7))


### Features

* **printbutton:** use typings defined in react-util ([656964e](https://github.com/terrestris/react-geo/commit/656964eca55d2ab438ddf678e09e99f181af5d55))

## [30.0.1](https://github.com/terrestris/react-geo/compare/v30.0.0...v30.0.1) (2025-03-28)


### Bug Fixes

* fixes a zoom error in LayerSwitcher ([a635b97](https://github.com/terrestris/react-geo/commit/a635b976f55a56bf9430cab4174664a4e2ba8424))

# [30.0.0](https://github.com/terrestris/react-geo/compare/v29.0.1...v30.0.0) (2025-03-24)


### Bug Fixes

* **deps:** update react-util and ol-util beside OpenLayers ([c7acd34](https://github.com/terrestris/react-geo/commit/c7acd34ffe36b0af2ef7703633d29d19a0560579))


### BREAKING CHANGES

* **deps:** CoordinateInfo requires active property and layer filtering using functions

## [29.0.1](https://github.com/terrestris/react-geo/compare/v29.0.0...v29.0.1) (2025-01-27)


### Bug Fixes

* initial range determination in time layer slider panel ([7adc84a](https://github.com/terrestris/react-geo/commit/7adc84a6acc6c27732b7ed2126e11e0ac37da0f6))

# [29.0.0](https://github.com/terrestris/react-geo/compare/v28.0.0...v29.0.0) (2025-01-24)


### Bug Fixes

* @babel/plugin-syntax-dynamic-import is included in @babel/preset-env in ES2020 ([86a9a64](https://github.com/terrestris/react-geo/commit/86a9a64e8d25e95bf6967c882910eadaf676d383))
* add no-debugger rule ([6ce69a1](https://github.com/terrestris/react-geo/commit/6ce69a17ce802aef48b18e438d3241fa32ec863b))
* enable tracking only if passed explicitely ([e2d03ff](https://github.com/terrestris/react-geo/commit/e2d03fff5cd514a726a0a6b429cfced46ded146f))
* pass default icon to component ([bbf3abb](https://github.com/terrestris/react-geo/commit/bbf3abbaeb34b7d30991d4867c4b6a03699ad58f))
* pass type prop correctly to button ([cc2ab13](https://github.com/terrestris/react-geo/commit/cc2ab13c9df99be957edb28f41d65dabb222f957))


### chore

* **eslint:** upgrade to v9 ([565c5da](https://github.com/terrestris/react-geo/commit/565c5daa39e90d9c8fa90edf97011ad808f015eb))


### BREAKING CHANGES

* **eslint:** upgrade eslint to v9

# [28.0.0](https://github.com/terrestris/react-geo/compare/v27.0.0...v28.0.0) (2025-01-24)


### Bug Fixes

* remove momentjs and homogenize props of timeslader and its panel ([6de4ff9](https://github.com/terrestris/react-geo/commit/6de4ff919feccceb9a66ea3e30d26a14389d65ba))
* update time for all time aware layers if value changes ([255d8b8](https://github.com/terrestris/react-geo/commit/255d8b80624011323b1684d7783f83ffc893595a))
* value update in time slider panel ([4eefb99](https://github.com/terrestris/react-geo/commit/4eefb9938069d965c9aebe8bd6be028a24cccefc))


### Features

* support minutes in autoplay and seperate speed from unit ([6519b5c](https://github.com/terrestris/react-geo/commit/6519b5c3ba1adfe07b5633a9d9173a645b8f5a02))


### BREAKING CHANGES

* MomentJS is replaced by DayJS

# [27.0.0](https://github.com/terrestris/react-geo/compare/v26.2.1...v27.0.0) (2025-01-15)


### Bug Fixes

* remove unneeded checkbox column ([3fc107a](https://github.com/terrestris/react-geo/commit/3fc107a839221ea1c1f7ae864767078d8fd2171a))


### Features

* update ag-grid and use theming via js api ([10bbdc0](https://github.com/terrestris/react-geo/commit/10bbdc0d5d6ca98198159ed2e65284a97a964c9f))


### BREAKING CHANGES

* The theme property of the AgFeatureGrid has changed to an AG-Grid Theme object.
Any CSS imports from AG-Grid have to be removed.

## [26.2.1](https://github.com/terrestris/react-geo/compare/v26.2.0...v26.2.1) (2024-12-11)


### Bug Fixes

* fix drag and drop in LayerTree ([25011cc](https://github.com/terrestris/react-geo/commit/25011cc31c9b6420f94885b395737cd020100559))

# [26.2.0](https://github.com/terrestris/react-geo/compare/v26.1.1...v26.2.0) (2024-11-27)


### Features

* support nested LayerGroups for background layer management ([60dc740](https://github.com/terrestris/react-geo/commit/60dc740ad76ca1911fb3867de240ea0360bb9146))

## [26.1.1](https://github.com/terrestris/react-geo/compare/v26.1.0...v26.1.1) (2024-11-18)


### Bug Fixes

* enable drawbutton autofocus on text area ([c39ce54](https://github.com/terrestris/react-geo/commit/c39ce54014592ab866d7fed31b431ff1c96bc836))
* linting warning ([898e764](https://github.com/terrestris/react-geo/commit/898e76428ca953106f0bf7fd5edb2d8977f8f2f5))

# [26.1.0](https://github.com/terrestris/react-geo/compare/v26.0.0...v26.1.0) (2024-11-07)


### Bug Fixes

* dependency array ([7323b86](https://github.com/terrestris/react-geo/commit/7323b8605236134bba85ac028eae7d91c28bf401))
* punctuation ([09d55d7](https://github.com/terrestris/react-geo/commit/09d55d7d5eeb6b60876cb6c2ff519298b683b02d))


### Features

* add optional layer visibility change callback ([1cf736c](https://github.com/terrestris/react-geo/commit/1cf736ccd4f82e47b22612ac58d90042775e5ccb))

# [26.0.0](https://github.com/terrestris/react-geo/compare/v25.1.2...v26.0.0) (2024-10-22)


### Bug Fixes

* linting ([b268a97](https://github.com/terrestris/react-geo/commit/b268a976b68f7440146c5791ea77e5c82d4d18f8))
* register client side row module by default ([17d7f6e](https://github.com/terrestris/react-geo/commit/17d7f6e3ff8afe09c12a5e4cccf62b31d686d9e7))


### Code Refactoring

* use ag-grid modules ([1ea6332](https://github.com/terrestris/react-geo/commit/1ea6332209cee366691100623676b8b29547737f))


### BREAKING CHANGES

* imports of ag-grid need to be adjusted, otherwise AG Grid will be included twice

See
- https://www.ag-grid.com/react-data-grid/modules/
- https://www.ag-grid.com/react-data-grid/modules/#mixing-packages-and-modules

## [25.1.2](https://github.com/terrestris/react-geo/compare/v25.1.1...v25.1.2) (2024-10-17)


### Bug Fixes

* pass type prop to button ([60270fd](https://github.com/terrestris/react-geo/commit/60270fd01858e8aff66505b1cc2b0001aafff775))

## [25.1.1](https://github.com/terrestris/react-geo/compare/v25.1.0...v25.1.1) (2024-10-14)


### Bug Fixes

* correct variable name for column definitions in checkbox selection check ([2c9f5ec](https://github.com/terrestris/react-geo/commit/2c9f5ec247f3e732872351be9741bc47a31ab8ee))

# [25.1.0](https://github.com/terrestris/react-geo/compare/v25.0.0...v25.1.0) (2024-09-20)


### Features

* adds a loading spin for TimeLayerSliderPanel ([df98ab1](https://github.com/terrestris/react-geo/commit/df98ab1cd3593bcbfabd80632366d7bb922f5845))
* adjust default value to hours ([52a43a1](https://github.com/terrestris/react-geo/commit/52a43a10bcc4a2b590a2690e58566f2c179792e5))

# [25.0.0](https://github.com/terrestris/react-geo/compare/v24.5.0...v25.0.0) (2024-09-20)


### chore

* update to latest ol ([3d60731](https://github.com/terrestris/react-geo/commit/3d60731ced037703f22ad3b83232c3490ba250a2))


### BREAKING CHANGES

* required peer dependency for ol is now >= 10

# [24.5.0](https://github.com/terrestris/react-geo/compare/v24.4.0...v24.5.0) (2024-09-19)


### Bug Fixes

* adds dependency and handler variable to use in cleanup function ([325c153](https://github.com/terrestris/react-geo/commit/325c153381202e727f3c029c31d1bb6081b883d1))


### Features

* tweaks the TimeLayerSliderPanel in design and functionality ([a8bad8e](https://github.com/terrestris/react-geo/commit/a8bad8e04988e7e75b8fadb46ad84cc21ab4a563))

# [24.4.0](https://github.com/terrestris/react-geo/compare/v24.3.0...v24.4.0) (2024-09-02)


### Features

* add onFeatureSelect listener to modify button ([580849a](https://github.com/terrestris/react-geo/commit/580849a7cd43c1dd37427e63a2df0379a65d60cb))

# [24.3.0](https://github.com/terrestris/react-geo/compare/v24.2.1...v24.3.0) (2024-07-31)


### Features

* adds a column filter ([aee7083](https://github.com/terrestris/react-geo/commit/aee7083b21c03b8b3e657ba80084f37b7fbb93db))

## [24.2.1](https://github.com/terrestris/react-geo/compare/v24.2.0...v24.2.1) (2024-07-26)


### Bug Fixes

* husky deprecated call ([245a408](https://github.com/terrestris/react-geo/commit/245a4084ab4ff04b4a04cb0a4813f232e03c1317))

# [24.2.0](https://github.com/terrestris/react-geo/compare/v24.1.1...v24.2.0) (2024-07-11)


### Features

* fixing typo and trigger release for https://github.com/terrestris/react-geo/pull/3897 ([c726d5f](https://github.com/terrestris/react-geo/commit/c726d5f028cee16f8f5ec377ecf4c57bf9d8e81d))

## [24.1.1](https://github.com/terrestris/react-geo/compare/v24.1.0...v24.1.1) (2024-07-04)


### Bug Fixes

* fixing dragging from tree node ([#3894](https://github.com/terrestris/react-geo/issues/3894)) ([0094f45](https://github.com/terrestris/react-geo/commit/0094f453518f90c9b6f764b0a08999addd65d93c))

# [24.1.0](https://github.com/terrestris/react-geo/compare/v24.0.2...v24.1.0) (2024-07-04)


### Features

* make loading mask configurable ([#3895](https://github.com/terrestris/react-geo/issues/3895)) ([6687cdc](https://github.com/terrestris/react-geo/commit/6687cdc4a71d4dc4464f6b9bf442c339e88ed7e8))

## [24.0.2](https://github.com/terrestris/react-geo/compare/v24.0.1...v24.0.2) (2024-06-19)


### Bug Fixes

* **CoordinateInfo:** update docs and react-util ([790e91b](https://github.com/terrestris/react-geo/commit/790e91ba33c43051943a36ccd7e94544fce66162))

## [24.0.1](https://github.com/terrestris/react-geo/compare/v24.0.0...v24.0.1) (2024-06-18)


### Bug Fixes

* update react-util ([4a0dd06](https://github.com/terrestris/react-geo/commit/4a0dd0677ee4564a23ef0cac67e50590af5c2f5a))

# [24.0.0](https://github.com/terrestris/react-geo/compare/v23.5.0...v24.0.0) (2024-06-12)


### Bug Fixes

* add build info to readme ([#3866](https://github.com/terrestris/react-geo/issues/3866)) ([7b97b95](https://github.com/terrestris/react-geo/commit/7b97b9505623e7997c10ebe4b6f9db781755fcfc))
* adds null check ([5a78b77](https://github.com/terrestris/react-geo/commit/5a78b7736881da8d4970dca1673de16c55bff938))
* adjust some css nesting, allows for use of the table scroll property without breaking the css ([c7cc92c](https://github.com/terrestris/react-geo/commit/c7cc92cf07c6e5f46c91c6abb19d60451214aa80))
* adjust to breaking changes in latest version of react-util ([2711a63](https://github.com/terrestris/react-geo/commit/2711a6378c9186e9871e6e68d0b115d4b5d1284c))
* adjust to change Key type in @types/react ([261ea52](https://github.com/terrestris/react-geo/commit/261ea52354359a6543ff4e96ce0b81b929f05c7d))
* explicit imports ([40af413](https://github.com/terrestris/react-geo/commit/40af41342c1f6247f0203f9d8a825a3c67f22e2f))
* layerswitcher always shows next layer instead of current layer ([1350c97](https://github.com/terrestris/react-geo/commit/1350c97aaeeaaf7f34aa1f53a13268117328238d))
* **LayerTree:** make contents of title clickable ([334e8aa](https://github.com/terrestris/react-geo/commit/334e8aac5467f90adfa9f22b56804d38d242f005))
* made use of olInteraction hook ([7b0732e](https://github.com/terrestris/react-geo/commit/7b0732e4cc67d5e6285727d9bc5681072b34fbe4))
* make property grid tighter ([1130d6e](https://github.com/terrestris/react-geo/commit/1130d6e66923cc2c8ca4307da446f39ce9749934))
* make use of dayjs, don't pass icon prop in LayerTreeNode ([c0cffa8](https://github.com/terrestris/react-geo/commit/c0cffa84ae196b22d27456fa6d97e3985e6136e4))
* make use of UseMeasureProps ([e73bfa7](https://github.com/terrestris/react-geo/commit/e73bfa7da3f01c044f907ee32171c678fb2d6678))
* readd changes that were lost in rebase ([f1c758f](https://github.com/terrestris/react-geo/commit/f1c758f0dad622c2e77f194e20f566062f952342))
* remove the DigitizeButton ([7cf8263](https://github.com/terrestris/react-geo/commit/7cf82630eddced00249ade6fbf88b3535dec8086))
* sets the transparent background to false again ([aad694f](https://github.com/terrestris/react-geo/commit/aad694ff8af64fba9683d0b3041dac69694f9c3c))
* simplify regex ([106e2c0](https://github.com/terrestris/react-geo/commit/106e2c0e0a5b91f4f6e3101dd0a06952e262f951))
* update dependencies ([30d9b90](https://github.com/terrestris/react-geo/commit/30d9b90b18d35c6d8091cc86f520b454b76de954))
* update react-util ([536b634](https://github.com/terrestris/react-geo/commit/536b634a836660c301cddabe6c866892263050d6))
* use antd css variables to make button active ([fe5504a](https://github.com/terrestris/react-geo/commit/fe5504ade04e6e33fbfbf6bc6b8d5288dda76900))


### chore

* migrate to typescript v5 ([bd8812f](https://github.com/terrestris/react-geo/commit/bd8812f481c1c9dd7a3afe1e22b4f31deb73ce9f))
* refactor geolocation button ([f646ed5](https://github.com/terrestris/react-geo/commit/f646ed5ebfa05f50a7308b315a1bd455e3b11001))
* update dependencies ([2515987](https://github.com/terrestris/react-geo/commit/2515987fe0bf4d3dc73f08a82676d3c15841423a))
* update to ol 8 api ([fc1ff8c](https://github.com/terrestris/react-geo/commit/fc1ff8cb64d9d2ef0730c3ad73ea579e6fc76a1e))


### Code Refactoring

* class to function component ([3b13ce1](https://github.com/terrestris/react-geo/commit/3b13ce13285d07b86eb551461faa1ab16d73272c))
* components FeatureGrid and AgFeatureGrid to function component ([ea48bb3](https://github.com/terrestris/react-geo/commit/ea48bb38101f13b5befdfeddf9ad622849d6cd41))
* remove deprecated HOC components ([ce5bdb7](https://github.com/terrestris/react-geo/commit/ce5bdb771ee7441daa5ad6b9bdf749245b36e7b9))
* remove Panel, Window and Titlebar components ([c749faa](https://github.com/terrestris/react-geo/commit/c749faa3614a051204e7dfab47c0617729d4a08e))
* simplify the ToggleButton and ToggleGroup components ([14760f0](https://github.com/terrestris/react-geo/commit/14760f064d7f79aa03a1db942c9af19b74b95c5d))


### Features

* add visible option for WfsSearchField ([a26f844](https://github.com/terrestris/react-geo/commit/a26f84406de50e185b5b4f81eda5a255498cc92a))
* adds a flag for transparent background of ToggleButton ([ef77c9d](https://github.com/terrestris/react-geo/commit/ef77c9dcef7a260cf103c6e0af8878b12441ab42))
* adds a wfs layer and feature-info ([#3826](https://github.com/terrestris/react-geo/issues/3826)) ([38dabed](https://github.com/terrestris/react-geo/commit/38dabed4be41b0e116840ba3e0840b31fc3dc2d8))
* adds the onSuccess callback to CoordinateInfo component ([1c0bec3](https://github.com/terrestris/react-geo/commit/1c0bec33c28105773432a6e6271c0f8e98768118))
* allow CoordinateInfo to request Feature Info in json format ([18e2a6f](https://github.com/terrestris/react-geo/commit/18e2a6f9457413a21ddedf1875c734085378a8a4))
* combine WfsSearch and WfsSearchInput to WfsSearchField ([a88b54b](https://github.com/terrestris/react-geo/commit/a88b54b17f97e7f7a7f1e987e20b927bbd4737dc))
* introduce useNominatim hook ([f4c8597](https://github.com/terrestris/react-geo/commit/f4c8597ee29a854aece656676639dc3058e8f6f1))
* pass through AutoComplete props ([698d913](https://github.com/terrestris/react-geo/commit/698d91337fb548b1feddcc9e0741d1b39b35ed9d))
* pass through on fetch success callbacks ([0b624bd](https://github.com/terrestris/react-geo/commit/0b624bd018b98bac9d292ff7dc1ea022b7884b9b))
* readd MapComponent, FloatingMapLogo and BackgroundLayerChooser ([a32aee4](https://github.com/terrestris/react-geo/commit/a32aee48673a74b4ee6c679c979bec85f554851b))
* refactor code into `useDraw` hook ([cd657fe](https://github.com/terrestris/react-geo/commit/cd657fe2d6f009dad9937227c9112c0b58e603e9))
* remove toolbar and user chip component ([3fe4ce2](https://github.com/terrestris/react-geo/commit/3fe4ce2a0e5fd99d0d9ce9525d2711df02d1bd7d))
* render urls as anchor element ([9b63cd2](https://github.com/terrestris/react-geo/commit/9b63cd2b976272d3c291e21e6988c77da742d47d))
* unify functionality of WfsField and NominatimField into SearchField ([f83539b](https://github.com/terrestris/react-geo/commit/f83539bc7c01265c0fc9a9bdba191c7b25ed8f75))
* update coordinate button to use the new result value ([a41b996](https://github.com/terrestris/react-geo/commit/a41b9968ebe0c308381217f9be6093267893ffbb))
* upgraded ol to v9 ([f2bd3d0](https://github.com/terrestris/react-geo/commit/f2bd3d0617685efe397c7bc22391b2e80822fa9d))
* use `WmsLayer` from `ol-util` instead of `react-util` ([0abde72](https://github.com/terrestris/react-geo/commit/0abde72b1355907203b9cd2ce9017d4c3709f390))
* use coordinateInfo hook ([7dddfce](https://github.com/terrestris/react-geo/commit/7dddfce96c9308da18137609617cc9ddde0a42b5))
* use useProjFromEpsgIO hook ([741851d](https://github.com/terrestris/react-geo/commit/741851da773f7a52c6caf60df9113dfc6107206c))
* use wfs hook ([189b0bb](https://github.com/terrestris/react-geo/commit/189b0bb92f13f14317b913724dad2ece3d4e6e4c))


### BREAKING CHANGES

* This removes the buttonTransparent property.
See the example on how to customize the color via the ConfigProvider.
* The input of the render function is no longer grouped by featureType
 but returns an object for each feature that contains the feature, the layer and the feature type.

If you need the grouping, you can do the following

```
import { groupBy, mapValues } from 'lodash';

<CoordinateInfo
  resultRenderer={({ features }) => {
    const grouped = groupBy(features, 'featureType');
    const groupedAndMapped = mapValues(grouped, results => results.map(r => r.feature));
    // ...
  }}
/>
```
* The `WfsField` and `NominatimField` hooks are removed.
Please check the example for `SearchField`.
* removes props map and toggleOnClick
* share common grid props among all grids
* make use of new useWfs hook in react-util

Co-authored-by: Amanda Sefu-Beierl <atsefu@gmail.com>
* refactors CoordinateReferenceSystemCombo to use useProjFromEpsgIO for CCRS fetching
* refactors CoordinateInfo as funnction compononent
* update ol-util peer dependency
* The pressed state of the ToggleButton is controlled now
* Typescript configuration
* use geolocation hook of react-util
* the AddWmsLayerEntry accepts a map prop now (required for attributions)
* These componentes are not available anymore
* Panel, Window and Titlebar components are not existing anymore
* mappify, loadify, isVisibleComponent HOCs as well as MapProvider class were removed
* Removes the deprecated DigitizeButton in favour of the DrawButton

# [24.0.0-main.11](https://github.com/terrestris/react-geo/compare/v24.0.0-main.10...v24.0.0-main.11) (2024-06-12)


### Bug Fixes

* update react-util ([536b634](https://github.com/terrestris/react-geo/commit/536b634a836660c301cddabe6c866892263050d6))

# [24.0.0-main.10](https://github.com/terrestris/react-geo/compare/v24.0.0-main.9...v24.0.0-main.10) (2024-06-11)


### Bug Fixes

* adjust some css nesting, allows for use of the table scroll property without breaking the css ([c7cc92c](https://github.com/terrestris/react-geo/commit/c7cc92cf07c6e5f46c91c6abb19d60451214aa80))

# [24.0.0-main.9](https://github.com/terrestris/react-geo/compare/v24.0.0-main.8...v24.0.0-main.9) (2024-06-10)


### Features

* update coordinate button to use the new result value ([a41b996](https://github.com/terrestris/react-geo/commit/a41b9968ebe0c308381217f9be6093267893ffbb))


### BREAKING CHANGES

* The input of the render function is no longer grouped by featureType
 but returns an object for each feature that contains the feature, the layer and the feature type.

If you need the grouping, you can do the following

```
import { groupBy, mapValues } from 'lodash';

<CoordinateInfo
  resultRenderer={({ features }) => {
    const grouped = groupBy(features, 'featureType');
    const groupedAndMapped = mapValues(grouped, results => results.map(r => r.feature));
    // ...
  }}
/>
```

# [24.0.0-main.8](https://github.com/terrestris/react-geo/compare/v24.0.0-main.7...v24.0.0-main.8) (2024-06-06)


### Bug Fixes

* use antd css variables to make button active ([fe5504a](https://github.com/terrestris/react-geo/commit/fe5504ade04e6e33fbfbf6bc6b8d5288dda76900))


### BREAKING CHANGES

* This removes the buttonTransparent property.
See the example on how to customize the color via the ConfigProvider.

# [24.0.0-main.7](https://github.com/terrestris/react-geo/compare/v24.0.0-main.6...v24.0.0-main.7) (2024-06-06)


### Bug Fixes

* make property grid tighter ([1130d6e](https://github.com/terrestris/react-geo/commit/1130d6e66923cc2c8ca4307da446f39ce9749934))

# [24.0.0-main.6](https://github.com/terrestris/react-geo/compare/v24.0.0-main.5...v24.0.0-main.6) (2024-06-04)


### Bug Fixes

* layerswitcher always shows next layer instead of current layer ([1350c97](https://github.com/terrestris/react-geo/commit/1350c97aaeeaaf7f34aa1f53a13268117328238d))

# [24.0.0-main.5](https://github.com/terrestris/react-geo/compare/v24.0.0-main.4...v24.0.0-main.5) (2024-06-03)


### Features

* unify functionality of WfsField and NominatimField into SearchField ([f83539b](https://github.com/terrestris/react-geo/commit/f83539bc7c01265c0fc9a9bdba191c7b25ed8f75))


### BREAKING CHANGES

* The `WfsField` and `NominatimField` hooks are removed.
Please check the example for `SearchField`.

# [24.0.0-main.4](https://github.com/terrestris/react-geo/compare/v24.0.0-main.3...v24.0.0-main.4) (2024-05-28)


### Bug Fixes

* **LayerTree:** make contents of title clickable ([334e8aa](https://github.com/terrestris/react-geo/commit/334e8aac5467f90adfa9f22b56804d38d242f005))

# [24.0.0-main.3](https://github.com/terrestris/react-geo/compare/v24.0.0-main.2...v24.0.0-main.3) (2024-05-27)


### Bug Fixes

* explicit imports ([40af413](https://github.com/terrestris/react-geo/commit/40af41342c1f6247f0203f9d8a825a3c67f22e2f))
* update dependencies ([30d9b90](https://github.com/terrestris/react-geo/commit/30d9b90b18d35c6d8091cc86f520b454b76de954))

# [24.0.0-main.2](https://github.com/terrestris/react-geo/compare/v24.0.0-main.1...v24.0.0-main.2) (2024-05-24)


### Bug Fixes

* add build info to readme ([#3866](https://github.com/terrestris/react-geo/issues/3866)) ([7b97b95](https://github.com/terrestris/react-geo/commit/7b97b9505623e7997c10ebe4b6f9db781755fcfc))

# [24.0.0-main.1](https://github.com/terrestris/react-geo/compare/v23.5.0...v24.0.0-main.1) (2024-05-23)


### Bug Fixes

* adds null check ([5a78b77](https://github.com/terrestris/react-geo/commit/5a78b7736881da8d4970dca1673de16c55bff938))
* adjust to breaking changes in latest version of react-util ([2711a63](https://github.com/terrestris/react-geo/commit/2711a6378c9186e9871e6e68d0b115d4b5d1284c))
* adjust to change Key type in @types/react ([261ea52](https://github.com/terrestris/react-geo/commit/261ea52354359a6543ff4e96ce0b81b929f05c7d))
* made use of olInteraction hook ([7b0732e](https://github.com/terrestris/react-geo/commit/7b0732e4cc67d5e6285727d9bc5681072b34fbe4))
* make use of dayjs, don't pass icon prop in LayerTreeNode ([c0cffa8](https://github.com/terrestris/react-geo/commit/c0cffa84ae196b22d27456fa6d97e3985e6136e4))
* make use of UseMeasureProps ([e73bfa7](https://github.com/terrestris/react-geo/commit/e73bfa7da3f01c044f907ee32171c678fb2d6678))
* readd changes that were lost in rebase ([f1c758f](https://github.com/terrestris/react-geo/commit/f1c758f0dad622c2e77f194e20f566062f952342))
* remove the DigitizeButton ([7cf8263](https://github.com/terrestris/react-geo/commit/7cf82630eddced00249ade6fbf88b3535dec8086))
* sets the transparent background to false again ([aad694f](https://github.com/terrestris/react-geo/commit/aad694ff8af64fba9683d0b3041dac69694f9c3c))
* simplify regex ([106e2c0](https://github.com/terrestris/react-geo/commit/106e2c0e0a5b91f4f6e3101dd0a06952e262f951))


### chore

* migrate to typescript v5 ([bd8812f](https://github.com/terrestris/react-geo/commit/bd8812f481c1c9dd7a3afe1e22b4f31deb73ce9f))
* refactor geolocation button ([f646ed5](https://github.com/terrestris/react-geo/commit/f646ed5ebfa05f50a7308b315a1bd455e3b11001))
* update dependencies ([2515987](https://github.com/terrestris/react-geo/commit/2515987fe0bf4d3dc73f08a82676d3c15841423a))
* update to ol 8 api ([fc1ff8c](https://github.com/terrestris/react-geo/commit/fc1ff8cb64d9d2ef0730c3ad73ea579e6fc76a1e))


### Code Refactoring

* class to function component ([3b13ce1](https://github.com/terrestris/react-geo/commit/3b13ce13285d07b86eb551461faa1ab16d73272c))
* components FeatureGrid and AgFeatureGrid to function component ([ea48bb3](https://github.com/terrestris/react-geo/commit/ea48bb38101f13b5befdfeddf9ad622849d6cd41))
* remove deprecated HOC components ([ce5bdb7](https://github.com/terrestris/react-geo/commit/ce5bdb771ee7441daa5ad6b9bdf749245b36e7b9))
* remove Panel, Window and Titlebar components ([c749faa](https://github.com/terrestris/react-geo/commit/c749faa3614a051204e7dfab47c0617729d4a08e))
* simplify the ToggleButton and ToggleGroup components ([14760f0](https://github.com/terrestris/react-geo/commit/14760f064d7f79aa03a1db942c9af19b74b95c5d))


### Features

* add visible option for WfsSearchField ([a26f844](https://github.com/terrestris/react-geo/commit/a26f84406de50e185b5b4f81eda5a255498cc92a))
* adds a flag for transparent background of ToggleButton ([ef77c9d](https://github.com/terrestris/react-geo/commit/ef77c9dcef7a260cf103c6e0af8878b12441ab42))
* adds a wfs layer and feature-info ([#3826](https://github.com/terrestris/react-geo/issues/3826)) ([38dabed](https://github.com/terrestris/react-geo/commit/38dabed4be41b0e116840ba3e0840b31fc3dc2d8))
* adds the onSuccess callback to CoordinateInfo component ([1c0bec3](https://github.com/terrestris/react-geo/commit/1c0bec33c28105773432a6e6271c0f8e98768118))
* allow CoordinateInfo to request Feature Info in json format ([18e2a6f](https://github.com/terrestris/react-geo/commit/18e2a6f9457413a21ddedf1875c734085378a8a4))
* combine WfsSearch and WfsSearchInput to WfsSearchField ([a88b54b](https://github.com/terrestris/react-geo/commit/a88b54b17f97e7f7a7f1e987e20b927bbd4737dc))
* introduce useNominatim hook ([f4c8597](https://github.com/terrestris/react-geo/commit/f4c8597ee29a854aece656676639dc3058e8f6f1))
* pass through AutoComplete props ([698d913](https://github.com/terrestris/react-geo/commit/698d91337fb548b1feddcc9e0741d1b39b35ed9d))
* pass through on fetch success callbacks ([0b624bd](https://github.com/terrestris/react-geo/commit/0b624bd018b98bac9d292ff7dc1ea022b7884b9b))
* readd MapComponent, FloatingMapLogo and BackgroundLayerChooser ([a32aee4](https://github.com/terrestris/react-geo/commit/a32aee48673a74b4ee6c679c979bec85f554851b))
* refactor code into `useDraw` hook ([cd657fe](https://github.com/terrestris/react-geo/commit/cd657fe2d6f009dad9937227c9112c0b58e603e9))
* remove toolbar and user chip component ([3fe4ce2](https://github.com/terrestris/react-geo/commit/3fe4ce2a0e5fd99d0d9ce9525d2711df02d1bd7d))
* render urls as anchor element ([9b63cd2](https://github.com/terrestris/react-geo/commit/9b63cd2b976272d3c291e21e6988c77da742d47d))
* upgraded ol to v9 ([f2bd3d0](https://github.com/terrestris/react-geo/commit/f2bd3d0617685efe397c7bc22391b2e80822fa9d))
* use `WmsLayer` from `ol-util` instead of `react-util` ([0abde72](https://github.com/terrestris/react-geo/commit/0abde72b1355907203b9cd2ce9017d4c3709f390))
* use coordinateInfo hook ([7dddfce](https://github.com/terrestris/react-geo/commit/7dddfce96c9308da18137609617cc9ddde0a42b5))
* use useProjFromEpsgIO hook ([741851d](https://github.com/terrestris/react-geo/commit/741851da773f7a52c6caf60df9113dfc6107206c))
* use wfs hook ([189b0bb](https://github.com/terrestris/react-geo/commit/189b0bb92f13f14317b913724dad2ece3d4e6e4c))


### BREAKING CHANGES

* removes props map and toggleOnClick
* share common grid props among all grids
* make use of new useWfs hook in react-util

Co-authored-by: Amanda Sefu-Beierl <atsefu@gmail.com>
* refactors CoordinateReferenceSystemCombo to use useProjFromEpsgIO for CCRS fetching
* refactors CoordinateInfo as funnction compononent
* update ol-util peer dependency
* The pressed state of the ToggleButton is controlled now
* Typescript configuration
* use geolocation hook of react-util
* the AddWmsLayerEntry accepts a map prop now (required for attributions)
* These componentes are not available anymore
* Panel, Window and Titlebar components are not existing anymore
* mappify, loadify, isVisibleComponent HOCs as well as MapProvider class were removed
* Removes the deprecated DigitizeButton in favour of the DrawButton

# [24.0.0-next.6](https://github.com/terrestris/react-geo/compare/v24.0.0-next.5...v24.0.0-next.6) (2024-05-23)


### Features

* allow CoordinateInfo to request Feature Info in json format ([18e2a6f](https://github.com/terrestris/react-geo/commit/18e2a6f9457413a21ddedf1875c734085378a8a4))

# [24.0.0-next.5](https://github.com/terrestris/react-geo/compare/v24.0.0-next.4...v24.0.0-next.5) (2024-05-16)


### Features

* render urls as anchor element ([4b1822c](https://github.com/terrestris/react-geo/commit/4b1822c717c1d929c7d0d9a4211dcdb6ac8d80f4))

# [23.5.0](https://github.com/terrestris/react-geo/compare/v23.4.1...v23.5.0) (2024-05-15)


### Features

* render urls as anchor element ([4b1822c](https://github.com/terrestris/react-geo/commit/4b1822c717c1d929c7d0d9a4211dcdb6ac8d80f4))

# [24.0.0-next.4](https://github.com/terrestris/react-geo/compare/v24.0.0-next.3...v24.0.0-next.4) (2024-05-16)


### Features

* render urls as anchor element ([9b63cd2](https://github.com/terrestris/react-geo/commit/9b63cd2b976272d3c291e21e6988c77da742d47d))

# [24.0.0-next.3](https://github.com/terrestris/react-geo/compare/v24.0.0-next.2...v24.0.0-next.3) (2024-05-16)


### Features

* add visible option for WfsSearchField ([a26f844](https://github.com/terrestris/react-geo/commit/a26f84406de50e185b5b4f81eda5a255498cc92a))
* pass through AutoComplete props ([698d913](https://github.com/terrestris/react-geo/commit/698d91337fb548b1feddcc9e0741d1b39b35ed9d))
* pass through on fetch success callbacks ([0b624bd](https://github.com/terrestris/react-geo/commit/0b624bd018b98bac9d292ff7dc1ea022b7884b9b))

# [24.0.0-next.2](https://github.com/terrestris/react-geo/compare/v24.0.0-next.1...v24.0.0-next.2) (2024-05-14)


### Features

* use `WmsLayer` from `ol-util` instead of `react-util` ([0abde72](https://github.com/terrestris/react-geo/commit/0abde72b1355907203b9cd2ce9017d4c3709f390))

# [24.0.0-next.1](https://github.com/terrestris/react-geo/compare/v23.4.1...v24.0.0-next.1) (2024-05-06)


### Bug Fixes

* adds null check ([5a78b77](https://github.com/terrestris/react-geo/commit/5a78b7736881da8d4970dca1673de16c55bff938))
* adjust to breaking changes in latest version of react-util ([2711a63](https://github.com/terrestris/react-geo/commit/2711a6378c9186e9871e6e68d0b115d4b5d1284c))
* adjust to change Key type in @types/react ([261ea52](https://github.com/terrestris/react-geo/commit/261ea52354359a6543ff4e96ce0b81b929f05c7d))
* made use of olInteraction hook ([7b0732e](https://github.com/terrestris/react-geo/commit/7b0732e4cc67d5e6285727d9bc5681072b34fbe4))
* make use of dayjs, don't pass icon prop in LayerTreeNode ([c0cffa8](https://github.com/terrestris/react-geo/commit/c0cffa84ae196b22d27456fa6d97e3985e6136e4))
* make use of UseMeasureProps ([e73bfa7](https://github.com/terrestris/react-geo/commit/e73bfa7da3f01c044f907ee32171c678fb2d6678))
* readd changes that were lost in rebase ([f1c758f](https://github.com/terrestris/react-geo/commit/f1c758f0dad622c2e77f194e20f566062f952342))
* remove the DigitizeButton ([7cf8263](https://github.com/terrestris/react-geo/commit/7cf82630eddced00249ade6fbf88b3535dec8086))
* sets the transparent background to false again ([aad694f](https://github.com/terrestris/react-geo/commit/aad694ff8af64fba9683d0b3041dac69694f9c3c))
* simplify regex ([106e2c0](https://github.com/terrestris/react-geo/commit/106e2c0e0a5b91f4f6e3101dd0a06952e262f951))


### chore

* migrate to typescript v5 ([bd8812f](https://github.com/terrestris/react-geo/commit/bd8812f481c1c9dd7a3afe1e22b4f31deb73ce9f))
* refactor geolocation button ([f646ed5](https://github.com/terrestris/react-geo/commit/f646ed5ebfa05f50a7308b315a1bd455e3b11001))
* update dependencies ([2515987](https://github.com/terrestris/react-geo/commit/2515987fe0bf4d3dc73f08a82676d3c15841423a))
* update to ol 8 api ([fc1ff8c](https://github.com/terrestris/react-geo/commit/fc1ff8cb64d9d2ef0730c3ad73ea579e6fc76a1e))


### Code Refactoring

* class to function component ([3b13ce1](https://github.com/terrestris/react-geo/commit/3b13ce13285d07b86eb551461faa1ab16d73272c))
* components FeatureGrid and AgFeatureGrid to function component ([ea48bb3](https://github.com/terrestris/react-geo/commit/ea48bb38101f13b5befdfeddf9ad622849d6cd41))
* remove deprecated HOC components ([ce5bdb7](https://github.com/terrestris/react-geo/commit/ce5bdb771ee7441daa5ad6b9bdf749245b36e7b9))
* remove Panel, Window and Titlebar components ([c749faa](https://github.com/terrestris/react-geo/commit/c749faa3614a051204e7dfab47c0617729d4a08e))
* simplify the ToggleButton and ToggleGroup components ([14760f0](https://github.com/terrestris/react-geo/commit/14760f064d7f79aa03a1db942c9af19b74b95c5d))


### Features

* adds a flag for transparent background of ToggleButton ([ef77c9d](https://github.com/terrestris/react-geo/commit/ef77c9dcef7a260cf103c6e0af8878b12441ab42))
* adds a wfs layer and feature-info ([#3826](https://github.com/terrestris/react-geo/issues/3826)) ([38dabed](https://github.com/terrestris/react-geo/commit/38dabed4be41b0e116840ba3e0840b31fc3dc2d8))
* adds the onSuccess callback to CoordinateInfo component ([1c0bec3](https://github.com/terrestris/react-geo/commit/1c0bec33c28105773432a6e6271c0f8e98768118))
* combine WfsSearch and WfsSearchInput to WfsSearchField ([a88b54b](https://github.com/terrestris/react-geo/commit/a88b54b17f97e7f7a7f1e987e20b927bbd4737dc))
* introduce useNominatim hook ([f4c8597](https://github.com/terrestris/react-geo/commit/f4c8597ee29a854aece656676639dc3058e8f6f1))
* readd MapComponent, FloatingMapLogo and BackgroundLayerChooser ([a32aee4](https://github.com/terrestris/react-geo/commit/a32aee48673a74b4ee6c679c979bec85f554851b))
* refactor code into `useDraw` hook ([cd657fe](https://github.com/terrestris/react-geo/commit/cd657fe2d6f009dad9937227c9112c0b58e603e9))
* remove toolbar and user chip component ([3fe4ce2](https://github.com/terrestris/react-geo/commit/3fe4ce2a0e5fd99d0d9ce9525d2711df02d1bd7d))
* upgraded ol to v9 ([f2bd3d0](https://github.com/terrestris/react-geo/commit/f2bd3d0617685efe397c7bc22391b2e80822fa9d))
* use coordinateInfo hook ([7dddfce](https://github.com/terrestris/react-geo/commit/7dddfce96c9308da18137609617cc9ddde0a42b5))
* use useProjFromEpsgIO hook ([741851d](https://github.com/terrestris/react-geo/commit/741851da773f7a52c6caf60df9113dfc6107206c))
* use wfs hook ([189b0bb](https://github.com/terrestris/react-geo/commit/189b0bb92f13f14317b913724dad2ece3d4e6e4c))


### BREAKING CHANGES

* removes props map and toggleOnClick
* share common grid props among all grids
* make use of new useWfs hook in react-util

Co-authored-by: Amanda Sefu-Beierl <atsefu@gmail.com>
* refactors CoordinateReferenceSystemCombo to use useProjFromEpsgIO for CCRS fetching
* refactors CoordinateInfo as funnction compononent
* update ol-util peer dependency
* The pressed state of the ToggleButton is controlled now
* Typescript configuration
* use geolocation hook of react-util
* the AddWmsLayerEntry accepts a map prop now (required for attributions)
* These componentes are not available anymore
* Panel, Window and Titlebar components are not existing anymore
* mappify, loadify, isVisibleComponent HOCs as well as MapProvider class were removed
* Removes the deprecated DigitizeButton in favour of the DrawButton

## [23.4.1](https://github.com/terrestris/react-geo/compare/v23.4.0...v23.4.1) (2024-03-25)


### Bug Fixes

* tooltip for RotationButton ([7ce3c9c](https://github.com/terrestris/react-geo/commit/7ce3c9c8cdb312e8e7ab2ce000db40a716507cc9))

# [23.4.0](https://github.com/terrestris/react-geo/compare/v23.3.0...v23.4.0) (2024-03-22)


### Bug Fixes

* remove line ([1df8a6f](https://github.com/terrestris/react-geo/commit/1df8a6f2c2d95c27d5b2f1645e2b201d0ddd04c7))
* remove unneeded imports ([c345370](https://github.com/terrestris/react-geo/commit/c34537069f321d3cfb5ee37c229ff60f1df46525))


### Features

* add RotationButton ([e46d4a5](https://github.com/terrestris/react-geo/commit/e46d4a588cd68e4e69e8556a3ae6cd718608a604))

# [23.3.0](https://github.com/terrestris/react-geo/compare/v23.2.1...v23.3.0) (2024-01-11)


### Features

* adds optional geoemtry extent shift ([ca4f31b](https://github.com/terrestris/react-geo/commit/ca4f31b346937ff8898e2780e0be7e302bbbeb9b))
* makes onClick property configurable ([62a40c4](https://github.com/terrestris/react-geo/commit/62a40c469f7816be5b8af8b261e29da24ae6636c))

## [23.2.1](https://github.com/terrestris/react-geo/compare/v23.2.0...v23.2.1) (2023-12-20)


### Bug Fixes

* allow custom onChange implementations ([f1e0df7](https://github.com/terrestris/react-geo/commit/f1e0df793575805e57d7b548c3aaca844147e2bd))

# [23.2.0](https://github.com/terrestris/react-geo/compare/v23.1.3...v23.2.0) (2023-11-29)


### Bug Fixes

* fixing number typo ([14fc3e8](https://github.com/terrestris/react-geo/commit/14fc3e8d898266a7117e0220ab8a9a287feae651))


### Features

* adds a radius property to the measure circle button ([6942024](https://github.com/terrestris/react-geo/commit/694202455a651087d9c5f9cc2ab87bf2d46ce837))
* adds readable unit based on actual distance ([72b0e63](https://github.com/terrestris/react-geo/commit/72b0e63f0ba7c6aee7ef7b336db359742e476de4))

## [23.1.3](https://github.com/terrestris/react-geo/compare/v23.1.2...v23.1.3) (2023-11-29)


### Bug Fixes

* update CoordinateInfo fetch options ([8a07f67](https://github.com/terrestris/react-geo/commit/8a07f6714f7f831c6385572a1171dd5e59dd5043))

## [23.1.2](https://github.com/terrestris/react-geo/compare/v23.1.1...v23.1.2) (2023-10-05)


### Bug Fixes

* enables layer array after no layer was selected ([#3562](https://github.com/terrestris/react-geo/issues/3562)) ([89e1b13](https://github.com/terrestris/react-geo/commit/89e1b138947a4232fee0c17737189bd4adaaec6f))

## [23.1.1](https://github.com/terrestris/react-geo/compare/v23.1.0...v23.1.1) (2023-09-29)


### Bug Fixes

* makes initalSelectedLayer work ([55b12b4](https://github.com/terrestris/react-geo/commit/55b12b4761e57ec71186475a2c741d291b14ea56))

# [23.1.0](https://github.com/terrestris/react-geo/compare/v23.0.1...v23.1.0) (2023-09-22)


### Features

* adds empty background if property is set ([#3477](https://github.com/terrestris/react-geo/issues/3477)) ([c093a2a](https://github.com/terrestris/react-geo/commit/c093a2a281124e00bf5f2b96541123ace47990fb))

## [23.0.1](https://github.com/terrestris/react-geo/compare/v23.0.0...v23.0.1) (2023-09-19)


### Bug Fixes

* keep feature id ([fb7c5c6](https://github.com/terrestris/react-geo/commit/fb7c5c679b52e7503cc795457529b3bd782f57ee))

# [23.0.0](https://github.com/terrestris/react-geo/compare/v22.4.2...v23.0.0) (2023-09-13)


### Bug Fixes

* copy correct inkmap-worker ([8f3a7cd](https://github.com/terrestris/react-geo/commit/8f3a7cda51c4116dd4a949eb3860897058697175))
* set currect node version for release pipeline as well ([1c72573](https://github.com/terrestris/react-geo/commit/1c725737498e25ea32baca4019d4ef46a63f1637))


### chore

* bump ol-util to v12 and use fixed version of inkmap ([14bc679](https://github.com/terrestris/react-geo/commit/14bc679d43dadb36ca388a1f7fe8372465b3dd5c))
* require node18 in ci pipelines as well ([27984cf](https://github.com/terrestris/react-geo/commit/27984cfd1a147b9feea779561464ba4a973deae3))


### Features

* add circle measure method ([5cbcf9d](https://github.com/terrestris/react-geo/commit/5cbcf9dab3c451156a5809fbb9fc6cb7f8d986f8))


### BREAKING CHANGES

* require node v18 in pipelines
* use node v18

## [22.4.2](https://github.com/terrestris/react-geo/compare/v22.4.1...v22.4.2) (2023-07-18)


### Bug Fixes

* manual commit to trigger release containing ol-util ([c9991dc](https://github.com/terrestris/react-geo/commit/c9991dc7ee0beb089e4d28bd095c6d16c45473d1))

## [22.4.1](https://github.com/terrestris/react-geo/compare/v22.4.0...v22.4.1) (2023-06-26)


### Bug Fixes

* pin ol, ol-util and react-styleguidist dependencies versions ([f856335](https://github.com/terrestris/react-geo/commit/f856335d3ee833c29860c16323f6020a84b03fb3))

# [22.4.0](https://github.com/terrestris/react-geo/compare/v22.3.2...v22.4.0) (2023-03-07)


### Features

* add optional icon to header ([2d37a49](https://github.com/terrestris/react-geo/commit/2d37a494e50a0a2738f4c366e36460eec3e9f12b))

## [22.3.2](https://github.com/terrestris/react-geo/compare/v22.3.1...v22.3.2) (2023-02-21)


### Bug Fixes

* adjust alias to use src folder for example loading ([88d68b4](https://github.com/terrestris/react-geo/commit/88d68b44dc34539431ea6ad3c0fca5b25185dd96))
* example import statements ([6349519](https://github.com/terrestris/react-geo/commit/634951940581a884bf1faf9965ad17fe6e0364b8))

## [22.3.1](https://github.com/terrestris/react-geo/compare/v22.3.0...v22.3.1) (2023-02-15)


### Bug Fixes

* remove direct dependency to ant-design/icons and replace all usages with fontawesome icons ([def64ee](https://github.com/terrestris/react-geo/commit/def64eee02980ee019a5d719026cc34f96fdc943))

# [22.3.0](https://github.com/terrestris/react-geo/compare/v22.2.1...v22.3.0) (2023-02-03)


### Bug Fixes

* apply suggestions from code review ([1010fa9](https://github.com/terrestris/react-geo/commit/1010fa9d952cb65580e9bd5c92c75e4a58a627b8))
* fix LayerSwitcher test ([9a4fc87](https://github.com/terrestris/react-geo/commit/9a4fc87af868731c6a5421294192c5fe4453d808))


### Features

* add Props to LayerSwitcher and refactor ([ee9abe6](https://github.com/terrestris/react-geo/commit/ee9abe6c041bf22bc3019cfaacd68c3e9d5e1151))

## [22.2.1](https://github.com/terrestris/react-geo/compare/v22.2.0...v22.2.1) (2023-01-25)


### Bug Fixes

* minor lint fixes ([e7809e1](https://github.com/terrestris/react-geo/commit/e7809e1c3509f4d8a29aa4253f3f24e8d35fbcfd))

# [22.2.0](https://github.com/terrestris/react-geo/compare/v22.1.1...v22.2.0) (2023-01-16)


### Features

* **NominatimSearch:** rewrite to FC, add debounceTime, use rtl for test ([eaf4b93](https://github.com/terrestris/react-geo/commit/eaf4b93680c7d777f4a5e33f990162b4f87bd1f7))

## [22.1.1](https://github.com/terrestris/react-geo/compare/v22.1.0...v22.1.1) (2023-01-11)


### Bug Fixes

* move [@types](https://github.com/types) to devDependencies ([a20855b](https://github.com/terrestris/react-geo/commit/a20855b141165b101a1a48abadc5ba3271a2f23f))

# [22.1.0](https://github.com/terrestris/react-geo/compare/v22.0.1...v22.1.0) (2022-12-20)


### Bug Fixes

* adjust tests ([1225a3b](https://github.com/terrestris/react-geo/commit/1225a3b9a93a1bf62dc5571369e55e167070ab88))
* revoke object URL ([00ca937](https://github.com/terrestris/react-geo/commit/00ca937c4091c7e6f4e30be3c59ac9e3609316ac))
* set legend url with available cors headers ([f18d9e1](https://github.com/terrestris/react-geo/commit/f18d9e18a1ca24bb25ecc0bc7159ed996995c6f7))


### Features

* allow to pass custom headers and add a loading mask ([ad94811](https://github.com/terrestris/react-geo/commit/ad948115389e1665c88f17b0806c5358c3507351))

## [22.0.1](https://github.com/terrestris/react-geo/compare/v22.0.0...v22.0.1) (2022-12-19)


### Bug Fixes

* mark featurecollection from unknown layers with index ([9731fc2](https://github.com/terrestris/react-geo/commit/9731fc211d245cbc60ad66a1b5a1aa288bc3514a))

# [22.0.0](https://github.com/terrestris/react-geo/compare/v21.0.1...v22.0.0) (2022-12-08)


### Features

* **print:** remove the print layout from code, use template functions ([43cfa51](https://github.com/terrestris/react-geo/commit/43cfa51925e30bbefde44a21bf4a37f9fa78763b))


### BREAKING CHANGES

* **print:** Printing PDFs now require a template

When printing a PDF, a template needs to be provided. See the PrintButton example for details.

## [21.0.1](https://github.com/terrestris/react-geo/compare/v21.0.0...v21.0.1) (2022-12-06)


### Bug Fixes

* remove unnecessary children prop ([89d51e6](https://github.com/terrestris/react-geo/commit/89d51e63ac687d8c169680595ba900caee48e7b6))

# [21.0.0](https://github.com/terrestris/react-geo/compare/v20.1.1...v21.0.0) (2022-12-05)


### Bug Fixes

* adapt deprecated tooltip tip formatter config ([6cdcef4](https://github.com/terrestris/react-geo/commit/6cdcef4ebdaa865baf9c03952a5f610610ac8f5e))
* fix deprecated menu config for dropdown ([8d293fd](https://github.com/terrestris/react-geo/commit/8d293fd65719222bc46959f7a091d5abd6774149))
* replace deprecated property visible by open ([511e371](https://github.com/terrestris/react-geo/commit/511e3711f47e45ba22d595a88393c31d9cc42d75))


### BREAKING CHANGES

* Dropdown doesn't need a full antd Menu component any more.
Instead of this, an object of type MenuProps is expected now.

## [20.1.1](https://github.com/terrestris/react-geo/compare/v20.1.0...v20.1.1) (2022-12-02)


### Bug Fixes

* make toggle on click configurable ([#3003](https://github.com/terrestris/react-geo/issues/3003)) ([df16322](https://github.com/terrestris/react-geo/commit/df16322d15ebcc77294bf3ec4b765fd29ff7d05f))

# [20.1.0](https://github.com/terrestris/react-geo/compare/v20.0.0...v20.1.0) (2022-12-01)


### Features

* toggle layer visibility when clicking on the name ([#3002](https://github.com/terrestris/react-geo/issues/3002)) ([568d0d2](https://github.com/terrestris/react-geo/commit/568d0d2fb35401004d640fa715420be288103b4e))

# [20.0.0](https://github.com/terrestris/react-geo/compare/v19.8.2...v20.0.0) (2022-11-16)


### Bug Fixes

* adaptaions after ol-util upgrade to v10.x ([4440810](https://github.com/terrestris/react-geo/commit/444081028805dbcfa4ef1cb97e8a5223c975656b))
* fix typing of togglebutton clone ([67dd940](https://github.com/terrestris/react-geo/commit/67dd940aa0163cd8c6a6675218c27af9922a1dc5))
* fix typings after ol7 upgrade ([2e04fca](https://github.com/terrestris/react-geo/commit/2e04fcaf648cbab1dd5b5f25dd246f74d21fcde5))
* get rid of unnecessary quotes ([2500acb](https://github.com/terrestris/react-geo/commit/2500acb9550369f2a6a5576bebe227c0737fc30f))


### chore

* bump ol to v7.x ([a9022eb](https://github.com/terrestris/react-geo/commit/a9022eb9717a66fc278b425f136fd9ee0fe8eaa5))


### BREAKING CHANGES

* set peer dependency for openlayers package to v7.1

## [19.8.2](https://github.com/terrestris/react-geo/compare/v19.8.1...v19.8.2) (2022-11-03)


### Bug Fixes

* catch some potential np ([70e7a53](https://github.com/terrestris/react-geo/commit/70e7a539219ddbb925bf165758a4c90bed20983d))

## [19.8.1](https://github.com/terrestris/react-geo/compare/v19.8.0...v19.8.1) (2022-11-02)


### Bug Fixes

* adjusting imports due to major release of ag-grid ([56b58f9](https://github.com/terrestris/react-geo/commit/56b58f91839bf2eb956962b95c0ee24e779f5b71))

# [19.8.0](https://github.com/terrestris/react-geo/compare/v19.7.0...v19.8.0) (2022-10-24)


### Features

* adds layer style properties to search results panel ([761fe4a](https://github.com/terrestris/react-geo/commit/761fe4a0eaf774cca6854f8500a20825b0b2e260))
* uses openlayers style as property type ([49e07a2](https://github.com/terrestris/react-geo/commit/49e07a292fad2afa94df6ec126800a24a52c490a))

# [19.7.0](https://github.com/terrestris/react-geo/compare/v19.6.0...v19.7.0) (2022-10-24)


### Features

* enhance the accesibility of some SVG icons ([b373bb3](https://github.com/terrestris/react-geo/commit/b373bb36265ffdb61a6d6de18f1b6cc04f3ccba0))

# [19.6.0](https://github.com/terrestris/react-geo/compare/v19.5.0...v19.6.0) (2022-10-12)


### Features

* add support for a custom list item prefix ([0c847c8](https://github.com/terrestris/react-geo/commit/0c847c84fd9420a3acc35d5ed914919fd740184e))

# [19.5.0](https://github.com/terrestris/react-geo/compare/v19.4.2...v19.5.0) (2022-10-06)


### Features

* add props onSuccess and onError ([c98382a](https://github.com/terrestris/react-geo/commit/c98382a50ed3403b12b3294dd70e20ce519b7a9c))

## [19.4.2](https://github.com/terrestris/react-geo/compare/v19.4.1...v19.4.2) (2022-09-28)


### Bug Fixes

* replaces the instanceof check ([6cd0eab](https://github.com/terrestris/react-geo/commit/6cd0eab3910fed15f3d6443a04e770c7c64e3407))

## [19.4.1](https://github.com/terrestris/react-geo/compare/v19.4.0...v19.4.1) (2022-09-26)


### Bug Fixes

* adds missing await ([c00c775](https://github.com/terrestris/react-geo/commit/c00c7756c6d755758e8344d7bc13c0e9a661f64d))

# [19.4.0](https://github.com/terrestris/react-geo/compare/v19.3.0...v19.4.0) (2022-08-16)


### Bug Fixes

*  address notes from codereview ([b845268](https://github.com/terrestris/react-geo/commit/b845268fd0c4a6ff029e8185cd496998ecd0473f))


### Features

* introduce BackgroundLayerChooser ([6256a68](https://github.com/terrestris/react-geo/commit/6256a68b5d40087a4b14cbd611ca32394890010b))

# [19.3.0](https://github.com/terrestris/react-geo/compare/v19.2.4...v19.3.0) (2022-08-15)


### Bug Fixes

* set default value for maxFeatures ([d2812f0](https://github.com/terrestris/react-geo/commit/d2812f0e88651ba889d1e05cc2a0c91a30e9820d))


### Features

* allow reading of GML32 responses ([c4cdca1](https://github.com/terrestris/react-geo/commit/c4cdca15949220e286ae64e43d5b86532691c8a9))

## [19.2.4](https://github.com/terrestris/react-geo/compare/v19.2.3...v19.2.4) (2022-08-10)


### Bug Fixes

* properly reference lint config file for vs code editor ([454365d](https://github.com/terrestris/react-geo/commit/454365d04f96935eec1b5f88220c50fe479b112f))

## [19.2.3](https://github.com/terrestris/react-geo/compare/v19.2.2...v19.2.3) (2022-08-10)


### Bug Fixes

* add missing whitespace ([867168f](https://github.com/terrestris/react-geo/commit/867168f680139092c2fdb0562225fd4e21a951ad))
* consider map size while fit geometry extent ([376d3ad](https://github.com/terrestris/react-geo/commit/376d3adc81a34708ffc1867a616f50a202ba0a74))

## [19.2.2](https://github.com/terrestris/react-geo/compare/v19.2.1...v19.2.2) (2022-08-09)


### Bug Fixes

* update ol-util to 7.3.0 ([5a04baa](https://github.com/terrestris/react-geo/commit/5a04baa2c484e98c5ce8e363f9e4da28f2b0e6fa))

## [19.2.1](https://github.com/terrestris/react-geo/compare/v19.2.0...v19.2.1) (2022-08-09)


### Bug Fixes

* activate northArrow for demo ([19a8405](https://github.com/terrestris/react-geo/commit/19a8405184bc8d97a698d515a83144501c277ac4))
* minor scalebar print fixes ([84afa36](https://github.com/terrestris/react-geo/commit/84afa364735517e8ee743302fb9ac56cddd410fb))

# [19.2.0](https://github.com/terrestris/react-geo/compare/v19.1.2...v19.2.0) (2022-08-02)


### Features

* allow additional fetch opts for GFI per query layer ([955c6f9](https://github.com/terrestris/react-geo/commit/955c6f94db33f3a61a6aea399dd1040316c2a8cf))

## [19.1.2](https://github.com/terrestris/react-geo/compare/v19.1.1...v19.1.2) (2022-08-01)


### Bug Fixes

* prepare update to ol 6.15 ([78dcd79](https://github.com/terrestris/react-geo/commit/78dcd7984b3b77e074ea6b269a5bdbff97806049))

## [19.1.1](https://github.com/terrestris/react-geo/compare/v19.1.0...v19.1.1) (2022-07-26)


### Bug Fixes

* use broader peer dependency ([dff0b99](https://github.com/terrestris/react-geo/commit/dff0b9932fd3753434a8b26f155c80c9d2595dff))

# [19.1.0](https://github.com/terrestris/react-geo/compare/v19.0.0...v19.1.0) (2022-07-22)


### Features

* add new property actionsCreator to SearchResultsPanel ([#2696](https://github.com/terrestris/react-geo/issues/2696)) ([4a31f77](https://github.com/terrestris/react-geo/commit/4a31f7741747857e42015d83f231cf50bddd63aa))

# [19.0.0](https://github.com/terrestris/react-geo/compare/v18.0.0...v19.0.0) (2022-07-20)


### Features

* allow dynamic theming via css variables ([be7db08](https://github.com/terrestris/react-geo/commit/be7db084ccb12ca968b35767f3b52e43c62d453f))


### BREAKING CHANGES

* applications need to import the antd/dist/antd.variable.min.css

# [18.0.0](https://github.com/terrestris/react-geo/compare/v17.5.0...v18.0.0) (2022-07-20)


### Features

* allow ordering searchResult categories ([b237b1b](https://github.com/terrestris/react-geo/commit/b237b1b55b52356124f125b02ed57c2adba9cf68))


### BREAKING CHANGES

* The property `features` was replaced with
`searchResults` and its type was changed to `Category[]`.

# [17.5.0](https://github.com/terrestris/react-geo/compare/v17.4.1...v17.5.0) (2022-07-19)


### Features

* add antd passThroughProps to SearchResultsPanel ([52065d2](https://github.com/terrestris/react-geo/commit/52065d242d244326025ed95cd0a35fd65307c75f))

## [17.4.1](https://github.com/terrestris/react-geo/compare/v17.4.0...v17.4.1) (2022-07-01)


### Bug Fixes

* fix lodash import ([#2654](https://github.com/terrestris/react-geo/issues/2654)) ([a47121a](https://github.com/terrestris/react-geo/commit/a47121a1b81e05f4d07011b4516f19bf8255b692))

# [17.4.0](https://github.com/terrestris/react-geo/compare/v17.3.1...v17.4.0) (2022-07-01)


### Features

* add grouped search results panel ([#2652](https://github.com/terrestris/react-geo/issues/2652)) ([9f0c9e2](https://github.com/terrestris/react-geo/commit/9f0c9e2560dabee1c1111ddbd8a02419f59e5710))

## [17.3.1](https://github.com/terrestris/react-geo/compare/v17.3.0...v17.3.1) (2022-06-27)


### Bug Fixes

* linting issues ([5c89b0f](https://github.com/terrestris/react-geo/commit/5c89b0fc485d311376ba51917663e296694cb3ed))
* simplify base64 image creation ([08b46ed](https://github.com/terrestris/react-geo/commit/08b46ed859cc7314bdb0ecf098121e9fbdc7ab80))
* use actual image size when printing legends ([072f04d](https://github.com/terrestris/react-geo/commit/072f04dc31d3ed147b2a91420d32308385ccfaf1))

# [17.3.0](https://github.com/terrestris/react-geo/compare/v17.2.2...v17.3.0) (2022-06-24)


### Bug Fixes

* temporarily disable layer type ([8e1c121](https://github.com/terrestris/react-geo/commit/8e1c121bdcfe0fcaa54dc534eb20e21d290488f3))
* types ([d8ee43a](https://github.com/terrestris/react-geo/commit/d8ee43ad4d3a839e781fc401922d5620c6b031f7))


### Features

* pdf print ([579704a](https://github.com/terrestris/react-geo/commit/579704aec10ca934d4c6cad066fc27b3d751b329))

## [17.2.2](https://github.com/terrestris/react-geo/compare/v17.2.1...v17.2.2) (2022-06-23)


### Bug Fixes

* configure buffer polyfill ([b77b9ff](https://github.com/terrestris/react-geo/commit/b77b9fff26fd419717e2f689fa0c741d29e0c675))
* make inkmap settings configurable ([0c91d62](https://github.com/terrestris/react-geo/commit/0c91d626e9a754a80eba7ce65575a8776a36bd51))

## [17.2.1](https://github.com/terrestris/react-geo/compare/v17.2.0...v17.2.1) (2022-06-23)


### Bug Fixes

* move husky installation from postinstall to prepare phase ([9e16925](https://github.com/terrestris/react-geo/commit/9e169257ca50be3438c154d1961547017eb767d7))

# [17.2.0](https://github.com/terrestris/react-geo/compare/v17.1.3...v17.2.0) (2022-06-22)


### Bug Fixes

* fix package lock file ([67d7568](https://github.com/terrestris/react-geo/commit/67d7568c02740b65719b0ea523388501db903f8e))
* fix tests ([8f732f2](https://github.com/terrestris/react-geo/commit/8f732f29f9d9a214509adad8f8cdddcb8006ba00))
* fix typecheck issues ([7826da2](https://github.com/terrestris/react-geo/commit/7826da230eeef945e97950336bb0db6407663506))
* linting ([4cdbcb3](https://github.com/terrestris/react-geo/commit/4cdbcb35ab1d5bd7ea9598c888677369c7c9e329))
* move inkmap mapping to ol-util ([35ff746](https://github.com/terrestris/react-geo/commit/35ff746e8e67a61cd1e403a36b88b75641630b87))
* restore initial version of printbutton test ([a6dc0c0](https://github.com/terrestris/react-geo/commit/a6dc0c0d1948d6828e955c955e37e1f57617f20b))


### Features

* add progressbar to print example ([111e874](https://github.com/terrestris/react-geo/commit/111e874c100454229e221ff10058c16d44d47bc1))
* add serviceWorker webpack config ([dd125fe](https://github.com/terrestris/react-geo/commit/dd125fe3a082783c89463e9cc6f812dd40d64b41))
* introduce client-side print with inkmap ([ceeb03b](https://github.com/terrestris/react-geo/commit/ceeb03bc95ea861e7ffb09edcbe055aef7ea0a7a))
* parse ol layers ([fa0ec7f](https://github.com/terrestris/react-geo/commit/fa0ec7f9e4de7b3a556ad036aab150fa658fe748))
* parse vectorlayers and styles, cleanup ([b163de0](https://github.com/terrestris/react-geo/commit/b163de002348bc4e640860acaeaf31fbf727f868))
* parse WMTS layers ([1691644](https://github.com/terrestris/react-geo/commit/1691644f5d4d92e240eb0bf4c3f3c99cff171285))

## [17.1.3](https://github.com/terrestris/react-geo/compare/v17.1.2...v17.1.3) (2022-05-23)


### Bug Fixes

* Clone features propertly before passing them to the result renderer ([9964d46](https://github.com/terrestris/react-geo/commit/9964d460c2679680932bdfbc76679a1f844cfe58))
* Fix and export component types ([089e347](https://github.com/terrestris/react-geo/commit/089e3470409d03bc313ee070acdfa57f3ba68433))
* Recalculate dataSource and columnDefs on changed props ([9aa1a23](https://github.com/terrestris/react-geo/commit/9aa1a23b1f7c4ec5a1a61f703d556c149a6b8026))

## [17.1.2](https://github.com/terrestris/react-geo/compare/v17.1.1...v17.1.2) (2022-05-18)


### Bug Fixes

* fix check in ZoomButton ([#2565](https://github.com/terrestris/react-geo/issues/2565)) ([652b357](https://github.com/terrestris/react-geo/commit/652b3570aef55247c33137bef0e9d7046d9b1ff1))

## [17.1.1](https://github.com/terrestris/react-geo/compare/v17.1.0...v17.1.1) (2022-05-05)


### Bug Fixes

* properly set map instance reference on layer clone ([af5809f](https://github.com/terrestris/react-geo/commit/af5809fdc0595ca9441dbb7e3bfca82bde43d6ad))

# [17.1.0](https://github.com/terrestris/react-geo/compare/v17.0.0...v17.1.0) (2022-04-19)


### Bug Fixes

* Use correct URL for OWS WFS ([a45d021](https://github.com/terrestris/react-geo/commit/a45d0214f9c2ae1e02e6316116ac3530aebdd472))


### Features

* Add support for localized nominatim responses ([87b2c3e](https://github.com/terrestris/react-geo/commit/87b2c3ec2a623a4f0f48b507276544717ccd663e))

# [17.0.0](https://github.com/terrestris/react-geo/compare/v16.4.3...v17.0.0) (2022-04-19)


### Bug Fixes

* Explicetely import required button icon components ([62bc33a](https://github.com/terrestris/react-geo/commit/62bc33a0eb88181777d2da140692bee51be03fb7))
* Fix broken example ([c0d2de5](https://github.com/terrestris/react-geo/commit/c0d2de53d1bae398c18e1888834d537ddc9d9687))
* Fix for NPE ([c26792c](https://github.com/terrestris/react-geo/commit/c26792cf909e1a484dc7353deedc7fd7e1b8611d))
* Set prop via set() ([8adf094](https://github.com/terrestris/react-geo/commit/8adf094f4452ede515bde9491d9c54b6ed5a4e3b))


### chore

* Update to latest aggrid and remove private method access ([6100800](https://github.com/terrestris/react-geo/commit/6100800b44297be31132486c2be8b54652061e76))


### BREAKING CHANGES

* The prop `rowClassName` has been removed
* The props iconName and pressedIconName have been removed from the Simple- and ToggleButton. The icon and pressedIcon props require an icon component now.

## [16.4.3](https://github.com/terrestris/react-geo/compare/v16.4.2...v16.4.3) (2022-04-11)


### Bug Fixes

* re-add event propagation to DigitizeButton and ModifyButton ([27646c9](https://github.com/terrestris/react-geo/commit/27646c90532cf4ddb4a6c7b8ff05eac68cbba98f))

## [16.4.2](https://github.com/terrestris/react-geo/compare/v16.4.1...v16.4.2) (2022-04-11)


### Bug Fixes

* **DigitizeButton:** do not propagate event to translate if modifying ([3748af7](https://github.com/terrestris/react-geo/commit/3748af744d98485dae4145203d0c5bcf63bc1e81))
* **ModifyButton:** do not propagate event to translate if modifying ([2144457](https://github.com/terrestris/react-geo/commit/2144457d09d832066cfd2b9de0314c24f007259d))

## [16.4.1](https://github.com/terrestris/react-geo/compare/v16.4.0...v16.4.1) (2022-04-11)


### Bug Fixes

* **MeasureButton:** make property `geodesic` a boolean with default value `true` ([cd85dea](https://github.com/terrestris/react-geo/commit/cd85deaff2f9344a023d17f4a3eb69973e82198a))

# [16.4.0](https://github.com/terrestris/react-geo/compare/v16.3.0...v16.4.0) (2022-04-05)


### Bug Fixes

* adapt test for the case if all passed layers are invisible ([e55917b](https://github.com/terrestris/react-geo/commit/e55917b1a9df7a1c46526480210d4b93ed2a029c))


### Features

* enable even more strict options ([a72f3e7](https://github.com/terrestris/react-geo/commit/a72f3e71a90661ad32df501a132bb04733ce7c17))

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
