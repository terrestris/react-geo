This example shows the usage of the DropTargetMap HOC by use of the onDropAware
function. The wrapped map component needs to be mappified in order to access
the map.

```jsx
const React = require('react');
const OlSourceOsm = require('ol/source/OSM').default;
const OlLayerTile = require('ol/layer/Tile').default;
const OlView = require('ol/View').default;
const OlMap = require('ol/Map').default;

const {
  MapComponent,
  MapProvider,
  mappify,
  onDropAware
} = require('../../index.js');

/**
 * Create the OlMap (you could do some asynchronus stuff here).
 *
 * @return {Promise} Promise that resolves an OlMap.
 */
const mapPromise = new Promise((resolve) => {
  const layer = new OlLayerTile({
    source: new OlSourceOsm()
  });

  const map = new OlMap({
    view: new OlView({
      center: [
        135.1691495,
        34.6565482
      ],
      projection: 'EPSG:4326',
      zoom: 16,
    }),
    layers: [layer]
  });

  resolve(map);
});

const Map = mappify(onDropAware(MapComponent));

<MapProvider map={mapPromise}>
  <Map style={{
    height: '512px'
  }} />
</MapProvider>
