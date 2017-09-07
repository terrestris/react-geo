/*eslint-env mocha*/
import React from 'react';
import expect from 'expect.js';
import { shallow } from 'enzyme';
import { Panel } from './Panel.jsx';

describe('<Panel />', () => {

  /**
   * setup StatusBar component
   *
   * @return {Component} mounted mock of StatusBar
   */
  const setup = (props) => {
    const mainDiv = document.createElement('div');
    mainDiv.id = 'main';
    document.body.appendChild(mainDiv);
    const wrapper = shallow(<Panel {...props} />);
    return wrapper;
  };

  it('is defined', () => {
    expect(Panel).not.to.be(undefined);
  });

  it('can be rendered', () => {
    const wrapper = setup();
    expect(wrapper).not.to.be(undefined);
  });

  it('passed props are added to Rnd', () => {
    const wrapper = setup({className: 'podolski', fc: 'koeln'});
    const rnd = wrapper.find('Rnd').nodes[0];
    expect(rnd.props.className).to.contain('podolski');
    expect(rnd.props.fc).to.equal('koeln');
  });

  describe('#toggleCollapse', () => {
    const wrapper = setup();

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
    const wrapper = setup();

    it('is defined', () => {
      expect(wrapper.instance().onResize).not.to.be(undefined);
    });

    // TODO try to add a real test for the function
    // it('sets resizing on the state to true', () => {
    //   wrapper.instance().onResize();
    //   const state = wrapper.state();
    // });
  });

  describe('#onResizeStart', () => {
    const wrapper = setup();

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
    const wrapper = setup();

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
    const wrapper = setup();

    it('is defined', () => {
      expect(wrapper.instance().close).not.to.be(undefined);
    });

    // TODO Readd this test after the
    // err: "undefined is not an object (evaluating '_this.i18n.options')"
    // is solved
    //
    // it('removes the window from the DOM', () => {
    //   wrapper.instance().close();
    // });
  });

  describe('#showWindow', () => {

    it('is defined', () => {
      expect(Panel.showWindow).not.to.be(undefined);
    });
  });

});
