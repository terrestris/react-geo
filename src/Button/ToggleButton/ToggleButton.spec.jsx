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

  it('calls a given toggle callback method if the pressed state changes', () => {
    const onToggle = jest.fn();
    let props = {
      onToggle: onToggle
    };

    const wrapper = TestUtil.mountComponent(ToggleButton, props);

    wrapper.setProps({
      pressed: true
    });

    expect(onToggle).toHaveBeenCalled();
  });

  it('changes the pressed state of the component on click (if standalone button)', () => {
    const wrapper = TestUtil.mountComponent(ToggleButton);

    wrapper.find('button').simulate('click');

    expect(wrapper.state('pressed')).toBe(true);
  });

  it('calls the on change callback (if included in a ToggleGroup)', () => {
    const onChangeSpy = jest.fn();
    let context = {
      toggleGroup: {
        onChange: onChangeSpy
      }
    };
    const wrapper = TestUtil.mountComponent(ToggleButton, null, context);

    wrapper.find('button').simulate('click');

    expect(onChangeSpy).toHaveBeenCalled();
  });

});
