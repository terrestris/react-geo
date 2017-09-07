'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _expect = require('expect.js');

var _expect2 = _interopRequireDefault(_expect);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _TestUtils = require('../../Util/TestUtils');

var _TestUtils2 = _interopRequireDefault(_TestUtils);

var _ToggleButton = require('../ToggleButton/ToggleButton.js');

var _ToggleButton2 = _interopRequireDefault(_ToggleButton);

var _ToggleGroup = require('./ToggleGroup.js');

var _ToggleGroup2 = _interopRequireDefault(_ToggleGroup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*eslint-env mocha*/
describe('<ToggleGroup />', function () {

  it('is defined', function () {
    (0, _expect2.default)(_ToggleGroup2.default).not.to.be(undefined);
  });

  it('can be rendered', function () {
    var wrapper = _TestUtils2.default.mountComponent(_ToggleGroup2.default);
    (0, _expect2.default)(wrapper).not.to.be(undefined);
  });

  it('renders it\'s children horizontally or vertically', function () {
    var wrapper = _TestUtils2.default.mountComponent(_ToggleGroup2.default);

    wrapper.setProps({
      orientation: 'vertical'
    });

    (0, _expect2.default)(wrapper.find('div.vertical-toggle-group').length).to.equal(1);

    wrapper.setProps({
      orientation: 'horizontal'
    });

    (0, _expect2.default)(wrapper.find('div.horizontal-toggle-group').length).to.equal(1);
  });

  it('renders children when passed in', function () {
    var props = {
      children: [_react2.default.createElement(_ToggleButton2.default, { key: '1', name: 'Shinji' }), _react2.default.createElement(_ToggleButton2.default, { key: '2', name: 'Kagawa' }), _react2.default.createElement(_ToggleButton2.default, { key: '3', name: '\u9999\u5DDD \u771F\u53F8' })]
    };
    var wrapper = _TestUtils2.default.mountComponent(_ToggleGroup2.default, props);

    (0, _expect2.default)(wrapper.find(_ToggleButton2.default).length).to.equal(3);
  });

  it('calls the given onChange callback if a children is pressed', function () {
    var changeSpy = _sinon2.default.spy();
    var props = {
      onChange: changeSpy,
      children: [_react2.default.createElement(_ToggleButton2.default, { key: '1', name: 'Shinji' })]
    };
    var wrapper = _TestUtils2.default.mountComponent(_ToggleGroup2.default, props);

    wrapper.find(_ToggleButton2.default).simulate('click');

    (0, _expect2.default)(changeSpy).to.have.property('callCount', 1);
  });

  it('sets the selected name on click', function () {
    var changeSpy = _sinon2.default.spy();
    var props = {
      onChange: changeSpy,
      children: [_react2.default.createElement(_ToggleButton2.default, { key: '1', name: 'Shinji' }), _react2.default.createElement(_ToggleButton2.default, { key: '2', name: 'Kagawa' }), _react2.default.createElement(_ToggleButton2.default, { key: '3', name: '\u9999\u5DDD \u771F\u53F8' })]
    };
    var wrapper = _TestUtils2.default.mountComponent(_ToggleGroup2.default, props);

    wrapper.find(_ToggleButton2.default).first().simulate('click');
    (0, _expect2.default)(wrapper.state().selectedName).to.equal('Shinji');

    wrapper.find(_ToggleButton2.default).at(2).simulate('click');
    (0, _expect2.default)(wrapper.state().selectedName).to.equal('香川 真司');
  });

  it('allows to deselect an already pressed button', function () {
    var changeSpy = _sinon2.default.spy();
    var props = {
      allowDeselect: false,
      onChange: changeSpy,
      children: [_react2.default.createElement(_ToggleButton2.default, { key: '1', name: 'Shinji' }), _react2.default.createElement(_ToggleButton2.default, { key: '2', name: 'Kagawa' }), _react2.default.createElement(_ToggleButton2.default, { key: '3', name: '\u9999\u5DDD \u771F\u53F8' })]
    };
    var wrapper = _TestUtils2.default.mountComponent(_ToggleGroup2.default, props);

    wrapper.find(_ToggleButton2.default).first().simulate('click');
    (0, _expect2.default)(wrapper.state().selectedName).to.equal('Shinji');

    wrapper.find(_ToggleButton2.default).first().simulate('click');
    (0, _expect2.default)(wrapper.state().selectedName).to.equal('Shinji');

    wrapper.setProps({
      allowDeselect: true
    });

    wrapper.find(_ToggleButton2.default).first().simulate('click');
    (0, _expect2.default)(wrapper.state().selectedName).to.equal(null);
  });
});