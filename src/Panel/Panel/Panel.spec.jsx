/*eslint-env mocha*/
import expect from 'expect.js';
import TestUtil from '../../Util/TestUtil';

import { Panel } from '../../index';

describe('<Panel />', () => {

  it('is defined', () => {
    expect(Panel).not.to.be(undefined);
  });

  it('can be rendered', () => {
    const wrapper = TestUtil.mountComponent(Panel);
    expect(wrapper).not.to.be(undefined);
  });

  it('passes props to Rnd', () => {
    const wrapper = TestUtil.mountComponent(Panel, {
      className: 'podolski',
      fc: 'koeln'
    });
    const rnd = wrapper.find('Rnd').getElements()[0];
    expect(rnd.props.className).to.contain('podolski');
    expect(rnd.props.fc).to.equal('koeln');
  });

  describe('#toggleCollapse', () => {
    const wrapper = TestUtil.mountComponent(Panel);

    it('is defined', () => {
      expect(wrapper.instance().toggleCollapse).not.to.be(undefined);
    });

    it('inverts the collapsed property on the state', () => {
      const oldState = wrapper.state();
      wrapper.instance().toggleCollapse();
      const newState = wrapper.state();
      expect(oldState.collapsed).to.be(!newState.collapsed);
    });
  });

  describe('#onResize', () => {
    const wrapper = TestUtil.mountComponent(Panel);

    it('is defined', () => {
      expect(wrapper.instance().onResize).not.to.be(undefined);
    });

    it('sets resizing on the state to true', () => {
      wrapper.instance().onResize(null, null, {clientHeight: 1337});
      expect(wrapper.state().height).to.eql(1337);
    });
  });

  describe('#onResizeStart', () => {
    const wrapper = TestUtil.mountComponent(Panel);

    it('is defined', () => {
      expect(wrapper.instance().onResizeStart).not.to.be(undefined);
    });

    it('sets resizing on the state to true', () => {
      wrapper.instance().onResizeStart();
      const state = wrapper.state();
      expect(state.resizing).to.be(true);
    });
  });

  describe('#onResizeStop', () => {
    const wrapper = TestUtil.mountComponent(Panel);

    it('is defined', () => {
      expect(wrapper.instance().onResizeStop).not.to.be(undefined);
    });

    it('sets the el size on the state', () => {
      wrapper.instance().onResizeStop();
      const state = wrapper.state();
      expect(state.resizing).to.be(false);
    });
  });

  describe('#close', () => {
    const wrapper = TestUtil.mountComponent(Panel);

    it('is defined', () => {
      expect(wrapper.instance().close).not.to.be(undefined);
    });

    it('removes the window from the DOM', () => {
      //Setup
      const node = wrapper.getDOMNode();
      document.body.appendChild(node);

      const before = document.getElementsByClassName(wrapper.instance().state.id);
      expect(before).to.have.length(1);
      wrapper.instance().close();

      const after = document.getElementsByClassName(wrapper.instance().state.id);
      expect(after).to.be.empty();

    });
  });

  describe('#showWindow', () => {

    it('is defined', () => {
      expect(Panel.showWindow).not.to.be(undefined);
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

        expect(win.props.title).to.eql('Drag me');
        expect(win.props.containerId).to.eql('testContainer');
        expect(win.props.id).to.contain('react-geo-window-');
        expect(win.props.collapsible).to.be(true);
        expect(win.props.closable).to.be(true);
        expect(win.props.resizeOpts).to.be(true);

        //TearDown
        win.close();
        testContainer.parentElement.removeChild(testContainer);
        done();
      });

    });
  });

});
