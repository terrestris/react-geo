/*eslint-env mocha*/
// import React from 'react';
import expect from 'expect.js';
// import { mount } from 'enzyme';
//
// import TestUtil from '../../Util/TestUtil';

import {
  MapProvider
} from '../../index';

describe('MapProvider', () => {
  // let map;
  //
  // /* eslint-disable require-jsdoc */
  // class MockComponent extends React.Component {
  //   render() {
  //     return (
  //       <div>A mock Component</div>
  //     );
  //   }
  // }
  /* eslint-enable require-jsdoc */

  // beforeEach(() => {
  //   map = TestUtil.createMap();
  // });

  describe('Basics', () => {
    it('is defined', () => {
      expect(MapProvider).not.to.be(undefined);
    });

    // TODO
    // it('provides a given map to its children', () => {
    //   const wrapper = mount(
    //     <MapProvider map={map}>
    //       <MockComponent />
    //     </MapProvider>
    //   );
    //
    //   expect(wrapper).not.to.be(undefined);
    //   expect(wrapper.context().map).to.eql(map);
    // });

  });
});
