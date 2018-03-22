import React from 'react';
import { render } from 'react-dom';

import OlMap from 'ol/map';
import OlView from 'ol/view';
import OlLayerTile from 'ol/layer/tile';
import OlSourceOsm from 'ol/source/osm';
import olProj from 'ol/proj';

import {
  ZoomToExtentButton
} from '../../index.js';

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
    zoom: 19
  })
});

//
// ***************************** SETUP END *************************************
//

render(
  <div>
    <div id="map" style={{
      height: '400px'
    }} />

    <div className="example-block">
      <span>Zoom to extent button:</span>
      <ZoomToExtentButton map={map} extent={
        [588947.9928934451,6584461.475575979,1053685.1248673166,6829059.966088544]
      }>
         Zoom to extent
      </ZoomToExtentButton>
    </div>

  </div>,

  // Target
  document.getElementById('exampleContainer'),

  // Callback
  () => {
    map.setTarget('map');
  }
);
