'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _user = require('./user.png');

var _user2 = _interopRequireDefault(_user);

var _UserChip = require('./UserChip.js');

var _UserChip2 = _interopRequireDefault(_UserChip);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//@react-geo@

(0, _reactDom.render)(_react2.default.createElement(
  'div',
  null,
  _react2.default.createElement(_UserChip2.default, { userName: 'John Doe' }),
  _react2.default.createElement(_UserChip2.default, { userName: 'John Doe', imageSrc: _user2.default, style: { marginTop: '10px' } })
), document.getElementById('exampleContainer'));