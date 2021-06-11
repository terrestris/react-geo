import TestUtil from '../../Util/TestUtil';
import Logger from '@terrestris/base-util/dist/Logger';

import OlSourceVector from 'ol/source/Vector';
import OlInteractionDraw from 'ol/interaction/Draw';
import OlInteractionSelect from 'ol/interaction/Select';
import OlInteractionModify from 'ol/interaction/Modify';
import OlInteractionTranslate from 'ol/interaction/Translate';
import OlStyleStyle from 'ol/style/Style';
import OlStyleStroke from 'ol/style/Stroke';
import OlStyleFill from 'ol/style/Fill';
import OlStyleCircle from 'ol/style/Circle';
import OlStyleText from 'ol/style/Text';
import OlFeature from 'ol/Feature';
import OlCollection from 'ol/Collection';
import OlGeomPoint from 'ol/geom/Point';
import OlGeomLineString from 'ol/geom/LineString';
import OlGeomPolygon from 'ol/geom/Polygon';

import DigitizeButton from './DigitizeButton';
import MapUtil from '@terrestris/ol-util/dist/MapUtil/MapUtil';
import AnimateUtil from '@terrestris/ol-util/dist/AnimateUtil/AnimateUtil';
import ToggleButton from '../ToggleButton/ToggleButton';

