import * as React from 'react';
import { mount, ShallowWrapper, ReactWrapper, MountRendererProps } from 'enzyme';
import OlView from 'ol/View';
import OlMap from 'ol/Map';
import OlSourceVector from 'ol/source/Vector';
import OlLayerVector from 'ol/layer/Vector';
import OlFeature from 'ol/Feature';
import OlGeomPoint from 'ol/geom/Point';
import OlMapBrowserEvent from 'ol/MapBrowserEvent';

type Wrapper =  ShallowWrapper | ReactWrapper;

/**
 * A set of some useful static helper methods.
 *
 * @class
 */
export class TestUtil {

  static mapDivId = 'map';
  static mapDivHeight = 256;
  static mapDivWidth = 256;

  /**
   * Mounts the given component.
   *
   * @param Component The Component to render.
   * @param props The props to be used.
   * @param options The options to be set.
   */
  static mountComponent = (Component: any, props?: any, options?: MountRendererProps): Wrapper => {
    return mount(<Component {...props}/>, options);
  };

  /**
   * Creates and applies a map <div> element to the body.
   *
   * @return {Element} The mounted <div> element.
   */
  static mountMapDiv = () => {
    const div = document.createElement('div');
    const style = div.style;

    style.position = 'absolute';
    style.left = '-1000px';
    style.top = '-1000px';
    style.width = TestUtil.mapDivWidth + 'px';
    style.height = TestUtil.mapDivHeight + 'px';
    div.id = TestUtil.mapDivId;

    document.body.appendChild(div);

    return div;
  };

  /**
   * Removes the map div element from the body.
   */
  static unmountMapDiv = () => {
    let div = document.querySelector(`div#${TestUtil.mapDivId}`);
    if (!div) {
      return;
    }
    const parent = div.parentNode;
    if (parent) {
      parent.removeChild(div);
    }
    div = null;
  };

  /**
   * Creates an ol map.
   *
   * @param [mapOpts] Additional options for the map to create.
   * @return The ol map.
   */
  static createMap = (mapOpts?: any) => {
    const source = new OlSourceVector();
    const layer = new OlLayerVector({source: source});
    const targetDiv = TestUtil.mountMapDiv();
    const defaultMapOpts = {
      target: targetDiv,
      layers: [layer],
      view: new OlView({
        center: [829729, 6708850],
        resolution: 1,
        resolutions: mapOpts ? mapOpts.resolutions : undefined
      })
    };

    Object.assign(defaultMapOpts, mapOpts);

    const map = new OlMap(defaultMapOpts);

    map.renderSync();

    return map;
  };

  /**
   * Removes the map.
   */
  static removeMap =  (map: OlMap) => {
    if (map instanceof OlMap) {
      map.dispose();
    }
    TestUtil.unmountMapDiv();
  };

  /**
   * Simulates a browser pointer event on the map viewport.
   * Origin: https://github.com/openlayers/openlayers/blob/master/test/spec/ol/interaction/Draw.test.js#L67
   *
   * @param map The map to use.
   * @param type Event type.
   * @param x Horizontal offset from map center.
   * @param y Vertical offset from map center.
   * @param [opt_shiftKey] Shift key is pressed
   * @param [dragging] Whether the map is being dragged or not.
   */
  static simulatePointerEvent = ({map, type, x, y, opt_shiftKey, dragging}:
  {map: any; type: string; x: number; y: number; opt_shiftKey?: boolean; dragging?: boolean}) => {
    const viewport = map.getViewport();
    // Calculated in case body has top < 0 (test runner with small window).
    const position = viewport.getBoundingClientRect();
    const shiftKey = opt_shiftKey !== undefined ? opt_shiftKey : false;
    const event = new PointerEvent(type, {
      clientX: position.left + x + TestUtil.mapDivWidth / 2,
      clientY: position.top + y + TestUtil.mapDivHeight / 2,
      shiftKey
    });
    const olEvt = OlMapBrowserEvent(type, map, event, dragging);
    map.handleMapBrowserEvent(olEvt);
  };

  /**
   * Creates and returns an empty vector layer.
   *
   * @param [properties] The properties to set.
   * @return {ol.layer.Vector} The layer.
   */
  static createVectorLayer = (properties: any) => {
    const source = new OlSourceVector();
    const layer = new OlLayerVector({source: source});

    layer.setProperties(properties);

    return layer;
  };

  /**
   * Returns a point feature with a random position.
   */
  static generatePointFeature = (props = {
    ATTR_1: Math.random() * 100,
    ATTR_2: 'Borsigplatz 9',
    ATTR_3: 'Dortmund'
  }) => {
    const coords = [
      Math.floor(Math.random() * 180) - 180,
      Math.floor(Math.random() * 90) - 90
    ];
    const geom = new OlGeomPoint(coords);
    const feat = new OlFeature({
      geometry: geom
    });

    feat.setProperties(props);

    return feat;
  };

}

export default TestUtil;
