'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _ToggleButton = require('./ToggleButton.js');

var _ToggleButton2 = _interopRequireDefault(_ToggleButton);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//@react-geo@

(0, _reactDom.render)(_react2.default.createElement(
  'div',
  null,
  _react2.default.createElement(
    'div',
    { className: 'example-block' },
    _react2.default.createElement(
      'span',
      null,
      'Just a ToggleButton:'
    ),
    _react2.default.createElement(_ToggleButton2.default, null)
  ),
  _react2.default.createElement(
    'div',
    { className: 'example-block' },
    _react2.default.createElement(
      'span',
      null,
      'Initialy pressed ToggleButton:'
    ),
    _react2.default.createElement(_ToggleButton2.default, {
      pressed: true
    })
  ),
  _react2.default.createElement(
    'div',
    { className: 'example-block' },
    _react2.default.createElement(
      'span',
      null,
      'pressedIcon:'
    ),
    _react2.default.createElement(_ToggleButton2.default, {
      icon: 'frown-o',
      pressedIcon: 'smile-o'
    })
  )
), document.getElementById('exampleContainer'));