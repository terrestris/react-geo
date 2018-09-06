/*eslint-env jest*/

import TestUtil from '../../Util/TestUtil';
import { getCenter, containsExtent } from 'ol/extent';
import OlGeomPolygon from 'ol/geom/Polygon';

import {
  ZoomToExtentButton
} from '../../index';

describe('<ZoomToExtentButton />', () => {

  let map;
  const mockGeometry = new OlGeomPolygon([
    [[5000, 0], [0, 5000], [5000, 10000], [10000, 5000], [5000, 0]]
  ]);
  const mockGeometryCenter = [5000, 5000];
  const mockExtent = [0, 0, 10000, 10000];
  const mockExtentCenter = [5000, 5000];

  beforeEach(() => {
    map = TestUtil.createMap();
  });

  it('is defined', () => {
    expect(ZoomToExtentButton).not.toBeUndefined();
  });

  it('can be rendered', () => {
    const wrapper = TestUtil.mountComponent(ZoomToExtentButton, {
      map,
      extent: mockExtent
    });
    expect(wrapper).not.toBeUndefined();
  });

  it('zooms to extent when clicked', () => {
    const wrapper = TestUtil.mountComponent(ZoomToExtentButton, {
      map,
      extent: mockExtent
    });
    wrapper.instance().onClick();

    const promise = new Promise(resolve => {
      setTimeout(resolve, 1200);
    });

    expect.assertions(2);
    return promise.then(() => {
      const newExtent = map.getView().calculateExtent();
      const newCenter = getCenter(newExtent);
      expect(newCenter).toEqual(mockExtentCenter);
      expect(containsExtent(newExtent, mockExtent)).toBe(true);
    });
  });

  it('zooms to polygon\'s geometry extent when clicked', () => {
    const wrapper = TestUtil.mountComponent(ZoomToExtentButton, {
      map,
      extent: mockGeometry
    });

    wrapper.instance().onClick();

    const promise = new Promise(resolve => {
      setTimeout(resolve, 1200);
    });

    expect.assertions(2);
    return promise.then(() => {
      const newExtent = map.getView().calculateExtent();
      const newCenter = getCenter(newExtent);
      expect(newCenter).toEqual(mockGeometryCenter);
      expect(containsExtent(newExtent, mockExtent)).toBe(true);
    });

  });
});
