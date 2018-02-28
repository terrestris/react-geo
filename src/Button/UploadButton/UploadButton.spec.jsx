/*eslint-env jest*/

import TestUtil from '../../Util/TestUtil';

import { UploadButton } from '../../index';

describe('<UploadButton />', () => {
  it('is defined', () => {
    expect(UploadButton).not.toBeUndefined();
  });

  it('can be rendered', () => {
    const wrapper = TestUtil.mountComponent(UploadButton);
    expect(wrapper).not.toBeUndefined();
  });

  it('renders an inputfield', () => {
    const wrapper = TestUtil.mountComponent(UploadButton);
    expect(wrapper.find('input').length).toBe(1);
  });

  it('applies inputProps to the inputfield', () => {
    const wrapper = TestUtil.mountComponent(UploadButton, {inputProps: {multiple: true}});
    expect(wrapper.find('input[multiple=true]').length).toBe(1);
  });

  it('renders a simplebutton if no children are given', () => {
    const wrapper = TestUtil.mountComponent(UploadButton);
    expect(wrapper.find('button').length).toBe(1);
  });

  it('calls a given click callback method onChange', () => {
    const onChange = jest.fn();
    const wrapper = TestUtil.mountComponent(UploadButton, {onChange});
    wrapper.find('input').simulate('change');
    expect(onChange).toHaveBeenCalledTimes(1);
  });

});
