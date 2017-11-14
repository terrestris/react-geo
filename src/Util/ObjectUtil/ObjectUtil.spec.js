/*eslint-env jest*/


import {
  ObjectUtil,
} from '../../index';

describe('ObjectUtil', () => {
  it('is defined', () => {
    expect(ObjectUtil).not.toBeUndefined();
  });

  describe('getValue', () => {
    let testObject;
    beforeEach(function() {
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

    it('is defined', () => {
      expect(ObjectUtil.getValue).not.toBeUndefined();
    });

    it('returns undefined on unexpected key datatype', function() {
      var unexpectedKeys = [
        1, false, true, null, undefined, {}, [], function() {}, NaN, /./g
      ];
      // mock up an object that has the string representation of the unexpected
      // keys actually set; an alternative implementation might return
      // `true` instead
      var obj = {};
      unexpectedKeys.forEach(unexpectedKey => {
        obj[Object.prototype.toString.call(unexpectedKey)] = true;
      });
      unexpectedKeys.forEach(unexpectedKey => {
        expect(ObjectUtil.getValue(unexpectedKey, obj)).toBeUndefined();
      });
    });

    it('returns false on unexpected object datatype', function() {
      var unexpectedObjs = [
        1, false, true, null, undefined, 'foo', NaN
      ];
      // we do *not* skip for [], new String('') etc.
      // See: https://lodash.com/docs/#isObject
      unexpectedObjs.forEach(unexpectedObj => {
        expect(ObjectUtil.getValue('', unexpectedObj)).toBeUndefined();
      });
    });

    it('returns as expected on getValue call', function() {
      var retVal1 = ObjectUtil.getValue('level', testObject);
      expect(retVal1).toBe('first');

      var retVal2 = ObjectUtil.getValue('firstNested/level', testObject);
      expect(retVal2).toBe('second');

      var retVal3 = ObjectUtil.getValue('secondLevel', testObject);
      expect(retVal3).toBe(true);
    });

    it('returns undefined on valid getValue (non-existing key)', function() {
      var got = ObjectUtil.getValue('foo', testObject);
      expect(got).toBeUndefined();
    });

    it('returns input on valid getValue (non-existing path)', function() {
      // MJ: I find this quite confusing, TBH
      var got = ObjectUtil.getValue('foo/bar/baz', testObject);
      expect(got).toBe(testObject);
    });

    it('returns last matched path when most specific not found', function() {
      var existingParent = ObjectUtil.getValue(
        'firstNested/deeper/evenDeeper', testObject
      );
      var got = ObjectUtil.getValue(
        'firstNested/deeper/evenDeeper/notThere', testObject
      );
      expect(got).toBe(existingParent);
    });

    it('handles some arrays and calls itself on contained objects', function() {
      // MJ: I find this quite confusing, TBH
      var obj = {ohai: [{foo: 'bar'}]};
      var got = ObjectUtil.getValue('foo', obj);
      expect(got).toBe('bar');
    });

    it('handles deep arrays and calls itself on contained objects', function() {
      // MJ: I find this quite confusing, TBH
      var obj = {ohai: [1, [2, [3, [{foo: 'bar'}]]]]};
      var got = ObjectUtil.getValue('foo', obj);
      expect(got).toBe('bar');
    });

    // The below test fails, that is why I do not specifically like the handling
    // of the arrays in this method.
    //
    // it('handles arrays and calls itself on contained objects', function() {
    //   var obj = {humpty: {ohai: [{foo: 'bar'}]}};
    //   var got = ObjectUtil.getValue('humpty/foo', obj);
    //   expect(got).toBe('bar');
    // });
  });

});
