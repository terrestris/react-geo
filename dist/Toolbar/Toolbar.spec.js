'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _expect = require('expect.js');

var _expect2 = _interopRequireDefault(_expect);

var _Toolbar = require('./Toolbar.js');

var _Toolbar2 = _interopRequireDefault(_Toolbar);

var _TestUtils = require('../Util/TestUtils');

var _TestUtils2 = _interopRequireDefault(_TestUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*eslint-env mocha*/
var testChildren = [_react2.default.createElement('div', { key: 'testdiv1', id: 'testdiv1' }), _react2.default.createElement('div', { key: 'testdiv2', id: 'testdiv2' }), _react2.default.createElement('div', { key: 'testdiv3', id: 'testdiv3' })];

describe('<Toolbar />', function () {
  var wrapper = void 0;

  beforeEach(function () {
    wrapper = _TestUtils2.default.mountComponent(_Toolbar2.default);
  });

  it('is defined', function () {
    (0, _expect2.default)(_Toolbar2.default).not.to.be(undefined);
  });

  it('can be rendered', function () {
    (0, _expect2.default)(wrapper).not.to.be(undefined);
  });

  it('contains div having class "horizontal-toolbar" by default', function () {
    var rootDiv = wrapper.find('div.horizontal-toolbar');
    (0, _expect2.default)(rootDiv).not.to.be(undefined);
    (0, _expect2.default)(rootDiv.length).to.be(1);
  });
});

describe('<Toolbar /> - CSS-class "vertical-toolbar"', function () {
  var wrapper = void 0;

  beforeEach(function () {
    wrapper = _TestUtils2.default.mountComponent(_Toolbar2.default, {
      alignment: 'vertical',
      children: testChildren
    });
  });

  it('can be rendered', function () {
    (0, _expect2.default)(wrapper).not.to.be(undefined);
  });

  it('contains div having class "vertical-toolbar"', function () {
    var rootDiv = wrapper.find('div.vertical-toolbar');
    (0, _expect2.default)(rootDiv).not.to.be(undefined);
    (0, _expect2.default)(rootDiv.length).to.be(1);
  });

  it('contains three child elements', function () {
    var rootDivChildren = wrapper.find('div.vertical-toolbar').children();
    (0, _expect2.default)(rootDivChildren).to.be.ok();
    (0, _expect2.default)(rootDivChildren.nodes).to.be.an(Array);
    (0, _expect2.default)(rootDivChildren.nodes).to.have.length(3);
  });
});

describe('<Toolbar /> - CSS-class "horizontal-toolbar"', function () {
  var wrapper = void 0;

  beforeEach(function () {
    wrapper = _TestUtils2.default.mountComponent(_Toolbar2.default, {
      alignment: 'horizontal',
      children: testChildren
    });
  });

  it('can be rendered', function () {
    (0, _expect2.default)(wrapper).not.to.be(undefined);
  });

  it('contains div having class "horizontal-toolbar"', function () {
    var rootDiv = wrapper.find('div.horizontal-toolbar');
    (0, _expect2.default)(rootDiv).not.to.be(undefined);
    (0, _expect2.default)(rootDiv.length).to.be(1);
  });

  it('contains three child elements', function () {
    var rootDivChildren = wrapper.find('div.horizontal-toolbar').children();
    (0, _expect2.default)(rootDivChildren).to.be.ok();
    (0, _expect2.default)(rootDivChildren.nodes).to.be.an(Array);
    (0, _expect2.default)(rootDivChildren.nodes).to.have.length(3);
  });
});