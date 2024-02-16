import MeasureUtil from '@terrestris/ol-util/dist/MeasureUtil/MeasureUtil';
import {EventTargetLike} from 'ol/events/Target';
import OlFeature from 'ol/Feature';
import OlGeomLineString from 'ol/geom/LineString';
import OlGeomPoint from 'ol/geom/Point';
import OlGeomPolygon from 'ol/geom/Polygon';
import OlInteractionDraw, {DrawEvent} from 'ol/interaction/Draw';
import OlLayerVector from 'ol/layer/Vector';
import OlMap from 'ol/Map';
import * as OlObservable from 'ol/Observable';
import OlOverlay from 'ol/Overlay';

import TestUtil, {Wrapper} from '../../Util/TestUtil';
import MeasureButton, {MeasureButtonProps} from './MeasureButton';

describe('<MeasureButton />', () => {

  let map: OlMap;

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

      const props: MeasureButtonProps = wrapper.props() as MeasureButtonProps;
      expect(props.measureLayerName).toBe('measureLayerName');
      expect(props.fillColor).toBe('#ff0000');
      expect(props.strokeColor).toBe('#0000ff');
      expect(props.showMeasureInfoOnClickedPoints).toBe(true);
      expect(props.clickToDrawText).toBe('Click to draw');
      expect(props.continuePolygonMsg).toBe('Continue draw polygon');
      expect(props.continueLineMsg).toBe('Continue draw line');
      expect(props.continueAngleMsg).toBe('Continue draw angle');
      expect(props.decimalPlacesInTooltips).toBe(5);
      expect(props.measureTooltipCssClasses).toEqual({
        tooltip: 'tooltip-cls',
        tooltipDynamic: 'dynamic-tooltip-cls',
        tooltipStatic: 'static-tooltip-cls'
      });
      expect(props.pressed).toBe(true);

      expect(props.measureTooltipCssClasses).toBeInstanceOf(Object);
      expect(wrapper.find('button').length).toBe(1);
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

        const instance: MeasureButton = wrapper.instance() as MeasureButton;

        expect(instance._drawInteraction?.getActive()).toBe(true);
        expect(instance._eventKeys?.drawstart).toBeDefined();
        expect(instance._eventKeys?.drawend).toBeDefined();
        expect(instance._eventKeys?.pointermove).toBeDefined();

      });
    });

    describe('#createMeasureLayer', () => {

      it('sets measure layer to state on method call', () => {
        const wrapper = TestUtil.mountComponent(MeasureButton, {
          map: map,
          measureType: 'line'
        });

        const instance: MeasureButton = wrapper.instance() as MeasureButton;

        expect(instance._measureLayer).toBeDefined();
        expect(instance._measureLayer).toBeInstanceOf(OlLayerVector);
      });
    });

    describe('#createDrawInteraction', () => {

      it('sets drawInteraction to state on method call', () => {
        const wrapper = TestUtil.mountComponent(MeasureButton, {
          map: map,
          measureType: 'polygon',
          pressed: true
        });

        const instance: MeasureButton = wrapper.instance() as MeasureButton;

        expect(instance._drawInteraction).toBeDefined();
        expect(instance._drawInteraction).toBeInstanceOf(OlInteractionDraw);
        expect(instance._drawInteraction?.getActive()).toBeTruthy();
      });
    });

    describe('#onDrawInteractionActiveChange', () => {

      it('calls create/remove tooltip functions depending on drawInteraction active state', () => {
        const wrapper = TestUtil.mountComponent(MeasureButton, {
          map: map,
          measureType: 'polygon',
          pressed: true
        });

        const instance: MeasureButton = wrapper.instance() as MeasureButton;

        const removeHelpTooltipSpy = jest.spyOn(instance, 'removeHelpTooltip');
        const removeMeasureTooltipSpy = jest.spyOn(instance, 'removeMeasureTooltip');
        const createHelpTooltipSpy = jest.spyOn(instance, 'createHelpTooltip');
        const createMeasureTooltipSpy = jest.spyOn(instance, 'createMeasureTooltip');

        instance._drawInteraction?.setActive(false);

        expect(removeHelpTooltipSpy).toHaveBeenCalledTimes(1);
        expect(removeMeasureTooltipSpy).toHaveBeenCalledTimes(1);

        instance._drawInteraction?.setActive(true);

        expect(createHelpTooltipSpy).toHaveBeenCalledTimes(1);
        expect(createMeasureTooltipSpy).toHaveBeenCalledTimes(1);

        removeHelpTooltipSpy.mockRestore();
        removeMeasureTooltipSpy.mockRestore();
        createHelpTooltipSpy.mockRestore();
        createMeasureTooltipSpy.mockRestore();
      });
    });

    describe('#drawStart', () => {

      let mockEvt: Partial<DrawEvent>;
      let wrapper: Wrapper;
      let instance: MeasureButton;

      beforeEach(() => {
        mockEvt = {
          feature: new OlFeature({
            geometry: new OlGeomPoint([0, 0])
          })
        };
        wrapper = TestUtil.mountComponent(MeasureButton, {
          map: map,
          measureType: 'line',
          showMeasureInfoOnClickedPoints: true
        });
        instance = wrapper.instance() as MeasureButton;
        instance._measureLayer?.getSource()?.addFeature(mockEvt.feature!);
      });

      it('sets the feature', () => {
        instance.onDrawStart(mockEvt as DrawEvent);
        expect(instance._feature).toBe(mockEvt.feature);
      });

      it('sets event key for click', () => {
        instance.onDrawStart(mockEvt as DrawEvent);
        expect(instance._eventKeys.click).toBeDefined();
      });

      it('calls cleanup methods', () => {
        const cleanupTooltipsSpy = jest.spyOn(instance, 'cleanupTooltips');
        const createMeasureTooltipSpy = jest.spyOn(instance, 'createMeasureTooltip');
        const createHelpTooltipSpy = jest.spyOn(instance, 'createHelpTooltip');
        const clearSpy = jest.spyOn(instance._measureLayer?.getSource()!, 'clear');

        instance.onDrawStart(mockEvt as DrawEvent);

        expect(cleanupTooltipsSpy).toHaveBeenCalledTimes(1);
        expect(createMeasureTooltipSpy).toHaveBeenCalledTimes(1);
        expect(createHelpTooltipSpy).toHaveBeenCalledTimes(1);
        expect(clearSpy).toHaveBeenCalledTimes(1);

        cleanupTooltipsSpy.mockRestore();
        createMeasureTooltipSpy.mockRestore();
        createHelpTooltipSpy.mockRestore();
        clearSpy.mockRestore();
      });
    });

    describe('#drawEnd', () => {

      let mockEvt: Partial<DrawEvent>;
      let wrapper: Wrapper;
      let instance: MeasureButton;

      beforeEach(() => {
        wrapper = TestUtil.mountComponent(MeasureButton, {
          map: map,
          measureType: 'line',
          showMeasureInfoOnClickedPoints: true
        });
        instance = wrapper.instance() as MeasureButton;
        mockEvt = {
          feature: new OlFeature({
            geometry: new OlGeomPoint([0, 0])
          })
        };
      });

      it ('unsets click event key', () => {

        instance._eventKeys.click = {
          target: {
            removeEventListener: jest.fn()
          } as unknown as EventTargetLike,
          listener: jest.fn(),
          type: 'click'
        };

        const unByKeySpy = jest.spyOn(OlObservable, 'unByKey');

        instance.onDrawEnd(mockEvt as DrawEvent);

        expect(unByKeySpy).toHaveBeenCalledTimes(1);

        unByKeySpy.mockRestore();
      });

      it ('calls removeMeasureTooltip method', () => {
        wrapper.setProps({
          showMeasureInfoOnClickedPoints: true
        });
        const removeMeasureTooltipSpy = jest.spyOn(instance, 'removeMeasureTooltip');
        instance.onDrawEnd(mockEvt as DrawEvent);
        expect(removeMeasureTooltipSpy).toHaveBeenCalledTimes(1);
        removeMeasureTooltipSpy.mockRestore();
      });

      it ('sets correct properties on measureTooltipElement', () => {
        wrapper.setProps({
          showMeasureInfoOnClickedPoints: false
        });

        instance.createMeasureTooltip();
        instance.onDrawEnd(mockEvt as DrawEvent);

        const expectedClassName = 'react-geo-measure-tooltip react-geo-measure-tooltip-static';
        const expectedOffset = [0, -7];
        expect(instance._measureTooltipElement?.className).toContain(expectedClassName);
        expect(instance._measureTooltip?.getOffset()).toEqual(expectedOffset);
      });

      it ('unsets the feature', () => {
        instance.onDrawEnd(mockEvt as DrawEvent);
        expect(instance._feature).toBeNull();
      });

      it ('calls createMeasureTooltip method', () => {
        wrapper.setProps({
          showMeasureInfoOnClickedPoints: true
        });
        const createMeasureTooltipSpy = jest.spyOn(instance, 'createMeasureTooltip');
        instance.onDrawEnd(mockEvt as DrawEvent);
        expect(createMeasureTooltipSpy).toHaveBeenCalledTimes(1);
        createMeasureTooltipSpy.mockRestore();
      });
    });

    describe('#addMeasureStopTooltip', () => {

      let wrapper: Wrapper;
      let instance: MeasureButton;
      let coordinate: number[];
      let mockLineFeat: OlFeature<OlGeomLineString>;

      beforeEach(() => {
        wrapper = TestUtil.mountComponent(MeasureButton, {
          map: map,
          measureType: 'line'
        });
        instance = wrapper.instance() as MeasureButton;
        coordinate = [100, 100];
        mockLineFeat = new OlFeature({
          geometry: new OlGeomLineString([[0, 0], [0, 100]])
        });
      });

      it('becomes a lineString feature with valid geometry', () => {

        instance._feature = mockLineFeat;
        instance.addMeasureStopTooltip(coordinate);

        expect(instance._feature).toBeDefined();
        expect(instance._feature.getGeometry()).toBeDefined();

        const geometry = instance._feature?.getGeometry() as OlGeomLineString;
        const value = MeasureUtil.formatLength(geometry, map, 2);
        expect(value).toBe('99.89 m');
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
        instance.addMeasureStopTooltip(coordinate);

        expect(instance._feature).toBeDefined();
        expect(instance._feature.getGeometry()).toBeDefined();

        const geometry = instance._feature?.getGeometry() as OlGeomPolygon;
        const value = MeasureUtil.formatArea(geometry, map, 2);
        expect(value).toBe('99.78 m<sup>2</sup>');
      });

      it('adds a tooltip overlay with correct properties and position to the map', () => {

        wrapper.setProps({
          measureType: 'line'
        });

        instance._feature = mockLineFeat;
        instance.addMeasureStopTooltip(coordinate);

        const geometry = instance._feature?.getGeometry() as OlGeomLineString;
        const value = MeasureUtil.formatLength(geometry, map, 2);
        expect(parseInt(value, 10)).toBeGreaterThan(10);

        const overlays = map.getOverlays();
        expect(overlays.getArray().length).toBe(1);

        const overlay = overlays.getArray()[0];
        const offset = overlay.getOffset();
        const positioning = overlay.getPositioning();
        const className = overlay.getElement()?.className;

        expect(offset).toEqual([0, -15]);
        expect(positioning).toBe('bottom-center');
        expect(className).toBe('react-geo-measure-tooltip react-geo-measure-tooltip-static');
        expect(overlay.getPosition()).toEqual(coordinate);

        expect(instance._createdTooltipDivs.length).toBe(1);
        expect(instance._createdTooltipOverlays.length).toBe(1);
      });
    });

    describe('#createMeasureTooltip', () => {

      let wrapper: Wrapper;
      let instance: MeasureButton;

      beforeEach(() => {
        wrapper = TestUtil.mountComponent(MeasureButton, {
          map: map,
          measureType: 'line'
        });
        instance = wrapper.instance() as MeasureButton;
      });

      it('returns undefined if measureTooltipElement already set', () => {
        const div = document.createElement('div');
        div.innerHTML = 'some value';
        instance._measureTooltipElement = div;
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
        const className = overlay.getElement()?.className;

        expect(offset).toEqual([0, -15]);
        expect(positioning).toBe('bottom-center');
        expect(className).toBe('react-geo-measure-tooltip react-geo-measure-tooltip-dynamic');
      });
    });

    describe('#createHelpTooltip', () => {

      let wrapper: Wrapper;
      let instance: MeasureButton;

      beforeEach(() => {
        wrapper = TestUtil.mountComponent(MeasureButton, {
          map: map,
          measureType: 'line'
        });
        instance = wrapper.instance() as MeasureButton;
      });

      it('returns undefined if _helpTooltipElement already set', () => {
        const div = document.createElement('div');
        div.innerHTML = 'some value';
        instance._helpTooltipElement = div;
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
        const className = overlay.getElement()?.className;

        expect(offset).toEqual([15, 0]);
        expect(positioning).toBe('center-left');
        expect(className).toBe('react-geo-measure-tooltip');
      });
    });

    describe('#removeHelpTooltip', () => {

      let wrapper: Wrapper;
      let instance: MeasureButton;

      beforeEach(() => {
        wrapper = TestUtil.mountComponent(MeasureButton, {
          map: map,
          measureType: 'line'
        });
        instance = wrapper.instance() as MeasureButton;
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

      let wrapper: Wrapper;
      let instance: MeasureButton;

      beforeEach(() => {
        wrapper = TestUtil.mountComponent(MeasureButton, {
          map: map,
          measureType: 'line'
        });
        instance = wrapper.instance() as MeasureButton;
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

      let wrapper: Wrapper;
      let instance: MeasureButton;
      let tooltipDiv1: HTMLDivElement;
      let tooltipDiv2: HTMLDivElement;
      let tooltip1: OlOverlay;
      let tooltip2: OlOverlay;

      beforeEach(() => {
        wrapper = TestUtil.mountComponent(MeasureButton, {
          map: map,
          measureType: 'line'
        });
        instance = wrapper.instance() as MeasureButton;

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

      let wrapper: Wrapper;
      let instance: MeasureButton;

      beforeEach(() => {
        wrapper = TestUtil.mountComponent(MeasureButton, {
          map: map,
          measureType: 'line'
        });
        instance = wrapper.instance() as MeasureButton;
      });

      it ('sets draw interaction state to false', () => {
        instance.createDrawInteraction();
        instance._drawInteraction?.setActive(true);

        instance.cleanup();

        expect(instance._drawInteraction?.getActive()).not.toBeTruthy();
      });

      it ('unbinds all event keys', () => {

        instance._eventKeys = {
          drawstart:  {
            target: {} as EventTargetLike,
            listener: jest.fn(),
            type: 'click'
          },
          drawend:  {
            target: {} as EventTargetLike,
            listener: jest.fn(),
            type: 'click'
          },
          pointermove:  {
            target: {} as EventTargetLike,
            listener: jest.fn(),
            type: 'click'
          },
          click:  {
            target: {} as EventTargetLike,
            listener: jest.fn(),
            type: 'click'
          },
          change:  {
            target: {} as EventTargetLike,
            listener: jest.fn(),
            type: 'click'
          }
        };

        // @ts-ignore
        OlObservable.unByKey = jest.fn();

        instance.cleanup();

        expect(OlObservable.unByKey).toHaveBeenCalledTimes(5);
      });

      it ('calls cleanupTooltips method', () => {

        const cleanupSpy = jest.spyOn(instance, 'cleanupTooltips');

        instance.cleanup();

        expect(cleanupSpy).toHaveBeenCalledTimes(1);

        cleanupSpy.mockRestore();
      });

      it ('clears measureLayer source', () => {
        instance.createMeasureLayer();

        const mockFeat = new OlFeature();

        instance._measureLayer?.getSource()?.addFeature(mockFeat);
        expect(instance._measureLayer?.getSource()?.getFeatures().length).toBe(1);

        instance.cleanup();

        expect(instance._measureLayer?.getSource()?.getFeatures().length).toBe(0);
      });
    });

    describe('#updateMeasureTooltip', () => {

      let wrapper: Wrapper;
      let instance: MeasureButton;

      beforeEach(() => {
        wrapper = TestUtil.mountComponent(MeasureButton, {
          map: map,
          measureType: 'line'
        });
        instance = wrapper.instance() as MeasureButton;
      });

      it ('returns undefined if measure and tooltip elements are not set', () => {
        const expectedOutput = instance.updateMeasureTooltip();
        expect(expectedOutput).toBeUndefined();
      });

      it ('sets correct tooltip position for line measurements', () => {
        instance._feature = new OlFeature({
          geometry: new OlGeomLineString([[0, 0], [0, 100]])
        });

        instance._measureTooltipElement = document.createElement('div');
        instance._measureTooltip = new OlOverlay({
          element: instance._measureTooltipElement
        });

        instance.updateMeasureTooltip();

        expect(instance._measureTooltipElement.innerHTML).toBe('99.89 m');
        expect(instance._measureTooltip.getPosition()).toEqual([0, 100]);
      });

      it ('sets correct tooltip position for area measurements', () => {

        const polyCoords = [
          [0, 0],
          [0, 10],
          [10, 10],
          [10, 0],
          [0, 0]
        ];
        instance._feature = new OlFeature({
          geometry: new OlGeomPolygon([polyCoords])
        });

        wrapper.setProps({
          measureType: 'polygon'
        });

        instance._measureTooltipElement = document.createElement('div');
        instance._measureTooltip = new OlOverlay({
          element: instance._measureTooltipElement
        });

        instance.updateMeasureTooltip();

        expect(instance._measureTooltipElement.innerHTML).toBe('99.78 m<sup>2</sup>');
        // Interior point as XYM coordinate, where M is the length of the horizontal
        // intersection that the point belongs to
        expect(instance._measureTooltip.getPosition()).toEqual([5, 5, 10]);
      });

      it ('sets correct tooltip position for angle measurements', () => {
        instance._feature = new OlFeature({
          geometry: new OlGeomLineString([[0, 0], [0, 100]])
        });

        wrapper.setProps({
          measureType: 'angle'
        });

        instance._measureTooltipElement = document.createElement('div');
        instance._measureTooltip = new OlOverlay({
          element: instance._measureTooltipElement
        });

        instance.updateMeasureTooltip();

        expect(instance._measureTooltipElement.innerHTML).toBe('0°');
        expect(instance._measureTooltip.getPosition()).toEqual([0, 100]);
      });
    });

    describe('#updateHelpTooltip', () => {

      let wrapper: Wrapper;
      let instance: MeasureButton;
      let geometry: OlGeomPoint;

      beforeEach(() => {
        wrapper = TestUtil.mountComponent(MeasureButton, {
          map: map,
          measureType: 'line'
        });
        instance = wrapper.instance() as MeasureButton;
        geometry = new OlGeomPoint([100, 100]);
      });

      it ('returns undefined if measure and tooltip elements are not set', () => {
        const expectedOutput = instance.updateHelpTooltip(geometry);
        expect(expectedOutput).toBeUndefined();
      });

      it ('sets correct help message and position for line measurements', () => {
        instance._feature = new OlFeature({
          geometry: new OlGeomLineString([[0, 0], [0, 100]])
        });

        instance._helpTooltipElement = document.createElement('div');
        instance._helpTooltip = new OlOverlay({
          element: instance._helpTooltipElement
        });

        instance.updateHelpTooltip(geometry.getLastCoordinate());

        expect(instance._helpTooltipElement.innerHTML).toBe('Click to draw line');
        expect(instance._helpTooltip.getPosition()).toEqual(geometry.getCoordinates());
      });

      it ('sets correct help message and position for area measurements', () => {

        const polyCoords = [
          [0, 0],
          [0, 10],
          [10, 10],
          [10, 0],
          [0, 0]
        ];
        instance._feature = new OlFeature({
          geometry: new OlGeomPolygon([polyCoords])
        });

        wrapper.setProps({
          measureType: 'polygon'
        });

        instance._helpTooltipElement = document.createElement('div');
        instance._helpTooltip = new OlOverlay({
          element: instance._helpTooltipElement
        });

        instance.updateHelpTooltip(geometry.getLastCoordinate());

        expect(instance._helpTooltipElement.innerHTML).toBe('Click to draw area');
        expect(instance._helpTooltip.getPosition()).toEqual(geometry.getCoordinates());
      });

      it ('sets correct help message and position for angle measurements', () => {
        instance._feature = new OlFeature({
          geometry: new OlGeomLineString([[0, 0], [0, 100]])
        });

        wrapper.setProps({
          measureType: 'angle'
        });

        instance._helpTooltipElement = document.createElement('div');
        instance._helpTooltip = new OlOverlay({
          element: instance._helpTooltipElement
        });

        instance.updateHelpTooltip(geometry.getLastCoordinate());

        expect(instance._helpTooltipElement.innerHTML).toBe('Click to draw angle');
        expect(instance._helpTooltip.getPosition()).toEqual(geometry.getCoordinates());
      });
    });
  });
});
