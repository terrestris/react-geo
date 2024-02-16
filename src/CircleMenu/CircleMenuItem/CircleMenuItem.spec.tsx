import TestUtil from '../../Util/TestUtil';
import { CircleMenuItem } from './CircleMenuItem';

describe('<CircleMenuItem />', () => {
  it('is defined', () => {
    expect(CircleMenuItem).toBeDefined();
  });

  it('can be rendered', () => {
    const wrapper = TestUtil.mountComponent(CircleMenuItem);
    expect(wrapper).toBeDefined();
  });

  it('applies the transformation on update', () => {
    const wrapper = TestUtil.mountComponent(CircleMenuItem, {
      children: 'A'
    });
    const instance = wrapper.instance() as CircleMenuItem;
    const transformationSpy = jest.spyOn(instance, 'applyTransformation');

    wrapper.setProps({
      position: [100, 100]
    });

    expect.assertions(1);

    return new Promise(resolve => {
      setTimeout(resolve, 100);
    })
      .then(() => {
        expect(transformationSpy).toHaveBeenCalledTimes(1);
        transformationSpy.mockRestore();
      });
  });

  describe('applyTransformation', () => {
    it('applies the transformation to the ref', () => {
      const radius = 1337;
      const duration = 1;
      const rotationAngle = 45;
      const wrapper = TestUtil.mountComponent(CircleMenuItem, {
        radius: radius,
        children: 'A',
        animationDuration: duration,
        rotationAngle: rotationAngle
      });
      const instance = wrapper.instance() as CircleMenuItem;

      expect.assertions(2);

      expect(instance._ref).toHaveStyle('transform: rotate(0deg) translate(0px) rotate(0deg)');

      instance.applyTransformation();

      return new Promise(resolve => {
        setTimeout(resolve, duration + 100);
      })
        .then(() => {
          // eslint-disable-next-line max-len
          expect(instance._ref).toHaveStyle(`transform: rotate(${rotationAngle}deg) translate(${radius}px) rotate(-${rotationAngle}deg)`);
        });
    });
  });


});
