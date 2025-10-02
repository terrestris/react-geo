import React from 'react';
import { render, fireEvent, screen, act, waitFor } from '@testing-library/react';
import DrawCutButton from './DrawCutButton';

describe('DrawCutButton', () => {
  it('renders and toggles pressed state', () => {
    render(<DrawCutButton pressed={false} />);
    const btn = screen.getByRole('button');
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute('aria-pressed', 'false');
  });

  it('shows Popconfirm after drawing', async () => {
    render(<DrawCutButton pressed={true} />);
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 10));
    });
    waitFor(() => {
      expect(screen.getByText('Perform cut?')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  it('calls onCutEnd when provided', async () => {
    const onCutEnd = jest.fn();
    render(<DrawCutButton pressed={true} onCutEnd={onCutEnd} />);
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 10));
    });
    waitFor(() => {
      expect(screen.getByText('OK')).toBeInTheDocument();
      fireEvent.click(screen.getByText('OK'));
    });
    waitFor(() => {
      expect(screen.queryByText('Perform cut?')).not.toBeInTheDocument();
    });
  });

  it('calls Popconfirm cancel', async () => {
    render(<DrawCutButton pressed={true} />);
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 10));
    });
    waitFor(() => {
      expect(screen.getByText('Canceö')).toBeInTheDocument();
      fireEvent.click(screen.getByText('Cancel'));
    });
    expect(screen.queryByText('Perform cut?')).not.toBeInTheDocument();
  });

  it('applies custom className and popConfirmText', () => {
    render(
      <DrawCutButton
        pressed={false}
        className="my-custom"
        popConfirmText="Are you sure?"
      />
    );
    const btn = screen.getByRole('button');
    expect(btn.className).toMatch(/my-custom/);
  });

  it('passes popConfirmProps to Popconfirm', async () => {
    render(
      <DrawCutButton
        pressed={true}
        popConfirmProps={{ okText: 'Yes', cancelText: 'No' }}
      />
    );
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 10));
    });
    waitFor(() => {
      expect(screen.getByText('Yes')).toBeInTheDocument();
      expect(screen.getByText('No')).toBeInTheDocument();
    })
  });
});
