import React from 'react';
import { render } from 'react-dom';

import OlMap from 'ol/map';
import OlView from 'ol/view';
import OlLayerTile from 'ol/layer/tile';
import OlSourceOsm from 'ol/source/osm';
import olProj from 'ol/proj';

import LayerTransparencySlider from './LayerTransparencySlider.jsx'; //@react-geo@

//
// ***************************** SETUP *****************************************
//
const layer = new OlLayerTile({
  name: 'OSM',
  source: new OlSourceOsm()
});
const map = new OlMap({
  layers: [
    layer
  ],
  view: new OlView({
    center: olProj.fromLonLat([37.40570, 8.81566]),
    zoom: 4
  })
});

//
// ***************************** SETUP END *************************************
//

render(
  <div>
    <div id="map" style={{
      width: '400px',
      height: '400px',
      position: 'relative'
    }} />

    <div className="example-block">
      <span>{'Move the slider to change the layer\'s opacity:'}</span>

      <LayerTransparencySlider
        layer={layer}
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
