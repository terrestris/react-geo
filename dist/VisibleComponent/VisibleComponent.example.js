'use strict';

var _css = require('antd/lib/button/style/css');

var _button = require('antd/lib/button');

var _button2 = _interopRequireDefault(_button);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _VisibleComponent = require('./VisibleComponent.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//@react-geo@

// Enhance (any) Component by wrapping it using isVisibleComponent().
var VisibleButton = (0, _VisibleComponent.isVisibleComponent)(_button2.default);

// The activeModules is a whitelist of components (identified by it's names) to
// render.
var activeModules = [{
  name: 'visibleButtonName'
}, {
  name: 'anotherVisibleButtonName'
}];

(0, _reactDom.render)(_react2.default.createElement(
  'div',
  null,
  _react2.default.createElement(VisibleButton, {
    name: 'visibleButtonName',
    activeModules: activeModules,
    type: 'primary',
    shape: 'circle',
    icon: 'search'
  }),
  _react2.default.createElement(VisibleButton, {
    name: 'notVisibleButtonName',
    activeModules: activeModules,
    type: 'primary',
    shape: 'circle',
    icon: 'search'
  }),
  _react2.default.createElement(VisibleButton, {
    name: 'anotherVisibleButtonName',
    activeModules: activeModules,
    type: 'primary',
    shape: 'circle',
    icon: 'poweroff'
  })
), document.getElementById('exampleContainer'));