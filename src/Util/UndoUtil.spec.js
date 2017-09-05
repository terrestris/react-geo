/*eslint-env mocha*/
import expect from 'expect.js';

import UndoUtil from './UndoUtil.js';

describe('UndoUtil', () => {

  describe('Basics', () => {
    it('is defined', () => {
      expect(UndoUtil).to.not.be(undefined);
    });
  });

  describe('Static methods', () => {
    describe('#atLeastOneUndoable', () => {
      it('is defined', () => {
        expect(UndoUtil.atLeastOneUndoable).to.not.be(undefined);
      });
      it('checks if at least one state is undoable or not.', () => {
        let state = {
          entry: {
            present: {
              a: 'a',
              b: 'b',
              c: 'c'
            },
            past: [],
            future: []
          }
        };

        expect(UndoUtil.atLeastOneUndoable(state)).to.be(false);

        state.entry.past.push({
          a: 'past a',
          b: 'past b',
          c: 'past c'
        });

        expect(UndoUtil.atLeastOneUndoable(state)).to.be(true);
      });
    });
    describe('#atLeastOneRedoable', () => {
      it('is defined', () => {
        expect(UndoUtil.atLeastOneRedoable).to.not.be(undefined);
      });
      it('checks if at least one state is redoable or not.', () => {
        let state = {
          entry: {
            present: {
              a: 'a',
              b: 'b',
              c: 'c'
            },
            past: [],
            future: []
          }
        };

        expect(UndoUtil.atLeastOneRedoable(state)).to.be(false);

        state.entry.future.push({
          a: 'past a',
          b: 'past b',
          c: 'past c'
        });

        expect(UndoUtil.atLeastOneRedoable(state)).to.be(true);
      });
    });
  });

});
