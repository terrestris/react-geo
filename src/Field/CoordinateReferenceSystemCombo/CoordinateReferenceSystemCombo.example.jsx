import React from 'react';
import { render } from 'react-dom';
import { CoordinateReferenceSystemCombo } from '../../index.js';

import proj4 from 'proj4';
import OlMap from 'ol/map';
import OlView from 'ol/view';
import OlLayerTile from 'ol/layer/tile';
import OlSourceOsm from 'ol/source/osm';
import OlProjection from 'ol/proj';
import OlExtent from 'ol/extent';

//
// ***************************** SETUP *****************************************
//
const defaultView = new OlView({
  center: OlProjection.fromLonLat([37.40570, 8.81566]),
  zoom: 4
});
const map = new OlMap({
  layers: [
    new OlLayerTile({
      name: 'OSM',
      source: new OlSourceOsm()
    })
  ],
  view: defaultView
});

OlProjection.setProj4(proj4);

/**
 * set map projection and perform client-side raster reprojection from
 * OSM (EPSG:3857) to arbitrary projection given in crsObj
 *
 * original code of setProjection can be found here:
 * https://openlayers.org/en/latest/examples/reprojection-by-code.html
 */
const setProjection = (crsObj) => {
  const {
    code, value, proj4def, bbox
  } = crsObj;

  if (code === null || value === null || proj4def === null || bbox === null) {
    map.setView(defaultView);
    return;
  }

  var newProjCode = 'EPSG:' + code;
  proj4.defs(newProjCode, proj4def);
  var newProj = OlProjection.get(newProjCode);
  var fromLonLat = OlProjection.getTransform('EPSG:4326', newProj);

  // very approximate calculation of projection extent
  var extent = OlExtent.applyTransform(
    [bbox[1], bbox[2], bbox[3], bbox[0]], fromLonLat);
  newProj.setExtent(extent);
  var newView = new OlView({
    projection: newProj
  });
  map.setView(newView);
  newView.fit(extent);
};


const predefinedCrsDefinitions = [{
  code: '25832',
  value: 'ETRS89 / UTM zone 32N'
}, {
  code: '31466',
  value: 'DHDN / 3-degree Gauss-Kruger zone 2'
}, {
  code: '31467',
  value: 'DHDN / 3-degree Gauss-Kruger zone 3'
}, {
  code: '4326',
  value: 'WGS 84'
}];

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
      <span>A <code>CoordinateReferenceSystemCombo</code> with predefined definitions of four CRS:</span>
      <br />

      {/* A CoordinateReferenceSystemCombo having predefinedCrsDefinitions*/}
      <CoordinateReferenceSystemCombo predefinedCrsDefinitions={predefinedCrsDefinitions} />
    </div>

    <div className="example-block">
      <span>A <code>CoordinateReferenceSystemCombo</code> with autocomplete mode where CRS are fetched from <a href="http://epsg.io/">epsg.io/</a>.
        If a CRS is selected (prop <code>onSelect</code>), the projection is used to perform client-side raster reprojection of OSM layer in map.
      </span>
      <br />

      <CoordinateReferenceSystemCombo onSelect={setProjection} />
    </div>
  </div>,

  // Target element
  document.getElementById('exampleContainer'),

  // Callback
  () => {
    map.setTarget('map');
  }
);
