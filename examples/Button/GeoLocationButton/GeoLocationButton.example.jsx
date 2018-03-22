import React from 'react';
import { render } from 'react-dom';

import OlMap from 'ol/map';
import OlView from 'ol/view';
import OlLayerTile from 'ol/layer/tile';
import OlSourceOsm from 'ol/source/osm';
import olProj from 'ol/proj';

import {
  GeoLocationButton,
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
      <ToggleGroup>
        <GeoLocationButton
          onGeolocationChange={() => undefined}
          map={map}
          showMarker={true}
          follow={true}
        >
        Track location
        </GeoLocationButton>
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
