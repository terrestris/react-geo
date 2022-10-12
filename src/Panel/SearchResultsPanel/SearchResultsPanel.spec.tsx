import * as React from 'react';
import { within, screen } from '@testing-library/react';

import OlView from 'ol/View';
import OlMap from 'ol/Map';
import OlPoint from 'ol/geom/Point';
import OlFeature from 'ol/Feature';

import {
  GlobalOutlined
} from '@ant-design/icons';

import { renderInMapContext } from '../../Util/rtlTestUtils';

import SearchResultsPanel, { Category } from './SearchResultsPanel';

describe('<SearchResultsPanel />', () => {

  const coord = [829729, 6708850];
  let map: OlMap;
  let searchResults: Category[];
  let category: Category;
  let feature: OlFeature<OlPoint>;

  beforeEach(() => {
    feature = new OlFeature<OlPoint>({
      geometry: new OlPoint(coord),
      title: 'bar'
    });
    category = {
      features: [feature],
      title: 'foo'
    };
    searchResults = [category];

    map = new OlMap({
      view: new OlView({
        center: coord,
        zoom: 10
      }),
      controls: [],
      layers: []
    });
  });

  describe('#Basics', () => {

    it('is defined', () => {
      expect(SearchResultsPanel).not.toBeUndefined();
    });

    it('can be rendered', () => {
      const { container } = renderInMapContext(map, <SearchResultsPanel
        numTotal={searchResults.length}
        searchResults={searchResults}
        searchTerms={[]}
      />);

      const resultsPanel = container.querySelector('.search-result-div');
      expect(resultsPanel).toBeVisible();
    });
  });

  describe('#Action Elements', () => {
    it('does not create any action elements by default', () => {

      const { container } = renderInMapContext(map, <SearchResultsPanel
        numTotal={searchResults.length}
        searchResults={searchResults}
        searchTerms={[]}
      />);

      const actionItemLists = container.querySelectorAll('.ant-list-item-action');
      expect(actionItemLists).toHaveLength(0);
    });

    it('creates action elements when actionsCreator is used', () => {
      const actionContent = 'actionContent';

      const { container } = renderInMapContext(map, <SearchResultsPanel
        numTotal={searchResults.length}
        searchResults={searchResults}
        searchTerms={[]}
        actionsCreator={() => [<div>{actionContent}</div>]}
      />);

      const actionItems = within(container).getAllByText(actionContent);
      expect(actionItems).toHaveLength(searchResults.length);
    });
  });

  it('renders a list prefix if given', () => {
    const { container } = renderInMapContext(map, <SearchResultsPanel
      numTotal={searchResults.length}
      searchResults={searchResults}
      searchTerms={[]}
      listPrefixRenderer={() => <GlobalOutlined />}
    />);

    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const listPrefixItems = container.querySelectorAll('.result-prefix');
    expect(listPrefixItems.length).toEqual(1);

    // eslint-disable-next-line testing-library/no-node-access
    const listPrefixItem = listPrefixItems.item(0).querySelectorAll('.anticon-global');
    expect(listPrefixItem).toBeDefined();
  });

});
