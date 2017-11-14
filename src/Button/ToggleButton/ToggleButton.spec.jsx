/*eslint-env jest*/

import sinon from 'sinon';

import TestUtil from '../../Util/TestUtil';

import {
  Logger,
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

  it('allows to set some props', () => {
    const wrapper = TestUtil.mountComponent(ToggleButton);

    wrapper.setProps({
      name: 'Shinji',
      type: 'secondary',
      icon: 'bath',
      shape: 'circle',
      size: 'small',
      disabled: true,
      pressed: false
    });

    expect(wrapper.props().name).toBe('Shinji');
    expect(wrapper.props().type).toBe('secondary');
    expect(wrapper.props().icon).toBe('bath');
    expect(wrapper.props().shape).toBe('circle');
    expect(wrapper.props().size).toBe('small');
    expect(wrapper.props().disabled).toBe(true);
    expect(wrapper.props().pressed).toBe(false);

    expect(wrapper.find('button.ant-btn-secondary').length).toBe(1);
    expect(wrapper.find('span.fa-bath').length).toBe(1);
    expect(wrapper.find('button.ant-btn-circle').length).toBe(1);
    expect(wrapper.find('button.ant-btn-sm').length).toBe(1);
    expect(wrapper.find('button', {disabled: true}).length).toBe(1);
  });

  it('sets a pressed class if the pressed state becomes truthy', () => {
    const wrapper = TestUtil.mountComponent(ToggleButton, {
      onToggle: () => {}
    });
    let pressedClass = wrapper.instance().pressedClass;

    expect(wrapper.find(`button.${pressedClass}`).length).toBe(0);

    wrapper.setProps({
      pressed: true
    });

    expect(wrapper.find(`button.${pressedClass}`).length).toBe(1);
  });

  it('warns if no toggle callback method is given', () => {
    const logSpy = sinon.spy(Logger, 'debug');
    const wrapper = TestUtil.mountComponent(ToggleButton, {
      onToggle: () => {}
    });

    wrapper.setProps({
      onToggle: null
    });

    expect(logSpy).toHaveProperty('callCount', 1);

    logSpy.restore();
  });

  it('calls a given toggle callback method if the pressed state changes', () => {
    const onToggle = sinon.spy();
    let props = {
      onToggle: onToggle
    };

    const wrapper = TestUtil.mountComponent(ToggleButton, props);

    wrapper.setProps({
      pressed: true
    });

    expect(onToggle).toHaveProperty('callCount', 1);
  });

  it('changes the pressed state of the component on click (if standalone button)', () => {
    const wrapper = TestUtil.mountComponent(ToggleButton);

    wrapper.find('button').simulate('click');

    expect(wrapper.state('pressed')).toBe(true);
  });

  it('calls the on change callback (if included in a ToggleGroup)', () => {
    const onChangeSpy = sinon.spy();
    let context = {
      toggleGroup: {
        onChange: onChangeSpy
      }
    };
    const wrapper = TestUtil.mountComponent(ToggleButton, null, context);

    wrapper.find('button').simulate('click');

    expect(onChangeSpy).toHaveProperty('callCount', 1);
  });

});
