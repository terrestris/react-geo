import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';

// import TestUtil from '../../Util/TestUtil';
import ToggleButton from '../ToggleButton/ToggleButton';
import ToggleGroup from './ToggleGroup';

describe('<ToggleGroup />', () => {

  it('is defined', () => {
    expect(ToggleGroup).toBeDefined();
  });

  it('can be rendered', () => {
    const { container } = render(<ToggleGroup />);
    expect(container).toBeVisible();
  });

  it('renders children when passed in', () => {
    render(
      <ToggleGroup
        orientation="vertical"
      >
        <ToggleButton value="Shinji" />
        <ToggleButton value="Kagawa" />
        <ToggleButton value="香川 真司" />
      </ToggleGroup>
    );

    const buttons = screen.getAllByRole('button');

    expect(buttons).toHaveLength(3);
  });

  it('calls the given onChange callback if a children is pressed', async () => {
    const onChange = jest.fn();
    const clickEvtMock = expect.objectContaining({
      type: 'click'
    });

    render(
      <ToggleGroup
        orientation="vertical"
        onChange={onChange}
      >
        <ToggleButton value="Shinji" />
        <ToggleButton value="Kagawa" />
        <ToggleButton value="香川 真司" />
      </ToggleGroup>
    );

    const buttons = screen.getAllByRole('button');

    await userEvent.click(buttons[0]);

    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(clickEvtMock, 'Shinji');
  });

  it('allows to toggle between buttons', async () => {
    const { rerender } = render(
      <ToggleGroup>
        <ToggleButton value="Shinji" />
        <ToggleButton value="Kagawa" />
        <ToggleButton value="香川 真司" />
      </ToggleGroup>
    );

    screen.getAllByRole('button').forEach(button => expect(button).not.toHaveClass('btn-pressed'));

    rerender(
      <ToggleGroup
        selected="Kagawa"
      >
        <ToggleButton value="Shinji" />
        <ToggleButton value="Kagawa" role="test" />
        <ToggleButton value="香川 真司" />
      </ToggleGroup>
    );

    screen.getAllByRole('button').forEach(button => expect(button).not.toHaveClass('btn-pressed'));
    expect(screen.getByRole('test')).toHaveClass('btn-pressed');

    rerender(
      <ToggleGroup
        selected="Shinji"
      >
        <ToggleButton value="Shinji" role="test-updated" />
        <ToggleButton value="Kagawa" role="test" />
        <ToggleButton value="香川 真司" />
      </ToggleGroup>
    );

    screen.getAllByRole('button').forEach(button => expect(button).not.toHaveClass('btn-pressed'));
    expect(screen.getByRole('test')).not.toHaveClass('btn-pressed');
    expect(screen.getByRole('test-updated')).toHaveClass('btn-pressed');

    rerender(
      <ToggleGroup>
        <ToggleButton value="Shinji" />
        <ToggleButton value="Kagawa" />
        <ToggleButton value="香川 真司" />
      </ToggleGroup>
    );

    screen.getAllByRole('button').forEach(button => expect(button).not.toHaveClass('btn-pressed'));
  });

});
