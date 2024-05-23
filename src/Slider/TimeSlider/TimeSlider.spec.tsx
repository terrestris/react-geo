import '@testing-library/jest-dom/jest-globals';
import '@testing-library/jest-dom';

import { fireEvent, render, screen } from '@testing-library/react';
import moment from 'moment';
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
        onChange={() => {}}
        value={''}
        formatString={''}
        marks={undefined}
      />
    );
    expect(container).toBeVisible();
  });

  it('initializes and displays values correctly', () => {
    const defaultValue = moment().subtract(30, 'minutes').toISOString();
    const minValue = moment().subtract(1, 'hour').toISOString();
    const maxValue = moment().toISOString();
    const formatString = 'DD.MM.YYYY HH:mm';

    render(
      <TimeSlider
        defaultValue={defaultValue}
        min={minValue}
        max={maxValue}
        onChange={() => {}}
        value={defaultValue}
        formatString={formatString}
        marks={undefined}
      />
    );

    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute(
      'aria-valuemin',
      expect.stringContaining(moment(minValue).unix().toString())
    );
    expect(slider).toHaveAttribute(
      'aria-valuemax',
      expect.stringContaining(moment(maxValue).unix().toString())
    );
  });

  it('calls onChange', () => {
    const onChangeMock = jest.fn();
    const defaultValue = moment().subtract(30, 'minutes').toISOString();

    render(
      <TimeSlider
        defaultValue={defaultValue}
        min={moment().subtract(1, 'hour').toISOString()}
        max={moment().toISOString()}
        onChange={onChangeMock}
        value={defaultValue}
        formatString={'DD.MM.YYYY HH:mm'}
        marks={undefined}
      />
    );

    const slider = screen.getByRole('slider');
    fireEvent.mouseOver(slider);
    fireEvent.mouseDown(slider);
    fireEvent.mouseMove(slider, { clientX: 100 });
    fireEvent.mouseUp(slider);

    expect(onChangeMock).toHaveBeenCalled();
  });

  it('displays marks', () => {
    const marks = {
      [moment().subtract(1, 'hour').toISOString()]: '-1hr',
      [moment().subtract(30, 'minutes').toISOString()]: '-30mins',
      [moment().toISOString()]: 'Now'
    };

    render(
      <TimeSlider
        defaultValue={moment().subtract(30, 'minutes').toISOString()}
        min={moment().subtract(1, 'hour').toISOString()}
        max={moment().toISOString()}
        onChange={() => {}}
        value={moment().toISOString()}
        formatString={'DD.MM.YYYY HH:mm'}
        marks={marks}
      />
    );

    expect(screen.getByText('-1hr')).toBeInTheDocument();
    expect(screen.getByText('-30mins')).toBeInTheDocument();
    expect(screen.getByText('Now')).toBeInTheDocument();
  });

  it('displays tooltip on hover', async () => {
    const formatString = 'DD.MM.YYYY HH:mm';
    const value = moment().subtract(30, 'minutes').unix();

    render(
      <TimeSlider
        defaultValue={moment(value * 1000).toISOString()}
        min={moment().subtract(1, 'hour').toISOString()}
        max={moment().toISOString()}
        onChange={() => {}}
        value={moment(value * 1000).toISOString()}
        formatString={formatString}
        marks={undefined}
      />
    );

    const slider = screen.getByRole('slider');
    fireEvent.mouseOver(slider);
    expect(
      screen.getByText(moment(value * 1000).format(formatString))
    ).toBeInTheDocument();
  });
});
