import { mount,shallow } from 'enzyme';
import OlMap from 'ol/Map';
import React from 'react';

import { useMap } from '../../Hook/useMap';
import { TestUtil } from '../../Util/TestUtil';
import MapContext from './MapContext';

describe('MapContext', () => {
  const olMap = TestUtil.createMap();

  const MapThing = ({ map }: {map: OlMap}) => {
    if (!map) {
      return <span>No map found</span>;
    }
    return <span>{map.getView().getCenter()}</span>;
  };

  const Thing = () => {
    const map = useMap();
    return <MapThing map={map} />;
  };

  it('is defined', () => {
    expect(useMap).toBeDefined();
  });

  describe('with useMap', () => {
    it('provides the default value', () => {
      const got = shallow(<Thing />);
      expect(got.props().map).toEqual(null);
    });

    it('provides a map if given', () => {
      const container = mount(
        <MapContext.Provider value={olMap}>
          <Thing />
        </MapContext.Provider>
      );
      const got = container.childAt(0);
      expect(got.props().map).toEqual(olMap);
    });
  });

  describe('with Consumer', () => {
    it('provides the default value', () => {
      const got = mount(
        <MapContext.Consumer>
          {(map) => <MapThing map={map} />}
        </MapContext.Consumer>
      );
      expect(got.props().map).toEqual(null);
    });

    it('provides a map if given', () => {
      const got = mount(
        <MapContext.Provider value={olMap}>
          <MapContext.Consumer>
            {(map) => <MapThing map={map} />}
          </MapContext.Consumer>
        </MapContext.Provider>
      );
      expect(got.props().map).toEqual(olMap);
    });
  });

});
