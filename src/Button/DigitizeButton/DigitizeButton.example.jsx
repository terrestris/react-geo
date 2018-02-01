import React from 'react';
import { render } from 'react-dom';

import OlMap from 'ol/map';
import OlView from 'ol/view';
import OlLayerTile from 'ol/layer/tile';
import OlSourceOsm from 'ol/source/osm';
import olProj from 'ol/proj';

import {
  DigitizeButton,
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
      <span>Select a digitize type:</span>
      <ToggleGroup
        orientation="horizontal">

        <DigitizeButton
          name="drawPoint"
          map={map}
          drawType="Point"
        >
        Draw point
        </DigitizeButton>

        <DigitizeButton
          name="drawLine"
          map={map}
          drawType="LineString"
        >
        Draw line
        </DigitizeButton>

        <DigitizeButton
          name="drawPolygon"
          map={map}
          drawType="Polygon"
        >
        Draw polygon
        </DigitizeButton>

        <DigitizeButton
          name="drawCircle"
          map={map}
          drawType="Circle"
        >
        Draw circle
        </DigitizeButton>

        <DigitizeButton
          name="drawRectangle"
          map={map}
          drawType="Rectangle"
        >
        Draw rectangle
        </DigitizeButton>

        <DigitizeButton
          name="drawText"
          map={map}
          drawType="Text"
        >
        Draw text label
        </DigitizeButton>

        <DigitizeButton
          name="selectAndModify"
          map={map}
          editType="Edit"
        >
        Select and modify features
        </DigitizeButton>

        <DigitizeButton
          name="copyFeature"
          map={map}
          editType="Copy"
        >
        Copy features
        </DigitizeButton>

        <DigitizeButton
          name="deleteFeature"
          map={map}
          editType="Delete"
        >
        Delete features
        </DigitizeButton>

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
