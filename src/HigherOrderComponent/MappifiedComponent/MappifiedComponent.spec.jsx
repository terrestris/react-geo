/*eslint-env mocha*/
import React from 'react';
import expect from 'expect.js';
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
      expect(mappify).not.to.be(undefined);
    });

    it('can be rendered', () => {
      const wrapper = TestUtil.mountComponent(EnhancedComponent, {}, {map});

      expect(wrapper).not.to.be(undefined);
      expect(wrapper.first().is(EnhancedComponent)).to.be(true);
    });

    it('adds the map from the context as a prop', () => {
      const wrapper = TestUtil.mountComponent(EnhancedComponent, {}, {map});
      const wrappedInstance = wrapper.instance().getWrappedInstance();

      expect(wrappedInstance.props.map).to.eql(map);
    });

    it('warns if no map is given in the context', () => {
      const loggerSpy = sinon.spy(Logger, 'warn');
      TestUtil.mountComponent(EnhancedComponent);
      expect(loggerSpy.calledOnce).to.be.ok();
      expect(loggerSpy.calledWith('You trying to mappify a component without any map in the '+
      'context. Did you implement the MapProvider?')).to.be.ok();
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

      expect(wrappedInstance.props).to.eql(expectedProps);
    });

    it('saves a reference to the wrapped instance if requested', () => {
      const props = {
        name: 'Podolski'
      };
      const wrapper = TestUtil.mountComponent(EnhancedComponent, props, {map});
      const wrappedInstance = wrapper.instance().getWrappedInstance();

      expect(wrappedInstance).to.be.an(MockComponent);

      const EnhancedComponentNoRef = mappify(MockComponent, {
        withRef: false
      });

      const wrapperNoRef = TestUtil.mountComponent(EnhancedComponentNoRef, props, {map});
      const wrappedInstanceNoRef = wrapperNoRef.instance().getWrappedInstance();

      expect(wrappedInstanceNoRef).to.be(undefined);
    });

  });
});
