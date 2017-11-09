import React from 'react';
import { render } from 'react-dom';

import OlMap from 'ol/map';
import OlView from 'ol/view';
import OlLayerGroup from 'ol/layer/group';
import OlLayerTile from 'ol/layer/tile';
import OlSourceTileJson from 'ol/source/tilejson';
import OlSourceOsm from 'ol/source/osm';
import olProj from 'ol/proj';

import { LayerTree } from '../index.js';


//
// ***************************** SETUP *****************************************
//
const layerGroup = new OlLayerGroup({
  name: 'Layergroup',
  layers: [
    new OlLayerTile({
      name: 'Food insecurity layer',
      minResolution: 200,
      maxResolution: 2000,
      source: new OlSourceTileJson({
        url: 'https://api.tiles.mapbox.com/v3/mapbox.20110804-hoa-foodinsecurity-3month.json?secure',
        crossOrigin: 'anonymous'
      })
    }),
    new OlLayerTile({
      name: 'World borders layer',
      minResolution: 2000,
      maxResolution: 20000,
      source: new OlSourceTileJson({
        url: 'https://api.tiles.mapbox.com/v3/mapbox.world-borders-light.json?secure',
        crossOrigin: 'anonymous'
      })
    })
  ]
});

const map = new OlMap({
  layers: [
    new OlLayerTile({
      name: 'OSM',
      source: new OlSourceOsm()
    }),
    layerGroup
  ],
  view: new OlView({
    center: olProj.fromLonLat([37.40570, 8.81566]),
    zoom: 6
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

    <span>{'Please note that the layers have resolution restrictions, please zoom in and out to see how the trees react to this.'}</span>
    <div className="example-block">
      <span>{'Configured with \'map.getLayerGroup()\':'}</span>

      <LayerTree
        layerGroup={map.getLayerGroup()}
        map={map}
      />

    </div>

    <div className="example-block">
      <span>{'A LayerTree configured with concrete layerGroup:'}</span>

      <LayerTree
        layerGroup={layerGroup}
        map={map}
      />
    </div>

    <div className="example-block">
      <span>{'A LayerTree with a filterFunction:'}</span>

      <LayerTree
        layerGroup={map.getLayerGroup()}
        map={map}
        filterFunction={(layer) => layer.get('name') != 'OSM'}
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
