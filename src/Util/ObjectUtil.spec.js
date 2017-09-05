/*eslint-env mocha*/
import expect from 'expect.js';

import ObjectUtil from './ObjectUtil.js';

describe('ObjectUtil', () => {
  it('is defined', () => {
    expect(ObjectUtil).not.to.be(undefined);
  });

  describe('getValue', () => {
    let testObject;
    beforeEach(function() {
      testObject = {
        firstLevel: true,
        level: 'first',
        firstNested: {
          secondLevel: true,
          level: 'second'
        }
      };
    });

    it('is defined', () => {
      expect(ObjectUtil.getValue).not.to.be(undefined);
    });

    // TODO Enable  after logger implementation
    // it('does throw on empty getValue call', function() {
    //   expect(ObjectUtil.getValue).to.throwError();
    // });

    it('returns as expected on getValue call', function() {

      var retVal1 = ObjectUtil.getValue('level', testObject);
      expect(retVal1).to.be('first');

      var retVal2 = ObjectUtil.getValue('firstNested/level', testObject);
      expect(retVal2).to.be('second');

      var retVal3 = ObjectUtil.getValue('secondLevel', testObject);
      expect(retVal3).to.be(true);
    });
  });

});
