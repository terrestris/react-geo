'use strict';

var _expect = require('expect.js');

var _expect2 = _interopRequireDefault(_expect);

var _UndoUtil = require('./UndoUtil.js');

var _UndoUtil2 = _interopRequireDefault(_UndoUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*eslint-env mocha*/
describe('UndoUtil', function () {

  describe('Basics', function () {
    it('is defined', function () {
      (0, _expect2.default)(_UndoUtil2.default).to.not.be(undefined);
    });
  });

  describe('Static methods', function () {
    describe('#atLeastOneUndoable', function () {
      it('is defined', function () {
        (0, _expect2.default)(_UndoUtil2.default.atLeastOneUndoable).to.not.be(undefined);
      });
      it('checks if at least one state is undoable or not.', function () {
        var state = {
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

        (0, _expect2.default)(_UndoUtil2.default.atLeastOneUndoable(state)).to.be(false);

        state.entry.past.push({
          a: 'past a',
          b: 'past b',
          c: 'past c'
        });

        (0, _expect2.default)(_UndoUtil2.default.atLeastOneUndoable(state)).to.be(true);
      });
    });
    describe('#atLeastOneRedoable', function () {
      it('is defined', function () {
        (0, _expect2.default)(_UndoUtil2.default.atLeastOneRedoable).to.not.be(undefined);
      });
      it('checks if at least one state is redoable or not.', function () {
        var state = {
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

        (0, _expect2.default)(_UndoUtil2.default.atLeastOneRedoable(state)).to.be(false);

        state.entry.future.push({
          a: 'past a',
          b: 'past b',
          c: 'past c'
        });

        (0, _expect2.default)(_UndoUtil2.default.atLeastOneRedoable(state)).to.be(true);
      });
    });
  });
});