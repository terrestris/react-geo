import * as React from 'react';

import TestUtil from '../../Util/TestUtil';
import ToggleButton from '../ToggleButton/ToggleButton';
import ToggleGroup, { ToggleGroupState } from './ToggleGroup';

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
    const props = {
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
    const changeSpy = jest.fn();
    const props = {
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
    const changeSpy = jest.fn();
    const props = {
      onChange: changeSpy,
      children: [
        <ToggleButton key="1" name="Shinji" onToggle={()=>{}} />,
        <ToggleButton key="2" name="Kagawa" onToggle={()=>{}} />,
        <ToggleButton key="3" name="香川 真司" onToggle={()=>{}} />
      ]
    };
    const wrapper = TestUtil.mountComponent(ToggleGroup, props);

    wrapper.find(ToggleButton).first().simulate('click');
    expect((wrapper.state() as ToggleGroupState).selectedName).toBe('Shinji');

    wrapper.find(ToggleButton).at(2).simulate('click');
    expect((wrapper.state() as ToggleGroupState).selectedName).toBe('香川 真司');
  });

  it('allows to deselect an already pressed button', () => {
    const changeSpy = jest.fn();
    const props = {
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
    expect((wrapper.state() as ToggleGroupState).selectedName).toBe('Shinji');

    wrapper.find(ToggleButton).first().simulate('click');
    expect((wrapper.state() as ToggleGroupState).selectedName).toBe('Shinji');

    wrapper.setProps({
      allowDeselect: true
    });

    wrapper.find(ToggleButton).first().simulate('click');
    expect((wrapper.state() as ToggleGroupState).selectedName).toBe(undefined);
  });

});
