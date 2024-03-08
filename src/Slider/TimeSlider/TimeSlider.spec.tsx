import {
  render
} from '@testing-library/react';
import React from 'react';

import TimeSlider from './TimeSlider';

describe('<TimeSlider />', () => {
  it('is defined', () => {
    expect(TimeSlider).not.toBeUndefined();
  });

  it('can be rendered', () => {
    const { container } = render(
      <TimeSlider
        defaultValue={''}
        min={''}
        max={''}
        onChange={()=>{}}
        value={''}
        formatString={''}
        marks={undefined}
      />);
    expect(container).toBeVisible();
  });

});
