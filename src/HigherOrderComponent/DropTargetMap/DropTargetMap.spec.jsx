/*eslint-env jest*/
import React from 'react';

import TestUtil from '../../Util/TestUtil';

import { onDropAware } from '../../index';

describe('onDropAware', () => {
  let EnhancedComponent;

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
    EnhancedComponent = onDropAware(MockComponent);
  });

  describe('Basics', () => {
    it('is defined', () => {
      expect(onDropAware).not.toBeUndefined();
    });

    it('can be rendered', () => {
      const wrapper = TestUtil.mountComponent(EnhancedComponent);

      expect(wrapper).not.toBeUndefined();
      expect(wrapper.first().is(EnhancedComponent)).toBe(true);
    });

    it('passes through all props', () => {
      const props = {
        someProp: '09'
      };
      const wrapper = TestUtil.mountComponent(EnhancedComponent, props);
      const instance = wrapper.instance();

      expect(instance.props.someProp).toEqual('09');
    });

  });
});
