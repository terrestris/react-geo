import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import SimpleButton from './SimpleButton';

describe('<SimpleButton />', () => {

  it('is defined', () => {
    expect(SimpleButton).toBeDefined();
  });

  it('can rendered', () => {
    render(<SimpleButton />);
    expect(screen.getByRole('button')).toBeVisible();
  });

  it('allows to set some props', () => {
    render(
      <SimpleButton
        type="default"
        shape="circle"
        size="small"
        disabled={true}
      />
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('ant-btn-default');
    expect(button).toHaveClass('ant-btn-circle');
    expect(button).toHaveClass('ant-btn-sm');
    expect(button).toBeDisabled();
  });

  it('calls a given click callback method onClick', () => {
    const onClick = jest.fn();
    render(<SimpleButton onClick={onClick} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
