'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TestUtil = undefined;

require('../../enzyme.conf.js');

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
var TestUtil = exports.TestUtil = function TestUtil() {
  _classCallCheck(this, TestUtil);
};

TestUtil.mapDivId = 'map';
TestUtil.mapDivHeight = 256;
TestUtil.mapDivWidth = 256;

TestUtil.mountComponent = function (Component, props, context) {
  var wrapper = (0, _enzyme.mount)(_react2.default.createElement(Component, props), { context: context });
  return wrapper;
};

TestUtil.mountMapDiv = function () {
  var div = document.createElement('div');
  var style = div.style;

  style.position = 'absolute';
  style.left = '-1000px';
  style.top = '-1000px';
  style.width = TestUtil.mapDivWidth + 'px';
  style.height = TestUtil.mapDivHeight + 'px';
  div.id = TestUtil.mapDivId;

  document.body.appendChild(div);

  return div;
};

TestUtil.unmountMapDiv = function () {
  var div = document.querySelector('div#' + TestUtil.mapDivId);
  if (!div) {
    return;
  }
  var parent = div.parentNode;
  if (parent) {
    parent.removeChild(div);
  }
  div = null;
};

TestUtil.createMap = function (mapOpts) {
  var source = new _vector2.default();
  var layer = new _vector4.default({ source: source });
  var targetDiv = TestUtil.mountMapDiv();
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

TestUtil.removeMap = function (map) {
  if (map instanceof _map2.default) {
    map.dispose();
  }
  TestUtil.unmountMapDiv();
};

TestUtil.simulatePointerEvent = function (map, type, x, y, opt_shiftKey, dragging) {
  var viewport = map.getViewport();
  // Calculated in case body has top < 0 (test runner with small window).
  var position = viewport.getBoundingClientRect();
  var shiftKey = opt_shiftKey !== undefined ? opt_shiftKey : false;
  var event = new _pointerevent2.default(type, {
    clientX: position.left + x + TestUtil.mapDivWidth / 2,
    clientY: position.top + y + TestUtil.mapDivHeight / 2,
    shiftKey: shiftKey
  });
  map.handleMapBrowserEvent(new _mapbrowserpointerevent2.default(type, map, event, dragging));
};

TestUtil.createVectorLayer = function (properties) {
  var source = new _vector2.default();
  var layer = new _vector4.default({ source: source });

  layer.setProperties(properties);

  return layer;
};

exports.default = TestUtil;