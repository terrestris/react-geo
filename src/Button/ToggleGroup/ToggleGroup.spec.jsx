/*eslint-env jest*/
import React from 'react';

import TestUtil from '../../Util/TestUtil';

import{
  ToggleButton,
  ToggleGroup
} from '../../index';

describe('<ToggleGroup />', () => {

  it('is defined', () => {
    expect(ToggleGroup).not.toBeUndefined();
  });

  it('can be rendered', () => {
    const wrapper = TestUtil.mountComponent(ToggleGroup);
    expect(wrapper).not.toBeUndefined();
  });

  it('renders it\'s children horizontally or vertically', () => {
    const wrapper = TestUtil.mountComponent(ToggleGroup, {
      orientation: 'vertical'
    });

    expect(wrapper.find('div.vertical-toggle-group').length).toBe(1);

    wrapper.setProps({
      orientation: 'horizontal'
    });

    expect(wrapper.find('div.horizontal-toggle-group').length).toBe(1);
  });

  it('renders children when passed in', () => {
    let props = {
      children: [
        <ToggleButton key="1" name="Shinji" onToggle={()=>{}} />,
        <ToggleButton key="2" name="Kagawa" onToggle={()=>{}} />,
        <ToggleButton key="3" name="香川 真司" onToggle={()=>{}} />
      ]
    };
    const wrapper = TestUtil.mountComponent(ToggleGroup, props);

    expect(wrapper.find(ToggleButton).length).toBe(3);
  });

  it('calls the given onChange callback if a children is pressed', () => {
    let changeSpy = jest.fn();
    let props = {
      onChange: changeSpy,
      children: [
        <ToggleButton key="1" name="Shinji" onToggle={()=>{}} />
      ]
    };
    const wrapper = TestUtil.mountComponent(ToggleGroup, props);

    wrapper.find(ToggleButton).simulate('click');

    expect(changeSpy).toHaveBeenCalled();
  });

  it('sets the selected name on click', () => {
    let changeSpy = jest.fn();
    let props = {
      onChange: changeSpy,
      children: [
        <ToggleButton key="1" name="Shinji" onToggle={()=>{}} />,
        <ToggleButton key="2" name="Kagawa" onToggle={()=>{}} />,
        <ToggleButton key="3" name="香川 真司" onToggle={()=>{}} />
      ]
    };
    const wrapper = TestUtil.mountComponent(ToggleGroup, props);

    wrapper.find(ToggleButton).first().simulate('click');
    expect(wrapper.state().selectedName).toBe('Shinji');

    wrapper.find(ToggleButton).at(2).simulate('click');
    expect(wrapper.state().selectedName).toBe('香川 真司');
  });

  it('allows to deselect an already pressed button', () => {
    let changeSpy = jest.fn();
    let props = {
      allowDeselect: false,
      onChange: changeSpy,
      children: [
        <ToggleButton key="1" name="Shinji" onToggle={()=>{}} />,
        <ToggleButton key="2" name="Kagawa" onToggle={()=>{}} />,
        <ToggleButton key="3" name="香川 真司" onToggle={()=>{}} />
      ]
    };
    const wrapper = TestUtil.mountComponent(ToggleGroup, props);

    wrapper.find(ToggleButton).first().simulate('click');
    expect(wrapper.state().selectedName).toBe('Shinji');

    wrapper.find(ToggleButton).first().simulate('click');
    expect(wrapper.state().selectedName).toBe('Shinji');

    wrapper.setProps({
      allowDeselect: true
    });

    wrapper.find(ToggleButton).first().simulate('click');
    expect(wrapper.state().selectedName).toBe(null);
  });

});
