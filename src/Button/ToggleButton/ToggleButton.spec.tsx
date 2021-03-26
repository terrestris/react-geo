import ToggleButton from './ToggleButton';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

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
    render(<ToggleButton pressed={true}/>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn-pressed');
  });

  it('ignores the onClick callback', () => {
    const onClick = jest.fn();

    render(<ToggleButton pressed={true} onClick={onClick} />);
    const button = screen.getByRole('button');
    userEvent.click(button);

    expect(onClick).not.toHaveBeenCalled();
  });

  it('toggles the pressed class if the pressed prop has changed', () => {
    const { rerender } = render(<ToggleButton />);
    const button = screen.getByRole('button');

    expect(button).not.toHaveClass('btn-pressed');

    rerender(<ToggleButton pressed={true} />);
    expect(button).toHaveClass('btn-pressed');

    // Nothing should happen if the prop hasn't changed.
    rerender(<ToggleButton pressed={true} />);
    expect(button).toHaveClass('btn-pressed');

    rerender(<ToggleButton />);
    expect(button).not.toHaveClass('btn-pressed');
  });

  // eslint-disable-next-line max-len
  it('calls the given toggle callback method if the pressed prop has changed initially to true', () => {
    const onToggle = jest.fn();
    const { rerender } = render(<ToggleButton onToggle={onToggle}/>);

    rerender(<ToggleButton pressed={true} onToggle={onToggle} />);
    expect(onToggle).toHaveBeenCalledTimes(1);
    // If the prop has been changed, no click evt is available.
    expect(onToggle).toHaveBeenCalledWith(true, null);

    rerender(<ToggleButton pressed={false} onToggle={onToggle} />);
    expect(onToggle).toHaveBeenCalledTimes(2);
    expect(onToggle).toHaveBeenCalledWith(false, null);

    // Nothing should happen if the prop hasn't changed.
    rerender(<ToggleButton pressed={false} onToggle={onToggle} />);
    expect(onToggle).toHaveBeenCalledTimes(2);

    rerender(<ToggleButton pressed={true} onToggle={onToggle} />);
    expect(onToggle).toHaveBeenCalledTimes(3);
    expect(onToggle).toHaveBeenCalledWith(true, null);
  });

  // eslint-disable-next-line max-len
  it('calls the given toggle callback method if the pressed prop has changed to false (from being false by default)', () => {
    const onToggle = jest.fn();
    const { rerender } = render(<ToggleButton onToggle={onToggle}/>);

    // Nothing should happen if the prop hasn't changed.
    // (pressed property is false by default)
    rerender(<ToggleButton pressed={false} onToggle={onToggle} />);
    expect(onToggle).toHaveBeenCalledTimes(0);

    rerender(<ToggleButton pressed={true} onToggle={onToggle} />);
    expect(onToggle).toHaveBeenCalledTimes(1);
    // If the prop has been changed, no click evt is available.
    expect(onToggle).toHaveBeenCalledWith(true, null);

    // Nothing should happen if the prop hasn't changed.
    rerender(<ToggleButton pressed={true} onToggle={onToggle} />);
    expect(onToggle).toHaveBeenCalledTimes(1);

    rerender(<ToggleButton pressed={false} onToggle={onToggle} />);
    expect(onToggle).toHaveBeenCalledTimes(2);
    expect(onToggle).toHaveBeenCalledWith(false, null);
  });

  it('cleans the last click event if not available', () => {
    const onToggle = jest.fn();
    const clickEvtMock = expect.objectContaining({
      type: 'click'
    });
    const { rerender } = render(<ToggleButton onToggle={onToggle}/>);
    const button = screen.getByRole('button');

    rerender(<ToggleButton pressed={true} onToggle={onToggle} />);
    expect(onToggle).toHaveBeenCalledTimes(1);
    // If the prop has been changed, no click evt is available.
    expect(onToggle).toHaveBeenCalledWith(true, null);

    // Pressed will now become false.
    userEvent.click(button);
    expect(onToggle).toHaveBeenCalledTimes(2);
    expect(onToggle).toHaveBeenCalledWith(false, clickEvtMock);

    rerender(<ToggleButton pressed={true} onToggle={onToggle} />);
    // If the prop has been changed, no click evt is available.
    expect(onToggle).toHaveBeenCalledTimes(3);
    expect(onToggle).toHaveBeenCalledWith(true, null);

  });

  it('toggles the pressed class on click', () => {
    render(<ToggleButton />);
    const button = screen.getByRole('button');

    expect(button).not.toHaveClass('btn-pressed');

    userEvent.click(button);
    expect(button).toHaveClass('btn-pressed');

    userEvent.click(button);
    expect(button).not.toHaveClass('btn-pressed');

    userEvent.click(button);
    expect(button).toHaveClass('btn-pressed');
  });

  it('calls the given toggle callback method on click', () => {
    const onToggle = jest.fn();
    const clickEvtMock = expect.objectContaining({
      type: 'click'
    });
    render(<ToggleButton onToggle={onToggle}/>);
    const button = screen.getByRole('button');

    userEvent.click(button);
    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(onToggle).toHaveBeenCalledWith(true, clickEvtMock);

    userEvent.click(button);
    expect(onToggle).toHaveBeenCalledTimes(2);
    expect(onToggle).toHaveBeenCalledWith(false, clickEvtMock);

    userEvent.click(button);
    expect(onToggle).toHaveBeenCalledTimes(3);
    expect(onToggle).toHaveBeenCalledWith(true, clickEvtMock);
  });

  it('can be rendered if iconName is set and no text or icon is set with the property pressed set to true', () => {
    const { container } = render(
      <ToggleButton iconName={'some-icon-name'} pressedIconName={undefined} pressed={true} />
    );
    expect(container).toBeVisible();
  });
});
