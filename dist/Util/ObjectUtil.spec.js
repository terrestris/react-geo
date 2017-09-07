'use strict';

var _expect = require('expect.js');

var _expect2 = _interopRequireDefault(_expect);

var _ObjectUtil = require('./ObjectUtil.js');

var _ObjectUtil2 = _interopRequireDefault(_ObjectUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*eslint-env mocha*/
describe('ObjectUtil', function () {
  it('is defined', function () {
    (0, _expect2.default)(_ObjectUtil2.default).not.to.be(undefined);
  });

  describe('getValue', function () {
    var testObject = void 0;
    beforeEach(function () {
      testObject = {
        firstLevel: true,
        level: 'first',
        firstNested: {
          secondLevel: true,
          level: 'second',
          deeper: {
            evenDeeper: {
              deepest: 'you could go deeper of course'
            }
          }
        }
      };
    });

    it('is defined', function () {
      (0, _expect2.default)(_ObjectUtil2.default.getValue).not.to.be(undefined);
    });

    it('returns undefined on unexpected key datatype', function () {
      var unexpectedKeys = [1, false, true, null, undefined, {}, [], function () {}, NaN, /./g];
      // mock up an object that has the string representation of the unexpected
      // keys actually set; an alternative implementation might return
      // `true` instead
      var obj = {};
      unexpectedKeys.forEach(function (unexpectedKey) {
        obj[Object.prototype.toString.call(unexpectedKey)] = true;
      });
      unexpectedKeys.forEach(function (unexpectedKey) {
        (0, _expect2.default)(_ObjectUtil2.default.getValue(unexpectedKey, obj)).to.be(undefined);
      });
    });

    it('returns false on unexpected object datatype', function () {
      var unexpectedObjs = [1, false, true, null, undefined, 'foo', NaN];
      // we do *not* skip for [], new String('') etc.
      // See: https://lodash.com/docs/#isObject
      unexpectedObjs.forEach(function (unexpectedObj) {
        (0, _expect2.default)(_ObjectUtil2.default.getValue('', unexpectedObj)).to.be(undefined);
      });
    });

    it('returns as expected on getValue call', function () {
      var retVal1 = _ObjectUtil2.default.getValue('level', testObject);
      (0, _expect2.default)(retVal1).to.be('first');

      var retVal2 = _ObjectUtil2.default.getValue('firstNested/level', testObject);
      (0, _expect2.default)(retVal2).to.be('second');

      var retVal3 = _ObjectUtil2.default.getValue('secondLevel', testObject);
      (0, _expect2.default)(retVal3).to.be(true);
    });

    it('returns undefined on valid getValue (non-existing key)', function () {
      var got = _ObjectUtil2.default.getValue('foo', testObject);
      (0, _expect2.default)(got).to.be(undefined);
    });

    it('returns input on valid getValue (non-existing path)', function () {
      // MJ: I find this quite confusing, TBH
      var got = _ObjectUtil2.default.getValue('foo/bar/baz', testObject);
      (0, _expect2.default)(got).to.be(testObject);
    });

    it('returns last matched path when most specific not found', function () {
      var existingParent = _ObjectUtil2.default.getValue('firstNested/deeper/evenDeeper', testObject);
      var got = _ObjectUtil2.default.getValue('firstNested/deeper/evenDeeper/notThere', testObject);
      (0, _expect2.default)(got).to.be(existingParent);
    });

    it('handles some arrays and calls itself on contained objects', function () {
      // MJ: I find this quite confusing, TBH
      var obj = { ohai: [{ foo: 'bar' }] };
      var got = _ObjectUtil2.default.getValue('foo', obj);
      (0, _expect2.default)(got).to.be('bar');
    });

    it('handles deep arrays and calls itself on contained objects', function () {
      // MJ: I find this quite confusing, TBH
      var obj = { ohai: [1, [2, [3, [{ foo: 'bar' }]]]] };
      var got = _ObjectUtil2.default.getValue('foo', obj);
      (0, _expect2.default)(got).to.be('bar');
    });

    // The below test fails, that is why I do not specifically like the handling
    // of the arrays in this method.
    //
    // it('handles arrays and calls itself on contained objects', function() {
    //   var obj = {humpty: {ohai: [{foo: 'bar'}]}};
    //   var got = ObjectUtil.getValue('humpty/foo', obj);
    //   expect(got).to.be('bar');
    // });
  });
});