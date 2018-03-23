/*eslint-env jest*/

import TestUtil from '../../Util/TestUtil';
import OlExtent from 'ol/extent';

import {
  ZoomToExtentButton
} from '../../index';

describe('<ZoomToExtentButton />', () => {

  let map;
  let mockGeometry;
  let mockExtent;

  beforeEach(() => {
    map = TestUtil.createMap();
    mockExtent = TestUtil.generateExtent();
    mockGeometry = TestUtil.generatePolygonGeometry();
  });

  it('is defined', () => {
    expect(ZoomToExtentButton).not.toBeUndefined();
  });

  it('can be rendered', () => {
    const wrapper = TestUtil.mountComponent(ZoomToExtentButton);
    expect(wrapper).not.toBeUndefined();
  });

  it('zooms to extent when clicked', () => {
    const wrapper = TestUtil.mountComponent(ZoomToExtentButton, {
      map,
      extent: mockExtent
    });
    wrapper.instance().onClick();
    const newExtent = map.getView().calculateExtent();
    const newSize = OlExtent.getSize(newExtent);
    const mockSize = OlExtent.getSize(mockExtent);
    const newCenter = OlExtent.getCenter(newExtent);
    const mockCenter = OlExtent.getCenter(mockExtent);
    expect(newCenter).toEqual(mockCenter);
    if (!(mockSize[1] < newSize[1]))     expect(newSize[1]).toEqual(mockSize[1]);
    if (!(mockSize[0] < newSize[0]))     expect(newSize[0]).toEqual(mockSize[0]);
  });

  it('zooms to polygon\'s geometry extent when clicked', () => {
    const wrapper = TestUtil.mountComponent(ZoomToExtentButton, {
      map,
      extent: mockGeometry
    });
    wrapper.instance().onClick();
    const newExtent = map.getView().calculateExtent();
    const newSize = OlExtent.getSize(newExtent);
    const mockSize = OlExtent.getSize(mockGeometry.getExtent());
    const newCenter = OlExtent.getCenter(newExtent);
    const mockCenter = OlExtent.getCenter(mockGeometry.getExtent());
    expect(newCenter).toEqual(mockCenter);
    if (!(mockSize[1] < newSize[1]))     expect(newSize[1]).toEqual(mockSize[1]);
    if (!(mockSize[0] < newSize[0]))     expect(newSize[0]).toEqual(mockSize[0]);
  });
});
