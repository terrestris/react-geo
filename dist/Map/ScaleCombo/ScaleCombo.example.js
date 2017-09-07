'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _MapUtil = require('../../Util/MapUtil');

var _MapUtil2 = _interopRequireDefault(_MapUtil);

var _ScaleCombo = require('./ScaleCombo.js');

var _ScaleCombo2 = _interopRequireDefault(_ScaleCombo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//@react-geo@

var scaleCombo = void 0;

// Trigger setState of scale combo on map 'moveend' event to refresh zoomLevel
// Normally this is handled by Actions / Reducers
//@react-geo@
__EXAMPLE_MAP__.on('moveend', function (evt) {
  var zoom = evt.target.getView().getZoom();
  var roundZoom = Math.round(zoom);
  if (!roundZoom) {
    roundZoom = 0;
  }
  scaleCombo.setState({ zoomLevel: roundZoom });
});

/**
 * Handle scale select event:
 *
 * In this example: Calculate resolution for scale and update map view
 **/
var onZoomLevelSelect = function onZoomLevelSelect(selectedScale) {
  var mv = __EXAMPLE_MAP__.getView();
  var calculatedResolution = _MapUtil2.default.getResolutionForScale(selectedScale, mv.getProjection().getUnits());
  mv.setResolution(calculatedResolution);
};

(0, _reactDom.render)(_react2.default.createElement(_ScaleCombo2.default, { onZoomLevelSelect: onZoomLevelSelect, map: __EXAMPLE_MAP__, style: { 'margin': '5px', 'width': '300px' }, ref: function ref(instance) {
    scaleCombo = instance;
  } }), document.getElementById('exampleContainerInMap'));