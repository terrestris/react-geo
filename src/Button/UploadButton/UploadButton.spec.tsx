import { fireEvent,render, screen } from '@testing-library/react';
import * as React from 'react';

import UploadButton from './UploadButton';

describe('<UploadButton />', () => {
  it('is defined', () => {
    expect(UploadButton).toBeDefined();
  });

  it('can be rendered', () => {
    const { container } = render(<UploadButton />);
    expect(container).toBeVisible();
  });

  it('applies inputProps to the input field', () => {
    render(
      <UploadButton
        inputProps={{
          role: 'test'
        }}
      />
    );

    expect(screen.getByRole('test')).toBeInTheDocument();
  });

  it('renders a simple button if no children are given', () => {
    render(<UploadButton />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls a given click callback method onChange', () => {
    const onChange = jest.fn();
    render(
      <UploadButton
        onChange={onChange}
        inputProps={{
          role: 'test'
        }}
      />
    );

    fireEvent.change(screen.getByRole('test'));

    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
