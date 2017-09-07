'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _user = require('../../UserChip/user.png');

var _user2 = _interopRequireDefault(_user);

var _FloatingMapLogo = require('./FloatingMapLogo.js');

var _FloatingMapLogo2 = _interopRequireDefault(_FloatingMapLogo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//@react-geo@

(0, _reactDom.render)(_react2.default.createElement(_FloatingMapLogo2.default, { imageSrc: _user2.default }), document.getElementById('exampleContainerInMap'));