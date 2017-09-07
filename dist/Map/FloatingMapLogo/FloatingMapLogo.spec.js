'use strict';

var _expect = require('expect.js');

var _expect2 = _interopRequireDefault(_expect);

var _FloatingMapLogo = require('./FloatingMapLogo.js');

var _FloatingMapLogo2 = _interopRequireDefault(_FloatingMapLogo);

var _user = require('../../UserChip/user.png');

var _user2 = _interopRequireDefault(_user);

var _TestUtils = require('../../Util/TestUtils');

var _TestUtils2 = _interopRequireDefault(_TestUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*eslint-env mocha*/
describe('<FloatingMapLogo />', function () {
  var wrapper = void 0;

  beforeEach(function () {
    var props = {
      imageSrc: _user2.default
    };
    wrapper = _TestUtils2.default.mountComponent(_FloatingMapLogo2.default, props);
  });

  it('is defined', function () {
    (0, _expect2.default)(_FloatingMapLogo2.default).not.to.be(undefined);
  });

  it('can be rendered', function () {
    (0, _expect2.default)(wrapper).not.to.be(undefined);
  });

  it('contains img element with predefined class', function () {
    var imageElement = wrapper.find('img');
    (0, _expect2.default)(imageElement.node.className).to.be('map-logo');
  });

  it('is not positioned absolutely by default', function () {
    var imageElement = wrapper.find('img');
    (0, _expect2.default)(imageElement.node.className).to.be('map-logo');
  });

  it('passes style prop', function () {
    var props = {
      imageSrc: _user2.default,
      style: {
        backgroundColor: 'yellow',
        position: 'inherit'
      }
    };
    wrapper = _TestUtils2.default.mountComponent(_FloatingMapLogo2.default, props);
    var imageElement = wrapper.find('img');
    (0, _expect2.default)(imageElement.node.style.backgroundColor).to.be('yellow');
    (0, _expect2.default)(imageElement.node.style.position).to.be('inherit');
  });

  it('passes position prop', function () {
    var props = {
      imageSrc: _user2.default,
      absolutelyPostioned: true,
      style: {
        backgroundColor: 'yellow'
      }
    };
    wrapper = _TestUtils2.default.mountComponent(_FloatingMapLogo2.default, props);
    var imageElement = wrapper.find('img');
    (0, _expect2.default)(imageElement.node.className).to.be('map-logo');
    (0, _expect2.default)(imageElement.node.style.position).to.be('absolute');
    (0, _expect2.default)(imageElement.node.style.backgroundColor).to.be('yellow');
  });

  it('delegates image height to child img element', function () {
    var targetHeightNumber = 1909;
    var targetHeight = targetHeightNumber + 'px';
    wrapper.setProps({ imageHeight: targetHeight });
    var element = wrapper.find('img');

    (0, _expect2.default)(element.node.height).to.be(targetHeightNumber);
  });
});