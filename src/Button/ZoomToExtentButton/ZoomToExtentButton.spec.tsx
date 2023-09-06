import MapContext from '@terrestris/react-util/dist/Context/MapContext/MapContext';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { containsExtent,getCenter } from 'ol/extent';
import OlGeomPolygon from 'ol/geom/Polygon';
import * as React from 'react';

import TestUtil from '../../Util/TestUtil';
import ZoomToExtentButton from '../ZoomToExtentButton/ZoomToExtentButton';

describe('<ZoomToExtentButton />', () => {

  let map;
  const mockGeometry = new OlGeomPolygon([
    [[5000, 0], [0, 5000], [5000, 10000], [10000, 5000], [5000, 0]]
  ]);
  const mockGeometryCenter = [5000, 5000];
  const mockExtent = [0, 0, 10000, 10000];
  const mockExtentCenter = [5000, 5000];
  const mockZoom = 7;

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

  it('zooms to extent when clicked', async () => {
    render(
      <MapContext.Provider value={map}>
        <ZoomToExtentButton extent={mockExtent}>Zoom test</ZoomToExtentButton>
      </MapContext.Provider>
    );

    const button = screen.getByText('Zoom test');
    await userEvent.click(button);

    const promise = new Promise<void>((resolve) => {
      window.setTimeout(() => {
        resolve();
      }, 1200);
    });
    await promise;
    const newExtent = map.getView().calculateExtent();
    const newCenter = getCenter(newExtent);
    expect(newCenter).toEqual(mockExtentCenter);
    expect(containsExtent(newExtent, mockExtent)).toBe(true);
  });

  it('zooms to polygon\'s geometry extent when clicked', async () => {
    render(
      <MapContext.Provider value={map}>
        <ZoomToExtentButton extent={mockGeometry}>Zoom test</ZoomToExtentButton>
      </MapContext.Provider>
    );

    const button = screen.getByText('Zoom test');
    await userEvent.click(button);

    const promise = new Promise<void>((resolve) => {
      window.setTimeout(() => {
        resolve();
      }, 1200);
    });
    await promise;
    const newExtent = map.getView().calculateExtent();
    const newCenter = getCenter(newExtent);
    expect(newCenter).toEqual(mockGeometryCenter);
    expect(containsExtent(newExtent, mockExtent)).toBe(true);
  });

  it('zooms to extent when clicked providing center and zoom', async () => {
    render(
      <MapContext.Provider value={map}>
        <ZoomToExtentButton
          fitOptions={undefined}
          center={mockExtentCenter}
          zoom={mockZoom}
        >Zoom test</ZoomToExtentButton>
      </MapContext.Provider>
    );

    const button = screen.getByText('Zoom test');
    await userEvent.click(button);

    const promise = new Promise<void>((resolve) => {
      window.setTimeout(() => {
        resolve();
      }, 1200);
    });
    await promise;
    const newExtent = map.getView().calculateExtent();
    const newCenter = getCenter(newExtent);
    const newZoom = map.getView().getZoom();
    expect(newCenter).toEqual(mockExtentCenter);
    expect(containsExtent(newExtent, mockExtent)).toBe(true);
    expect(newZoom).toEqual(mockZoom);
  });
});
