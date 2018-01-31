/*eslint-env jest*/
import React from 'react';

import TestUtil from '../../Util/TestUtil';

import {
  Titlebar,
  SimpleButton
} from '../../index';

describe('<Titlebar />', () => {

  it('is defined', () => {
    expect(Titlebar).not.toBeUndefined();
  });

  it('can be rendered', () => {
    const wrapper = TestUtil.mountComponent(Titlebar);
    expect(wrapper).not.toBeUndefined();
  });

  it('adds a passed className', () => {
    const wrapper = TestUtil.mountComponent(Titlebar, {
      className: 'podolski'
    });
    expect(wrapper.instance().props.className).toContain('podolski');
  });

  it('renders the title', () => {
    const wrapper = TestUtil.mountComponent(Titlebar, {
      children: 'Testtitle'
    });
    const title = wrapper.find('span.title');
    expect(title.length).toBe(1);
  });

  it('renders the controls (if set)', () => {
    const wrapper = TestUtil.mountComponent(Titlebar, {
      children: 'Testtitle'
    });
    expect(wrapper.find('span.controls').length).toBe(0);
    const wrapperWithTools = TestUtil.mountComponent(Titlebar, {
      children: 'Testtitle',
      tools: [
        <SimpleButton
          icon="times"
          key="close-tool"
          size="small"
        />
      ]
    });
    expect(wrapperWithTools.find('span.controls').length).toBe(1);
  });

});
