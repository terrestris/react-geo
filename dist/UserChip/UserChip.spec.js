'use strict';

var _expect = require('expect.js');

var _expect2 = _interopRequireDefault(_expect);

var _UserChip = require('./UserChip.js');

var _UserChip2 = _interopRequireDefault(_UserChip);

var _user = require('./user.png');

var _user2 = _interopRequireDefault(_user);

var _TestUtils = require('../Util/TestUtils');

var _TestUtils2 = _interopRequireDefault(_TestUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*eslint-env mocha*/
describe('<UserChip />', function () {

  var wrapper = void 0;

  beforeEach(function () {
    wrapper = _TestUtils2.default.mountComponent(_UserChip2.default);
  });

  it('is defined', function () {
    (0, _expect2.default)(_UserChip2.default).not.to.be(undefined);
  });

  it('can be rendered', function () {
    (0, _expect2.default)(wrapper).not.to.be(undefined);
  });

  it('determines initials from given user name', function () {
    wrapper.setProps({ userName: 'Shinji Kagawa' });
    var test = wrapper.instance().getInitials();
    (0, _expect2.default)(test).to.be('SK');
  });

  it('uses imageSrc if image is given', function () {
    var props = {
      imageSrc: _user2.default
    };
    var wrapper = _TestUtils2.default.mountComponent(_UserChip2.default, props);
    (0, _expect2.default)(wrapper.find('img').node.src).to.contain(_user2.default);
  });

  it('uses initials if image is not given', function () {
    wrapper.setProps({ userName: 'Shinji Kagawa' });
    (0, _expect2.default)(wrapper.find('img').node).to.be(undefined);
  });

  it('should not render a dropdown for invalid configuration', function () {
    wrapper.setProps({ userName: 'Shinji Kagawa' });
    wrapper.setProps({ userMenu: null });
    (0, _expect2.default)(wrapper.find('ul.user-appinfo-menu').node).to.be(undefined);
  });

  it('should pass style prop', function () {
    var props = {
      style: {
        'backgroundColor': 'yellow'
      }
    };
    var wrapper = _TestUtils2.default.mountComponent(_UserChip2.default, props);
    (0, _expect2.default)(wrapper.find('div.userchip').node.style.backgroundColor).to.be('yellow');
  });
});