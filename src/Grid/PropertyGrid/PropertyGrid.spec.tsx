import { render, screen } from '@testing-library/react';
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
    name: 'Point',
    link: 'https://www.example.com'
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

  it('renders urls as links', () => {
    render(
      <PropertyGrid
        feature={testFeature}
      />
    );

    const link = screen.getByText('https://www.example.com');
    expect(link).toBeVisible();
    expect(link).toBeInstanceOf(HTMLAnchorElement);
    expect(link).toHaveAttribute('href', 'https://www.example.com');
  });

  describe('isUrl behavior cases (URL-based impl)', () => {
    const goodCases = [
      'http://example.com',
      'https://example.com/path?x=1',
      '//example.com', // protocol-relative
      'http://localhost:8080',
      'http://example', // short host without dot
      'http://sub.domain.co.uk',
      'https://127.0.0.1',
      'http://a.b',
      'http://example.com/some/page.html#hash',
      'https://example.com:8443/path',
      'https://user:password@pasexample.com:8443/some/path?foo=bar&baz=qux',
      'https://🪨🎸🤘'
    ];

    const badCases = [
      'ftp://example.com',
      'mailto:user@example.com',
      'example.com', // bare host
      '/relative/path',
      '://missing-scheme.com',
      '',
      '   ',
      'http://',
      'http://.com',
      '////weird'
    ];

    goodCases.forEach((value) => {
      it(`treats '${value}' as URL (true)`, () => {
        const feature = new OlFeature({ geometry: new OlGeomPoint([0, 0]), attr: value });
        render(
          <PropertyGrid
            feature={feature}
            attributeFilter={[ 'attr' ]}
          />
        );

        const link = screen.queryByRole('link', { name: value });
        expect(!!link).toBe(true);
      });
    });

    badCases.forEach((value) => {
      it(`treats '${value}' as non-URL (false)`, () => {
        const feature = new OlFeature({ geometry: new OlGeomPoint([0, 0]), attr: value });
        render(
          <PropertyGrid
            feature={feature}
            attributeFilter={[ 'attr' ]}
          />
        );

        const link = screen.queryByRole('link', { name: value });
        expect(!!link).toBe(false);
      });
    });
  });

});
