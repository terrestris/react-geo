/*eslint-env mocha*/
import React from 'react';
import expect from 'expect.js';
import sinon from 'sinon';

import TestUtils from '../../Util/TestUtils';

import ToggleButton from '../ToggleButton/ToggleButton.jsx';
import ToggleGroup from './ToggleGroup.jsx';

describe('<ToggleGroup />', () => {

  it('is defined', () => {
    expect(ToggleGroup).not.to.be(undefined);
  });

  it('can be rendered', () => {
    const wrapper = TestUtils.mountComponent(ToggleGroup);
    expect(wrapper).not.to.be(undefined);
  });

  it('renders it\'s children horizontally or vertically', () => {
    const wrapper = TestUtils.mountComponent(ToggleGroup);

    wrapper.setProps({
      orientation: 'vertical'
    });

    expect(wrapper.find('div.vertical-toggle-group').length).to.equal(1);

    wrapper.setProps({
      orientation: 'horizontal'
    });

    expect(wrapper.find('div.horizontal-toggle-group').length).to.equal(1);
  });

  it('renders children when passed in', () => {
    let props = {
      children: [
        <ToggleButton key="1" name="Shinji" />,
        <ToggleButton key="2" name="Kagawa" />,
        <ToggleButton key="3" name="香川 真司" />
      ]
    };
    const wrapper = TestUtils.mountComponent(ToggleGroup, props);

    expect(wrapper.find(ToggleButton).length).to.equal(3);
  });

  it('calls the given onChange callback if a children is pressed', () => {
    let changeSpy = sinon.spy();
    let props = {
      onChange: changeSpy,
      children: [
        <ToggleButton key="1" name="Shinji" />
      ]
    };
    const wrapper = TestUtils.mountComponent(ToggleGroup, props);

    wrapper.find(ToggleButton).simulate('click');

    expect(changeSpy).to.have.property('callCount', 1);
  });

  it('sets the selected name on click', () => {
    let changeSpy = sinon.spy();
    let props = {
      onChange: changeSpy,
      children: [
        <ToggleButton key="1" name="Shinji" />,
        <ToggleButton key="2" name="Kagawa" />,
        <ToggleButton key="3" name="香川 真司" />
      ]
    };
    const wrapper = TestUtils.mountComponent(ToggleGroup, props);

    wrapper.find(ToggleButton).first().simulate('click');
    expect(wrapper.state().selectedName).to.equal('Shinji');

    wrapper.find(ToggleButton).at(2).simulate('click');
    expect(wrapper.state().selectedName).to.equal('香川 真司');
  });

  it('allows to deselect an already pressed button', () => {
    let changeSpy = sinon.spy();
    let props = {
      allowDeselect: false,
      onChange: changeSpy,
      children: [
        <ToggleButton key="1" name="Shinji" />,
        <ToggleButton key="2" name="Kagawa" />,
        <ToggleButton key="3" name="香川 真司" />
      ]
    };
    const wrapper = TestUtils.mountComponent(ToggleGroup, props);

    wrapper.find(ToggleButton).first().simulate('click');
    expect(wrapper.state().selectedName).to.equal('Shinji');

    wrapper.find(ToggleButton).first().simulate('click');
    expect(wrapper.state().selectedName).to.equal('Shinji');

    wrapper.setProps({
      allowDeselect: true
    });

    wrapper.find(ToggleButton).first().simulate('click');
    expect(wrapper.state().selectedName).to.equal(null);
  });

});
