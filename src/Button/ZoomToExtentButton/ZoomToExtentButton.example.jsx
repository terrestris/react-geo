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

const extent = [588947.9928934451,6584461.475575979,1053685.1248673166,6829059.966088544];

render(
  <div>
    <div id="map" style={{
      height: '400px'
    }} />

    <div className="example-block">
      <span>Zoom to extent button:</span>
      <ZoomToExtentButton map={map} extent={extent}>
         Zoom to extent (standard, animated)
      </ZoomToExtentButton>
      &nbsp;
      <ZoomToExtentButton map={map} extent={extent} fitOptions={{
        duration: 0
      }}
      >
        Zoom to extent (no animation)
      </ZoomToExtentButton>
      &nbsp;
      <ZoomToExtentButton map={map} extent={extent} fitOptions={{
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
