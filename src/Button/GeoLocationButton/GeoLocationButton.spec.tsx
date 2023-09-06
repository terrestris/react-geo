import {
  disableGeolocationMock,
  enableGeolocationMock,
  fireGeolocationListeners
} from '@terrestris/react-util/dist/Util/geolocationMock';
import { render, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { transform } from 'ol/proj';
import * as React from 'react';

import TestUtil from '../../Util/TestUtil';
import GeoLocationButton from './GeoLocationButton';

describe('<GeoLocationButton />', () => {

  let map;

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
      const { container } = render(<GeoLocationButton map={map} />);
      expect(container).toBeVisible();
    });

    it('can be pressed', async () => {
      const callback = jest.fn();

      const { container } = render(<GeoLocationButton
        map={map}
        showMarker={false}
        onGeolocationChange={callback}
      />);

      const button = within(container).getByRole('button');
      await userEvent.click(button);

      fireGeolocationListeners();
      expect(callback).toBeCalled();
    });

    it('can be pressed twice', async () => {
      const callback = jest.fn();

      const { container } = render(<GeoLocationButton
        map={map}
        showMarker={false}
        onGeolocationChange={callback}
      />);

      fireGeolocationListeners();

      expect(callback).toBeCalledTimes(0);

      const button = within(container).getByRole('button');
      await userEvent.click(button);

      fireGeolocationListeners();

      expect(callback).toBeCalledTimes(1);

      await userEvent.click(button);

      fireGeolocationListeners();

      expect(callback).toBeCalledTimes(1);
    });

    it('is called with the correct position', async () => {
      const callback = jest.fn();

      const { container } = render(<GeoLocationButton
        map={map}
        showMarker={false}
        onGeolocationChange={callback}
      />);

      const button = within(container).getByRole('button');
      await userEvent.click(button);

      const coordinates = [ 47.12, -64.99 ];

      fireGeolocationListeners({
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
