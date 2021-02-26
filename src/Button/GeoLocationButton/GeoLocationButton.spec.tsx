import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import * as React from 'react';
import { transform } from 'ol/proj';

import TestUtil from '../../Util/TestUtil';
import { GeolocationMock } from '../../Util/GeolocationMock';

import GeoLocationButton from './GeoLocationButton';

describe('<GeoLocationButton />', () => {

  let map;

  beforeEach(() => {
    map = TestUtil.createMap();
  });

  describe('#Basics', () => {

    it('is defined', () => {
      expect(GeoLocationButton).not.toBeUndefined();
    });

    it('can be rendered', () => {
      render(<GeoLocationButton map={map} data-testid="test-geolocation-button" />);
      expect(screen.getByTestId('test-geolocation-button')).toBeVisible();
    });

    it('can be pressed', () => {
      const geolocationMock = new GeolocationMock();
      const callback = jest.fn();

      render(<GeoLocationButton
        map={map}
        showMarker={false}
        onGeolocationChange={callback}
        data-testid="test-geolocation-button"
      />);

      const button = screen.getByTestId('test-geolocation-button');
      userEvent.click(button);

      geolocationMock.fireListeners();
      expect(callback).toBeCalled();
    });

    it('can be pressed twice', () => {
      const geolocationMock = new GeolocationMock();
      const callback = jest.fn();

      render(<GeoLocationButton
        map={map}
        showMarker={false}
        onGeolocationChange={callback}
        data-testid="test-geolocation-button"
      />);

      geolocationMock.fireListeners();

      expect(callback).toBeCalledTimes(0);

      const button = screen.getByTestId('test-geolocation-button');
      userEvent.click(button);

      geolocationMock.fireListeners();

      expect(callback).toBeCalledTimes(1);

      userEvent.click(button);

      geolocationMock.fireListeners();

      expect(callback).toBeCalledTimes(1);
    });

    it('is called with the correct position', () => {
      const geolocationMock = new GeolocationMock();
      const callback = jest.fn();

      render(<GeoLocationButton
        map={map}
        showMarker={false}
        onGeolocationChange={callback}
        data-testid="test-geolocation-button"
      />);

      const button = screen.getByTestId('test-geolocation-button');
      userEvent.click(button);

      const coordinates = [ 47.12, -64.99 ];

      geolocationMock.fireListeners({
        coords: {
          longitude: coordinates[0],
          latitude: coordinates[1],
          accuracy: 7,
          speed: 9,
          heading: 0
        }
      });

      const converted = transform(coordinates, 'EPSG:4326', map.getView().getProjection());

      expect(callback).toBeCalledWith({
        accuracy: 7,
        heading: 0,
        position: converted,
        speed: 9
      });
    });
  });
});
