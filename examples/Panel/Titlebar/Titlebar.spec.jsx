/*eslint-env mocha*/
import React from 'react';
import expect from 'expect.js';
import TestUtil from '../../Util/TestUtil';

import {
  Titlebar,
  SimpleButton
} from '../../index';

describe('<Titlebar />', () => {

  it('is defined', () => {
    expect(Titlebar).not.to.be(undefined);
  });

  it('can be rendered', () => {
    const wrapper = TestUtil.mountComponent(Titlebar, {
      parent: document.body
    });
    expect(wrapper).not.to.be(undefined);
  });

  it('adds a passed className', () => {
    const wrapper = TestUtil.mountComponent(Titlebar, {
      parent: document.body,
      className: 'podolski'
    });
    expect(wrapper.instance().props.className).to.contain('podolski');
  });

  it('renders the title', () => {
    const wrapper = TestUtil.mountComponent(Titlebar, {
      children: 'Testtitle'
    });
    const title = wrapper.find('span.title');
    expect(title.length).to.equal(1);
  });

  it('renders the controls (if set)', () => {
    const wrapper = TestUtil.mountComponent(Titlebar, {
      children: 'Testtitle'
    });
    expect(wrapper.find('span.controls').length).to.equal(0);
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
    expect(wrapperWithTools.find('span.controls').length).to.equal(1);
  });

});
