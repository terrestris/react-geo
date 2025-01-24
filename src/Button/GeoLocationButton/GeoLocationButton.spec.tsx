import {
  disableGeolocationMock,
  enableGeolocationMock,
  fireGeolocationListeners
} from '@terrestris/react-util/dist/Util/geolocationMock';
import { renderInMapContext } from '@terrestris/react-util/dist/Util/rtlTestUtils';
import { render } from '@testing-library/react';
import OlMap from 'ol/Map';
import { fromLonLat } from 'ol/proj';
import * as React from 'react';
import { act } from 'react-dom/test-utils';

import TestUtil from '../../Util/TestUtil';
import GeoLocationButton from './GeoLocationButton';

describe('<GeoLocationButton />', () => {

  let map: OlMap;

  beforeAll(() => {
    enableGeolocationMock();
  });

  afterAll(() => {
    disableGeolocationMock();
  });

  beforeEach(() => {
    map = TestUtil.createMap();
  });

  describe('#Basics', () => {

    it('is defined', () => {
      expect(GeoLocationButton).not.toBeUndefined();
    });

    it('can be rendered', () => {
      const { container } = render(<GeoLocationButton  />);
      expect(container).toBeVisible();
    });

    it('can be pressed', async () => {
      const callback = jest.fn();

      const { rerenderInMapContext } = renderInMapContext(map, (
        <GeoLocationButton
          showMarker={false}
          onGeoLocationChange={callback}
          pressed={false}
          enableTracking={true}
        />
      ));

      rerenderInMapContext(<GeoLocationButton
        showMarker={false}
        onGeoLocationChange={callback}
        pressed={true}
        enableTracking={true}
      />);

      act(() => {
        fireGeolocationListeners();
      });

      expect(callback).toBeCalled();
    });

    it('can be pressed twice', async () => {
      const callback = jest.fn();

      const { rerenderInMapContext } = renderInMapContext(map, (<GeoLocationButton
        showMarker={false}
        onGeoLocationChange={callback}
        pressed={false}
        enableTracking={true}
      />));

      expect(callback).toBeCalledTimes(0);

      rerenderInMapContext(<GeoLocationButton
        showMarker={false}
        onGeoLocationChange={callback}
        pressed={true}
        enableTracking={true}
      />);

      act(() => {
        fireGeolocationListeners();
      });

      expect(callback).toBeCalledTimes(1);

      render(<GeoLocationButton
        showMarker={false}
        onGeoLocationChange={callback}
        pressed={false}
      />);

      expect(callback).toBeCalledTimes(1);
    });

    it('is called with the correct position', async () => {
      const callback = jest.fn();

      const { rerenderInMapContext } = renderInMapContext(map, <GeoLocationButton
        showMarker={false}
        onGeoLocationChange={callback}
        pressed={false}
        enableTracking={true}
      />);

      rerenderInMapContext(<GeoLocationButton
        showMarker={false}
        onGeoLocationChange={callback}
        pressed={true}
        enableTracking={true}
      />);

      const coordinates = [ 47.12, -64.99 ];

      act(() => {
        fireGeolocationListeners({
          coords: {
            longitude: coordinates[0],
            latitude: coordinates[1],
            accuracy: 7,
            speed: 9,
            heading: 0
          }
        });
      });

      expect(callback).toBeCalledWith({
        accuracy: 7,
        heading: 0,
        position: fromLonLat(coordinates),
        speed: 9
      });
    });
  });
});
