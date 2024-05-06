import {
  render
} from '@testing-library/react';
import { Map } from 'ol';
import React from 'react';

import TestUtil from '../../Util/TestUtil';
import MapComponent from './MapComponent';

describe('<MapComponent />', () => {
  let map: Map;

  it('is defined', () => {
    expect(MapComponent).not.toBeUndefined();
  });

  beforeEach(() => {
    map = TestUtil.createMap();
  });

  it('can be rendered', () => {
    const { container } = render(
      <MapComponent
        map={map}
      />
    );
    expect(container).toBeVisible();
  });
});
