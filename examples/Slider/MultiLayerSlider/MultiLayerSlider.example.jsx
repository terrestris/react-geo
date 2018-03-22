import React from 'react';
import { render } from 'react-dom';
import OlSourceTileWMS from 'ol/source/tilewms';
import OlLayerTile from 'ol/layer/tile';
import OlView from 'ol/view';
import OlMap from 'ol/map';

import {
  MultiLayerSlider
} from '../../index.js';

//
// ***************************** SETUP *****************************************
//
const layer1 = new OlLayerTile({
  name: 'Land/Water',
  source: new OlSourceTileWMS({
    url: 'https://geoserver.mundialis.de/geoserver/wms',
    params: {'LAYERS': '1_8A1104', 'TILED': true},
    serverType: 'geoserver'
  })
});
const layer2 = new OlLayerTile({
  name: 'True Color Composite',
  source: new OlSourceTileWMS({
    url: 'https://geoserver.mundialis.de/geoserver/wms',
    params: {'LAYERS': '1_040302', 'TILED': true},
    serverType: 'geoserver'
  })
});
const layer3 = new OlLayerTile({
  name: 'Color Infrared (vegetation)',
  source: new OlSourceTileWMS({
    url: 'https://geoserver.mundialis.de/geoserver/wms',
    params: {'LAYERS': '1_080403', 'TILED': true},
    serverType: 'geoserver'
  })
});
const layer4 = new OlLayerTile({
  name: 'Atmospheric Penetration',
  source: new OlSourceTileWMS({
    url: 'https://geoserver.mundialis.de/geoserver/wms',
    params: {'LAYERS': '1_12118A', 'TILED': true},
    serverType: 'geoserver'
  })
});
const layer5 = new OlLayerTile({
  name: 'Vegetation',
  source: new OlSourceTileWMS({
    url: 'https://geoserver.mundialis.de/geoserver/wms',
    params: {'LAYERS': '1_118A04', 'TILED': true},
    serverType: 'geoserver'
  })
});
const map = new OlMap({
  layers: [
    layer1,
    layer2,
    layer3,
    layer4,
    layer5
  ],
  view: new OlView({
    center: [4100247.903296841, -456383.49866892234],
    zoom: 13
  })
});

//
// ***************************** SETUP END *************************************
//

render(
  <div>
    <div id="map" style={{height: '400px'}}></div>

    <div className="example-block">
      <span>{'Move the slider to change the layer\'s opacity:'}</span>

      <MultiLayerSlider
        layers={[layer1, layer2, layer3, layer4, layer5]}
      />

    </div>

  </div>,

  // Target
  document.getElementById('exampleContainer'),

  // Callback
  () => {
    map.setTarget('map');
  }
);
