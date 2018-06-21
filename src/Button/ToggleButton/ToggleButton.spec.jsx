/*eslint-env jest*/

import TestUtil from '../../Util/TestUtil';

import {
  ToggleButton
} from '../../index';

describe('<ToggleButton />', () => {

  it('is defined', () => {
    expect(ToggleButton).not.toBeUndefined();
  });

  it('can be rendered', () => {
    const wrapper = TestUtil.mountComponent(ToggleButton);
    expect(wrapper).not.toBeUndefined();
  });

  it('isn\'t pressed by default', () => {
    const wrapper = TestUtil.mountComponent(ToggleButton);
    const pressedClass = wrapper.instance().pressedClass;
    expect(wrapper.find(`button.${pressedClass}`).length).toBe(0);
  });

  it('sets the pressed class if pressed prop is set to true initially', () => {
    const wrapper = TestUtil.mountComponent(ToggleButton, {
      pressed: true
    });
    const pressedClass = wrapper.instance().pressedClass;

    expect(wrapper.find(`button.${pressedClass}`).length).toBe(1);
  });

  it('ignores the onClick callback', () => {
    const onClick = jest.fn();
    const wrapper = TestUtil.mountComponent(ToggleButton, {
      onClick
    });

    wrapper.find('button').simulate('click');

    expect(onClick).toHaveBeenCalledTimes(0);
  });

  it('toggles the pressed class if the pressed prop has changed', () => {
    const wrapper = TestUtil.mountComponent(ToggleButton);
    const pressedClass = wrapper.instance().pressedClass;

    expect(wrapper.find(`button.${pressedClass}`).length).toBe(0);

    wrapper.setProps({
      pressed: true
    });
    expect(wrapper.find(`button.${pressedClass}`).length).toBe(1);

    // Nothing should happen if the prop hasn't changed.
    wrapper.setProps({
      pressed: true
    });
    expect(wrapper.find(`button.${pressedClass}`).length).toBe(1);

    wrapper.setProps({
      pressed: false
    });
    expect(wrapper.find(`button.${pressedClass}`).length).toBe(0);
  });

  it('calls the given toggle callback method if the pressed prop has changed initially to true', () => {
    const onToggle = jest.fn();
    const props = {
      onToggle
    };
    const wrapper = TestUtil.mountComponent(ToggleButton, props);

    wrapper.setProps({
      pressed: true
    });
    expect(onToggle).toHaveBeenCalledTimes(1);
    // If the prop has been changed, no click evt is available.
    expect(onToggle).toHaveBeenCalledWith(true, null);

    wrapper.setProps({
      pressed: false
    });
    expect(onToggle).toHaveBeenCalledTimes(2);
    expect(onToggle).toHaveBeenCalledWith(false, null);

    // Nothing should happen if the prop hasn't changed.
    wrapper.setProps({
      pressed: false
    });
    expect(onToggle).toHaveBeenCalledTimes(2);
    expect(onToggle).toHaveBeenCalledWith(false, null);

    wrapper.setProps({
      pressed: true
    });
    expect(onToggle).toHaveBeenCalledTimes(3);
    expect(onToggle).toHaveBeenCalledWith(true, null);
  });

  it('calls the given toggle callback method if the pressed prop has changed to false (from being false by default)', () => {
    const onToggle = jest.fn();
    const props = {
      onToggle
    };
    const wrapper = TestUtil.mountComponent(ToggleButton, props);

    // Nothing should happen if the prop hasn't changed.
    // (pressed property is false by default)
    wrapper.setProps({
      pressed: false
    });
    expect(onToggle).toHaveBeenCalledTimes(0);

    wrapper.setProps({
      pressed: true
    });
    expect(onToggle).toHaveBeenCalledTimes(1);
    // If the prop has been changed, no click evt is available.
    expect(onToggle).toHaveBeenCalledWith(true, null);

    // Nothing should happen if the prop hasn't changed.
    wrapper.setProps({
      pressed: true
    });
    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(onToggle).toHaveBeenCalledWith(true, null);

    wrapper.setProps({
      pressed: false
    });
    expect(onToggle).toHaveBeenCalledTimes(2);
    expect(onToggle).toHaveBeenCalledWith(false, null);
  });

  it('cleans the last click event if not available', () => {
    const onToggle = jest.fn();
    const props = {
      onToggle
    };
    const clickEvtMock = expect.objectContaining({
      type: 'click'
    });
    const wrapper = TestUtil.mountComponent(ToggleButton, props);

    wrapper.setProps({
      pressed: true
    });
    expect(onToggle).toHaveBeenCalledTimes(1);
    // If the prop has been changed, no click evt is available.
    expect(onToggle).toHaveBeenCalledWith(true, null);

    // Pressed will now become false.
    wrapper.find('button').simulate('click');
    expect(onToggle).toHaveBeenCalledTimes(2);
    expect(onToggle).toHaveBeenCalledWith(false, clickEvtMock);

    wrapper.setProps({
      pressed: true
    });
    // If the prop has been changed, no click evt is available.
    expect(onToggle).toHaveBeenCalledTimes(3);
    expect(onToggle).toHaveBeenCalledWith(true, null);

  });

  it('toggles the pressed class on click', () => {
    const wrapper = TestUtil.mountComponent(ToggleButton);
    const pressedClass = wrapper.instance().pressedClass;

    expect(wrapper.find(`button.${pressedClass}`).length).toBe(0);

    wrapper.find('button').simulate('click');
    expect(wrapper.find(`button.${pressedClass}`).length).toBe(1);

    wrapper.find('button').simulate('click');
    expect(wrapper.find(`button.${pressedClass}`).length).toBe(0);

    wrapper.find('button').simulate('click');
    expect(wrapper.find(`button.${pressedClass}`).length).toBe(1);
  });

  it('calls the given toggle callback method on click', () => {
    const onToggle = jest.fn();
    const props = {
      onToggle
    };
    const clickEvtMock = expect.objectContaining({
      type: 'click'
    });
    const wrapper = TestUtil.mountComponent(ToggleButton, props);

    wrapper.find('button').simulate('click');
    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(onToggle).toHaveBeenCalledWith(true, clickEvtMock);

    wrapper.find('button').simulate('click');
    expect(onToggle).toHaveBeenCalledTimes(2);
    expect(onToggle).toHaveBeenCalledWith(false, clickEvtMock);

    wrapper.find('button').simulate('click');
    expect(onToggle).toHaveBeenCalledTimes(3);
    expect(onToggle).toHaveBeenCalledWith(true, clickEvtMock);
  });

  it('toggles the pressed state of the component on click', () => {
    const wrapper = TestUtil.mountComponent(ToggleButton);

    wrapper.find('button').simulate('click');
    expect(wrapper.state('overallPressed')).toBe(true);

    wrapper.find('button').simulate('click');
    expect(wrapper.state('overallPressed')).toBe(false);

    wrapper.find('button').simulate('click');
    expect(wrapper.state('overallPressed')).toBe(true);
  });
});
