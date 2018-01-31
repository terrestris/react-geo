/*eslint-env jest*/
import TestUtil from '../../Util/TestUtil';

import OlSourceVector from 'ol/source/vector';
import OlInteractionDraw from 'ol/interaction/draw';
import OlInteractionSelect from 'ol/interaction/select';
import OlStyleStyle from 'ol/style/style';
import OlStyleStroke from 'ol/style/stroke';
import OlStyleFill from 'ol/style/fill';
import OlStyleCircle from 'ol/style/circle';
import OlStyleText from 'ol/style/text';
import OlFeature from 'ol/feature';
import OlCollection from 'ol/collection';
import OlGeomPoint from 'ol/geom/point';
import OlGeomLineString from 'ol/geom/linestring';
import OlGeomPolygon from 'ol/geom/polygon';

import RedliningButton from './RedliningButton.jsx';
import MapUtil from '../../Util/MapUtil/MapUtil';
import DigitizeUtil from '../../Util/DigitizeUtil/DigitizeUtil';

describe('<RedliningButton />', () => {

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
  const setupWrapper = () => {
    const defaultProps = {
      map: map,
      drawType: 'Point'
    };
    return TestUtil.mountComponent(RedliningButton, defaultProps);
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

  /**
   * Returns a mock OlInteractionSelect .
   *
   * @return {Object} The mocked interaction.
   */
  const getMockSelectInteraction = () => {
    return new OlInteractionSelect({
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
      expect(RedliningButton).not.toBeUndefined();
    });

    it('can be rendered', () => {
      const wrapper = setupWrapper();
      expect(wrapper).not.toBeUndefined();
      expect(wrapper.find(RedliningButton).length).toEqual(1);
    });

    it('drawType or editType prop must be provided and have valid values', () => {

      const wrapper = setupWrapper();
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      wrapper.setProps({
        drawType: 'invalid'
      });

      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Warning: Failed prop type')
      );

      consoleSpy.mockReset();
      consoleSpy.mockRestore();
    });
  });

  describe('#Private methods', () => {

    describe('#onToggle', () => {

      it ('calls a createDrawInteraction method if button was pressed and valid drawType was provided', () => {
        const wrapper = setupWrapper();
        const createDrawInteraction = jest.spyOn(wrapper.instance(), 'createDrawInteraction');

        wrapper.instance().onToggle(true);
        expect(createDrawInteraction).toHaveBeenCalledTimes(1);

        createDrawInteraction.mockReset();
        createDrawInteraction.mockRestore();
      });

      it ('calls a createSelectOrModifyInteraction method if button was pressed and valid editType was provided', () => {
        const wrapper = setupWrapper();
        wrapper.setProps({
          drawType: null,
          editType: 'Edit'
        });
        const createSelectOrModifyInteraction = jest.spyOn(wrapper.instance(), 'createSelectOrModifyInteraction');

        wrapper.instance().onToggle(true);
        expect(createSelectOrModifyInteraction).toHaveBeenCalledTimes(1);

        createSelectOrModifyInteraction.mockReset();
        createSelectOrModifyInteraction.mockRestore();
      });

      it ('removes all draw/select interactions created by component from the map if the button was untoggled', () => {
        const wrapper = setupWrapper();

        const mockInteraction = getMockDrawPointInteraction();

        const defaultMapInteractionsLength = map.getInteractions().getLength();
        map.addInteraction(getMockDrawPointInteraction());
        map.on('pointermove', wrapper.instance().onPointerMove);

        wrapper.setState({
          interaction: [mockInteraction]
        });

        expect(map.getInteractions().getLength()).toBe(defaultMapInteractionsLength + 1);
        // Warning: using of private properties such `listeners_` could be
        // a bit fragile. We should probably find another way to get the
        // appropriate value.
        expect(map.listeners_.pointermove).toBeDefined();

        wrapper.instance().onToggle(false);

        expect(map.listeners_.pointermove).toBeUndefined();
      });

      it ('unregisters `add` listener on redlining feature collection if drawType is Text and button was untoggled', () => {
        const wrapper = setupWrapper();
        wrapper.setProps({
          drawType: 'Text'
        });
        const mockInteraction = getMockDrawPointInteraction();

        const instance = wrapper.instance();
        instance.createRedliningLayer();
        instance._redliningFeatures =
          wrapper.state().redliningLayer.getSource().getFeaturesCollection();

        map.addInteraction(mockInteraction);
        instance._redliningFeatures.on('add', wrapper.instance().handleTextAdding);

        expect(instance._redliningFeatures.listeners_.add.length).toBe(2);

        wrapper.setState({
          interaction: [mockInteraction]
        });

        instance.onToggle(false);

        expect(instance._redliningFeatures.listeners_.add.length).toBe(1);
      });

      it ('unregisters `select` listener on select interaction if editType is Delete and button was untoggled', () => {
        const wrapper = setupWrapper();
        wrapper.setProps({
          drawType: null,
          editType: 'Delete'
        });
        const mockInteraction = getMockSelectInteraction();

        const instance = wrapper.instance();
        instance._selectInteraction = mockInteraction;

        map.addInteraction(mockInteraction);
        instance._selectInteraction.on('select', wrapper.instance().onFeatureRemove);

        expect(instance._selectInteraction.listeners_.select.length).toBe(1);

        wrapper.setState({
          interaction: [mockInteraction]
        });

        instance.onToggle(false);

        expect(instance._selectInteraction.listeners_.select).toBeUndefined();
      });

      it ('unregisters `select` listener on select interaction if editType is Copy and button was untoggled', () => {
        const wrapper = setupWrapper();
        wrapper.setProps({
          drawType: null,
          editType: 'Copy'
        });
        const mockInteraction = getMockSelectInteraction();

        const instance = wrapper.instance();
        instance._selectInteraction = mockInteraction;

        map.addInteraction(mockInteraction);
        instance._selectInteraction.on('select', wrapper.instance().onFeatureCopy);

        expect(instance._selectInteraction.listeners_.select.length).toBe(1);

        wrapper.setState({
          interaction: [mockInteraction]
        });

        instance.onToggle(false);

        expect(instance._selectInteraction.listeners_.select).toBeUndefined();
      });
    });

    describe('#createRedliningLayer', () => {

      it ('creates a redlining vector layer, adds this to the map and assigns its value to state', () => {
        let redliningLayer = MapUtil.getLayerByName(map, 'react-geo_redlining');

        expect(redliningLayer).toBeUndefined();
        const wrapper = setupWrapper();

        redliningLayer = MapUtil.getLayerByName(map, 'react-geo_redlining');
        expect(redliningLayer).toBeDefined();
        expect(wrapper.state().redliningLayer).toBe(redliningLayer);
      });
    });

    describe('#getRedliningStyleFunction', () => {

      it ('returns a valid OlStyleStyle object depending on feature geometry type', () => {
        const wrapper = setupWrapper();
        const pointFeature = new OlFeature(new OlGeomPoint([0, 0]));
        const lineFeature = new OlFeature(new OlGeomLineString([0, 0], [1, 1]));
        const polyFeature = new OlFeature(new OlGeomPolygon([0, 0], [0, 1], [1, 1], [0, 0]));

        const pointStyle = wrapper.instance().getRedliningStyleFunction(pointFeature);
        expect(pointStyle instanceof OlStyleStyle).toBeTruthy();
        expect(typeof pointStyle).toBe('object');
        expect(pointStyle.getImage() instanceof OlStyleCircle).toBeTruthy();

        pointFeature.set('isLabel', true);

        const labelStyle = wrapper.instance().getRedliningStyleFunction(pointFeature);
        expect(labelStyle instanceof OlStyleStyle).toBeTruthy();
        expect(typeof labelStyle).toBe('object');
        expect(labelStyle.getText() instanceof OlStyleText).toBeTruthy();

        const lineStyle = wrapper.instance().getRedliningStyleFunction(lineFeature);
        expect(lineStyle instanceof OlStyleStyle).toBeTruthy();
        expect(typeof lineStyle).toBe('object');
        expect(lineStyle.getStroke() instanceof OlStyleStroke).toBeTruthy();

        const polyStyle = wrapper.instance().getRedliningStyleFunction(polyFeature);
        expect(polyStyle instanceof OlStyleStyle).toBeTruthy();
        expect(typeof polyStyle).toBe('object');
        expect(polyStyle.getStroke() instanceof OlStyleStroke).toBeTruthy();
        expect(polyStyle.getFill() instanceof OlStyleFill).toBeTruthy();
      });
    });

    describe('#createDrawInteraction', () => {

      it ('creates OL draw interaction depending on provided drawType and sets its value to state', () => {
        const wrapper = setupWrapper();
        wrapper.setProps({
          drawType: 'Rectangle'
        });

        wrapper.instance().createDrawInteraction(true);

        expect(wrapper.state().interaction.length).toBe(1);
        expect(wrapper.state().interaction[0].type_).toBe('Circle');

        wrapper.setState({
          interaction: null
        });
        wrapper.setProps({
          drawType: 'Text'
        });

        wrapper.instance()._redliningFeatures = new OlCollection();
        wrapper.instance().createDrawInteraction(true);

        expect(wrapper.state().interaction.length).toBe(1);
        expect(wrapper.state().interaction[0].type_).toBe('Point');
      });
    });

    describe('#createSelectOrModifyInteraction', () => {

      it ('creates OL select or modify interaction depending on provided editType and sets its value(s) to state', () => {
        const wrapper = setupWrapper();

        wrapper.setProps({
          drawType: null,
          editType: 'Delete'
        });

        expect(wrapper.instance()._selectInteraction).toBeNull();

        wrapper.instance().createSelectOrModifyInteraction();

        expect(wrapper.instance()._selectInteraction).toBeDefined();
        expect(wrapper.instance()._selectInteraction.listeners_.select).toBeDefined();

        expect(wrapper.state().interaction.length).toBe(1);

        wrapper.setState({
          interaction: null
        });

        wrapper.setProps({
          editType: 'Edit'
        });

        wrapper.instance().createSelectOrModifyInteraction();

        expect(wrapper.state().interaction.length).toBe(3);
      });
    });

    describe('#onFeatureRemove',() => {

      it ('removes selected feature from the map', () => {
        const wrapper = setupWrapper();
        const feat = new OlFeature();
        const mockEvt = {
          selected: [feat]
        };

        wrapper.instance().createRedliningLayer();
        wrapper.instance().createSelectOrModifyInteraction();

        wrapper.state().redliningLayer.getSource().addFeature(feat);
        wrapper.instance()._selectInteraction.getFeatures().push(feat);

        expect(wrapper.instance()._selectInteraction.getFeatures().getArray().length).toBe(1);
        expect(wrapper.state().redliningLayer.getSource().getFeaturesCollection().getArray().length).toBe(1);

        wrapper.instance().onFeatureRemove(mockEvt);

        expect(wrapper.instance()._selectInteraction.getFeatures().getArray().length).toBe(0);
        expect(wrapper.state().redliningLayer.getSource().getFeaturesCollection().getArray().length).toBe(0);
      });
    });

    describe('#onFeatureCopy', () => {

      it ('calls moveFeature method from DigitizeUtil class', () => {
        const wrapper = setupWrapper();
        const feat = new OlFeature(new OlGeomPoint([0, 0]));
        const mockEvt = {
          selected: [feat]
        };

        const moveFeatureSpy = jest.spyOn(DigitizeUtil, 'moveFeature');

        wrapper.instance().onFeatureCopy(mockEvt);

        expect(moveFeatureSpy).toHaveBeenCalledTimes(1);

        moveFeatureSpy.mockReset();
        moveFeatureSpy.mockRestore();
      });
    });

    describe('#onModifyStart', () => {

      it('shows prompt for input text if a labeled feature is being modified', () => {
        const wrapper = setupWrapper();
        const feat = new OlFeature();
        feat.set('isLabel', true);
        const mockEvt = {
          features: {}
        };
        mockEvt.features.getArray = () => [feat];

        wrapper.instance().onModifyStart(mockEvt);

        expect(wrapper.instance()._redliningTextFeature).toEqual(mockEvt.features.getArray()[0]);
        expect(wrapper.state().showLabelPrompt).toBeTruthy();
      });
    });

    describe('#handleTextAdding', () => {

      it('shows prompt for input text if a labeled feature is being handled', () => {
        const wrapper = setupWrapper();
        const feat = new OlFeature();
        const mockEvt = {
          element: feat
        };

        wrapper.instance().handleTextAdding(mockEvt);

        expect(wrapper.instance()._redliningTextFeature).toEqual(mockEvt.element);
        expect(wrapper.instance()._redliningTextFeature.get('isLabel')).toBeTruthy();
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

        wrapper.instance()._redliningTextFeature = feat;
        wrapper.instance().onModalLabelOk();

        expect(wrapper.state().showLabelPrompt).toBeFalsy();
      });
    });

    describe('#onModalLabelCancel', () => {

      it('hides prompt for input text and removes _redliningTextFeature from layer', () => {
        const wrapper = setupWrapper();
        const feat = new OlFeature(new OlGeomPoint([0, 0]));

        wrapper.setState({
          showLabelPrompt: true
        });

        feat.setStyle(new OlStyleStyle({
          text: new OlStyleText()
        }));
        feat.set('isLabel', true);

        wrapper.instance()._redliningTextFeature = feat;
        wrapper.instance()._redliningFeatures = new OlCollection();
        wrapper.instance()._redliningFeatures.push(feat);

        expect(wrapper.instance()._redliningFeatures.getLength()).toBe(1);

        wrapper.instance().onModalLabelCancel();

        expect(wrapper.state().showLabelPrompt).toBeFalsy();
        expect(wrapper.instance()._redliningFeatures.getLength()).toBe(0);
        expect(wrapper.instance()._redliningTextFeature).toBeNull();
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

        expect(feat.getStyle().getText().getText()).toBe(label);
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
