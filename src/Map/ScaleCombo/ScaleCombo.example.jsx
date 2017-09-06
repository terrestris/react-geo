import React from 'react';
import { render } from 'react-dom';

import MapUtils from '../../Util/MapUtil'; //@react-geo@
import ScaleCombo from './ScaleCombo.jsx'; //@react-geo@

let scaleCombo;

// Trigger setState of scale combo on map 'moveend' event to refresh zoomLevel
// Normally this is handled by Actions / Reducers
__EXAMPLE_MAP__.on('moveend', function(evt) {
  let zoom = evt.target.getView().getZoom();
  let roundZoom = Math.round(zoom);
  if (!roundZoom) {
    roundZoom = 0;
  }
  scaleCombo.setState({zoomLevel: roundZoom});
});

/**
 * Handle scale select event:
 *
 * In this example: Calculate resolution for scale and update map view
 **/
var onZoomLevelSelect = (selectedScale) => {
  let mv = __EXAMPLE_MAP__.getView();
  let calculatedResolution = MapUtils.getResolutionForScale(selectedScale, mv.getProjection().getUnits());
  mv.setResolution(calculatedResolution);
};


render(
  <ScaleCombo onZoomLevelSelect={onZoomLevelSelect} map={__EXAMPLE_MAP__} style={{'margin': '5px', 'width': '300px'}} ref={ (instance) => {scaleCombo = instance;}} />,
  document.getElementById('exampleContainerInMap')
);
