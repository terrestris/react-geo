/*eslint-env jest*/

import TestUtil from '../../Util/TestUtil';

import { SimpleButton } from '../../index';

describe('<SimpleButton />', () => {
  it('is defined', () => {
    expect(SimpleButton).not.toBeUndefined();
  });

  it('can be rendered', () => {
    const wrapper = TestUtil.mountComponent(SimpleButton);
    expect(wrapper).not.toBeUndefined();
  });

  it('allows to set some props', () => {
    const wrapper = TestUtil.mountComponent(SimpleButton);

    wrapper.setProps({
      type: 'secondary',
      icon: 'bath',
      shape: 'circle',
      size: 'small',
      disabled: true
    });

    expect(wrapper.props().type).toBe('secondary');
    expect(wrapper.props().icon).toBe('bath');
    expect(wrapper.props().shape).toBe('circle');
    expect(wrapper.props().size).toBe('small');
    expect(wrapper.props().disabled).toBe(true);

    expect(wrapper.find('button.ant-btn-secondary').length).toBe(1);
    expect(wrapper.find('span.fa-bath').length).toBe(1);
    expect(wrapper.find('button.ant-btn-circle').length).toBe(1);
    expect(wrapper.find('button.ant-btn-sm').length).toBe(1);
    expect(wrapper.find('button', {disabled: true}).length).toBe(1);
  });

  it('calls a given click callback method onClick', () => {
    const onClick = jest.fn();
    const wrapper = TestUtil.mountComponent(SimpleButton, {onClick});

    wrapper.find('button').simulate('click');

    expect(onClick).toHaveBeenCalledTimes(1);
  });

});
