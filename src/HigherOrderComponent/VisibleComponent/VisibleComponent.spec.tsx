import * as React from 'react';


import TestUtil from '../../Util/TestUtil';

import { isVisibleComponent } from './VisibleComponent';

describe('isVisibleComponent', () => {
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
    EnhancedComponent = isVisibleComponent(MockComponent);
  });

  describe('Basics', () => {
    it('is defined', () => {
      expect(isVisibleComponent).not.toBeUndefined();
    });

    it('can be rendered', () => {
      const wrapper = TestUtil.mountComponent(EnhancedComponent);

      expect(wrapper).not.toBeUndefined();
      expect(wrapper.first().is(EnhancedComponent)).toBe(true);
    });

    it('passes through all props except activeModules', () => {
      const props = {
        someProp: '09',
        name: 'shinjiKagawaModule',
        activeModules: [{
          name: 'shinjiKagawaModule'
        }]
      };
      const expectedProps = {
        someProp: '09',
        name: 'shinjiKagawaModule'
      };
      const wrapper = TestUtil.mountComponent(EnhancedComponent, props);
      const wrappedInstance = wrapper.childAt(0).instance();

      expect(wrappedInstance.props).toEqual(expectedProps);
    });

    it('shows or hides the wrapped component in relation to it\'s representation in the activeModules prop', () => {
      // 1. No name and no activeModules.
      let wrapper = TestUtil.mountComponent(EnhancedComponent);
      expect(wrapper.find('div').length).toBe(0);

      // 2. Name and no activeModules.
      wrapper = TestUtil.mountComponent(EnhancedComponent, {
        name: 'shinjiKagawaModule'
      });
      expect(wrapper.find('div').length).toBe(0);

      // 3. Name and activeModules.
      wrapper = TestUtil.mountComponent(EnhancedComponent, {
        name: 'shinjiKagawaModule',
        activeModules: [{
          name: 'shinjiKagawaModule'
        }]
      });
      expect(wrapper.find('div').length).toBe(1);

      // 4. Name and activeModules, but name not in activeModules.
      wrapper = TestUtil.mountComponent(EnhancedComponent, {
        name: 'someModule',
        activeModules: [{
          name: 'shinjiKagawaModule'
        }]
      });
      expect(wrapper.find('div').length).toBe(0);

      // 5. No name and activeModules.
      wrapper = TestUtil.mountComponent(EnhancedComponent, {
        activeModules: [{
          name: 'shinjiKagawaModule'
        }]
      });
      expect(wrapper.find('div').length).toBe(0);

      // 6. Name and activeModules, but no name in activeModules
      wrapper = TestUtil.mountComponent(EnhancedComponent, {
        name: 'shinjiKagawaModule',
        activeModules: [{
          notName: 'shinjiKagawaModule'
        }]
      });
      expect(wrapper.find('div').length).toBe(0);
    });

  });
});
