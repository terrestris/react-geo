/*eslint-env jest*/
import TestUtil from '../Util/TestUtil';
import { CircleMenu } from '../index';

describe('<CircleMenu />', () => {
  it('is defined', () => {
    expect(CircleMenu).toBeDefined();
  });

  it('can be rendered', () => {
    const wrapper = TestUtil.mountComponent(CircleMenu, {
      children: ['A', 'B'],
      position: [0, 0]
    });
    expect(wrapper).toBeDefined();
  });

  it('contains the passed children', () => {
    const wrapper = TestUtil.mountComponent(CircleMenu, {
      children: ['A', 'B'],
      position: [0, 0]
    });
    expect(wrapper.find('CircleMenuItem').length).toBe(2);
    expect(wrapper.find('CircleMenuItem').at(0).props().children).toBe('A');
    expect(wrapper.find('CircleMenuItem').at(1).props().children).toBe('B');
  });

  // it('applys the Transformation on mount', () => {
  //   const wrapper = TestUtil.mountComponent(CircleMenu, {
  //     children: ['A', 'B'],
  //     position: [0, 0]
  //   });
  // });

  it('applys the Transformation on update', (done) => {
    const wrapper = TestUtil.mountComponent(CircleMenu, {
      children: ['A', 'B'],
      position: [0, 0]
    });
    const instance = wrapper.instance();
    const transformationSpy = jest.spyOn(instance, 'applyTransformation');

    wrapper.setProps({
      position: [100, 100]
    });

    setTimeout(() => {
      expect(transformationSpy).toHaveBeenCalledTimes(1);
      done();
    }, 2);

    transformationSpy.mockReset();
    transformationSpy.mockRestore();

  });

  describe('applyTransformation', () => {
    it('applys the Transformation to the ref', (done) => {
      const diameter = 1337;
      const animationDuration = 1;
      const wrapper = TestUtil.mountComponent(CircleMenu, {
        diameter: diameter,
        children: ['A', 'B'],
        position: [0, 0],
        animationDuration: animationDuration
      });
      const instance = wrapper.instance();

      expect(instance._ref.style.width).toBe('0px');
      expect(instance._ref.style.height).toBe('0px');

      instance.applyTransformation();

      setTimeout(() => {
        expect(instance._ref.style.width).toBe('1337px');
        expect(instance._ref.style.height).toBe('1337px');
        done();
      }, animationDuration);
    });
  });

});
