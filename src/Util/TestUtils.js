import React from 'react';
import { mount } from 'enzyme';

/**
 * A set of some useful static helper methods.
 *
 * @class
 */
export class TestUtils {

  /**
   * Mounts the given component.
   *
   * @param {Component} Component The Component to render.
   * @param {Object} props The props to be used.
   * @param {Object} context The context to be set.
   */
  static mountComponent = (Component, props, context) => {
    const wrapper = mount(<Component {...props} />, {context});
    return wrapper;
  };

}

export default TestUtils;
