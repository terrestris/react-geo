import {
  render,
  screen
} from '@testing-library/react';
import React from 'react';

import testLogo from '../../../assets/user.png';
import FloatingMapLogo from './FloatingMapLogo';

describe('<FloatingMapLogo />', () => {
  it('can be rendered', () => {
    const { container } = render(
      <FloatingMapLogo
        imageSrc={testLogo}
      />
    );
    expect(container).toBeVisible();
  });

  it('contains img element with predefined class', () => {
    render(
      <FloatingMapLogo
        imageSrc={testLogo}
      />
    );

    const imgEl = screen.getByRole('img');
    expect(imgEl).toHaveClass('react-geo-floatingmaplogo');
  });
});
