import React from 'react';
import { render } from 'react-dom';
import OlSourceOsm from 'ol/source/osm';
import OlLayerTile from 'ol/layer/tile';
import OlView from 'ol/view';
import OlMap from 'ol/map';

import {
  MapComponent,
  MapProvider,
  mappify,
  onDropAware
} from '../../index.js';

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

render(
  <MapProvider map={mapPromise}>
    <Map style={{
      height: '512px'
    }} />
  </MapProvider>,
  document.getElementById('exampleContainer')
);
