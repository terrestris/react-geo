This example shows the usage of the DropTargetMap HOC by use of the onDropAware
function. The wrapped map component needs to be mappified in order to access
the map.

```jsx
import React from 'react';

import OlMap from 'ol/Map';
import OlView from 'ol/View';
import OlLayerTile from 'ol/layer/Tile';
import OlSourceOSM from 'ol/source/OSM';

import onDropAware from '@terrestris/react-geo/HigherOrderComponent/DropTargetMap/DropTargetMap';
import MapComponent from '@terrestris/react-geo/Map/MapComponent/MapComponent';
import MapProvider from '@terrestris/react-geo/Provider/MapProvider/MapProvider';
import { mappify } from '@terrestris/react-geo/HigherOrderComponent/MappifiedComponent/MappifiedComponent';

/**
 * Create the OlMap (you could do some asynchronus stuff here).
 *
 * @return {Promise} Promise that resolves an OlMap.
 */
const mapPromise = new Promise((resolve) => {
  const layer = new OlLayerTile({
    source: new OlSourceOSM()
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
