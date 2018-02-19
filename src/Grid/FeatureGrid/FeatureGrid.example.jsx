import React from 'react';
import { render } from 'react-dom';
import OlMap from 'ol/map';
import OlView from 'ol/view';
import OlLayerTile from 'ol/layer/tile';
import OlSourceOsm from 'ol/source/osm';
import OlProj from 'ol/proj';
import OlFormatGeoJson from 'ol/format/geojson';

import federalStates from '../../../assets/federal-states-ger.json';

import {
  FeatureGrid
} from '../../index.js';

const map = new OlMap({
  layers: [
    new OlLayerTile({
      name: 'OSM',
      source: new OlSourceOsm()
    })
  ],
  view: new OlView({
    center: OlProj.fromLonLat([37.40570, 8.81566]),
    zoom: 4
  })
});

const format = new OlFormatGeoJson();
const features = format.readFeatures(federalStates);

// eslint-disable-next-line require-jsdoc
const nameColumnRenderer = val => <a href={`https://en.wikipedia.org/wiki/${val}`}>{val}</a>;

render(
  <div>
    <div
      className="example-block"
    >
      <FeatureGrid
        features={features}
        map={map}
        zoomToExtent={true}
        selectable={true}
        attributeBlacklist={['gml_id', 'USE', 'RS', 'RS_ALT']}
        columnDefs={{
          'GEN': {
            title: 'Name',
            render: nameColumnRenderer,
            sorter: (a, b) => {
              const nameA = a.GEN.toUpperCase();
              const nameB = b.GEN.toUpperCase();
              if (nameA < nameB) {
                return -1;
              }
              if (nameA > nameB) {
                return 1;
              }

              return 0;
            },
            defaultSortOrder: 'ascend'
          },
          'SHAPE_LENG': {
            title: 'Length',
            render: val => Math.round(val)
          },
          'SHAPE_AREA': {
            title: 'Area',
            render: val => Math.round(val)
          }
        }}
      />
    </div>
    <div
      id="map"
      style={{
        height: '400px'
      }}
    />
  </div>,

  // Target
  document.getElementById('exampleContainer'),

  // Callback
  () => {
    map.setTarget('map');
  }
);
