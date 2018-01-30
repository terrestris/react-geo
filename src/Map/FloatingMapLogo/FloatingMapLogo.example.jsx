import React from 'react';
import { render } from 'react-dom';
import OlSourceOsm from 'ol/source/osm';
import OlLayerTile from 'ol/layer/tile';
import OlView from 'ol/view';
import OlMap from 'ol/map';

import logo from '../../UserChip/user.png';
import { FloatingMapLogo } from '../../index.js';

const map = new OlMap({
  view: new OlView({
    center: [801045, 6577113],
    zoom: 9
  }),
  layers: [
    new OlLayerTile({
      source: new OlSourceOsm()
    })
  ]
});

render(
  <div
    id='map'
    style={{
      position: 'relative',
      height: '200px'
    }}
  >
    <FloatingMapLogo
      imageSrc={logo}
    />
  </div>,
  document.getElementById('exampleContainer'),
  () => {
    map.setTarget('map');
  }
);
