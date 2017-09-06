/*eslint-env mocha*/
import React from 'react';
import expect from 'expect.js';
import { mount } from 'enzyme';
import sinon from 'sinon';

import ToggleButton from './ToggleButton.jsx';
import Logger from '../../Util/Logger';

describe('<ToggleButton />', () => {

  /**
   * Wraps the component.
   *
   * @return {Object} The wrapped component.
   */
  const setup = (props, context) => {
    const wrapper = mount(<ToggleButton {...props} />, {context});
    return wrapper;
  };

  it('is defined', () => {
    expect(ToggleButton).not.to.be(undefined);
  });

  it('can be rendered', () => {
    const wrapper = setup();
    expect(wrapper).not.to.be(undefined);
  });

  it('allows to set some props', () => {
    const wrapper = setup();

    wrapper.setProps({
      name: 'Shinji',
      type: 'secondary',
      icon: 'bath',
      shape: 'circle',
      size: 'small',
      disabled: true,
      pressed: false
    });

    expect(wrapper.props().name).to.equal('Shinji');
    expect(wrapper.props().type).to.equal('secondary');
    expect(wrapper.props().icon).to.equal('bath');
    expect(wrapper.props().shape).to.equal('circle');
    expect(wrapper.props().size).to.equal('small');
    expect(wrapper.props().disabled).to.equal(true);
    expect(wrapper.props().pressed).to.equal(false);

    expect(wrapper.find('button.ant-btn-secondary').length).to.equal(1);
    expect(wrapper.find('span.fa-bath').length).to.equal(1);
    expect(wrapper.find('button.ant-btn-circle').length).to.equal(1);
    expect(wrapper.find('button.ant-btn-sm').length).to.equal(1);
    expect(wrapper.find({disabled: true}).length).to.equal(1);
  });

  it('sets a pressed class if the pressed state becomes truthy', () => {
    const wrapper = setup({
      onToggle: () => {}
    });
    let toggleClass = wrapper.instance().toggleClass;

    expect(toggleClass).to.be.a('string');
    expect(wrapper.find(`button.${toggleClass}`).length).to.equal(0);

    wrapper.setProps({
      pressed: true
    });

    expect(wrapper.find(`button.${toggleClass}`).length).to.equal(1);
  });

  it('warns if no toggle callback method is given', () => {
    const logSpy = sinon.spy(Logger, 'debug');
    const wrapper = setup({
      onToggle: () => {}
    });

    wrapper.setProps({
      onToggle: null
    });

    expect(logSpy).to.have.property('callCount', 1);

    logSpy.restore();
  });

  it('calls a given toggle callback method if the pressed state changes', () => {
    const onToggle = sinon.spy();
    let props = {
      onToggle: onToggle
    };

    const wrapper = setup(props);

    wrapper.setProps({
      pressed: true
    });

    expect(onToggle).to.have.property('callCount', 1);
  });

  it('changes the pressed state of the component on click (if standalone button)', () => {
    const wrapper = setup();

    wrapper.find('button').simulate('click');

    expect(wrapper.state('pressed')).to.be(true);
  });

  it('calls the on change callback (if included in a ToggleGroup)', () => {
    const onChangeSpy = sinon.spy();
    let context = {
      toggleGroup: {
        onChange: onChangeSpy
      }
    };
    const wrapper = setup(null, context);

    wrapper.find('button').simulate('click');

    expect(onChangeSpy).to.have.property('callCount', 1);
  });

});
