import React from 'react';
import { render } from 'react-dom';

import OlMap from 'ol/map';
import OlView from 'ol/view';
import OlLayerTile from 'ol/layer/tile';
import OlSourceTileWMS from 'ol/source/tilewms';
import olProj from 'ol/proj';

import { Legend } from '../index.js';


//
// ***************************** SETUP *****************************************
//

const background = new OlLayerTile({
  name: 'OSM-WMS',
  source: new OlSourceTileWMS({
    url: 'https://ows.terrestris.de/osm-gray/service',
    params: {'LAYERS': 'OSM-WMS', 'TILED': true},
    serverType: 'geoserver'
  })
});

const usa = new OlLayerTile({
  name: 'States (USA)',
  source: new OlSourceTileWMS({
    url: 'https://ahocevar.com/geoserver/wms',
    params: {'LAYERS': 'usa:states', 'TILED': true},
    serverType: 'geoserver'
  })
});

const places =  new OlLayerTile({
  name: 'Places',
  legendUrl: 'https://www.koeln.de/files/images/Karnevalstrikot_Spieler_270.jpg',
  source: new OlSourceTileWMS({
    url: 'https://ahocevar.com/geoserver/wms',
    params: {'LAYERS': 'ne:ne_10m_populated_places', 'TILED': true, 'TRANSPARENT': 'true'},
    serverType: 'geoserver'
  })
});

const map = new OlMap({
  layers: [
    background,
    usa,
    places
  ],
  view: new OlView({
    center: olProj.fromLonLat([-98.583333, 39.833333]),
    zoom: 4
  })
});

const extraParams = {
  HEIGHT: 10,
  WIDTH: 10
};
//
// ***************************** SETUP END *************************************
//

render(
  <div>
    <div id="map" style={{
      height: '200px'
    }} />

    <div className="example-block">
      <span>{`Layer ${background.get('name')}:`}</span>
      <Legend layer={background} />
    </div>

    <div className="example-block">
      <span>{`Layer ${usa.get('name')} with "extraParams":`}</span>
      <Legend layer={usa} extraParams={extraParams} />
    </div>

    <div className="example-block">
      <span>{`Layer ${places.get('name')} with custom "legendUrl":`}</span>
      <Legend layer={places} />
    </div>
  </div>,

  // Target
  document.getElementById('exampleContainer'),

  // Callback
  () => {
    map.setTarget('map');
  }
);
