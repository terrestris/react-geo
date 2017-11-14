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

  describe('#close', () => {
    const wrapper = TestUtil.mountComponent(Panel);

    it('is defined', () => {
      expect(wrapper.instance().close).not.toBeUndefined();
    });

    it('removes the window from the DOM', () => {
      //Setup
      const node = wrapper.getDOMNode();
      document.body.appendChild(node);

      const before = document.getElementsByClassName(wrapper.instance().state.id);
      expect(before).toHaveLength(1);
      wrapper.instance().close();

      const after = document.getElementsByClassName(wrapper.instance().state.id);
      expect(after).toHaveLength(0);

    });
  });

  describe('#showWindow', () => {

    it('is defined', () => {
      expect(Panel.showWindow).not.toBeUndefined();
    });

    it('shows a window', (done) => {
      //Setup
      const testContainer = document.createElement('div');
      testContainer.id = 'testContainer';
      document.body.appendChild(testContainer);

      Panel.showWindow({
        x: 200,
        y: 200,
        containerId: 'testContainer',
        width: 200,
        height: 200,
        title: 'Drag me'
      }).then((win) => {

        expect(win.props.title).toBe('Drag me');
        expect(win.props.containerId).toBe('testContainer');
        expect(win.props.id).toContain('react-geo-window-');
        expect(win.props.collapsible).toBe(true);
        expect(win.props.closable).toBe(true);
        expect(win.props.resizeOpts).toBe(true);

        //TearDown
        win.close();
        testContainer.parentElement.removeChild(testContainer);
        done();
      });

    });
  });

});
