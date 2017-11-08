/*eslint-env mocha*/
import expect from 'expect.js';

import TestUtil from '../../Util/TestUtil';

import {
  MapComponent
} from '../../index';

describe('<MapComponent />', () => {
  let map;

  it('is defined', () => {
    expect(MapComponent).not.to.be(undefined);
  });

  beforeEach(() => {
    map = TestUtil.createMap();
  });

  it('can be rendered', () => {
    const wrapper = TestUtil.mountComponent(MapComponent, {map});
    expect(wrapper).not.to.be(undefined);
  });

  it('passes props', () => {
    const wrapper = TestUtil.mountComponent(MapComponent, {
      map: map,
      className: 'podolski',
      fc: 'koeln'
    });
    const div = wrapper.find('div').getElements()[0];
    expect(div.props.className).to.contain('podolski');
    expect(div.props.fc).to.equal('koeln');
  });

});
