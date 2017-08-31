import expect from 'expect.js';
import * as Sol from '../src/index';

describe('Sol', () => {
  it('is defined', () => {
    expect(Sol).not.to.be(undefined);
  });
  it('contains module MapBuilder', () => {
    expect(Sol.MapBuilder).not.to.be(undefined);
  });
});
