/*eslint-env mocha*/
import expect from 'expect.js';
import OlDragRotateAndZoom from 'ol/interaction/dragrotateandzoom';
import OlDraw from 'ol/interaction/draw';
import sinon from 'sinon';

import TestUtils from './TestUtils.js';
import Logger from './Logger.js';
import MapUtil from './MapUtil.js';

describe('MapUtil', () => {
  let map;

  beforeEach(() => {
    map = TestUtils.createMap();
  });

  afterEach(() => {
    TestUtils.removeMap(map);
  });

  it('is defined', () => {
    expect(MapUtil).to.not.be(undefined);
  });

  describe('#getInteractionsByName', () => {
    it('is defined', () => {
      expect(MapUtil.getInteractionsByName).to.not.be(undefined);
    });

    it('needs to be called with a map instance', () => {
      const logSpy = sinon.spy(Logger, 'debug');

      let returnedInteractions = MapUtil.getInteractionsByName(null, 'BVB!');

      expect(logSpy).to.have.property('callCount', 1);
      expect(returnedInteractions).to.have.length(0);

      Logger.debug.restore();
    });

    it('returns an empty array if no interaction candidate is found', () => {
      let dragInteractionName = 'Drag Queen';
      let dragInteraction = new OlDragRotateAndZoom();
      dragInteraction.set('name', dragInteractionName);
      map.addInteraction(dragInteraction);

      let returnedInteractions = MapUtil.getInteractionsByName(
        map, `${dragInteractionName} NOT AVAILABLE`);

      expect(returnedInteractions).to.have.length(0);
    });

    it('returns the requested interactions by name', () => {
      let dragInteractionName = 'Drag Queen';
      let dragInteraction = new OlDragRotateAndZoom();
      dragInteraction.set('name', dragInteractionName);
      map.addInteraction(dragInteraction);

      let returnedInteractions = MapUtil.getInteractionsByName(
        map, dragInteractionName);

      expect(returnedInteractions).to.have.length(1);

      let anotherDragInteraction = new OlDragRotateAndZoom();
      anotherDragInteraction.set('name', dragInteractionName);
      map.addInteraction(anotherDragInteraction);

      returnedInteractions = MapUtil.getInteractionsByName(
        map, dragInteractionName);

      expect(returnedInteractions).to.have.length(2);
    });
  });

  describe('#getInteractionsByClass', () => {
    it('is defined', () => {
      expect(MapUtil.getInteractionsByClass).to.not.be(undefined);
    });

    it('needs to be called with a map instance', () => {
      const logSpy = sinon.spy(Logger, 'debug');

      let returnedInteractions = MapUtil.getInteractionsByClass(null, OlDragRotateAndZoom);

      expect(logSpy).to.have.property('callCount', 1);
      expect(returnedInteractions).to.have.length(0);

      Logger.debug.restore();
    });

    it('returns an empty array if no interaction candidate is found', () => {
      let dragInteraction = new OlDragRotateAndZoom();
      map.addInteraction(dragInteraction);

      let returnedInteractions = MapUtil.getInteractionsByClass(
        map, OlDraw);

      expect(returnedInteractions).to.have.length(0);
    });

    it('returns the requested interactions by class', () => {
      let dragInteraction = new OlDragRotateAndZoom();
      map.addInteraction(dragInteraction);

      let returnedInteractions = MapUtil.getInteractionsByClass(
        map, OlDragRotateAndZoom);

      expect(returnedInteractions).to.have.length(1);

      let anotherDragInteraction = new OlDragRotateAndZoom();
      map.addInteraction(anotherDragInteraction);

      returnedInteractions = MapUtil.getInteractionsByClass(
        map, OlDragRotateAndZoom);

      expect(returnedInteractions).to.have.length(2);
    });
  });
});
