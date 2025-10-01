import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import FeatureLabelModal from './FeatureLabelModal';

describe('<FeatureLabelModal />', () => {
  let feature: Feature<Point>;

  beforeEach(() => {
    feature = new Feature({
      geometry: new Point([0, 0]),
      label: 'Initial label'
    });
  });

  it('renders nothing if no feature is given', () => {
    // @ts-expect-error purposely passing undefined
    const { container } = render(<FeatureLabelModal feature={undefined} onOk={jest.fn()} onCancel={jest.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders modal and textarea with feature label', () => {
    render(<FeatureLabelModal feature={feature} onOk={jest.fn()} onCancel={jest.fn()} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveValue('Initial label');
  });

  it('calls onCancel when cancel is clicked', () => {
    const onCancel = jest.fn();
    render(<FeatureLabelModal feature={feature} onOk={jest.fn()} onCancel={onCancel} />);
    // AntD Modal renders a button with aria-label 'Close' for cancel
    const cancelBtn = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelBtn);
    expect(onCancel).toHaveBeenCalled();
  });

  it('calls onOk and sets label when ok is clicked', () => {
    const onOk = jest.fn();
    render(<FeatureLabelModal feature={feature} onOk={onOk} onCancel={jest.fn()} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'New label' } });
    const okBtn = screen.getByRole('button', { name: /ok/i });
    fireEvent.click(okBtn);
    expect(onOk).toHaveBeenCalled();
    expect(feature.get('label')).toBe('New label');
  });

  it('splits label into lines if maxLabelLineLength is set', () => {
    const onOk = jest.fn();
    render(<FeatureLabelModal feature={feature} onOk={onOk} onCancel={jest.fn()} maxLabelLineLength={5} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '1234567890' } });
    const okBtn = screen.getByRole('button', { name: /ok/i });
    fireEvent.click(okBtn);
    // the implementation is a bit surprising, but this is it rght now
    expect(feature.get('label')).toBe('123456-\n7890');
  });
});
