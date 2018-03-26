import React from 'react';
import { render } from 'react-dom';

import OlMap from 'ol/map';
import OlView from 'ol/view';
import OlLayerTile from 'ol/layer/tile';
import OlSourceOsm from 'ol/source/osm';
import olProj from 'ol/proj';

import {
  ZoomButton
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

render(
  <div>
    <div id="map" style={{
      height: '400px'
    }} />

    <div className="example-block">
      <span>Zoom buttons:</span>
      <br />
      <ZoomButton map={map}>
         Zoom in (standard, animated)
      </ZoomButton>
      &nbsp;
      <ZoomButton map={map} delta={0.5}>
         Zoom in (0.5 zoomlevels, animated)
      </ZoomButton>
      &nbsp;
      <ZoomButton map={map} animate={false}>
         Zoom in (no animation)
      </ZoomButton>
      &nbsp;
      <ZoomButton map={map} animateOptions={{duration: 1500}}>
         Zoom in (1.5 seconds animation)
      </ZoomButton>
      <br />
      <br />
      <ZoomButton map={map} delta={-1}>
         Zoom out (standard, animated)
      </ZoomButton>
      &nbsp;
      <ZoomButton map={map} delta={-2}>
         Zoom out (2 zoomlevels, animated)
      </ZoomButton>
      &nbsp;
      <ZoomButton map={map} delta={-1} animate={false}>
         Zoom out (no animation)
      </ZoomButton>
      &nbsp;
      <ZoomButton map={map} delta={-1} animateOptions={{duration: 1500}}>
         Zoom out (1.5 seconds animation)
      </ZoomButton>
    </div>

  </div>,

  // Target
  document.getElementById('exampleContainer'),

  // Callback
  () => {
    map.setTarget('map');
  }
);
