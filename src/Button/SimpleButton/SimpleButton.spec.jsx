/*eslint-env mocha*/
import expect from 'expect.js';
import sinon from 'sinon';

import TestUtil from '../../Util/TestUtil';
import Logger from '../../Util/Logger';

import { SimpleButton } from '../../index';

describe('<SimpleButton />', () => {
  it('is defined', () => {
    expect(SimpleButton).not.to.be(undefined);
  });

  it('can be rendered', () => {
    const wrapper = TestUtil.mountComponent(SimpleButton);
    expect(wrapper).not.to.be(undefined);
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

    expect(wrapper.props().type).to.equal('secondary');
    expect(wrapper.props().icon).to.equal('bath');
    expect(wrapper.props().shape).to.equal('circle');
    expect(wrapper.props().size).to.equal('small');
    expect(wrapper.props().disabled).to.equal(true);

    expect(wrapper.find('button.ant-btn-secondary').length).to.equal(1);
    expect(wrapper.find('span.fa-bath').length).to.equal(1);
    expect(wrapper.find('button.ant-btn-circle').length).to.equal(1);
    expect(wrapper.find('button.ant-btn-sm').length).to.equal(1);
    expect(wrapper.find('button', {disabled: true}).length).to.equal(1);
  });

  it('warns if no click callback method is given', () => {
    const wrapper = TestUtil.mountComponent(SimpleButton);
    const logSpy = sinon.spy(Logger, 'debug');

    wrapper.find('button').simulate('click');

    expect(logSpy).to.have.property('callCount', 1);

    Logger.debug.restore();
  });

  it('calls a given click callback method onClick', () => {
    const wrapper = TestUtil.mountComponent(SimpleButton);
    const onClick = sinon.spy();

    wrapper.setProps({onClick});

    wrapper.find('button').simulate('click');

    expect(onClick).to.have.property('callCount', 1);
  });

});
