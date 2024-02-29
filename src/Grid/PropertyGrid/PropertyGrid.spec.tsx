import { render, screen } from '@testing-library/react';
import _isNil from 'lodash/isNil';
import OlFeature from 'ol/Feature';
import OlGeomPoint from 'ol/geom/Point';
import React from 'react';

import PropertyGrid from './PropertyGrid';

describe('<PropertyGrid />', () => {
  const testFeature = new OlFeature({
    geometry: new OlGeomPoint([19.09, 1.09])
  });

  const attributeObject = {
    foo: 'bar',
    bvb: 'yarmolenko',
    mip: 'map',
    name: 'Point'
  };

  testFeature.setProperties(attributeObject);
  testFeature.setId(1909);

  it('is defined', () => {
    expect(PropertyGrid).toBeDefined();
  });

  it('renders without errors', () => {
    const { container } = render(
      <PropertyGrid
        feature={testFeature}
      />
    );
    expect(container).toBeVisible();
  });

  it('renders the attribute names and values', () => {
    render(
      <PropertyGrid
        feature={testFeature}
      />
    );

    expect(screen.getByText('Attribute name')).toBeVisible();
    expect(screen.getByText('Attribute value')).toBeVisible();
    expect(screen.getByText('foo')).toBeVisible();
    expect(screen.getByText('bar')).toBeVisible();
    expect(screen.getByText('bvb')).toBeVisible();
    expect(screen.getByText('yarmolenko')).toBeVisible();
    expect(screen.getByText('mip')).toBeVisible();
    expect(screen.getByText('map')).toBeVisible();
    expect(screen.getByText('name')).toBeVisible();
    expect(screen.getByText('Point')).toBeVisible();
  });

  it('filters the attribute list based on attributeFilter prop', () => {
    render(
      <PropertyGrid
        feature={testFeature}
        attributeFilter={['bvb', 'name']}
      />
    );
    expect(screen.queryByText('foo')).not.toBeInTheDocument();
    expect(screen.queryByText('bar')).not.toBeInTheDocument();
    expect(screen.getByText('bvb')).toBeVisible();
    expect(screen.getByText('yarmolenko')).toBeVisible();
    expect(screen.queryByText('mip')).not.toBeInTheDocument();
    expect(screen.queryByText('map')).not.toBeInTheDocument();
    expect(screen.getByText('name')).toBeVisible();
    expect(screen.getByText('Point')).toBeVisible();
  });
});
