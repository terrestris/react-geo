import React from 'react';
import { render } from 'react-dom';

import OlMap from 'ol/map';
import OlView from 'ol/view';
import OlLayerTile from 'ol/layer/tile';
import OlSourceOsm from 'ol/source/osm';
import olProj from 'ol/proj';

import {
  MeasureButton
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
    zoom: 4
  })
});

//
// ***************************** SETUP END *************************************
//

render(
  <div>
    <div id="map" style={{
      width: '800px',
      height: '400px'
    }} />

    <div className="example-block">
      <span>Measure type:</span>
      <MeasureButton
        map={map}
        measureType="line"
      >
        Distance
      </MeasureButton>

      <MeasureButton
        pressed={true}
        map={map}
        measureType="line"
        showMeasureInfoOnClickedPoints
      >
        Distance with step labels
      </MeasureButton>

      <MeasureButton
        map={map}
        measureType="line"
        multipleDrawing
      >
        Distance with multiple drawing
      </MeasureButton>

      <MeasureButton
        map={map}
        measureType="polygon"
      >
        Area
      </MeasureButton>

      <MeasureButton
        map={map}
        measureType="angle"
      >
        Angle
      </MeasureButton>

    </div>

  </div>,

  // Target
  document.getElementById('exampleContainer'),

  // Callback
  () => {
    map.setTarget('map');
  }
);
