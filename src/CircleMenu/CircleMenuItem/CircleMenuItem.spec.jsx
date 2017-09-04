/*eslint-env jest*/
import TestUtil from '../../Util/TestUtil';

import { CircleMenuItem } from './CircleMenuItem.jsx';

describe('<CircleMenuItem />', () => {
  it('is defined', () => {
    expect(CircleMenuItem).toBeDefined();
  });

  it('can be rendered', () => {
    const wrapper = TestUtil.mountComponent(CircleMenuItem);
    expect(wrapper).toBeDefined();
  });

  it('applys the Transformation on update', (done) => {
    const wrapper = TestUtil.mountComponent(CircleMenuItem, {
      children: 'A'
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
      const radius = 1337;
      const duration = 1;
      const rotationAngle = 45;
      const wrapper = TestUtil.mountComponent(CircleMenuItem, {
        radius: radius,
        children: 'A',
        animationDuration: duration,
        rotationAngle: rotationAngle
      });
      const instance = wrapper.instance();

      expect(instance._ref.style.transform).toBe('rotate(0deg) translate(0px) rotate(0deg)');

      instance.applyTransformation();

      setTimeout(() => {
        expect(instance._ref.style.transform).toBe(`rotate(${rotationAngle}deg) translate(${radius}px) rotate(-${rotationAngle}deg)`);
        done();
      }, duration);
    });
  });


});
