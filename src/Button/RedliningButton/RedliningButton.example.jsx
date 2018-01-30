import React from 'react';
import { render } from 'react-dom';

import OlMap from 'ol/map';
import OlView from 'ol/view';
import OlLayerTile from 'ol/layer/tile';
import OlSourceOsm from 'ol/source/osm';
import olProj from 'ol/proj';

import {
  RedliningButton,
  ToggleGroup
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
      height: '400px'
    }} />

    <div className="example-block">
      <span>Select a redlining type:</span>
      <ToggleGroup
        orientation="horizontal">

        <RedliningButton
          name="drawPoint"
          map={map}
          drawType="Point"
        >
        Draw point
        </RedliningButton>

        <RedliningButton
          name="drawLine"
          map={map}
          drawType="LineString"
        >
        Draw line
        </RedliningButton>

        <RedliningButton
          name="drawPolygon"
          map={map}
          drawType="Polygon"
        >
        Draw polygon
        </RedliningButton>

        <RedliningButton
          name="drawCircle"
          map={map}
          drawType="Circle"
        >
        Draw circle
        </RedliningButton>

        <RedliningButton
          name="drawRectangle"
          map={map}
          drawType="Rectangle"
        >
        Draw rectangle
        </RedliningButton>

        <RedliningButton
          name="drawText"
          map={map}
          drawType="Text"
        >
        Draw text label
        </RedliningButton>

        <RedliningButton
          name="selectAndModify"
          map={map}
          editType="Edit"
        >
        Select and modify features
        </RedliningButton>

        <RedliningButton
          name="copyFeature"
          map={map}
          editType="Copy"
        >
        Copy features
        </RedliningButton>

        <RedliningButton
          name="deleteFeature"
          map={map}
          editType="Delete"
        >
        Delete features
        </RedliningButton>

      </ToggleGroup>

    </div>

  </div>,

  // Target
  document.getElementById('exampleContainer'),

  // Callback
  () => {
    map.setTarget('map');
  }
);
