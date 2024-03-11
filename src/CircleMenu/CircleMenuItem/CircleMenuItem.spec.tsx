import {
  render,
  screen
} from '@testing-library/react';
import * as React from 'react';

import { CircleMenuItem } from './CircleMenuItem';

describe('<CircleMenuItem />', () => {
  it('is defined', () => {
    expect(CircleMenuItem).toBeDefined();
  });

  it('can be rendered', () => {
    const { container } = render(
      <CircleMenuItem
        radius={40}
        rotationAngle={45}
      />
    );

    expect(container).toBeVisible();
  });

  describe('applyTransformation', () => {
    it('applies the transformation to the ref', async () => {
      const radius = 1337;
      const duration = 1;
      const rotationAngle = 45;

      const { rerender } = render(
        <CircleMenuItem
          radius={0}
          rotationAngle={rotationAngle}
          animationDuration={duration}
        >
          <span>A</span>
        </CircleMenuItem>
      );

      let menuItem = screen.getByRole('menuitem');

      expect(menuItem).toHaveStyle('transform: rotate(0deg) translate(0px) rotate(0deg)');

      rerender(
        <CircleMenuItem
          radius={radius}
          rotationAngle={rotationAngle}
          animationDuration={duration}
        >
          A
        </CircleMenuItem>
      );

      menuItem = screen.getByRole('menuitem');

      await new Promise(resolve => setTimeout(resolve, duration + 100));

      // eslint-disable-next-line max-len
      expect(menuItem).toHaveStyle(`transform: rotate(${rotationAngle}deg) translate(${radius}px) rotate(-${rotationAngle}deg)`);
    });
  });

});
