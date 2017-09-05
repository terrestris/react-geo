/*eslint-env mocha*/
import React from 'react';
import expect from 'expect.js';
import Toolbar from './Toolbar.jsx';
import TestUtils from '../Util/TestUtils';

const testChildren = [
  <div key="testdiv1" id="testdiv1" />,
  <div key="testdiv2" id="testdiv2" />,
  <div key="testdiv3" id="testdiv3" />
];

describe('<Toolbar />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = TestUtils.mountComponent(Toolbar);
  });

  it('is defined', () => {
    expect(Toolbar).not.to.be(undefined);
  });

  it('can be rendered', () => {
    expect(wrapper).not.to.be(undefined);
  });

  it('contains div having class "horizontal-toolbar" by default', () => {
    let rootDiv = wrapper.find('div.horizontal-toolbar');
    expect(rootDiv).not.to.be(undefined);
    expect(rootDiv.length).to.be(1);
  });

});

describe('<Toolbar /> - CSS-class "vertical-toolbar"', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = TestUtils.mountComponent(Toolbar, {
      alignment: 'vertical',
      children: testChildren
    });
  });

  it('can be rendered', () => {
    expect(wrapper).not.to.be(undefined);
  });

  it('contains div having class "vertical-toolbar"', () => {
    let rootDiv = wrapper.find('div.vertical-toolbar');
    expect(rootDiv).not.to.be(undefined);
    expect(rootDiv.length).to.be(1);
  });

  it('contains three child elements', () => {
    let rootDivChildren = wrapper.find('div.vertical-toolbar').children();
    expect(rootDivChildren).to.be.ok();
    expect(rootDivChildren.nodes).to.be.an(Array);
    expect(rootDivChildren.nodes).to.have.length(3);
  });
});

describe('<Toolbar /> - CSS-class "horizontal-toolbar"', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = TestUtils.mountComponent(Toolbar, {
      alignment: 'horizontal',
      children: testChildren
    });
  });

  it('can be rendered', () => {
    expect(wrapper).not.to.be(undefined);
  });

  it('contains div having class "horizontal-toolbar"', () => {
    let rootDiv = wrapper.find('div.horizontal-toolbar');
    expect(rootDiv).not.to.be(undefined);
    expect(rootDiv.length).to.be(1);
  });

  it('contains three child elements', () => {
    let rootDivChildren = wrapper.find('div.horizontal-toolbar').children();
    expect(rootDivChildren).to.be.ok();
    expect(rootDivChildren.nodes).to.be.an(Array);
    expect(rootDivChildren.nodes).to.have.length(3);
  });
});
