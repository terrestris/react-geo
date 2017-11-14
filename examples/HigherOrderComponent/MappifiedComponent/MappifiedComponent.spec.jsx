/*eslint-env jest*/
import React from 'react';

import sinon from 'sinon';

import TestUtil from '../../Util/TestUtil';

import {
  Logger,
  mappify
} from '../../index';

describe('mappify', () => {
  let EnhancedComponent;
  let map;

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
    map = TestUtil.createMap();
    EnhancedComponent = mappify(MockComponent, {
      withRef: true
    });
  });

  describe('Basics', () => {
    it('is defined', () => {
      expect(mappify).not.toBeUndefined();
    });

    it('can be rendered', () => {
      const wrapper = TestUtil.mountComponent(EnhancedComponent, {}, {map});

      expect(wrapper).not.toBeUndefined();
      expect(wrapper.first().is(EnhancedComponent)).toBe(true);
    });

    it('adds the map from the context as a prop', () => {
      const wrapper = TestUtil.mountComponent(EnhancedComponent, {}, {map});
      const wrappedInstance = wrapper.instance().getWrappedInstance();

      expect(wrappedInstance.props.map).toBe(map);
    });

    it('warns if no map is given in the context', () => {
      const loggerSpy = sinon.spy(Logger, 'warn');
      TestUtil.mountComponent(EnhancedComponent);
      expect(loggerSpy.calledOnce).toBeTruthy();
      expect(loggerSpy.calledWith('You trying to mappify a component without any map in the '+
      'context. Did you implement the MapProvider?')).toBeTruthy();
      loggerSpy.restore();
    });

    it('passes through all props', () => {
      const props = {
        someProp: '10',
        name: 'Podolski'
      };
      const expectedProps = {
        someProp: '10',
        name: 'Podolski',
        map: map
      };
      const wrapper = TestUtil.mountComponent(EnhancedComponent, props, {map});
      const wrappedInstance = wrapper.instance().getWrappedInstance();

      expect(wrappedInstance.props).toEqual(expectedProps);
    });

    it('saves a reference to the wrapped instance if requested', () => {
      const props = {
        name: 'Podolski'
      };
      const wrapper = TestUtil.mountComponent(EnhancedComponent, props, {map});
      const wrappedInstance = wrapper.instance().getWrappedInstance();

      expect(wrappedInstance).toBeInstanceOf(MockComponent);

      const EnhancedComponentNoRef = mappify(MockComponent, {
        withRef: false
      });

      const wrapperNoRef = TestUtil.mountComponent(EnhancedComponentNoRef, props, {map});
      const wrappedInstanceNoRef = wrapperNoRef.instance().getWrappedInstance();

      expect(wrappedInstanceNoRef).toBeUndefined();
    });

  });
});
