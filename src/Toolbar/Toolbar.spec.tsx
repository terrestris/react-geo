import * as React from 'react';

import TestUtil from '../Util/TestUtil';

import Toolbar from './Toolbar';

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
    expect(Toolbar).not.toBeUndefined();
  });

  it('can be rendered', () => {
    expect(wrapper).not.toBeUndefined();
  });

  it('contains div having class "horizontal-toolbar" by default', () => {
    const rootDiv = wrapper.find('div.horizontal-toolbar');
    expect(rootDiv).not.toBeUndefined();
    expect(rootDiv.length).toBe(1);
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
    expect(wrapper).not.toBeUndefined();
  });

  it('contains div having class "vertical-toolbar"', () => {
    const rootDiv = wrapper.find('div.vertical-toolbar');
    expect(rootDiv).not.toBeUndefined();
    expect(rootDiv.length).toBe(1);
  });

  it('contains three child elements', () => {
    const rootDivChildren = wrapper.find('div.vertical-toolbar').children();
    expect(rootDivChildren).toBeTruthy();
    expect(rootDivChildren.getElements().length).toBe(3);
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
    expect(wrapper).not.toBeUndefined();
  });

  it('contains div having class "horizontal-toolbar"', () => {
    const rootDiv = wrapper.find('div.horizontal-toolbar');
    expect(rootDiv).not.toBeUndefined();
    expect(rootDiv.length).toBe(1);
  });

  it('contains three child elements', () => {
    const rootDivChildren = wrapper.find('div.horizontal-toolbar').children();
    expect(rootDivChildren).toBeTruthy();
    expect(rootDivChildren.getElements()).toHaveLength(3);
  });
});
