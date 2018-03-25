/*eslint-env jest*/

import TestUtil from '../../Util/TestUtil';

import { ZoomButton } from '../../index';

describe('<ZoomButton />', () => {

  let map;

  beforeEach(() => {
    map = TestUtil.createMap();
  });

  it('is defined', () => {
    expect(ZoomButton).not.toBeUndefined();
  });

  it('can be rendered', () => {
    const wrapper = TestUtil.mountComponent(ZoomButton, {map});
    expect(wrapper).not.toBeUndefined();
  });

  it('zooms in when clicked', () => {
    const wrapper = TestUtil.mountComponent(ZoomButton, {map});

    const initialZoom = map.getView().getZoom();

    wrapper.instance().onClick();

    const promise = new Promise(resolve => {
      setTimeout(resolve, 1200);
    });

    expect.assertions(1);
    return promise.then(() => {
      const newZoom = map.getView().getZoom();
      expect(newZoom).toBe(initialZoom + 1);
    });
  });

  it('can be configured to zoom out', () => {
    const wrapper = TestUtil.mountComponent(ZoomButton, {map, delta: -1});

    const initialZoom = map.getView().getZoom();

    wrapper.instance().onClick();

    const promise = new Promise(resolve => {
      setTimeout(resolve, 1200);
    });

    expect.assertions(1);
    return promise.then(() => {
      const newZoom = map.getView().getZoom();
      expect(newZoom).toBe(initialZoom - 1);
    });
  });

});
