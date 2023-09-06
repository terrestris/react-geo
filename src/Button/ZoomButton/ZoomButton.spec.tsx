import MapContext from '@terrestris/react-util/dist/Context/MapContext/MapContext';
import { actSetTimeout } from '@terrestris/react-util/dist/Util/rtlTestUtils';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OlMap from 'ol/Map';
import * as React from 'react';

import TestUtil from '../../Util/TestUtil';
import ZoomButton from './ZoomButton';

describe('<ZoomButton />', () => {

  let map;

  beforeEach(() => {
    map = TestUtil.createMap();
  });

  it('is defined', () => {
    expect(ZoomButton).not.toBeUndefined();
  });

  it('can be rendered', () => {
    const { container } = render(
      <MapContext.Provider value={map}>
        <ZoomButton />
      </MapContext.Provider>
    );
    expect(container).toBeVisible();
  });

  it('zooms in when clicked', async () => {
    render(
      <MapContext.Provider value={map}>
        <ZoomButton>Zoom test</ZoomButton>
      </MapContext.Provider>
    );

    const initialZoom = map.getView().getZoom();
    const button = screen.getByText('Zoom test');
    await userEvent.click(button);

    await actSetTimeout(300);
    const newZoom = map.getView().getZoom();
    expect(newZoom).toBe(initialZoom + 1);
  });

  it('can be configured to zoom out', async () => {
    render(
      <MapContext.Provider value={map}>
        <ZoomButton delta={-1}>Zoom test</ZoomButton>
      </MapContext.Provider>
    );

    const initialZoom = map.getView().getZoom();
    const button = screen.getByText('Zoom test');
    await userEvent.click(button);

    await actSetTimeout(300);
    const newZoom = map.getView().getZoom();
    expect(newZoom).toBe(initialZoom - 1);
  });

  it('does not belch when map has no view', () => {
    render(
      <MapContext.Provider value={new OlMap(undefined)}>
        <ZoomButton>Zoom test</ZoomButton>
      </MapContext.Provider>
    );
    const button = screen.getByText('Zoom test');

    expect(async () => {
      await userEvent.click(button);
    }).not.toThrow();
  });

  it('cancels already running animations', async () => {
    render(
      <MapContext.Provider value={map}>
        <ZoomButton animate={true} animateOptions={{ duration: 250 }}>Zoom test</ZoomButton>
      </MapContext.Provider>
    );

    const button = screen.getByText('Zoom test');
    const view = map.getView();
    view.cancelAnimations = jest.fn();

    await userEvent.click(button);
    await userEvent.click(button);
    await userEvent.click(button);

    expect(view.cancelAnimations.mock.calls.length).not.toBe(0);
  });

});
