/*eslint-env mocha*/
import React from 'react';
import expect from 'expect.js';
import TestUtil from '../Util/TestUtil';

import {Toolbar} from '../index';

const testChildren = [
  <div key="testdiv1" id="testdiv1" />,
  <div key="testdiv2" id="testdiv2" />,
  <div key="testdiv3" id="testdiv3" />
];

describe('<Toolbar />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = TestUtil.mountComponent(Toolbar);
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
    wrapper = TestUtil.mountComponent(Toolbar, {
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
    expect(rootDivChildren.getElements().length).to.eql(3);
  });
});

describe('<Toolbar /> - CSS-class "horizontal-toolbar"', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = TestUtil.mountComponent(Toolbar, {
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
    expect(rootDivChildren.getElements()).to.have.length(3);
  });
});
