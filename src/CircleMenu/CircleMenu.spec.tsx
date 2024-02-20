import {
  render,
  screen
} from '@testing-library/react';
import * as React from 'react';

import TestUtil from '../Util/TestUtil';
import CircleMenu from './CircleMenu';

describe('<CircleMenu />', () => {
  it('is defined', () => {
    expect(CircleMenu).toBeDefined();
  });

  it('can be rendered', () => {
    const { container } = render(
      <CircleMenu
        position={[100, 100]}
      >
        <span>A</span>
        <span>B</span>
      </CircleMenu>
    );

    expect(container).toBeVisible();
  });

  it('contains the passed children', () => {
    render(
      <CircleMenu
        position={[100, 100]}
      >
        <span role="option">A</span>
        <span role="option">B</span>
      </CircleMenu>
    );

    const children = screen.getAllByRole('option');

    expect(children).toHaveLength(2);
    expect(children[0]).toHaveTextContent('A');
    expect(children[1]).toHaveTextContent('B');
  });

  it('applies the transformation on update', async () => {
    const animationDuration = 1;

    const { rerender } = render(
      <CircleMenu
        position={[0, 0]}
        animationDuration={animationDuration}
        role="menu"
      >
        <span role="option">A</span>
        <span role="option">B</span>
      </CircleMenu>
    );

    let menu = screen.getByRole('menu');

    expect(menu).toHaveStyle('transition: all 1ms; top: -50px; left: -50px');

    rerender(
      <CircleMenu
        position={[100, 100]}
        animationDuration={animationDuration}
        role="menu"
      >
        <span role="option">A</span>
        <span role="option">B</span>
      </CircleMenu>
    );

    await new Promise(resolve => setTimeout(resolve, animationDuration + 100));

    menu = screen.getByRole('menu');

    expect(menu).toHaveStyle('transition: all 1ms; top: 50px; left: 50px');
  });

  describe('applyTransformation', () => {
    it('applies the transformation to the ref', async () => {
      const diameter = 1337;
      const animationDuration = 1;
      const { rerender } = render(
        <CircleMenu
          position={[0, 0]}
          animationDuration={animationDuration}
          diameter={diameter}
          role="menu"
        >
          <span role="option">A</span>
          <span role="option">B</span>
        </CircleMenu>
      );

      await new Promise(resolve => setTimeout(resolve, animationDuration + 100));

      const menu = screen.getByRole('menu');

      expect(menu).toHaveStyle('width: 1337px; height: 1337px');
    });
  });

});
