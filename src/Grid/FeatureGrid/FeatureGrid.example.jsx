import React from 'react';
import { render } from 'react-dom';

import OlFeature from 'ol/feature';
import OlGeomPoint from 'ol/geom/point';

import {
  FeatureGrid
} from '../../index.js';

//
// ***************************** SETUP *****************************************
//
const feature = new OlFeature({
  geometry: new OlGeomPoint([19.09, 1.09]),
});

const attributeObject = {
  foo: 'bar',
  foo2: 'bar2',
  foo3: 'bar3',
  foo9: 'bar9',
  name: 'Point'
};

feature.setProperties(attributeObject);
feature.setId(1909);
//
// ***************************** SETUP END *************************************
//

render(
  <div className="example-block">
    <span>FeatureGrid:</span>
    <FeatureGrid
      feature={feature}
    />
  </div>,
  document.getElementById('exampleContainer')
);
