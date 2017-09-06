import React from 'react';
import { mount } from 'enzyme';

import OlView from 'ol/view';
import OlMap from 'ol/map';
import OlSourceVector from 'ol/source/vector';
import OlLayerVector from 'ol/layer/vector';

/**
 * A set of some useful static helper methods.
 *
 * @class
 */
export class TestUtils {

  static mapDivId = 'map';
  static mapDivHeight = 256;
  static mapDivWidth = 256;

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

  /**
   * Creates and applies a map <div> element to the body.
   *
   * @return {Element} The mounted <div> element.
   */
  static mountMapDiv = () => {
    var div = document.createElement('div');
    var style = div.style;

    style.position = 'absolute';
    style.left = '-1000px';
    style.top = '-1000px';
    style.width = TestUtils.mapDivWidth + 'px';
    style.height = TestUtils.mapDivHeight + 'px';
    div.id = TestUtils.mapDivId;

    document.body.appendChild(div);

    return div;
  };

  /**
   * Removes the map div element from the body.
   */
  static unmountMapDiv = () => {
    let div = document.querySelector(`div#${TestUtils.mapDivId}`);
    if (!div) {
      return;
    }
    let parent = div.parentNode;
    if (parent) {
      parent.removeChild(div);
    }
    div = null;
  };

  /**
   * Creates an ol map.
   *
   * @param {Object} mapOpts Additional options for the map to create.
   * @return {ol.Map} The ol map.
   */
  static createMap = (mapOpts) => {
    let source = new OlSourceVector();
    let layer = new OlLayerVector({source: source});
    let targetDiv = TestUtils.mountMapDiv();
    let defaultMapOpts = {
      target: targetDiv,
      layers: [layer],
      view: new OlView({
        center: [829729, 6708850],
        resolution: 1,
        resolutions: mapOpts ? mapOpts.resolutions : undefined
      })
    };

    Object.assign(defaultMapOpts, mapOpts);

    let map = new OlMap(defaultMapOpts);

    map.renderSync();

    return map;
  };

  /**
   * Removes the map.
   */
  static removeMap = (map) => {
    if (map instanceof OlMap) {
      map.dispose();
    }
    TestUtils.unmountMapDiv();
  };

}

export default TestUtils;
