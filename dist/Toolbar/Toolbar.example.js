'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _SimpleButton = require('../Button/SimpleButton/SimpleButton.js');

var _SimpleButton2 = _interopRequireDefault(_SimpleButton);

var _Toolbar = require('./Toolbar.js');

var _Toolbar2 = _interopRequireDefault(_Toolbar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//@react-geo@

(0, _reactDom.render)(_react2.default.createElement(
  'div',
  null,
  _react2.default.createElement(
    _Toolbar2.default,
    null,
    _react2.default.createElement(_SimpleButton2.default, { type: 'primary', shape: 'circle', icon: 'search' }),
    _react2.default.createElement(_SimpleButton2.default, { type: 'primary', shape: 'circle', icon: 'search' }),
    _react2.default.createElement(_SimpleButton2.default, { type: 'primary', shape: 'circle', icon: 'search' })
  ),
  _react2.default.createElement('hr', {
    style: {
      margin: '1em'
    }
  }),
  _react2.default.createElement(
    _Toolbar2.default,
    { alignment: 'vertical', style: {
        position: 'unset'
      } },
    _react2.default.createElement(_SimpleButton2.default, { type: 'primary', shape: 'circle', icon: 'info' }),
    _react2.default.createElement(_SimpleButton2.default, { type: 'primary', shape: 'circle', icon: 'info' }),
    _react2.default.createElement(_SimpleButton2.default, { type: 'primary', shape: 'circle', icon: 'info' })
  )
), document.getElementById('exampleContainer')); //@react-geo@