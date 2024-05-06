import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';

import ToggleButton from './ToggleButton';

describe('<ToggleButton />', () => {

  it('is defined', () => {
    expect(ToggleButton).not.toBeUndefined();
  });

  it('can be rendered', () => {
    const { container } = render(<ToggleButton />);
    expect(container).toBeVisible();
  });

  it('isn\'t pressed by default', () => {
    render(<ToggleButton />);
    const button = screen.getByRole('button');
    expect(button).not.toHaveClass('btn-pressed');
  });

  it('sets the pressed class if pressed prop is set to true initially', () => {
    render(<ToggleButton pressed={true} />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn-pressed');
  });

  it('does not ignore the onClick callback', async () => {
    const onClick = jest.fn();

    render(<ToggleButton pressed={true} onClick={onClick} />);
    const button = screen.getByRole('button');
    await userEvent.click(button);

    expect(onClick).toHaveBeenCalled();
  });

  it('toggles the pressed class if the pressed prop has changed', () => {
    const { rerender } = render(<ToggleButton pressed={false} />);
    const button = screen.getByRole('button');

    expect(button).not.toHaveClass('btn-pressed');

    rerender(<ToggleButton pressed={true} />);
    expect(button).toHaveClass('btn-pressed');

    // Nothing should happen if the prop hasn't changed.
    rerender(<ToggleButton pressed={true} />);
    expect(button).toHaveClass('btn-pressed');

    rerender(<ToggleButton pressed={false} />);
    expect(button).not.toHaveClass('btn-pressed');
  });

  it('calls the given toggle callback method on click', async () => {
    const onChange = jest.fn();
    const clickEvtMock = expect.objectContaining({
      type: 'click'
    });
    render(<ToggleButton onChange={onChange} value="test" />);
    const button = screen.getByRole('button');

    await userEvent.click(button);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(clickEvtMock, 'test');

    await userEvent.click(button);
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenCalledWith(clickEvtMock, 'test');

    await userEvent.click(button);
    expect(onChange).toHaveBeenCalledTimes(3);
    expect(onChange).toHaveBeenCalledWith(clickEvtMock, 'test');
  });

  it('can be rendered if icon is set and no text or icon is set with the property pressed set to true', () => {
    const { container } = render(
      <ToggleButton
        icon={'some-icon-name'}
        pressedIcon={undefined}
        pressed={true}
      />
    );
    expect(container).toBeVisible();
  });
});
