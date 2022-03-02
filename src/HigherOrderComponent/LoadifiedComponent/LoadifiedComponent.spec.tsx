import * as React from 'react';
import TestUtil from '../../Util/TestUtil';
import { loadify } from './LoadifiedComponent';

describe('loadify', () => {
  let EnhancedComponent;

  class MockComponent extends React.Component {
    render() {
      return (
        <div>A mock Component</div>
      );
    }
  }

  beforeEach(() => {
    EnhancedComponent = loadify(MockComponent);
  });

  describe('Basics', () => {
    it('is defined', () => {
      expect(loadify).not.toBeUndefined();
    });

    it('can be rendered', () => {
      const wrapper = TestUtil.mountComponent(EnhancedComponent);
      expect(wrapper).not.toBeUndefined();
      expect(wrapper.first().is(EnhancedComponent)).toBe(true);
    });

    it('passes through all props except Spin props', () => {
      const props = {
        someProp: '09',
        otherProp: 'ppp',
        spinning: false
      };
      const expectedProps = {
        someProp: '09',
        otherProp: 'ppp'
      };
      const wrapper = TestUtil.mountComponent(EnhancedComponent, props);
      const wrappedInstance = wrapper.childAt(0).prop('children');

      expect(wrappedInstance.props).toEqual(expectedProps);
    });

    it('shows or hides the Loading component based on the spinning prop', () => {
      let wrapper = TestUtil.mountComponent(EnhancedComponent);

      // 1. Don't Show loading sign.
      wrapper = TestUtil.mountComponent(EnhancedComponent, {
        spinning: false
      });
      expect(wrapper.find('.ant-spin').length).toBe(0);

      // 2. show loading sign.
      wrapper = TestUtil.mountComponent(EnhancedComponent, {
        spinning: true
      });
      expect(wrapper.find('.ant-spin').length).toBe(1);
    });
  });
});
