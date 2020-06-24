import * as React from 'react';

import TestUtil from '../../Util/TestUtil';

import { mappify } from './MappifiedComponent';

import Logger from '@terrestris/base-util/dist/Logger';

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
    EnhancedComponent = mappify(MockComponent);
  });

  describe('Basics', () => {
    it('is defined', () => {
      expect(mappify).not.toBeUndefined();
    });

    it('can be rendered', () => {
      const wrapper = TestUtil.mountComponent(EnhancedComponent, {}, {context: {map}});

      expect(wrapper).not.toBeUndefined();
      expect(wrapper.first().is(EnhancedComponent)).toBe(true);
    });

    it('adds the map from the context as a prop', () => {
      const wrapper = TestUtil.mountComponent(EnhancedComponent, {}, {context: {map}});
      const wrappedInstance = wrapper.childAt(0).instance();

      expect(wrappedInstance.props.map).toBe(map);
    });

    it('warns if no map is given in the context', () => {
      const loggerSpy = jest.spyOn(Logger, 'warn');
      TestUtil.mountComponent(EnhancedComponent);
      expect(loggerSpy).toHaveBeenCalled();
      expect(loggerSpy).toHaveBeenCalledWith('You\'re trying to mappify a ' +
        'component without any map in the context. Did you implement ' +
        'the MapProvider?');
      loggerSpy.mockRestore();
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
      const wrapper = TestUtil.mountComponent(EnhancedComponent, props, {context: {map}});
      const wrappedInstance = wrapper.childAt(0).instance();

      expect(wrappedInstance.props).toEqual(expectedProps);
    });

  });
});
