'use strict';

var _expect = require('expect.js');

var _expect2 = _interopRequireDefault(_expect);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _TestUtils = require('../../Util/TestUtils');

var _TestUtils2 = _interopRequireDefault(_TestUtils);

var _Logger = require('../../Util/Logger');

var _Logger2 = _interopRequireDefault(_Logger);

var _ToggleButton = require('./ToggleButton.js');

var _ToggleButton2 = _interopRequireDefault(_ToggleButton);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('<ToggleButton />', function () {

  it('is defined', function () {
    (0, _expect2.default)(_ToggleButton2.default).not.to.be(undefined);
  });

  it('can be rendered', function () {
    var wrapper = _TestUtils2.default.mountComponent(_ToggleButton2.default);
    (0, _expect2.default)(wrapper).not.to.be(undefined);
  });

  it('allows to set some props', function () {
    var wrapper = _TestUtils2.default.mountComponent(_ToggleButton2.default);

    wrapper.setProps({
      name: 'Shinji',
      type: 'secondary',
      icon: 'bath',
      shape: 'circle',
      size: 'small',
      disabled: true,
      pressed: false
    });

    (0, _expect2.default)(wrapper.props().name).to.equal('Shinji');
    (0, _expect2.default)(wrapper.props().type).to.equal('secondary');
    (0, _expect2.default)(wrapper.props().icon).to.equal('bath');
    (0, _expect2.default)(wrapper.props().shape).to.equal('circle');
    (0, _expect2.default)(wrapper.props().size).to.equal('small');
    (0, _expect2.default)(wrapper.props().disabled).to.equal(true);
    (0, _expect2.default)(wrapper.props().pressed).to.equal(false);

    (0, _expect2.default)(wrapper.find('button.ant-btn-secondary').length).to.equal(1);
    (0, _expect2.default)(wrapper.find('span.fa-bath').length).to.equal(1);
    (0, _expect2.default)(wrapper.find('button.ant-btn-circle').length).to.equal(1);
    (0, _expect2.default)(wrapper.find('button.ant-btn-sm').length).to.equal(1);
    (0, _expect2.default)(wrapper.find({ disabled: true }).length).to.equal(1);
  });

  it('sets a pressed class if the pressed state becomes truthy', function () {
    var wrapper = _TestUtils2.default.mountComponent(_ToggleButton2.default, {
      onToggle: function onToggle() {}
    });
    var toggleClass = wrapper.instance().toggleClass;

    (0, _expect2.default)(toggleClass).to.be.a('string');
    (0, _expect2.default)(wrapper.find('button.' + toggleClass).length).to.equal(0);

    wrapper.setProps({
      pressed: true
    });

    (0, _expect2.default)(wrapper.find('button.' + toggleClass).length).to.equal(1);
  });

  it('warns if no toggle callback method is given', function () {
    var logSpy = _sinon2.default.spy(_Logger2.default, 'debug');
    var wrapper = _TestUtils2.default.mountComponent(_ToggleButton2.default, {
      onToggle: function onToggle() {}
    });

    wrapper.setProps({
      onToggle: null
    });

    (0, _expect2.default)(logSpy).to.have.property('callCount', 1);

    logSpy.restore();
  });

  it('calls a given toggle callback method if the pressed state changes', function () {
    var onToggle = _sinon2.default.spy();
    var props = {
      onToggle: onToggle
    };

    var wrapper = _TestUtils2.default.mountComponent(_ToggleButton2.default, props);

    wrapper.setProps({
      pressed: true
    });

    (0, _expect2.default)(onToggle).to.have.property('callCount', 1);
  });

  it('changes the pressed state of the component on click (if standalone button)', function () {
    var wrapper = _TestUtils2.default.mountComponent(_ToggleButton2.default);

    wrapper.find('button').simulate('click');

    (0, _expect2.default)(wrapper.state('pressed')).to.be(true);
  });

  it('calls the on change callback (if included in a ToggleGroup)', function () {
    var onChangeSpy = _sinon2.default.spy();
    var context = {
      toggleGroup: {
        onChange: onChangeSpy
      }
    };
    var wrapper = _TestUtils2.default.mountComponent(_ToggleButton2.default, null, context);

    wrapper.find('button').simulate('click');

    (0, _expect2.default)(onChangeSpy).to.have.property('callCount', 1);
  });
}); /*eslint-env mocha*/