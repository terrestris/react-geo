/**
 * This is a partial of GeolocationPosition which is assignable to PositionMock
 */
type PositionMock = {
  coords: Partial<GeolocationCoordinates>;
};

const initialGeolocation = global.navigator.geolocation;

let currentPosition: PositionMock;
const listeners: Array<(p: PositionMock) => void> = [];


/**
 * This enables the geolocation mock
 */
export function enableGeolocationMock() {
  global.navigator.geolocation = {
    getCurrentPosition: jest.fn()
      .mockImplementation(() => currentPosition),
    watchPosition: jest.fn()
      .mockImplementation(listener => {
        listeners.push(listener);
      })
  };
}


/**
 * This disables the geolocation mock
 */
export function disableGeolocationMock() {
  global.navigator.geolocation = initialGeolocation;
}


/**
 * Please note that openlayers seems to do some postprocessing on the heading value so it is not really possible to test
 * this here.
 * @param {PositionMock} [position]
 */
export function fireGeolocationListeners(position?: PositionMock) {
  position = position ?? {
    coords: {
      latitude: -12.1,
      longitude: 12.3
    }
  };
  for (const listener of listeners) {
    listener(position);
  }
}

/**
 * Updates the current position of the geolocation
 * @param {PositionMock} position
 */
export function updatePosition(position: PositionMock) {
  currentPosition = position;
}

