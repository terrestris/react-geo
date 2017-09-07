'use strict';

var _expect = require('expect.js');

var _expect2 = _interopRequireDefault(_expect);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _TestUtils = require('../../Util/TestUtils');

var _TestUtils2 = _interopRequireDefault(_TestUtils);

var _Logger = require('../../Util/Logger');

var _Logger2 = _interopRequireDefault(_Logger);

var _SimpleButton = require('./SimpleButton.js');

var _SimpleButton2 = _interopRequireDefault(_SimpleButton);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('<SimpleButton />', function () {
  it('is defined', function () {
    (0, _expect2.default)(_SimpleButton2.default).not.to.be(undefined);
  });

  it('can be rendered', function () {
    var wrapper = _TestUtils2.default.mountComponent(_SimpleButton2.default);
    (0, _expect2.default)(wrapper).not.to.be(undefined);
  });

  it('allows to set some props', function () {
    var wrapper = _TestUtils2.default.mountComponent(_SimpleButton2.default);

    wrapper.setProps({
      type: 'secondary',
      icon: 'bath',
      shape: 'circle',
      size: 'small',
      disabled: true
    });

    (0, _expect2.default)(wrapper.props().type).to.equal('secondary');
    (0, _expect2.default)(wrapper.props().icon).to.equal('bath');
    (0, _expect2.default)(wrapper.props().shape).to.equal('circle');
    (0, _expect2.default)(wrapper.props().size).to.equal('small');
    (0, _expect2.default)(wrapper.props().disabled).to.equal(true);

    (0, _expect2.default)(wrapper.find('button.ant-btn-secondary').length).to.equal(1);
    (0, _expect2.default)(wrapper.find('span.fa-bath').length).to.equal(1);
    (0, _expect2.default)(wrapper.find('button.ant-btn-circle').length).to.equal(1);
    (0, _expect2.default)(wrapper.find('button.ant-btn-sm').length).to.equal(1);
    (0, _expect2.default)(wrapper.find({ disabled: true }).length).to.equal(1);
  });

  it('warns if no click callback method is given', function () {
    var wrapper = _TestUtils2.default.mountComponent(_SimpleButton2.default);
    var logSpy = _sinon2.default.spy(_Logger2.default, 'debug');

    wrapper.find('button').simulate('click');

    (0, _expect2.default)(logSpy).to.have.property('callCount', 1);

    _Logger2.default.debug.restore();
  });

  it('calls a given click callback method onClick', function () {
    var wrapper = _TestUtils2.default.mountComponent(_SimpleButton2.default);
    var onClick = _sinon2.default.spy();

    wrapper.setProps({
      onClick: onClick
    });

    wrapper.find('button').simulate('click');

    (0, _expect2.default)(onClick).to.have.property('callCount', 1);
  });
}); /*eslint-env mocha*/