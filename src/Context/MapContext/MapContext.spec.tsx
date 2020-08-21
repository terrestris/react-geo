import React from 'react';
import { shallow, mount } from 'enzyme';
import { useMap } from '../../Hook/useMap';
import MapContext from './MapContext';
import { TestUtil } from '../../Util/TestUtil';

describe('MapContext', () => {
  const olMap = TestUtil.createMap();

  const MapThing = ({ map }) => {
    if (!map) {
      return <span>No map found</span>
    }
    return <span>{map.getView().getCenter()}</span>
  }

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
