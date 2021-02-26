/*
 * This is a partial of GeolocationPosition which is assignable to PositionMock
 */
type PositionMock = {
  coords: Partial<GeolocationCoordinates>;
};

/**
 * Please note that openlayers seems to do some postprocessing on the heading value so it is not really possible to test
 * this here.
 */
export class GeolocationMock {
  private position: PositionMock;
  private listeners: Array<(p: PositionMock) => void> = [];

  constructor(initialPosition?: PositionMock) {
    this.position = initialPosition ?? {
      coords: {
        latitude: 51.1,
        longitude: 45.3
      }
    };

    global.navigator.geolocation = {
      getCurrentPosition: jest.fn()
        .mockImplementation(() => this.position),
      watchPosition: jest.fn()
        .mockImplementation(listener => {
          this.listeners.push(listener);
        })
    };
  }

  updatePosition(position: PositionMock) {
    this.position = position;
  }

  fireListeners(position?: PositionMock) {
    position = position ?? {
      coords: {
        latitude: -12.1,
        longitude: 12.3
      }
    };
    for (const listener of this.listeners) {
      listener(position);
    }
  }
}
