/*eslint-env jest*/

import TestUtil from '../../Util/TestUtil';

import { Panel } from '../../index';

describe('<Panel />', () => {

  it('is defined', () => {
    expect(Panel).not.toBeUndefined();
  });

  it('can be rendered', () => {
    const wrapper = TestUtil.mountComponent(Panel);
    expect(wrapper).not.toBeUndefined();
  });

  it('passes props to Rnd', () => {
    const wrapper = TestUtil.mountComponent(Panel, {
      className: 'podolski',
      fc: 'koeln'
    });
    const rnd = wrapper.find('Rnd').getElements()[0];
    expect(rnd.props.className).toContain('podolski');
    expect(rnd.props.fc).toBe('koeln');
  });

  describe('#toggleCollapse', () => {
    const wrapper = TestUtil.mountComponent(Panel);

    it('is defined', () => {
      expect(wrapper.instance().toggleCollapse).not.toBeUndefined();
    });

    it('inverts the collapsed property on the state', () => {
      const oldState = wrapper.state();
      wrapper.instance().toggleCollapse();
      const newState = wrapper.state();
      expect(oldState.collapsed).toBe(!newState.collapsed);
    });
  });

  describe('#onResize', () => {
    const wrapper = TestUtil.mountComponent(Panel);

    it('is defined', () => {
      expect(wrapper.instance().onResize).not.toBeUndefined();
    });

    it('sets resizing on the state to true', () => {
      wrapper.instance().onResize(null, null, {clientHeight: 1337});
      expect(wrapper.state().height).toBe(1337);
    });
  });

  describe('#onResizeStart', () => {
    const wrapper = TestUtil.mountComponent(Panel);

    it('is defined', () => {
      expect(wrapper.instance().onResizeStart).not.toBeUndefined();
    });

    it('sets resizing on the state to true', () => {
      wrapper.instance().onResizeStart();
      const state = wrapper.state();
      expect(state.resizing).toBe(true);
    });
  });

  describe('#onResizeStop', () => {
    const wrapper = TestUtil.mountComponent(Panel);

    it('is defined', () => {
      expect(wrapper.instance().onResizeStop).not.toBeUndefined();
    });

    it('sets the el size on the state', () => {
      wrapper.instance().onResizeStop();
      const state = wrapper.state();
      expect(state.resizing).toBe(false);
    });
  });

});
