/*eslint-env mocha*/
import expect from 'expect.js';
import testImage from  './user.png';
import TestUtils from '../Util/TestUtils';

import {UserChip} from '../index';

describe('<UserChip />', () => {

  let wrapper;

  beforeEach(() => {
    wrapper = TestUtils.mountComponent(UserChip);
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
    const wrapper =TestUtils.mountComponent(UserChip, props);
    expect(wrapper.find('img').node.src).to.contain(testImage);
  });

  it('uses initials if image is not given', () => {
    wrapper.setProps({userName: 'Shinji Kagawa'});
    expect(wrapper.find('img').node).to.be(undefined);
  });

  it('should not render a dropdown for invalid configuration', () => {
    wrapper.setProps({userName: 'Shinji Kagawa'});
    wrapper.setProps({userMenu: null});
    expect(wrapper.find('ul.user-appinfo-menu').node).to.be(undefined);
  });

  it('should pass style prop', () => {
    const props = {
      style: {
        'backgroundColor': 'yellow'
      }
    };
    const wrapper =TestUtils.mountComponent(UserChip, props);
    expect(wrapper.find('div.userchip').node.style.backgroundColor).to.be('yellow');
  });

});
