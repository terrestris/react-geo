import * as React from 'react';
import moment from 'moment';

import OlTileLayer from 'ol/layer/Tile';
import OlTileWMS from 'ol/source/TileWMS';

import TestUtil from '../../Util/TestUtil';

import { timeLayerAware } from './TimeLayerAware';

describe('timeLayerAware', () => {
  let EnhancedComponent;
  let EnhancedComponent2;
  let layer;
  let layerWithFunnyTimeSpelling;
  const customHandler = jest.fn();

  /* eslint-disable require-jsdoc */
  class MockComponent extends React.Component {
    render() {
      return (
        <div>A mock Component</div>
      );
    }
  }
  /* eslint-enable require-jsdoc */

  beforeEach(() => {
    layer = new OlTileLayer({
      source: new OlTileWMS({
        params: {
          LAYERS: 'humpty:dumpty',
          TIME: 'overwrite me!'
        }
      })
    });
    layerWithFunnyTimeSpelling = new OlTileLayer({
      source: new OlTileWMS({
        params: {
          LAYERS: 'humpty:dumpty',
          tImE: 'overwrite me!'
        }
      })
    });
    EnhancedComponent = timeLayerAware(MockComponent, [{
      isWmsTime: false,
      customHandler: customHandler
    }]);
    EnhancedComponent2 = timeLayerAware(MockComponent, [{
      isWmsTime: true,
      layer: layer
    }, {
      isWmsTime: true,
      layer: layerWithFunnyTimeSpelling
    }]);
  });

  describe('Basics', () => {
    it('is defined', () => {
      expect(timeLayerAware).not.toBeUndefined();
    });

    it('can be rendered', () => {
      const wrapper = TestUtil.mountComponent(EnhancedComponent, {}, {});
      expect(wrapper).not.toBeUndefined();
      expect(wrapper.first().is(EnhancedComponent)).toBe(true);
    });

    it('calls configured custom handlers', () => {
      const time = moment().toISOString();
      new EnhancedComponent().timeChanged(time);

      expect(customHandler).toHaveBeenCalledWith(time);
    });

    it('changes WMS Time layer parameter TIME, single instant', () => {
      const time = moment().toISOString();
      new EnhancedComponent2().timeChanged(time);
      const params = layer.getSource().getParams();

      expect(params.TIME).toBe(time);
    });

    it('changes WMS Time layer parameter TIME, start and end instants', () => {
      const start = moment().toISOString();
      const end = moment().toISOString();
      new EnhancedComponent2().timeChanged([start, end]);
      const params = layer.getSource().getParams();

      expect(params.TIME).toBe(`${start}/${end}`);
    });

    it('updates the correct parameter, even when spelled funnily', () => {
      const time = moment().toISOString();
      new EnhancedComponent2().timeChanged(time);
      const params = layerWithFunnyTimeSpelling.getSource().getParams();

      expect(params.tImE).toBe(time); // right one overwriten
      expect('TIME' in params).toBe(false); // only right one overwritten
    });
  });
});
