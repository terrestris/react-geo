'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _ToggleGroup = require('./ToggleGroup.js');

var _ToggleGroup2 = _interopRequireDefault(_ToggleGroup);

var _ToggleButton = require('../ToggleButton/ToggleButton.js');

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
      'Just a ToggleGroup:'
    ),
    _react2.default.createElement(
      _ToggleGroup2.default,
      {
        allowDeselect: true,
        selectedName: 'one'
      },
      _react2.default.createElement(_ToggleButton2.default, {
        name: 'one',
        icon: 'frown-o',
        pressedIcon: 'smile-o'
      }),
      _react2.default.createElement(_ToggleButton2.default, {
        name: 'two',
        icon: 'smile-o',
        pressedIcon: 'frown-o'
      })
    )
  )
), document.getElementById('exampleContainer')); //@react-geo@