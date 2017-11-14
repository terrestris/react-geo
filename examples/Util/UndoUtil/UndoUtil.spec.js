/*eslint-env jest*/


import {
  UndoUtil
} from '../../index';

describe('UndoUtil', () => {

  describe('Basics', () => {
    it('is defined', () => {
      expect(UndoUtil).toBeDefined();
    });
  });

  describe('Static methods', () => {
    describe('#atLeastOneUndoable', () => {
      it('is defined', () => {
        expect(UndoUtil.atLeastOneUndoable).toBeDefined();
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

        expect(UndoUtil.atLeastOneUndoable(state)).toBe(false);

        state.entry.past.push({
          a: 'past a',
          b: 'past b',
          c: 'past c'
        });

        expect(UndoUtil.atLeastOneUndoable(state)).toBe(true);
      });
    });
    describe('#atLeastOneRedoable', () => {
      it('is defined', () => {
        expect(UndoUtil.atLeastOneRedoable).toBeDefined();
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

        expect(UndoUtil.atLeastOneRedoable(state)).toBe(false);

        state.entry.future.push({
          a: 'past a',
          b: 'past b',
          c: 'past c'
        });

        expect(UndoUtil.atLeastOneRedoable(state)).toBe(true);
      });
    });
  });

});
