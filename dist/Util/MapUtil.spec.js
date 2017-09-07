'use strict';

var _expect = require('expect.js');

var _expect2 = _interopRequireDefault(_expect);

var _dragrotateandzoom = require('ol/interaction/dragrotateandzoom');

var _dragrotateandzoom2 = _interopRequireDefault(_dragrotateandzoom);

var _draw = require('ol/interaction/draw');

var _draw2 = _interopRequireDefault(_draw);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _TestUtils = require('./TestUtils.js');

var _TestUtils2 = _interopRequireDefault(_TestUtils);

var _Logger = require('./Logger.js');

var _Logger2 = _interopRequireDefault(_Logger);

var _MapUtil = require('./MapUtil.js');

var _MapUtil2 = _interopRequireDefault(_MapUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('MapUtil', function () {
  var testResolutions = {
    degrees: 0.000004807292355257246,
    m: 0.5345462690925383,
    ft: 1.7537607253692198,
    'us-ft': 1.7537572178477696
  };
  var testScale = 1909.09;

  var map = void 0;

  beforeEach(function () {
    map = _TestUtils2.default.createMap();
  });

  afterEach(function () {
    _TestUtils2.default.removeMap(map);
  });

  it('is defined', function () {
    (0, _expect2.default)(_MapUtil2.default).to.not.be(undefined);
  });

  describe('#getInteractionsByName', function () {
    it('is defined', function () {
      (0, _expect2.default)(_MapUtil2.default.getInteractionsByName).to.not.be(undefined);
    });

    it('needs to be called with a map instance', function () {
      var logSpy = _sinon2.default.spy(_Logger2.default, 'debug');

      var returnedInteractions = _MapUtil2.default.getInteractionsByName(null, 'BVB!');

      (0, _expect2.default)(logSpy).to.have.property('callCount', 1);
      (0, _expect2.default)(returnedInteractions).to.have.length(0);

      _Logger2.default.debug.restore();
    });

    it('returns an empty array if no interaction candidate is found', function () {
      var dragInteractionName = 'Drag Queen';
      var dragInteraction = new _dragrotateandzoom2.default();
      dragInteraction.set('name', dragInteractionName);
      map.addInteraction(dragInteraction);

      var returnedInteractions = _MapUtil2.default.getInteractionsByName(map, dragInteractionName + ' NOT AVAILABLE');

      (0, _expect2.default)(returnedInteractions).to.have.length(0);
    });

    it('returns the requested interactions by name', function () {
      var dragInteractionName = 'Drag Queen';
      var dragInteraction = new _dragrotateandzoom2.default();
      dragInteraction.set('name', dragInteractionName);
      map.addInteraction(dragInteraction);

      var returnedInteractions = _MapUtil2.default.getInteractionsByName(map, dragInteractionName);

      (0, _expect2.default)(returnedInteractions).to.have.length(1);

      var anotherDragInteraction = new _dragrotateandzoom2.default();
      anotherDragInteraction.set('name', dragInteractionName);
      map.addInteraction(anotherDragInteraction);

      returnedInteractions = _MapUtil2.default.getInteractionsByName(map, dragInteractionName);

      (0, _expect2.default)(returnedInteractions).to.have.length(2);
    });
  });

  describe('#getInteractionsByClass', function () {
    it('is defined', function () {
      (0, _expect2.default)(_MapUtil2.default.getInteractionsByClass).to.not.be(undefined);
    });

    it('needs to be called with a map instance', function () {
      var logSpy = _sinon2.default.spy(_Logger2.default, 'debug');

      var returnedInteractions = _MapUtil2.default.getInteractionsByClass(null, _dragrotateandzoom2.default);

      (0, _expect2.default)(logSpy).to.have.property('callCount', 1);
      (0, _expect2.default)(returnedInteractions).to.have.length(0);

      _Logger2.default.debug.restore();
    });

    it('returns an empty array if no interaction candidate is found', function () {
      var dragInteraction = new _dragrotateandzoom2.default();
      map.addInteraction(dragInteraction);

      var returnedInteractions = _MapUtil2.default.getInteractionsByClass(map, _draw2.default);

      (0, _expect2.default)(returnedInteractions).to.have.length(0);
    });

    it('returns the requested interactions by class', function () {
      var dragInteraction = new _dragrotateandzoom2.default();
      map.addInteraction(dragInteraction);

      var returnedInteractions = _MapUtil2.default.getInteractionsByClass(map, _dragrotateandzoom2.default);

      (0, _expect2.default)(returnedInteractions).to.have.length(1);

      var anotherDragInteraction = new _dragrotateandzoom2.default();
      map.addInteraction(anotherDragInteraction);

      returnedInteractions = _MapUtil2.default.getInteractionsByClass(map, _dragrotateandzoom2.default);

      (0, _expect2.default)(returnedInteractions).to.have.length(2);
    });
  });

  describe('#getResolutionForScale', function () {
    it('is defined', function () {
      (0, _expect2.default)(_MapUtil2.default.getResolutionForScale).to.not.be(undefined);
    });

    it('returns expected values for valid units', function () {
      var units = ['degrees', 'm', 'ft', 'us-ft'];
      units.forEach(function (unit) {
        (0, _expect2.default)(_MapUtil2.default.getResolutionForScale(testScale, unit)).to.be(testResolutions[unit]);
      });
    });

    it('returns inverse of getScaleForResolution', function () {
      var unit = 'm';
      var resolutionToTest = 190919.09;
      var calculateScale = _MapUtil2.default.getScaleForResolution(resolutionToTest, unit);
      (0, _expect2.default)(_MapUtil2.default.getResolutionForScale(calculateScale, unit)).to.be(resolutionToTest);
    });
  });

  describe('#getScaleForResolution', function () {
    it('is defined', function () {
      (0, _expect2.default)(_MapUtil2.default.getScaleForResolution).to.not.be(undefined);
    });

    it('returns expected values for valid units', function () {
      var units = ['degrees', 'm', 'ft', 'us-ft'];

      /**
       * Helper method to round number to two floating digits
       */
      var roundToTwoDecimals = function roundToTwoDecimals(num) {
        return Math.round(num * 100) / 100;
      };

      units.forEach(function (unit) {
        (0, _expect2.default)(roundToTwoDecimals(_MapUtil2.default.getScaleForResolution(testResolutions[unit], unit))).to.be(testScale);
      });
    });

    it('returns inverse of getResolutionForScale', function () {
      var unit = 'm';
      var calculateScale = _MapUtil2.default.getResolutionForScale(testScale, unit);
      (0, _expect2.default)(_MapUtil2.default.getScaleForResolution(calculateScale, unit)).to.be(testScale);
    });
  });
}); /*eslint-env mocha*/