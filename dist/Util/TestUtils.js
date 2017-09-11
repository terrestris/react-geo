'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TestUtils = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _enzyme = require('enzyme');

var _view = require('ol/view');

var _view2 = _interopRequireDefault(_view);

var _map = require('ol/map');

var _map2 = _interopRequireDefault(_map);

var _vector = require('ol/source/vector');

var _vector2 = _interopRequireDefault(_vector);

var _vector3 = require('ol/layer/vector');

var _vector4 = _interopRequireDefault(_vector3);

var _pointerevent = require('ol/pointer/pointerevent');

var _pointerevent2 = _interopRequireDefault(_pointerevent);

var _mapbrowserpointerevent = require('ol/mapbrowserpointerevent');

var _mapbrowserpointerevent2 = _interopRequireDefault(_mapbrowserpointerevent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * A set of some useful static helper methods.
 *
 * @class
 */
var TestUtils = exports.TestUtils = function TestUtils() {
  _classCallCheck(this, TestUtils);
};

TestUtils.mapDivId = 'map';
TestUtils.mapDivHeight = 256;
TestUtils.mapDivWidth = 256;

TestUtils.mountComponent = function (Component, props, context) {
  var wrapper = (0, _enzyme.mount)(_react2.default.createElement(Component, props), { context: context });
  return wrapper;
};

TestUtils.mountMapDiv = function () {
  var div = document.createElement('div');
  var style = div.style;

  style.position = 'absolute';
  style.left = '-1000px';
  style.top = '-1000px';
  style.width = TestUtils.mapDivWidth + 'px';
  style.height = TestUtils.mapDivHeight + 'px';
  div.id = TestUtils.mapDivId;

  document.body.appendChild(div);

  return div;
};

TestUtils.unmountMapDiv = function () {
  var div = document.querySelector('div#' + TestUtils.mapDivId);
  if (!div) {
    return;
  }
  var parent = div.parentNode;
  if (parent) {
    parent.removeChild(div);
  }
  div = null;
};

TestUtils.createMap = function (mapOpts) {
  var source = new _vector2.default();
  var layer = new _vector4.default({ source: source });
  var targetDiv = TestUtils.mountMapDiv();
  var defaultMapOpts = {
    target: targetDiv,
    layers: [layer],
    view: new _view2.default({
      center: [829729, 6708850],
      resolution: 1,
      resolutions: mapOpts ? mapOpts.resolutions : undefined
    })
  };

  Object.assign(defaultMapOpts, mapOpts);

  var map = new _map2.default(defaultMapOpts);

  map.renderSync();

  return map;
};

TestUtils.removeMap = function (map) {
  if (map instanceof _map2.default) {
    map.dispose();
  }
  TestUtils.unmountMapDiv();
};

TestUtils.simulatePointerEvent = function (map, type, x, y, opt_shiftKey, dragging) {
  var viewport = map.getViewport();
  // Calculated in case body has top < 0 (test runner with small window).
  var position = viewport.getBoundingClientRect();
  var shiftKey = opt_shiftKey !== undefined ? opt_shiftKey : false;
  var event = new _pointerevent2.default(type, {
    clientX: position.left + x + TestUtils.mapDivWidth / 2,
    clientY: position.top + y + TestUtils.mapDivHeight / 2,
    shiftKey: shiftKey
  });
  map.handleMapBrowserEvent(new _mapbrowserpointerevent2.default(type, map, event, dragging));
};

TestUtils.createVectorLayer = function (properties) {
  var source = new _vector2.default();
  var layer = new _vector4.default({ source: source });

  layer.setProperties(properties);

  return layer;
};

exports.default = TestUtils;