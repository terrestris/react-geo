import React from 'react';
import { render } from 'react-dom';
import { NominatimSearch } from '../../index.js';

import OlMap from 'ol/map';
import OlView from 'ol/view';
import OlLayerTile from 'ol/layer/tile';
import OlSourceOsm from 'ol/source/osm';
import olProj from 'ol/proj';

//
// ***************************** SETUP *****************************************
//
const map = new OlMap({
  layers: [
    new OlLayerTile({
      name: 'OSM',
      source: new OlSourceOsm()
    })
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
      right: '0px',
      position: 'absolute'
    }} />

    <div className="example-block">
      <span>Just a NominatimSearch:</span>

      {/* A NominatimSearch without any configuration*/}
      <NominatimSearch map={map} />

    </div>
  </div>,

  // Target
  document.getElementById('exampleContainer'),

  // Callback
  () => {
    map.setTarget('map');
  }
);
