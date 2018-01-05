/*eslint-env jest*/
import React from 'react';
import moment from 'moment';

import TestUtil from '../../Util/TestUtil';

import {
  timeLayerAware
} from '../../index';

describe('timeLayerAware', () => {
  let EnhancedComponent;
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
    EnhancedComponent = timeLayerAware(MockComponent, [{
      isWmsTime: false,
      customHandler: customHandler
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
  });
});
