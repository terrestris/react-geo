import React from 'react';
import { render } from 'react-dom';

import OlMap from 'ol/Map';
import OlView from 'ol/View';
import OlLayerTile from 'ol/layer/Tile';
import OlSourceOsm from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';

import {
  message
} from 'antd';

import {
  DigitizeButton,
  GeometryUtil,
  MapUtil,
  SimpleButton,
  ToggleGroup
} from '../../index.js';


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
    center: fromLonLat([37.40570, 8.81566]),
    zoom: 4
  })
});

//
// ***************************** SETUP END *************************************
//

/**
 *
 */
const clearDrawFeatures = () => {
  const drawLayer = MapUtil.getLayerByName(map, 'drawLayer');
  drawLayer.getSource().clear();
};

/**
 *
 */
const clearOperationFeatures = () => {
  window.setTimeout(() => {
    const utilLayer = MapUtil.getLayerByName(map, 'utilLayer');
    utilLayer.getSource().clear();
  }, 10);
};

render(
  <div>
    <div id="map" style={{
      height: '400px'
    }} />

    <div className="example-block">
      <span>Drawing:</span>
      <ToggleGroup
        orientation="horizontal">
        <DigitizeButton
          name="drawPolygon"
          digitizeLayerName="drawLayer"
          map={map}
          drawType="Polygon"
          onDrawStart={clearDrawFeatures}
        >
        Draw polygon
        </DigitizeButton>
        <DigitizeButton
          name="drawLine"
          map={map}
          digitizeLayerName="utilLayer"
          drawType="LineString"
          onDrawEnd={(evt) => {
            const drawLayer = MapUtil.getLayerByName(map, 'drawLayer');
            const source = drawLayer.getSource();
            const features = drawLayer.getSource().getFeatures();
            if (features.length !== 1) {
              message.warn('Example only supports one feature!!');
            }
            const line = evt.feature;
            const splitFeatures = GeometryUtil.splitByLine(features[0], line);
            clearDrawFeatures();
            clearOperationFeatures();
            source.addFeatures(splitFeatures);
          }}
        >
          Split by Line
        </DigitizeButton>
        <DigitizeButton
          name="drawLine"
          map={map}
          digitizeLayerName="utilLayer"
          drawType="Polygon"
          onDrawEnd={(evt) => {
            const drawLayer = MapUtil.getLayerByName(map, 'drawLayer');
            const source = drawLayer.getSource();
            const features = source.getFeatures();
            if (features.length !== 1) {
              message.warn('Example only supports one feature!!');
            }
            const polygon = evt.feature;
            const unionFeature = GeometryUtil.union([features[0], polygon]);
            clearDrawFeatures();
            clearOperationFeatures();
            source.addFeature(unionFeature);
          }}
        >
          Union
        </DigitizeButton>
        <DigitizeButton
          name="drawLine"
          map={map}
          digitizeLayerName="utilLayer"
          drawType="Polygon"
          onDrawEnd={(evt) => {
            const drawLayer = MapUtil.getLayerByName(map, 'drawLayer');
            const source = drawLayer.getSource();
            const features = source.getFeatures();
            if (features.length !== 1) {
              message.warn('Example only supports one feature!!');
            }
            const polygon = evt.feature;
            const intersectionFeature = GeometryUtil.intersection(features[0], polygon);
            clearDrawFeatures();
            clearOperationFeatures();
            source.addFeature(intersectionFeature);
          }}
        >
          Intersection
        </DigitizeButton>
        <DigitizeButton
          name="drawLine"
          map={map}
          digitizeLayerName="utilLayer"
          drawType="Polygon"
          onDrawEnd={(evt) => {
            const drawLayer = MapUtil.getLayerByName(map, 'drawLayer');
            const source = drawLayer.getSource();
            const features = source.getFeatures();
            if (features.length !== 1) {
              message.warn('Example only supports one feature!!');
            }
            const polygon = evt.feature;
            const differenceFeature = GeometryUtil.difference(features[0], polygon);
            clearDrawFeatures();
            clearOperationFeatures();
            source.addFeature(differenceFeature);
          }}
        >
          Difference
        </DigitizeButton>
      </ToggleGroup>
    </div>
    <div className="example-block">
      <SimpleButton
        onClick={() => {
          const drawLayer = MapUtil.getLayerByName(map, 'drawLayer');
          const source = drawLayer.getSource();
          const features = source.getFeatures();
          if (features.length !== 1) {
            message.warn('Example only supports one feature!!');
          }
          const bufferedFeature = GeometryUtil.addBuffer(features[0], 100000);
          clearDrawFeatures();
          clearOperationFeatures();
          source.addFeature(bufferedFeature);
        }}
      >
        Add Buffer (100 km)
      </SimpleButton>
    </div>
  </div>,

  // Target
  document.getElementById('exampleContainer'),

  // Callback
  () => {
    map.setTarget('map');
  }
);
