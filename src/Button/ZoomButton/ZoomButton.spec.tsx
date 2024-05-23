import { actSetTimeout, renderInMapContext } from '@terrestris/react-util/dist/Util/rtlTestUtils';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import _isNil from 'lodash/isNil';
import OlMap from 'ol/Map';
import * as React from 'react';

import TestUtil from '../../Util/TestUtil';
import ZoomButton from './ZoomButton';

describe('<ZoomButton />', () => {

  let map: OlMap;

  beforeEach(() => {
    map = TestUtil.createMap();
  });

  it('is defined', () => {
    expect(ZoomButton).not.toBeUndefined();
  });

  it('can be rendered', () => {
    const { container } = renderInMapContext(map, <ZoomButton />);
    expect(container).toBeVisible();
  });

  it('zooms in when clicked', async () => {
    renderInMapContext(map,
      <ZoomButton>Zoom test</ZoomButton>
    );

    const initialZoom = map.getView().getZoom();
    if (!_isNil(initialZoom)) {
      const button = screen.getByText('Zoom test');
      await userEvent.click(button);

      await actSetTimeout(300);
      const newZoom = map.getView().getZoom();
      expect(newZoom).toBe(initialZoom + 1);
    }
  });

  it('can be configured to zoom out', async () => {
    renderInMapContext(map,
      <ZoomButton delta={-1}>Zoom test</ZoomButton>
    );

    const initialZoom = map.getView().getZoom();
    if (!_isNil(initialZoom)) {
      const button = screen.getByText('Zoom test');
      await userEvent.click(button);

      await actSetTimeout(300);
      const newZoom = map.getView().getZoom();
      expect(newZoom).toBe(initialZoom - 1);
    }
  });

  it('does not belch when map has no view', () => {
    renderInMapContext(new OlMap(undefined),
      <ZoomButton>Zoom test</ZoomButton>
    );
    const button = screen.getByText('Zoom test');

    expect(async () => {
      await userEvent.click(button);
    }).not.toThrow();
  });

  it('cancels already running animations', async () => {
    renderInMapContext(map,
      <ZoomButton animateOptions={{ duration: 250 }}>Zoom test</ZoomButton>
    );

    const button = screen.getByText('Zoom test');
    const view = map.getView();
    view.cancelAnimations = jest.fn();

    await userEvent.click(button);
    await userEvent.click(button);
    await userEvent.click(button);

    expect((view.cancelAnimations as jest.Mock).mock.calls.length).toBe(2);
  });

});
