/*eslint-env mocha*/
import expect from 'expect.js';
import testLogo from '../../UserChip/user.png';
import TestUtil from '../../Util/TestUtil';

import {FloatingMapLogo} from '../../index';

describe('<FloatingMapLogo />', () => {
  let wrapper;

  beforeEach(() => {
    let props = {
      imageSrc: testLogo
    };
    wrapper = TestUtil.mountComponent(FloatingMapLogo, props);
  });

  it('is defined', () => {
    expect(FloatingMapLogo).not.to.be(undefined);
  });

  it('can be rendered', () => {
    expect(wrapper).not.to.be(undefined);
  });

  it('contains img element with predefined class', () => {
    let imageElement = wrapper.find('img');
    expect(imageElement.node.className).to.be('map-logo');
  });

  it('is not positioned absolutely by default', () => {
    let imageElement = wrapper.find('img');
    expect(imageElement.node.className).to.be('map-logo');
  });

  it('passes style prop', () => {
    let props = {
      imageSrc: testLogo,
      style: {
        backgroundColor: 'yellow',
        position: 'inherit'
      }
    };
    wrapper = TestUtil.mountComponent(FloatingMapLogo, props);
    let imageElement = wrapper.find('img');
    expect(imageElement.node.style.backgroundColor).to.be('yellow');
    expect(imageElement.node.style.position).to.be('inherit');
  });

  it('passes position prop', () => {
    let props = {
      imageSrc: testLogo,
      absolutelyPostioned: true,
      style: {
        backgroundColor: 'yellow'
      }
    };
    wrapper = TestUtil.mountComponent(FloatingMapLogo, props);
    let imageElement = wrapper.find('img');
    expect(imageElement.node.className).to.be('map-logo');
    expect(imageElement.node.style.position).to.be('absolute');
    expect(imageElement.node.style.backgroundColor).to.be('yellow');
  });

  it('delegates image height to child img element', () => {
    const targetHeightNumber = 1909;
    const targetHeight = targetHeightNumber+'px';
    wrapper.setProps({imageHeight: targetHeight});
    let element = wrapper.find('img');

    expect(element.node.height).to.be(targetHeightNumber);
  });

});
