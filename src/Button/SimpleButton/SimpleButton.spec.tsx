import TestUtil from '../../Util/TestUtil';
import SimpleButton, {SimpleButtonProps} from './SimpleButton';

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
      shape: 'circle',
      size: 'small',
      disabled: true
    });

    const props = wrapper.props() as SimpleButtonProps;
    expect(props.type).toBe('secondary');
    expect(props.shape).toBe('circle');
    expect(props.size).toBe('small');
    expect(props.disabled).toBe(true);

    expect(wrapper.find('button.ant-btn-secondary').length).toBe(1);
    expect(wrapper.find('button.ant-btn-circle').length).toBe(1);
    expect(wrapper.find('button.ant-btn-sm').length).toBe(1);
    expect(wrapper.find('button').length).toBe(1);
  });

  it('calls a given click callback method onClick', () => {
    const onClick = jest.fn();
    const wrapper = TestUtil.mountComponent(SimpleButton, {onClick});

    wrapper.find('button').simulate('click');

    expect(onClick).toHaveBeenCalledTimes(1);
  });

});
