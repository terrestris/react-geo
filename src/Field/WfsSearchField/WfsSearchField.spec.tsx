import { render } from '@testing-library/react';
import React from 'react';

import WfsSearchField from './WfsSearchField';

describe('<WfsSearchField />', () => {
  it('is defined', () => {
    expect(WfsSearchField).not.toBeUndefined();
  });

  it('can be rendered', () => {
    const { container } = render(
      <WfsSearchField
        baseUrl=""
        attributeDetails={{}}
        featureNS=""
        featurePrefix=""
      />
    );
    expect(container).not.toBeUndefined();
  });

});
