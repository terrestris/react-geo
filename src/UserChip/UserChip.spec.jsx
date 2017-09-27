/*eslint-env mocha*/
import expect from 'expect.js';
import testImage from  './user.png';
import TestUtil from '../Util/TestUtil';

import {UserChip} from '../index';

describe('<UserChip />', () => {

  let wrapper;

  beforeEach(() => {
    wrapper = TestUtil.mountComponent(UserChip);
  });

  it('is defined', () => {
    expect(UserChip).not.to.be(undefined);
  });

  it('can be rendered', () => {
    expect(wrapper).not.to.be(undefined);
  });

  it('determines initials from given user name', () => {
    wrapper.setProps({userName: 'Shinji Kagawa'});
    let test = wrapper.instance().getInitials();
    expect(test).to.be('SK');
  });

  it('uses imageSrc if image is given', () => {
    const props = {
      imageSrc: testImage
    };
    const wrapper =TestUtil.mountComponent(UserChip, props);
    expect(wrapper.find('img').props().src).to.contain(testImage);
  });

  it('uses initials if image is not given', () => {
    wrapper.setProps({userName: 'Shinji Kagawa'});
    expect(wrapper.find('img').length).to.be(0);
  });

  it('should not render a dropdown for invalid configuration', () => {
    wrapper.setProps({userName: 'Shinji Kagawa'});
    wrapper.setProps({userMenu: null});
    expect(wrapper.find('ul.user-appinfo-menu').length).to.be(0);
  });

  it('should pass style prop', () => {
    const props = {
      style: {
        'backgroundColor': 'yellow'
      }
    };
    const wrapper = TestUtil.mountComponent(UserChip, props);
    const className = wrapper.instance().className;
    expect(wrapper.find(`div.${className}`).props().style.backgroundColor).to.be('yellow');
  });

});
