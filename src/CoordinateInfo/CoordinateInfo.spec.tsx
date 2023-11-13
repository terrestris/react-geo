import { render } from '@testing-library/react';
import * as React from 'react';

import CoordinateInfo from '../CoordinateInfo/CoordinateInfo';
import TestUtil from '../Util/TestUtil';

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
