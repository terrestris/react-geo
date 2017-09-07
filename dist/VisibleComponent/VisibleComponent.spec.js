'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _expect = require('expect.js');

var _expect2 = _interopRequireDefault(_expect);

var _VisibleComponent = require('./VisibleComponent.js');

var _TestUtils = require('../Util/TestUtils');

var _TestUtils2 = _interopRequireDefault(_TestUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*eslint-env mocha*/


describe('isVisibleComponent', function () {
  var EnhancedComponent = void 0;

  /* eslint-disable require-jsdoc */

  var MockComponent = function (_React$Component) {
    _inherits(MockComponent, _React$Component);

    function MockComponent() {
      _classCallCheck(this, MockComponent);

      return _possibleConstructorReturn(this, (MockComponent.__proto__ || Object.getPrototypeOf(MockComponent)).apply(this, arguments));
    }

    _createClass(MockComponent, [{
      key: 'render',
      value: function render() {
        return _react2.default.createElement(
          'div',
          null,
          'A mock Component'
        );
      }
    }]);

    return MockComponent;
  }(_react2.default.Component);
  /* eslint-enable require-jsdoc */

  beforeEach(function () {
    EnhancedComponent = (0, _VisibleComponent.isVisibleComponent)(MockComponent, {
      withRef: true
    });
  });

  describe('Basics', function () {
    it('is defined', function () {
      (0, _expect2.default)(_VisibleComponent.isVisibleComponent).not.to.be(undefined);
    });

    it('can be rendered', function () {
      var wrapper = _TestUtils2.default.mountComponent(EnhancedComponent);

      (0, _expect2.default)(wrapper).not.to.be(undefined);
      (0, _expect2.default)(wrapper.first().is(EnhancedComponent)).to.be(true);
    });

    it('passes through all props except activeModules', function () {
      var props = {
        someProp: '09',
        name: 'shinjiKagawaModule',
        activeModules: [{
          name: 'shinjiKagawaModule'
        }]
      };
      var expectedProps = {
        someProp: '09',
        name: 'shinjiKagawaModule'
      };
      var wrapper = _TestUtils2.default.mountComponent(EnhancedComponent, props);
      var wrappedInstance = wrapper.instance().getWrappedInstance();

      (0, _expect2.default)(wrappedInstance.props).to.eql(expectedProps);
    });

    it('saves a reference to the wrapped instance if requested', function () {
      var props = {
        name: 'shinjiKagawaModule',
        activeModules: [{
          name: 'shinjiKagawaModule'
        }]
      };
      var wrapper = _TestUtils2.default.mountComponent(EnhancedComponent, props);
      var wrappedInstance = wrapper.instance().getWrappedInstance();

      (0, _expect2.default)(wrappedInstance).to.be.an(MockComponent);

      var EnhancedComponentNoRef = (0, _VisibleComponent.isVisibleComponent)(MockComponent, {
        withRef: false
      });

      var wrapperNoRef = _TestUtils2.default.mountComponent(EnhancedComponentNoRef, props);
      var wrappedInstanceNoRef = wrapperNoRef.instance().getWrappedInstance();

      (0, _expect2.default)(wrappedInstanceNoRef).to.be(undefined);
    });

    it('shows or hides the wrapped component in relation to it\'s representation in the activeModules prop', function () {
      // 1. No name and no activeModules.
      var wrapper = _TestUtils2.default.mountComponent(EnhancedComponent);
      (0, _expect2.default)(wrapper.find('div').length).to.equal(0);

      // 2. Name and no activeModules.
      wrapper = _TestUtils2.default.mountComponent(EnhancedComponent, {
        name: 'shinjiKagawaModule'
      });
      (0, _expect2.default)(wrapper.find('div').length).to.equal(0);

      // 3. Name and activeModules.
      wrapper = _TestUtils2.default.mountComponent(EnhancedComponent, {
        name: 'shinjiKagawaModule',
        activeModules: [{
          name: 'shinjiKagawaModule'
        }]
      });
      (0, _expect2.default)(wrapper.find('div').length).to.equal(1);

      // 4. Name and activeModules, but name not in activeModules.
      wrapper = _TestUtils2.default.mountComponent(EnhancedComponent, {
        name: 'someModule',
        activeModules: [{
          name: 'shinjiKagawaModule'
        }]
      });
      (0, _expect2.default)(wrapper.find('div').length).to.equal(0);

      // 5. No name and activeModules.
      wrapper = _TestUtils2.default.mountComponent(EnhancedComponent, {
        activeModules: [{
          name: 'shinjiKagawaModule'
        }]
      });
      (0, _expect2.default)(wrapper.find('div').length).to.equal(0);

      // 6. Name and activeModules, but no name in activeModules
      wrapper = _TestUtils2.default.mountComponent(EnhancedComponent, {
        name: 'shinjiKagawaModule',
        activeModules: [{
          notName: 'shinjiKagawaModule'
        }]
      });
      (0, _expect2.default)(wrapper.find('div').length).to.equal(0);
    });
  });
});