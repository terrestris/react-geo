import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import OlFeature from 'ol/Feature';
import OlGeomPoint from 'ol/geom/Point';

import FeatureLabelModal from './FeatureLabelModal';

describe('<CopyButton />', () => {
  let testFeature: OlFeature<OlGeomPoint>;
  let onOk: jest.Mock;
  let onCancel: jest.Mock;

  beforeEach(() => {
    testFeature = new OlFeature({
      geometry: new OlGeomPoint([19.09, 1.09])
    });
    onOk = jest.fn();
    onCancel = jest.fn();
  });

  it('is defined', () => {
    expect(FeatureLabelModal).not.toBeUndefined();
  });

  it('can be rendered', () => {
    render(
      <FeatureLabelModal
        feature={testFeature}
        onOk={jest.fn()}
        onCancel={jest.fn()}
      />
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ok/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('shows the label from the feature if present', () => {
    testFeature.set('label', 'Test label');
    render(
      <FeatureLabelModal
        feature={testFeature}
        onOk={onOk}
        onCancel={onCancel}
      />
    );
    expect(screen.getByText('Test label')).toBeInTheDocument();
  });

  it('updates the label state when textarea changes', () => {
    render(
      <FeatureLabelModal
        feature={testFeature}
        onOk={onOk}
        onCancel={onCancel}
      />
    );
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'New label' } });
    expect((textarea as HTMLTextAreaElement).value).toBe('New label');
  });

  it('calls onOk and sets the feature label when OK is clicked', () => {
    render(
      <FeatureLabelModal
        feature={testFeature}
        onOk={onOk}
        onCancel={onCancel}
      />
    );
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'MyLabel' } });
    fireEvent.click(screen.getByRole('button', { name: /ok/i }));
    expect(testFeature.get('label')).toBe('MyLabel');
    expect(onOk).toHaveBeenCalled();
  });

  it('calls onCancel when Cancel is clicked', () => {
    render(
      <FeatureLabelModal
        feature={testFeature}
        onOk={onOk}
        onCancel={onCancel}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalled();
  });

  it('splits label into lines if maxLabelLineLength is set', () => {
    render(
      <FeatureLabelModal
        feature={testFeature}
        onOk={onOk}
        onCancel={onCancel}
        maxLabelLineLength={3}
      />
    );
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'abcdef' } });
    fireEvent.click(screen.getByRole('button', { name: /ok/i }));
    expect(testFeature.get('label')).toBe('abcd-\nef');
  });

  it('returns null if feature is not provided', () => {
    const { container } = render(
      <FeatureLabelModal
        // @ts-expect-error
        feature={undefined}
        onOk={onOk}
        onCancel={onCancel}
      />
    );
    expect(container.firstChild).toBeNull();
  });
});
