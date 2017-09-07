'use strict';

var _css = require('antd/lib/select/style/css');

var _select = require('antd/lib/select');

var _select2 = _interopRequireDefault(_select);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _expect = require('expect.js');

var _expect2 = _interopRequireDefault(_expect);

var _ScaleCombo = require('./ScaleCombo.js');

var _ScaleCombo2 = _interopRequireDefault(_ScaleCombo);

var _TestUtils = require('../../Util/TestUtils');

var _TestUtils2 = _interopRequireDefault(_TestUtils);

var _MapUtil = require('../../Util/MapUtil');

var _MapUtil2 = _interopRequireDefault(_MapUtil);

var _Logger = require('../../Util/Logger');

var _Logger2 = _interopRequireDefault(_Logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Option = _select2.default.Option; /*eslint-env mocha*/


describe('<ScaleCombo />', function () {
  var wrapper = void 0;
  var map = void 0;

  beforeEach(function () {
    wrapper = _TestUtils2.default.mountComponent(_ScaleCombo2.default);
  });

  afterEach(function () {
    _TestUtils2.default.removeMap(map);
  });

  it('is defined', function () {
    (0, _expect2.default)(_ScaleCombo2.default).not.to.be(undefined);
  });

  it('can be rendered', function () {
    (0, _expect2.default)(wrapper).not.to.be(undefined);
  });

  it('passes style prop', function () {
    var props = {
      style: {
        'backgroundColor': 'yellow'
      }
    };
    var wrapper = _TestUtils2.default.mountComponent(_ScaleCombo2.default, props);
    (0, _expect2.default)(wrapper.find('div.scale-select').node.style.backgroundColor).to.be('yellow');
  });

  describe('#getOptionsFromMap', function () {
    it('is defined', function () {
      (0, _expect2.default)(wrapper.instance().getOptionsFromMap).not.to.be(undefined);
    });

    it('shows warning of map is not set', function () {
      var logSpy = _sinon2.default.spy(_Logger2.default, 'warn');
      wrapper.instance().getOptionsFromMap();
      (0, _expect2.default)(logSpy).to.have.property('callCount', 1);
      _Logger2.default.warn.restore();
    });

    it('creates options array from scaled primarily', function () {
      var logSpy = _sinon2.default.spy(_Logger2.default, 'debug');
      var scaleArray = [_react2.default.createElement(
        Option,
        { key: '100', value: '100' },
        '1:100'
      )];
      wrapper = _TestUtils2.default.mountComponent(_ScaleCombo2.default, {
        scales: scaleArray
      });
      wrapper.instance().getOptionsFromMap();
      (0, _expect2.default)(logSpy).to.have.property('callCount', 1);
      _Logger2.default.debug.restore();
    });

    it('creates options array from given map without resolutions and updates scales prop', function () {
      map = _TestUtils2.default.createMap();
      wrapper = _TestUtils2.default.mountComponent(_ScaleCombo2.default, {
        scales: [],
        map: map
      });
      wrapper.instance().getOptionsFromMap();
      (0, _expect2.default)(wrapper.props().scales).to.be.an('array');
    });

    it('creates options array from given map with resolutions and updates scales prop', function () {
      var testResolutions = [560, 280, 140, 70, 28];
      map = _TestUtils2.default.createMap({
        resolutions: testResolutions
      });
      wrapper = _TestUtils2.default.mountComponent(_ScaleCombo2.default, {
        scales: [],
        map: map
      });
      wrapper.instance().getOptionsFromMap();
      (0, _expect2.default)(wrapper.props().scales).to.be.an('array');
      (0, _expect2.default)(wrapper.props().scales).to.have.length(testResolutions.length);

      var roundScale = Math.round(_MapUtil2.default.getScaleForResolution(testResolutions[0], 'm')).toString();
      (0, _expect2.default)(wrapper.props().scales[0].key).to.be(roundScale);
    });
  });

  describe('#determineOptionKeyForZoomLevel', function () {
    it('is defined', function () {
      (0, _expect2.default)(wrapper.instance().determineOptionKeyForZoomLevel).not.to.be(undefined);
    });

    it('returns "undefied" for erronous zoom level or if exceeds number of valid zoom levels ', function () {
      var scaleArray = [_react2.default.createElement(
        Option,
        { key: '100', value: '100' },
        '1:100'
      ), _react2.default.createElement(
        Option,
        { key: '200', value: '200' },
        '1:100'
      ), _react2.default.createElement(
        Option,
        { key: '300', value: '300' },
        '1:100'
      )];
      wrapper = _TestUtils2.default.mountComponent(_ScaleCombo2.default, {
        scales: scaleArray
      });

      (0, _expect2.default)(wrapper.instance().determineOptionKeyForZoomLevel(undefined)).to.be(undefined);
      (0, _expect2.default)(wrapper.instance().determineOptionKeyForZoomLevel(null)).to.be(undefined);
      (0, _expect2.default)(wrapper.instance().determineOptionKeyForZoomLevel('foo')).to.be(undefined);

      (0, _expect2.default)(wrapper.instance().determineOptionKeyForZoomLevel(scaleArray.length)).to.be(undefined);
    });

    it('returns matching key for zoom level', function () {
      var scaleArray = [_react2.default.createElement(
        Option,
        { key: '100', value: '100' },
        '1:100'
      ), _react2.default.createElement(
        Option,
        { key: '200', value: '200' },
        '1:100'
      ), _react2.default.createElement(
        Option,
        { key: '300', value: '300' },
        '1:100'
      )];
      wrapper = _TestUtils2.default.mountComponent(_ScaleCombo2.default, {
        scales: scaleArray
      });

      var index = 1;
      (0, _expect2.default)(wrapper.instance().determineOptionKeyForZoomLevel(index)).to.be(scaleArray[index].key);
    });
  });

  describe('#handleOnKeyDown', function () {
    it('is defined', function () {
      (0, _expect2.default)(wrapper.instance().handleOnKeyDown).not.to.be(undefined);
    });

    it('calls onZoomLevelSelect if ENTER key is pressed', function () {
      var onZoomLevelSelect = _sinon2.default.spy();
      wrapper = _TestUtils2.default.mountComponent(_ScaleCombo2.default, {
        onZoomLevelSelect: onZoomLevelSelect
      });

      var eventObj = {
        key: 'Enter',
        target: {
          value: 9
        }
      };

      wrapper.instance().handleOnKeyDown(eventObj);
      (0, _expect2.default)(onZoomLevelSelect).to.have.property('callCount', 1);
    });
  });

  describe('#getInputElement', function () {
    it('is defined', function () {
      (0, _expect2.default)(wrapper.instance().getInputElement).not.to.be(undefined);
    });

    it('returns input element with an reigstered onKeyDown event', function () {
      var inputElement = wrapper.instance().getInputElement();
      (0, _expect2.default)(inputElement.type).to.be('input');
      (0, _expect2.default)(inputElement.props.onKeyDown).to.be.ok();
      (0, _expect2.default)(inputElement.props.onKeyDown).to.be.a('function');
    });
  });
});