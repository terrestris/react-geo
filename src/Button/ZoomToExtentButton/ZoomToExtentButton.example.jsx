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
    zoom: 10
  })
});

//
// ***************************** SETUP END *************************************
//

const extent1 = [588948, 6584461, 1053685, 6829060];
const extent2 = [608948, 6484461, 1253685, 6629060];
const extent3 = [628948, 6384461, 1453685, 6429060];

render(
  <div>
    <div id="map" style={{
      height: '400px'
    }} />

    <div className="example-block">
      <span>Zoom to extent button:</span>
      <ZoomToExtentButton map={map} extent={extent1}>
         Zoom to extent (standard, animated)
      </ZoomToExtentButton>
      &nbsp;
      <ZoomToExtentButton map={map} extent={extent2} fitOptions={{
        duration: 0
      }}
      >
        Zoom to extent (no animation)
      </ZoomToExtentButton>
      &nbsp;
      <ZoomToExtentButton map={map} extent={extent3} fitOptions={{
        duration: 3000
      }}
      >
        Zoom to extent (slow animation)
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
