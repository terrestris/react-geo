import React from 'react';
import { mount } from 'enzyme';

import OlView from 'ol/view';
import OlMap from 'ol/map';
import OlSourceVector from 'ol/source/vector';
import OlLayerVector from 'ol/layer/vector';
import OlPointerEvent from 'ol/pointer/pointerevent';
import OlMapBrowserPointerEvent from 'ol/mapbrowserpointerevent';

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
      resolution: 1
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

/**
 * Simulates a browser pointer event on the map viewport.
 * Origin: https://github.com/openlayers/openlayers/blob/master/test/spec/ol/interaction/draw.test.js#L67
 *
 * @param {ol.Map} map The map to use.
 * @param {string} type Event type.
 * @param {number} x Horizontal offset from map center.
 * @param {number} y Vertical offset from map center.
 * @param {boolean} opt_shiftKey Shift key is pressed
 */
static simulatePointerEvent = (map, type, x, y, opt_shiftKey) => {
  let viewport = map.getViewport();
  // Calculated in case body has top < 0 (test runner with small window).
  let position = viewport.getBoundingClientRect();
  let shiftKey = opt_shiftKey !== undefined ? opt_shiftKey : false;
  let event = new OlPointerEvent(type, {
    clientX: position.left + x + TestUtils.mapDivWidth / 2,
    clientY: position.top + y + TestUtils.mapDivHeight / 2,
    shiftKey: shiftKey
  });
  map.handleMapBrowserEvent(new OlMapBrowserPointerEvent(type, map, event));
}

}

export default TestUtils;
