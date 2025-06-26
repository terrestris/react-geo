import '@testing-library/jest-dom/jest-globals';
import '@testing-library/jest-dom';

import { fireEvent, render, screen } from '@testing-library/react';
import dayjs from 'dayjs';
import React from 'react';

import TimeSlider, {TimeSliderMark} from './TimeSlider';

describe('<TimeSlider />', () => {
  it('is defined', () => {
    expect(TimeSlider).not.toBeUndefined();
  });

  it('can be rendered', () => {
    const { container } = render(
      <TimeSlider
        defaultValue={dayjs()}
        formatString={'DD.MM.YYYY HH:mm'}
        marks={undefined}
        max={dayjs()}
        min={dayjs()}
        onChange={() => {}}
        value={dayjs()}
      />
    );
    expect(container).toBeVisible();
  });

  it('initializes and displays values correctly', () => {
    const defaultValue = dayjs().subtract(30, 'minutes');
    const minValue = dayjs().subtract(1, 'hour');
    const maxValue = dayjs();
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
      expect.stringContaining(minValue.unix().toString())
    );
    expect(slider).toHaveAttribute(
      'aria-valuemax',
      expect.stringContaining(maxValue.unix().toString())
    );
  });

  it('calls onChange', () => {
    const onChangeMock = jest.fn();
    const defaultValue = dayjs().subtract(30, 'minutes');

    render(
      <TimeSlider
        defaultValue={defaultValue}
        min={dayjs().subtract(1, 'hour')}
        max={dayjs()}
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
    const marks: TimeSliderMark[] = [{
      timestamp: dayjs().subtract(1, 'hour'),
      markConfig: {
        label: '-1hr'
      }
    }, {
      timestamp: dayjs().subtract(30, 'minutes'),
      markConfig: {
        label: '-30mins'
      }
    }, {
      timestamp: dayjs(),
      markConfig: {
        label: 'Now'
      }
    }];

    render(
      <TimeSlider
        defaultValue={dayjs().subtract(30, 'minutes')}
        formatString={'DD.MM.YYYY HH:mm'}
        marks={marks}
        max={dayjs()}
        min={dayjs().subtract(1, 'hour')}
        onChange={() => {}}
        value={dayjs()}
      />
    );

    expect(screen.getByText('-1hr')).toBeInTheDocument();
    expect(screen.getByText('-30mins')).toBeInTheDocument();
    expect(screen.getByText('Now')).toBeInTheDocument();
  });

  it('displays tooltip on hover', async () => {
    const formatString = 'DD.MM.YYYY HH:mm';
    const value = dayjs().subtract(30, 'minutes').unix();

    render(
      <TimeSlider
        defaultValue={dayjs(value * 1000)}
        formatString={formatString}
        marks={undefined}
        max={dayjs()}
        min={dayjs().subtract(1, 'hour')}
        onChange={() => {}}
        value={dayjs(value * 1000)}
      />
    );

    const slider = screen.getByRole('slider');
    fireEvent.mouseOver(slider);
    const tooltip = document.querySelector('.ant-tooltip-inner');
    expect(tooltip).toBeInTheDocument();

  });
});