describe('<DigitizeButton />', () => {

  let map;

  beforeEach(() => {
    map = TestUtil.createMap();
  });

  afterEach(() => {
    map = TestUtil.removeMap();
  });

  /**
   * Wraps the component.
   *
   * @return {Object} The wrapped component.
   */
  const setupWrapper = (shallow: boolean = false) => {
    const defaultProps = {
      map: map,
      drawType: 'Point'
    };

    if (shallow) {
      return TestUtil.shallowComponent(DigitizeButton, defaultProps);
    } else {
      return TestUtil.mountComponent(DigitizeButton, defaultProps);
    }
  };

  /**
   * Returns a mock OLInteractionDraw of type Point.
   *
   * @return {Object} The mocked interaction.
   */
  const getMockDrawPointInteraction = () => {
    return new OlInteractionDraw({
      source: new OlSourceVector(),
      type: 'Point',
      style: new OlStyleStyle({
        stroke: new OlStyleStroke({
          color: 'red',
          width: 2
        })
      })
    });
  };

  describe('#Basics', () => {

    it('is defined', () => {
      expect(DigitizeButton).not.toBeUndefined();
    });

    it('can be rendered', () => {
      const wrapper = setupWrapper();
      expect(wrapper).not.toBeUndefined();
      expect(wrapper.find(DigitizeButton).length).toEqual(1);
    });

    it('passes style property to wrapped ToggleButton', () => {
      const style = {
        backgroundColor: 'yellow'
      };
      const wrapper = setupWrapper();
      wrapper.setProps({
        style
      });

      const toggleButton = wrapper.find(ToggleButton).get(0);
      expect(toggleButton).toBeDefined();
      expect(toggleButton.props.style).toEqual(style);
    });

    it('drawType or editType prop must be provided and have valid values', () => {
      const loggerSpy = jest.spyOn(Logger, 'warn');
      TestUtil.mountComponent(DigitizeButton, {map});
      expect(loggerSpy).toHaveBeenCalledTimes(1);
      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringContaining('Neither "drawType" nor "editType" was provided. Digitize ' +
        'button won\'t work properly!')
      );
      loggerSpy.mockRestore();
    });
  });

  describe('#Private methods', () => {

    describe('#onToggle', () => {
      it('calls passed onToggle in props it was provided', () => {
        expect.assertions(1);
        const wrapper = setupWrapper();
        const onToggle = jest.fn();

        wrapper.setProps({
          onToggle
        }, () => {
          wrapper.instance().onToggle(true);
          expect(onToggle).toHaveBeenCalledTimes(1);
        });
      });

      it ('creates a draw interaction on mount', () => {
        const wrapper = setupWrapper(true);
        const createDrawInteraction = jest.spyOn(wrapper.instance(), 'createDrawInteraction');

        expect(createDrawInteraction).toHaveBeenCalledTimes(0);

        wrapper.instance().componentDidMount();
        expect(createDrawInteraction).toHaveBeenCalledTimes(1);

        expect(wrapper.instance()._drawInteraction).toBeInstanceOf(OlInteractionDraw);
        expect(wrapper.instance()._drawInteraction.getActive()).toBeFalsy();

        createDrawInteraction.mockRestore();
      });

      it ('creates a select interaction on mount', () => {
        const wrapper = setupWrapper(true);
        wrapper.setProps({
          drawType: null,
          editType: 'Edit'
        });
        const createSelectInteraction = jest.spyOn(wrapper.instance(), 'createSelectInteraction');

        expect(createSelectInteraction).toHaveBeenCalledTimes(0);

        wrapper.instance().componentDidMount();
        expect(createSelectInteraction).toHaveBeenCalledTimes(1);

        expect(wrapper.instance()._selectInteraction).toBeInstanceOf(OlInteractionSelect);
        expect(wrapper.instance()._selectInteraction.getActive()).toBeFalsy();

        createSelectInteraction.mockRestore();
      });

      it ('creates a modify interaction on mount', () => {
        const wrapper = setupWrapper(true);
        wrapper.setProps({
          drawType: null,
          editType: 'Edit'
        });
        const createModifyInteraction = jest.spyOn(wrapper.instance(), 'createModifyInteraction');

        expect(createModifyInteraction).toHaveBeenCalledTimes(0);

        wrapper.instance().componentDidMount();
        expect(createModifyInteraction).toHaveBeenCalledTimes(1);

        expect(wrapper.instance()._modifyInteraction).toBeInstanceOf(OlInteractionModify);
        expect(wrapper.instance()._modifyInteraction.getActive()).toBeFalsy();

        createModifyInteraction.mockRestore();
      });

      it ('creates a translate interaction on mount', () => {
        const wrapper = setupWrapper(true);
        wrapper.setProps({
          drawType: null,
          editType: 'Edit'
        });
        const createTranslateInteraction = jest.spyOn(wrapper.instance(), 'createTranslateInteraction');

        expect(createTranslateInteraction).toHaveBeenCalledTimes(0);

        wrapper.instance().componentDidMount();
        expect(createTranslateInteraction).toHaveBeenCalledTimes(1);

        expect(wrapper.instance()._translateInteraction).toBeInstanceOf(OlInteractionTranslate);
        expect(wrapper.instance()._translateInteraction.getActive()).toBeFalsy();

        createTranslateInteraction.mockRestore();
      });

      it ('removes all interactions and map listeners from the map on unmount', () => {
        const wrapper = setupWrapper();

        const defaultMapInteractionsLength = map.getInteractions().getLength();
        map.addInteraction(getMockDrawPointInteraction());
        map.on('pointermove', wrapper.instance().onPointerMove);

        wrapper.instance().componentDidMount();

        expect(map.getInteractions().getLength()).toBe(defaultMapInteractionsLength + 1);
        // Warning: using of private properties such `listeners_` could be
        // a bit fragile. We should probably find another way to get the
        // appropriate value.
        expect(map.listeners_.pointermove).toBeDefined();

        wrapper.instance().componentWillUnmount();

        expect(map.listeners_.pointermove).toBeUndefined();

        expect(map.getInteractions().getLength()).toBe(defaultMapInteractionsLength);
      });

      it ('activates the draw interaction on toggle', () => {
        const wrapper = setupWrapper();
        const instance = wrapper.instance();

        expect(instance._drawInteraction.getActive()).toBeFalsy();

        instance.onToggle(true);

        expect(instance._drawInteraction.getActive()).toBeTruthy();
      });

      it ('activates the edit interactions on toggle', () => {
        const wrapper = setupWrapper();

        wrapper.setProps({
          drawType: null,
          editType: 'Edit'
        });

        const instance = wrapper.instance();

        instance.componentDidMount();

        expect(instance._selectInteraction.getActive()).toBeFalsy();
        expect(instance._modifyInteraction.getActive()).toBeFalsy();
        expect(instance._translateInteraction.getActive()).toBeFalsy();

        instance.onToggle(true);

        expect(instance._selectInteraction.getActive()).toBeTruthy();
        expect(instance._modifyInteraction.getActive()).toBeTruthy();
        expect(instance._translateInteraction.getActive()).toBeTruthy();
      });
    });

    describe('#createDigitizeLayer', () => {

      it ('creates a digitize vector layer, adds this to the map and assigns its value to state', () => {
        let digitizeLayer = MapUtil.getLayerByName(map, 'react-geo_digitize');

        expect(digitizeLayer).toBeUndefined();
        const wrapper = setupWrapper();

        digitizeLayer = MapUtil.getLayerByName(map, 'react-geo_digitize');
        expect(digitizeLayer).toBeDefined();
        expect(wrapper.instance()._digitizeLayer).toBe(digitizeLayer);
      });
    });

    describe('#digitizeStyleFunction', () => {

      it ('returns a valid OlStyleStyle object depending on feature geometry type', () => {
        const wrapper = setupWrapper();
        const pointFeature = new OlFeature(new OlGeomPoint([0, 0]));
        const lineFeature = new OlFeature(new OlGeomLineString([0, 0], [1, 1]));
        const polyFeature = new OlFeature(new OlGeomPolygon([0, 0], [0, 1], [1, 1], [0, 0]));

        const pointStyle = wrapper.instance().digitizeStyleFunction(pointFeature);
        expect(pointStyle instanceof OlStyleStyle).toBeTruthy();
        expect(typeof pointStyle).toBe('object');
        expect(pointStyle.getImage() instanceof OlStyleCircle).toBeTruthy();

        pointFeature.set('isLabel', true);

        const labelStyle = wrapper.instance().digitizeStyleFunction(pointFeature);
        expect(labelStyle instanceof OlStyleStyle).toBeTruthy();
        expect(typeof labelStyle).toBe('object');
        expect(labelStyle.getText() instanceof OlStyleText).toBeTruthy();

        const lineStyle = wrapper.instance().digitizeStyleFunction(lineFeature);
        expect(lineStyle instanceof OlStyleStyle).toBeTruthy();
        expect(typeof lineStyle).toBe('object');
        expect(lineStyle.getStroke() instanceof OlStyleStroke).toBeTruthy();

        const polyStyle = wrapper.instance().digitizeStyleFunction(polyFeature);
        expect(polyStyle instanceof OlStyleStyle).toBeTruthy();
        expect(typeof polyStyle).toBe('object');
        expect(polyStyle.getStroke() instanceof OlStyleStroke).toBeTruthy();
        expect(polyStyle.getFill() instanceof OlStyleFill).toBeTruthy();
      });
    });

    describe('#selectedStyleFunction', () => {

      it ('returns a valid OlStyleStyle object to be used with selected features', () => {
        const wrapper = setupWrapper();

        wrapper.setProps({
          selectFillColor: '#ff0000',
          selectStrokeColor: '#0000ff'
        });

        const expectedStyle = wrapper.instance().selectedStyleFunction(new OlFeature());
        expect(expectedStyle instanceof OlStyleStyle).toBeTruthy();
        expect(expectedStyle.getStroke().getColor()).toBe(wrapper.props().selectStrokeColor);
        expect(expectedStyle.getFill().getColor()).toBe(wrapper.props().selectFillColor);
      });
    });

    describe('#createDrawInteraction', () => {

      it ('creates OL draw interaction depending on provided drawType and sets its value to state', () => {
        const wrapper = setupWrapper();
        wrapper.setProps({
          drawType: 'Rectangle'
        });

        wrapper.instance().createDrawInteraction();

        expect(wrapper.instance()._drawInteraction.type_).toBe('Circle');

        wrapper.setProps({
          drawType: 'Text'
        });

        wrapper.instance().createDrawInteraction();

        expect(wrapper.instance()._drawInteraction.type_).toBe('Point');
      });
    });

    describe('#createSelectOrModifyInteraction', () => {

      // eslint-disable-next-line max-len
      it ('creates OL select/modify/translate interaction depending on provided editType and sets its value(s) to state', () => {
        const wrapper = setupWrapper();

        wrapper.setProps({
          drawType: null,
          editType: 'Edit'
        });

        expect(wrapper.instance()._selectInteraction).toBeUndefined();

        wrapper.instance().createSelectInteraction();

        expect(wrapper.instance()._selectInteraction).toBeInstanceOf(OlInteractionSelect);

        expect(wrapper.instance()._modifyInteraction).toBeUndefined();

        wrapper.instance().createModifyInteraction();

        expect(wrapper.instance()._modifyInteraction).toBeInstanceOf(OlInteractionModify);

        expect(wrapper.instance()._translateInteraction).toBeUndefined();

        wrapper.instance().createTranslateInteraction();

        expect(wrapper.instance()._translateInteraction).toBeInstanceOf(OlInteractionTranslate);
      });
    });

    describe('#onFeatureRemove',() => {

      it ('removes selected feature from the map', () => {
        const wrapper = setupWrapper();
        wrapper.setProps({
          drawType: null,
          editType: 'Edit'
        });
        const feat = new OlFeature();
        const mockEvt = {
          selected: [feat]
        };

        wrapper.instance().createDigitizeLayer();
        wrapper.instance().createSelectInteraction();

        wrapper.instance()._digitizeLayer.getSource().addFeature(feat);
        wrapper.instance()._selectInteraction.getFeatures().push(feat);

        expect(wrapper.instance()._selectInteraction.getFeatures().getArray().length).toBe(1);
        expect(wrapper.instance()._digitizeLayer.getSource().getFeaturesCollection().getArray().length).toBe(1);

        wrapper.instance().onFeatureRemove(mockEvt);

        expect(wrapper.instance()._selectInteraction.getFeatures().getArray().length).toBe(0);
        expect(wrapper.instance()._digitizeLayer.getSource().getFeaturesCollection().getArray().length).toBe(0);
      });
    });

    describe('#onFeatureCopy', () => {

      it ('calls moveFeature method from AnimateUtil class', () => {
        const wrapper = setupWrapper();
        const feat = new OlFeature(new OlGeomPoint([0, 0]));
        const mockEvt = {
          selected: [feat]
        };

        wrapper.instance()._digitizeFeatures = new OlCollection();

        const moveFeatureSpy = jest.spyOn(AnimateUtil, 'moveFeature');

        wrapper.instance().onFeatureCopy(mockEvt);

        expect(moveFeatureSpy).toHaveBeenCalledTimes(1);

        moveFeatureSpy.mockRestore();
      });
    });

    describe('#onModifyStart', () => {

      it('shows prompt for input text if a labeled feature is being modified', () => {
        const wrapper = setupWrapper();
        const feat = new OlFeature();
        feat.set('isLabel', true);
        feat.setStyle(new OlStyleStyle({
          text: new OlStyleText()
        }));
        const mockEvt = {
          features: {}
        };
        mockEvt.features.getArray = () => [feat];

        wrapper.instance().onModifyStart(mockEvt);

        expect(wrapper.instance()._digitizeTextFeature).toEqual(mockEvt.features.getArray()[0]);
        expect(wrapper.state().showLabelPrompt).toBeTruthy();
      });
    });

    describe('#handleTextAdding', () => {

      it('shows prompt for input text if a labeled feature is being handled', () => {
        const wrapper = setupWrapper();
        const feat = new OlFeature();
        const mockEvt = {
          feature: feat
        };

        wrapper.instance().handleTextAdding(mockEvt);

        expect(wrapper.instance()._digitizeTextFeature).toEqual(mockEvt.feature);
        expect(wrapper.instance()._digitizeTextFeature.get('isLabel')).toBeTruthy();
        expect(wrapper.state().showLabelPrompt).toBeTruthy();
      });
    });

    describe('#onModalLabelOk', () => {

      it('hides prompt for input text', () => {
        const wrapper = setupWrapper();
        const feat = new OlFeature(new OlGeomPoint([0, 0]));

        wrapper.setState({
          showLabelPrompt: true
        });

        feat.setStyle(new OlStyleStyle({
          text: new OlStyleText()
        }));
        feat.set('isLabel', true);

        wrapper.instance()._digitizeTextFeature = feat;
        wrapper.instance().onModalLabelOk();

        expect(wrapper.state().showLabelPrompt).toBeFalsy();
      });
    });

    describe('#onModalLabelCancel', () => {

      it('hides prompt for input text and removes _digitizeTextFeature from layer', () => {
        const wrapper = setupWrapper();
        const feat = new OlFeature(new OlGeomPoint([0, 0]));

        wrapper.setState({
          showLabelPrompt: true
        });

        feat.setStyle(new OlStyleStyle({
          text: new OlStyleText()
        }));
        feat.set('isLabel', true);

        wrapper.instance()._digitizeTextFeature = feat;
        wrapper.instance()._digitizeFeatures = new OlCollection();
        wrapper.instance()._digitizeFeatures.push(feat);

        expect(wrapper.instance()._digitizeFeatures.getLength()).toBe(1);

        wrapper.instance().onModalLabelCancel();

        expect(wrapper.state().showLabelPrompt).toBeFalsy();
      });
    });

    describe('#setTextOnFeature', () => {

      it('sets label text on feature', () => {
        const wrapper = setupWrapper();
        const feat = new OlFeature(new OlGeomPoint([0, 0]));

        const label = 'label';

        wrapper.setState({
          textLabel: label
        });

        feat.setStyle(new OlStyleStyle({
          text: new OlStyleText()
        }));
        feat.set('isLabel', true);

        wrapper.instance().setTextOnFeature(feat);

        expect(feat.get('label')).toBe(label);
      });
    });

    describe('#onLabelChange', () => {

      it('sets state value for textLabel', () => {
        const wrapper = setupWrapper();

        const mockEvt = {
          target: {
            value: 'label'
          }
        };

        wrapper.instance().onLabelChange(mockEvt);
        expect(wrapper.state().textLabel).toBe(mockEvt.target.value);
      });
    });
  });
});
