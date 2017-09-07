'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _SimpleButton = require('./SimpleButton.js');

var _SimpleButton2 = _interopRequireDefault(_SimpleButton);

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
      'Just a SimpleButton:'
    ),
    _react2.default.createElement(_SimpleButton2.default, null)
  ),
  _react2.default.createElement(
    'div',
    { className: 'example-block' },
    _react2.default.createElement(
      'span',
      null,
      'Tooltip:'
    ),
    _react2.default.createElement(_SimpleButton2.default, {
      tooltip: 'bottom tooltip',
      tooltipPlacement: 'bottom'
    })
  ),
  _react2.default.createElement(
    'div',
    { className: 'example-block' },
    _react2.default.createElement(
      'span',
      null,
      'Icon:'
    ),
    _react2.default.createElement(_SimpleButton2.default, {
      icon: 'bullhorn'
    })
  )
), document.getElementById('exampleContainer'));