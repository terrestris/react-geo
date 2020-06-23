import testLogo from '../../../assets/user.png';
import TestUtil from '../../Util/TestUtil';

import FloatingMapLogo from './FloatingMapLogo';

describe('<FloatingMapLogo />', () => {
  let wrapper;

  beforeEach(() => {
    const props = {
      imageSrc: testLogo
    };
    wrapper = TestUtil.mountComponent(FloatingMapLogo, props);
  });

  it('is defined', () => {
    expect(FloatingMapLogo).not.toBeUndefined();
  });

  it('can be rendered', () => {
    expect(wrapper).not.toBeUndefined();
  });

  it('contains img element with predefined class', () => {
    const imageElement = wrapper.find('img').getElement();
    expect(imageElement.props.className).toBe(wrapper.instance().className);
  });

  it('is not positioned absolutely by default', () => {
    const imageElement = wrapper.find('img').getElement();
    expect(imageElement.props.className).toBe(wrapper.instance().className);
  });

  it('passes style prop', () => {
    const props = {
      imageSrc: testLogo,
      style: {
        backgroundColor: 'yellow',
        position: 'inherit'
      },
      className: 'peter'
    };
    wrapper = TestUtil.mountComponent(FloatingMapLogo, props);
    const imageElement = wrapper.find('img').getElement();
    expect(imageElement.props.style.backgroundColor).toBe('yellow');
    expect(imageElement.props.className).toContain(wrapper.instance().className);
    expect(imageElement.props.className).toContain('peter');
    expect(imageElement.props.style.position).toBe('inherit');
  });

  it('passes position prop', () => {
    const props = {
      imageSrc: testLogo,
      absolutelyPositioned: true,
      style: {
        backgroundColor: 'yellow'
      }
    };
    wrapper = TestUtil.mountComponent(FloatingMapLogo, props);
    const imageElement = wrapper.find('img').getElement();
    expect(imageElement.props.className).toBe(wrapper.instance().className);
    expect(imageElement.props.style.position).toBe('absolute');
    expect(imageElement.props.style.backgroundColor).toBe('yellow');
  });

  it('delegates image height to child img element', () => {
    const targetHeightNumber = 1909;
    const targetHeight = targetHeightNumber + 'px';
    wrapper.setProps({imageHeight: targetHeight});
    const imageElement = wrapper.find('img').getElement();
    expect(imageElement.props.height).toBe(targetHeight);
  });

});
