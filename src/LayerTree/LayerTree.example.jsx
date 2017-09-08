import React from 'react';
import { render } from 'react-dom';

import OlMap from 'ol/map';
import OlView from 'ol/view';
import OlGroupLayer from 'ol/layer/group';
import OlTileLayer from 'ol/layer/tile';
import OlTileJsonSource from 'ol/source/tilejson';
import OlOsmSource from 'ol/source/osm';
import olProj from 'ol/proj';

import LayerTree from './LayerTree.jsx'; //@react-geo@


//
// ***************************** SETUP *****************************************
//
const layerGroup = new OlGroupLayer({
  name: 'Layergroup',
  layers: [
    new OlTileLayer({
      name: 'Food insecurity layer',
      source: new OlTileJsonSource({
        url: 'https://api.tiles.mapbox.com/v3/mapbox.20110804-hoa-foodinsecurity-3month.json?secure',
        crossOrigin: 'anonymous'
      })
    }),
    new OlTileLayer({
      name: 'World borders layer',
      source: new OlTileJsonSource({
        url: 'https://api.tiles.mapbox.com/v3/mapbox.world-borders-light.json?secure',
        crossOrigin: 'anonymous'
      })
    })
  ]
});

const map = new OlMap({
  layers: [
    new OlTileLayer({
      name: 'OSM',
      source: new OlOsmSource()
    }),
    layerGroup
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
      <span>{'Configured with \'map.getLayerGroup()\':'}</span>

      <LayerTree
        layerGroup={map.getLayerGroup()}
        map={map}
      />

    </div>

    <div className="example-block">
      <span>{'A LayerTree configured with concrete layerGroup:'}:</span>

      <LayerTree
        layerGroup={layerGroup}
        map={map}
      />

    </div>

  </div>,

  // Target
  document.getElementById('exampleContainer'),

  // Callback
  () => {
    map.setTarget('map');
  }
);
