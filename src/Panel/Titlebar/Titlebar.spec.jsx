/*eslint-env mocha*/
import React from 'react';
import expect from 'expect.js';
import { shallow } from 'enzyme';
import { Titlebar } from './Titlebar.jsx';

describe('<Titlebar />', () => {

  /**
   * setup StatusBar component
   *
   * @return {Component} mounted mock of StatusBar
   */
  const setup = (props) => {
    const wrapper = shallow(<Titlebar parent={document.body} {...props} />);
    return wrapper;
  };

  it('is defined', () => {
    expect(Titlebar).not.to.be(undefined);
  });

  it('can be rendered', () => {
    const wrapper = setup();
    expect(wrapper).not.to.be(undefined);
  });

  it('adds a passed className', () => {
    const wrapper = setup({className: 'podolski'});
    expect(wrapper.node.props.className).to.contain('podolski');
  });

  it('renders the title', () => {
    const wrapper = setup();
    const title = wrapper.find('span.title');
    expect(title.length).to.equal(1);
  });

  it('renders the controls', () => {
    const wrapper = setup();
    const title = wrapper.find('span.controls');
    expect(title.length).to.equal(1);
  });

});
