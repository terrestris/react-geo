import { render } from '@testing-library/react';
import * as React from 'react';

import CoordinateInfo from '../CoordinateInfo/CoordinateInfo';

describe('<CoordinateInfo />', () => {
  it('is defined', () => {
    expect(CoordinateInfo).not.toBeUndefined();
  });

  it('can be rendered', () => {
    const { container } = render(<CoordinateInfo />);
    expect(container).toBeVisible();
  });
});
