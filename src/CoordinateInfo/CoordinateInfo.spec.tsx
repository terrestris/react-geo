import * as React from 'react';
import TestUtil from '../Util/TestUtil';
import { render } from '@testing-library/react';

import CoordinateInfo from '../CoordinateInfo/CoordinateInfo';

describe('<CoordinateInfo />', () => {
  let map;

  beforeEach(() => {
    map = TestUtil.createMap();
  });

  it('is defined', () => {
    expect(CoordinateInfo).not.toBeUndefined();
  });

  it('can be rendered', () => {
    const { container } = render(<CoordinateInfo map={map} />);
    expect(container).toBeVisible();
  });
});
