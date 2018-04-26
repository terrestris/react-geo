/*eslint-env jest*/
import TestUtil from '../../Util/TestUtil';

import OlLayerVector from 'ol/layer/Vector';
import OlInteractionDraw from 'ol/interaction/Draw';
import OlFeature from 'ol/Feature';
import OlGeomLineString from 'ol/geom/LineString';
import OlGeomPolygon from 'ol/geom/Polygon';
import OlOverlay from 'ol/Overlay';
import OlObservable from 'ol/Observable';

import { MeasureButton } from '../../index';
import MeasureUtil from '@terrestris/ol-util/src/MeasureUtil/MeasureUtil';

describe('<MeasureButton />', () => {

  let map;

  beforeEach(() => {
    map = TestUtil.createMap();
  });

  describe('#Basics', () => {

    it('is defined', () => {
      expect(MeasureButton).not.toBeUndefined();
    });

    it('can be rendered', () => {
      const wrapper = TestUtil.mountComponent(MeasureButton, {
        map: map,
        measureType: 'line'
      });
      expect(wrapper).not.toBeUndefined();
    });

    it('measureType prop must have valid value', () => {
      const wrapper = TestUtil.mountComponent(MeasureButton, {
        map: map,
        measureType: 'line'
      });

      const measureTypeValidValues = [
        'line',
        'area',
        'angle'
      ];

      expect(measureTypeValidValues).toContain(wrapper.props().measureType);

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      wrapper.setProps({
        measureType: 'invalid'
      });

      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Warning: Failed prop type')
      );

      consoleSpy.mockReset();
      consoleSpy.mockRestore();
    });

    it('allows to set some props', () => {
      const wrapper = TestUtil.mountComponent(MeasureButton, {
        map: map,
        measureType: 'line'
      });

      wrapper.setProps({
        measureLayerName: 'measureLayerName',
        fillColor: '#ff0000',
        strokeColor: '#0000ff',
        showMeasureInfoOnClickedPoints: true,
        clickToDrawText: 'Click to draw',
        continuePolygonMsg: 'Continue draw polygon',
        continueLineMsg: 'Continue draw line',
        continueAngleMsg: 'Continue draw angle',
        decimalPlacesInTooltips: 5,
        measureTooltipCssClasses: {
          tooltip: 'tooltip-cls',
          tooltipDynamic: 'dynamic-tooltip-cls',
          tooltipStatic: 'static-tooltip-cls'
        },
        pressed: true
      });

      expect(wrapper.props().measureLayerName).toBe('measureLayerName');
      expect(wrapper.props().fillColor).toBe('#ff0000');
      expect(wrapper.props().strokeColor).toBe('#0000ff');
      expect(wrapper.props().showMeasureInfoOnClickedPoints).toBe(true);
      expect(wrapper.props().clickToDrawText).toBe('Click to draw');
      expect(wrapper.props().continuePolygonMsg).toBe('Continue draw polygon');
      expect(wrapper.props().continueLineMsg).toBe('Continue draw line');
      expect(wrapper.props().continueAngleMsg).toBe('Continue draw angle');
      expect(wrapper.props().decimalPlacesInTooltips).toBe(5);
      expect(wrapper.props().measureTooltipCssClasses).toEqual({
        tooltip: 'tooltip-cls',
        tooltipDynamic: 'dynamic-tooltip-cls',
        tooltipStatic: 'static-tooltip-cls'
      });
      expect(wrapper.props().pressed).toBe(true);

      expect(wrapper.props().measureTooltipCssClasses).toBeInstanceOf(Object);
      expect(wrapper.find('button', {pressed: true}).length).toBe(1);
    });

  });

  describe('#Static methods', () => {

    describe('#onToggle', () => {

      it('calls a given toggle callback method if the pressed state changes', () => {
        const onToggle = jest.fn();

        const props = {
          map: map,
          measureType: 'line',
          onToggle
        };

        const wrapper = TestUtil.mountComponent(MeasureButton, props);

        wrapper.setProps({
          pressed: true
        });

        expect(onToggle).toHaveBeenCalledTimes(1);
      });

      it('changes drawInteraction and event listener state if the button was toggled', () => {
        const wrapper = TestUtil.mountComponent(MeasureButton, {
          map: map,
          measureType: 'angle'
        });

        wrapper.setProps({
          pressed: true
        });

        const instance = wrapper.instance();

        expect(wrapper.state('drawInteraction').getActive()).toBe(true);
        expect(instance._eventKeys.drawstart).toBeDefined();
        expect(instance._eventKeys.drawend).toBeDefined();
        expect(instance._eventKeys.pointermove).toBeDefined();

      });
    });

    describe('#createMeasureLayer', () => {

      it('sets measure layer to state on method call', () => {
        const wrapper = TestUtil.mountComponent(MeasureButton, {
          map: map,
          measureType: 'line'
        });

        expect(wrapper.state('measureLayer')).toBeDefined;
        expect(wrapper.state('measureLayer')).toBeInstanceOf(OlLayerVector);
      });
    });

    describe('#createDrawInteraction', () => {

      it('sets drawInteraction to state on method call', () => {
        const wrapper = TestUtil.mountComponent(MeasureButton, {
          map: map,
          measureType: 'polygon',
          pressed: true
        });

        expect(wrapper.state('drawInteraction')).toBeDefined;
        expect(wrapper.state('drawInteraction')).toBeInstanceOf(OlInteractionDraw);
        expect(wrapper.state('drawInteraction').getActive()).toBeTruthy();
      });
    });

    describe('#onDrawInteractionActiveChange', () => {

      it('calls create/remove tooltip functions depending on drawInteraction active state', () => {
        const wrapper = TestUtil.mountComponent(MeasureButton, {
          map: map,
          measureType: 'polygon',
          pressed: true
        });

        const instance = wrapper.instance();

        const removeHelpTooltipSpy = jest.spyOn(instance, 'removeHelpTooltip');
        const removeMeasureTooltipSpy = jest.spyOn(instance, 'removeMeasureTooltip');
        const createHelpTooltipSpy = jest.spyOn(instance, 'createHelpTooltip');
        const createMeasureTooltipSpy = jest.spyOn(instance, 'createMeasureTooltip');

        wrapper.state('drawInteraction').setActive(false);

        expect(removeHelpTooltipSpy).toHaveBeenCalledTimes(1);
        expect(removeMeasureTooltipSpy).toHaveBeenCalledTimes(1);

        wrapper.state('drawInteraction').setActive(true);

        expect(createHelpTooltipSpy).toHaveBeenCalledTimes(1);
        expect(createMeasureTooltipSpy).toHaveBeenCalledTimes(1);

        jest.resetAllMocks();
        jest.restoreAllMocks();
      });
    });

    describe('#drawStart', () => {

      let mockEvt;
      let wrapper;
      let instance;

      beforeEach(() => {
        mockEvt = {
          feature: new OlFeature()
        };
        wrapper = TestUtil.mountComponent(MeasureButton, {
          map: map,
          measureType: 'line',
          showMeasureInfoOnClickedPoints: true
        });
        wrapper.state('measureLayer').getSource().addFeature(mockEvt.feature);
        instance = wrapper.instance();
      });

      it('sets the feature', () => {
        instance.drawStart(mockEvt);
        expect(instance._feature).toBe(mockEvt.feature);
      });

      it('sets event key for click', () => {
        instance.drawStart(mockEvt);
        expect(instance._eventKeys.click).toBeDefined();
      });

      it('calls cleanup methods', () => {
        const cleanupTooltipsSpy = jest.spyOn(instance, 'cleanupTooltips');
        const createMeasureTooltipSpy = jest.spyOn(instance, 'createMeasureTooltip');
        const createHelpTooltipSpy = jest.spyOn(instance, 'createHelpTooltip');
        const clearSpy = jest.spyOn(wrapper.state('measureLayer').getSource(), 'clear');

        instance.drawStart(mockEvt);

        expect(cleanupTooltipsSpy).toHaveBeenCalledTimes(1);
        expect(createMeasureTooltipSpy).toHaveBeenCalledTimes(1);
        expect(createHelpTooltipSpy).toHaveBeenCalledTimes(1);
        expect(clearSpy).toHaveBeenCalledTimes(1);

        jest.resetAllMocks();
        jest.restoreAllMocks();
      });
    });

    describe('#drawEnd', () => {

      let wrapper;
      let instance;
      let mockEvt;

      beforeEach(() => {
        wrapper = TestUtil.mountComponent(MeasureButton, {
          map: map,
          measureType: 'line',
          showMeasureInfoOnClickedPoints: true
        });
        instance = wrapper.instance();
        mockEvt = {};
      });

      it ('unsets click event key', () => {

        instance._eventKeys.click = jest.fn();

        const unByKeySpy = jest.spyOn(OlObservable, 'unByKey');

        instance.drawEnd(mockEvt);

        expect(unByKeySpy).toHaveBeenCalledTimes(1);

        unByKeySpy.mockReset();
        unByKeySpy.mockRestore();
      });

      it ('calls removeMeasureTooltip method', () => {
        wrapper.setProps({
          showMeasureInfoOnClickedPoints: true
        });
        const removeMeasureTooltipSpy = jest.spyOn(instance, 'removeMeasureTooltip');
        instance.drawEnd(mockEvt);
        expect(removeMeasureTooltipSpy).toHaveBeenCalledTimes(1);
        jest.resetAllMocks();
        jest.restoreAllMocks();
      });

      it ('sets correct properties on measureTooltipElement', () => {
        wrapper.setProps({
          showMeasureInfoOnClickedPoints: false
        });

        instance.createMeasureTooltip();
        instance.drawEnd(mockEvt);

        const expectedClassName = 'react-geo-measure-tooltip react-geo-measure-tooltip-static';
        const expectedOffset = [0, -7];
        expect(instance._measureTooltipElement.className).toContain(expectedClassName);
        expect(instance._measureTooltip.getOffset()).toEqual(expectedOffset);
      });

      it ('unsets the feature', () => {
        instance.drawEnd(mockEvt);
        expect(instance._feature).toBeNull;
      });

      it ('calls createMeasureTooltip method', () => {
        wrapper.setProps({
          showMeasureInfoOnClickedPoints: true
        });
        const createMeasureTooltipSpy = jest.spyOn(instance, 'createMeasureTooltip');
        instance.drawEnd(mockEvt);
        expect(createMeasureTooltipSpy).toHaveBeenCalledTimes(1);
        jest.resetAllMocks();
        jest.restoreAllMocks();
      });
    });

    describe('#addMeasureStopTooltip', () => {

      let wrapper;
      let instance;
      let mockEvt;
      let mockLineFeat;

      beforeEach(() => {
        wrapper = TestUtil.mountComponent(MeasureButton, {
          map: map,
          measureType: 'line'
        });
        instance = wrapper.instance();
        mockEvt = {
          coordinate: [100, 100]
        };
        mockLineFeat = new OlFeature({
          geometry: new OlGeomLineString([[0, 0], [0, 100]])
        });
      });

      it('becomes a lineString feature with valid geometry', () => {

        instance._feature = mockLineFeat;
        instance.addMeasureStopTooltip(mockEvt);

        expect(instance._feature).toBeDefined();
        expect(instance._feature.getGeometry()).toBeDefined();

        const value = MeasureUtil.formatLength(instance._feature.getGeometry(), map, 0);
        expect(value).toBe('100 m');
      });

      it('becomes a polygon feature with valid geometry', () => {

        const polyCoords = [
          [0, 0],
          [0, 10],
          [10, 10],
          [10, 0],
          [0, 0]
        ];
        const mockPolyFeat = new OlFeature({
          geometry: new OlGeomPolygon([polyCoords])
        });

        wrapper.setProps({
          measureType: 'polygon'
        });

        instance._feature = mockPolyFeat;
        instance.addMeasureStopTooltip(mockEvt);

        expect(instance._feature).toBeDefined();
        expect(instance._feature.getGeometry()).toBeDefined();

        const value = MeasureUtil.formatArea(instance._feature.getGeometry(), map, 0);
        expect(value).toBe('100 m<sup>2</sup>');
      });

      it('adds a tooltip overlay with correct properties and position to the map', () => {

        wrapper.setProps({
          measureType: 'line'
        });

        instance._feature = mockLineFeat;
        instance.addMeasureStopTooltip(mockEvt);

        const value = MeasureUtil.formatLength(instance._feature.getGeometry(), map, 0);
        expect(parseInt(value, 10)).toBeGreaterThan(10);

        const overlays = map.getOverlays();
        expect(overlays.getArray().length).toBe(1);

        const overlay = overlays.getArray()[0];
        const offset = overlay.getOffset();
        const positioning = overlay.getPositioning();
        const className = overlay.getElement().className;

        expect(offset).toEqual([0, -15]);
        expect(positioning).toBe('bottom-center');
        expect(className).toBe('react-geo-measure-tooltip react-geo-measure-tooltip-static');
        expect(overlay.getPosition()).toEqual(mockEvt.coordinate);

        expect(instance._createdTooltipDivs.length).toBe(1);
        expect(instance._createdTooltipOverlays.length).toBe(1);
      });
    });

    describe('#createMeasureTooltip', () => {

      let wrapper;
      let instance;

      beforeEach(() => {
        wrapper = TestUtil.mountComponent(MeasureButton, {
          map: map,
          measureType: 'line'
        });
        instance = wrapper.instance();
      });

      it('returns undefined if measureTooltipElement already set', () => {
        instance._measureTooltipElement = 'some value';
        const expectedOutput = instance.createMeasureTooltip();
        expect(expectedOutput).toBeUndefined();
      });

      it('adds a tooltip overlay with correct properties', () => {

        instance.createMeasureTooltip();

        const overlays = map.getOverlays();
        expect(overlays.getArray().length).toBe(1);

        const overlay = overlays.getArray()[0];
        const offset = overlay.getOffset();
        const positioning = overlay.getPositioning();
        const className = overlay.getElement().className;

        expect(offset).toEqual([0, -15]);
        expect(positioning).toBe('bottom-center');
        expect(className).toBe('react-geo-measure-tooltip react-geo-measure-tooltip-dynamic');
      });
    });

    describe('#createHelpTooltip', () => {

      let wrapper;
      let instance;

      beforeEach(() => {
        wrapper = TestUtil.mountComponent(MeasureButton, {
          map: map,
          measureType: 'line'
        });
        instance = wrapper.instance();
      });

      it('returns undefined if _helpTooltipElement already set', () => {
        instance._helpTooltipElement = 'some value';
        const expectedOutput = instance.createHelpTooltip();
        expect(expectedOutput).toBeUndefined();
      });

      it('adds a tooltip overlay with correct properties', () => {

        instance.createHelpTooltip();

        const overlays = map.getOverlays();
        expect(overlays.getArray().length).toBe(1);

        const overlay = overlays.getArray()[0];
        const offset = overlay.getOffset();
        const positioning = overlay.getPositioning();
        const className = overlay.getElement().className;

        expect(offset).toEqual([15, 0]);
        expect(positioning).toBe('center-left');
        expect(className).toBe('react-geo-measure-tooltip');
      });
    });

    describe('#removeHelpTooltip', () => {

      let wrapper;
      let instance;

      beforeEach(() => {
        wrapper = TestUtil.mountComponent(MeasureButton, {
          map: map,
          measureType: 'line'
        });
        instance = wrapper.instance();
      });

      it ('removes help tooltip overlay from the map', () => {
        instance._helpTooltipElement = document.createElement('div');
        instance._helpTooltip = new OlOverlay({
          element: instance._helpTooltipElement
        });
        map.addOverlay(instance._helpTooltip);

        let overlayLength = map.getOverlays().getArray().length;
        expect(overlayLength).toBe(1);

        instance.removeHelpTooltip();
        overlayLength = map.getOverlays().getArray().length;
        expect(overlayLength).toBe(0);

      });

      it ('resets help tooltips', () => {
        instance.removeHelpTooltip();

        expect(instance._helpTooltipElement).toBeNull();
        expect(instance._helpTooltip).toBeNull();
      });
    });

    describe('#removeMeasureTooltip', () => {

      let wrapper;
      let instance;

      beforeEach(() => {
        wrapper = TestUtil.mountComponent(MeasureButton, {
          map: map,
          measureType: 'line'
        });
        instance = wrapper.instance();
      });

      it ('removes measure tooltip overlay from the map', () => {
        instance._measureTooltipElement = document.createElement('div');
        instance._measureTooltip = new OlOverlay({
          element: instance._measureTooltipElement
        });
        map.addOverlay(instance._measureTooltip);

        let overlayLength = map.getOverlays().getArray().length;
        expect(overlayLength).toBe(1);

        instance.removeMeasureTooltip();
        overlayLength = map.getOverlays().getArray().length;
        expect(overlayLength).toBe(0);

      });

      it ('resets measure tooltips', () => {
        instance.removeMeasureTooltip();

        expect(instance._helpTooltipElement).toBeNull();
        expect(instance._helpTooltip).toBeNull();
      });
    });

    describe('#cleanupTooltips', () => {

      let wrapper;
      let instance;
      let tooltipDiv1;
      let tooltipDiv2;
      let tooltip1;
      let tooltip2;

      beforeEach(() => {
        wrapper = TestUtil.mountComponent(MeasureButton, {
          map: map,
          measureType: 'line'
        });
        instance = wrapper.instance();

        tooltipDiv1 = document.createElement('div');
        tooltipDiv2 = document.createElement('div');
        tooltip1 = new OlOverlay({
          element: tooltipDiv1
        });
        tooltip2 = new OlOverlay({
          element: tooltipDiv2
        });
      });

      it ('removes tooltip overlays from the map', () => {
        instance._createdTooltipOverlays.push(tooltip1, tooltip2);

        map.addOverlay(tooltip1);
        map.addOverlay(tooltip2);

        expect(instance._createdTooltipOverlays.length).toBe(2);
        expect(map.getOverlays().getArray().length).toBe(2);

        instance.cleanupTooltips();

        expect(instance._createdTooltipOverlays.length).toBe(0);
      });

      it ('removes tooltip divs', () => {
        instance._createdTooltipDivs.push(tooltipDiv1, tooltipDiv2);

        expect(instance._createdTooltipDivs.length).toBe(2);

        instance.cleanupTooltips();

        expect(instance._createdTooltipDivs.length).toBe(0);
      });
    });

    describe('#cleanup', () => {

      let wrapper;
      let instance;

      beforeEach(() => {
        wrapper = TestUtil.mountComponent(MeasureButton, {
          map: map,
          measureType: 'line'
        });
        instance = wrapper.instance();
      });

      it ('sets draw interaction state to false', () => {
        instance.createDrawInteraction();
        wrapper.state('drawInteraction').setActive(true);

        instance.cleanup();

        expect(wrapper.state('drawInteraction').getActive()).not.toBeTruthy();
      });

      it ('unbinds all event keys', () => {

        instance._eventKeys = {
          drawstart: jest.fn(),
          drawend: jest.fn(),
          pointermove: jest.fn(),
          click: jest.fn(),
        };

        OlObservable.unByKey = jest.fn();

        instance.cleanup();

        expect(OlObservable.unByKey).toHaveBeenCalledTimes(4);
      });

      it ('calls cleanupTooltips method', () => {

        const cleanupSpy = jest.spyOn(instance, 'cleanupTooltips');

        instance.cleanup();

        expect(cleanupSpy).toHaveBeenCalledTimes(1);

        cleanupSpy.mockReset();
        cleanupSpy.mockRestore();
      });

      it ('clears measureLayer source', () => {
        instance.createMeasureLayer();

        const mockFeat = new OlFeature();

        wrapper.state('measureLayer').getSource().addFeature(mockFeat);
        expect(wrapper.state('measureLayer').getSource().getFeatures().length).toBe(1);

        instance.cleanup();

        expect(wrapper.state('measureLayer').getSource().getFeatures().length).toBe(0);
      });
    });

    describe('#updateMeasureTooltip', () => {

      let wrapper;
      let instance;
      let mockEvt;

      beforeEach(() => {
        wrapper = TestUtil.mountComponent(MeasureButton, {
          map: map,
          measureType: 'line'
        });
        instance = wrapper.instance();
        mockEvt = {
          coordinate: [100, 100]
        };
      });

      it ('returns undefined by dragging state', () => {
        mockEvt.dragging = true;
        const expectedOutput = instance.updateMeasureTooltip(mockEvt);
        expect(expectedOutput).toBeUndefined();
      });

      it ('returns undefined if measure and tooltip elements are not set', () => {
        const expectedOutput = instance.updateMeasureTooltip(mockEvt);
        expect(expectedOutput).toBeUndefined();
      });

      it ('sets correct help message and tooltip position for line measurements', () => {
        const mockLineFeat = new OlFeature({
          geometry: new OlGeomLineString([[0, 0], [0, 100]])
        });
        instance._feature = mockLineFeat;

        instance._helpTooltipElement = document.createElement('div');
        instance._measureTooltipElement = document.createElement('div');
        instance._helpTooltip = new OlOverlay({
          element: instance._helpTooltipElement
        });
        instance._measureTooltip = new OlOverlay({
          element: instance._measureTooltipElement
        });

        instance.updateMeasureTooltip(mockEvt);

        expect(instance._measureTooltipElement.innerHTML).toBe('99.89 m');
        expect(instance._measureTooltip.getPosition()).toEqual([0, 100]);

        expect(instance._helpTooltipElement.innerHTML).toBe('Click to draw line');
        expect(instance._helpTooltip.getPosition()).toEqual(mockEvt.coordinate);
      });

      it ('sets correct help message and tooltip position for area measurements', () => {

        const polyCoords = [
          [0, 0],
          [0, 10],
          [10, 10],
          [10, 0],
          [0, 0]
        ];
        const mockPolyFeat = new OlFeature({
          geometry: new OlGeomPolygon([polyCoords])
        });

        instance._feature = mockPolyFeat;

        wrapper.setProps({
          measureType: 'polygon'
        });

        instance._helpTooltipElement = document.createElement('div');
        instance._measureTooltipElement = document.createElement('div');
        instance._helpTooltip = new OlOverlay({
          element: instance._helpTooltipElement
        });
        instance._measureTooltip = new OlOverlay({
          element: instance._measureTooltipElement
        });

        instance.updateMeasureTooltip(mockEvt);

        expect(instance._measureTooltipElement.innerHTML).toBe('99.78 m<sup>2</sup>');
        // Interior point as XYM coordinate, where M is the length of the horizontal
        // intersection that the point belongs to
        expect(instance._measureTooltip.getPosition()).toEqual([5, 5, 10]);

        expect(instance._helpTooltipElement.innerHTML).toBe('Click to draw area');
        expect(instance._helpTooltip.getPosition()).toEqual(mockEvt.coordinate);
      });

      it ('sets correct help message and tooltip position for angle measurements', () => {
        const mockLineFeat = new OlFeature({
          geometry: new OlGeomLineString([[0, 0], [0, 100]])
        });
        instance._feature = mockLineFeat;

        wrapper.setProps({
          measureType: 'angle'
        });

        instance._helpTooltipElement = document.createElement('div');
        instance._measureTooltipElement = document.createElement('div');
        instance._helpTooltip = new OlOverlay({
          element: instance._helpTooltipElement
        });
        instance._measureTooltip = new OlOverlay({
          element: instance._measureTooltipElement
        });

        instance.updateMeasureTooltip(mockEvt);

        expect(instance._measureTooltipElement.innerHTML).toBe('0°');
        expect(instance._measureTooltip.getPosition()).toEqual([0, 100]);

        expect(instance._helpTooltipElement.innerHTML).toBe('Click to draw angle');
        expect(instance._helpTooltip.getPosition()).toEqual(mockEvt.coordinate);
      });
    });
  });
});
