import TestUtil from '../../Util/TestUtil';

import Panel from './Panel';

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

  describe('#onKeyDown', () => {

    const wrapper = TestUtil.mountComponent(Panel);

    // Mock a DOM to play around
    document.body.className = 'react-geo-panel';

    const element = wrapper.instance()._rnd.getSelfElement();

    it('is defined', () => {
      expect(wrapper.instance().onKeyDown).not.toBeUndefined();
    });

    it('calls onEscape method if provided in props', () => {
      const mockEvt = {
        key: 'invalid_key'
      };

      wrapper.setProps({
        onEscape: jest.fn()
      });

      const onEscSpy = jest.spyOn(wrapper.props(), 'onEscape');
      const focusSpy = jest.spyOn(element, 'focus');

      wrapper.instance().onKeyDown(mockEvt);
      expect(onEscSpy).toHaveBeenCalledTimes(0);
      expect(focusSpy).toHaveBeenCalledTimes(0);

      // call once again with valid key and onEscape function
      mockEvt.key = 'Escape';

      wrapper.instance().onKeyDown(mockEvt);
      expect(onEscSpy).toHaveBeenCalledTimes(1);
      expect(focusSpy).toHaveBeenCalledTimes(1);
      expect(element.className).toContain(document.activeElement.className);

      onEscSpy.mockRestore();
      focusSpy.mockRestore();
    });
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

    it('calls corresponding function "onResize" of props if defined', () => {
      const onResizeMock = jest.fn();
      const wrapperWithMockedFunction = TestUtil.mountComponent(Panel,  {
        onResize: onResizeMock
      });
      expect(wrapperWithMockedFunction.instance().onResizeStop).not.toBeUndefined();
      wrapperWithMockedFunction.instance().onResize(null, null, {clientHeight: 4711});
      expect(onResizeMock.mock.calls).toHaveLength(1);
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

    it('calls corresponding function "onResizeStart" of props if defined', () => {
      const onResizeStartMock = jest.fn();
      const wrapperWithMockedFunction = TestUtil.mountComponent(Panel,  {
        onResizeStart: onResizeStartMock
      });
      expect(wrapperWithMockedFunction.instance().onResizeStart).not.toBeUndefined();
      wrapperWithMockedFunction.instance().onResizeStart();
      expect(onResizeStartMock.mock.calls).toHaveLength(1);
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

    it('calls corresponding function "onResizeStop" of props if defined', () => {
      const onResizeStopMock = jest.fn();
      const wrapperWithMockedFunction = TestUtil.mountComponent(Panel,  {
        onResizeStop: onResizeStopMock
      });
      expect(wrapperWithMockedFunction.instance().onResizeStop).not.toBeUndefined();
      wrapperWithMockedFunction.instance().onResizeStop();
      expect(onResizeStopMock.mock.calls).toHaveLength(1);
    });
  });

});
