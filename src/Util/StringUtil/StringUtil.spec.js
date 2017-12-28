/*eslint-env jest*/


import {
  StringUtil
} from '../../index';

describe('StringUtil', () => {

  describe('Basics', () => {
    it('is defined', () => {
      expect(StringUtil).toBeDefined();
    });
  });

  describe('Static methods', () => {
    describe('#urlify', () => {
      it('wraps any occurence of a link with an <a> tag', () => {
        let url = 'http://www.bvb.de';
        let text = `Visit ${url}`;
        let got = StringUtil.urlify(text);
        expect(got).toBe(`Visit <a href="${url}" target="_blank">${url}</a>`);

        url = 'https://www.bvb.de';
        text = `Visit ${url}`;
        got = StringUtil.urlify(text);
        expect(got).toBe(`Visit <a href="${url}" target="_blank">${url}</a>`);
      });
    });

    describe('#coerce', () => {
      it('… to boolean', () => {
        const valTrue = 'true';
        const valFalse = 'false';
        const gotTrue = StringUtil.coerce(valTrue);
        const gotFalse = StringUtil.coerce(valFalse);
        expect(gotTrue).toBe(true);
        expect(gotFalse).toBe(false);
      });
      it('… to int', () => {
        const intVal = '1337';
        const intGot = StringUtil.coerce(intVal);

        expect(intGot).toBe(1337);
      });
      it('… to float', () => {
        const floatVal = '73556.08';
        const floatGot = StringUtil.coerce(floatVal);

        expect(floatGot).toBe(73556.08);
      });
      it('… to array', () => {
        const arrayVal = '["merry", 12, "12", false, "true"]';
        const arrayGot = StringUtil.coerce(arrayVal);

        expect(arrayGot.length).toBe(5);
        expect(arrayGot[0]).toBe('merry');
        expect(arrayGot[1]).toBe(12);
        expect(arrayGot[2]).toBe(12);
        expect(arrayGot[3]).toBe(false);
        expect(arrayGot[4]).toBe(true);
      });
      it('… to object', () => {
        const objectVal = '{"a": 12, "b": "12","c": "merry","d": "false", "e": true}';
        const objectGot = StringUtil.coerce(objectVal);

        expect(Object.keys(objectGot).length).toBe(5);
        expect(objectGot.a).toBe(12);
        expect(objectGot.b).toBe(12);
        expect(objectGot.c).toBe('merry');
        expect(objectGot.d).toBe(false);
        expect(objectGot.e).toBe(true);
      });
    });
  });

});
