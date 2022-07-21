import React, { ReactNode, useEffect, useState } from 'react';
import OlLayerVector from 'ol/layer/Vector';
import OlFeature from 'ol/Feature';
import OlSourceVector from 'ol/source/Vector';
import OlMap from 'ol/Map';

import {
  Collapse,
  CollapseProps,
  List
} from 'antd';

import _isEmpty from 'lodash/isEmpty';
import './SearchResultsPanel.less';
import useMap from '../../Hook/useMap';
import BaseLayer from 'ol/layer/Base';

const Panel = Collapse.Panel;
const ListItem = List.Item;

export interface Category {
  title: string;
  /** Each feature is expected to have at least the properties `title` and `geometry` */
  features: OlFeature[];
}

interface SearchResultsPanelProps extends Partial<CollapseProps>{
  searchResults: Category[];
  numTotal: number;
  searchTerms: string[];
  /** Creator function that creates actions for each item */
  actionsCreator?: (item: any) => undefined|ReactNode[];
}

const SearchResultsPanel = (props: SearchResultsPanelProps) => {
  const [highlightLayer, setHighlightLayer] = useState<OlLayerVector<OlSourceVector> | null>(null);
  const map = useMap() as OlMap;
  const {
    searchResults,
    numTotal,
    searchTerms,
    actionsCreator = () => undefined,
    ...passThroughProps
  } = props;

  useEffect(() => {
    const layer = new OlLayerVector({
      source: new OlSourceVector()
    });
    setHighlightLayer(layer);
    map.addLayer(layer);
  }, []);

  useEffect(() => {
    return () => {
      map.removeLayer(highlightLayer as BaseLayer);
    };
  }, [highlightLayer]);

  const highlightSearchTerms = (text: string) => {
    searchTerms.forEach(searchTerm => {
      const term = searchTerm.toLowerCase();
      if (term === '') {
        return;
      }
      let start = text.toLowerCase().indexOf(term);
      while (start >= 0) {
        const startPart = text.substring(0, start);
        const matchedPart = text.substring(start, start + term.length);
        const endPart = text.substring(start + term.length, text.length);
        text = `${startPart}<b>${matchedPart}</b>${endPart}`;
        start = text.toLowerCase().indexOf(term, start + 8);
      }
    });
    return text;
  };

  const onMouseOver = (feature: OlFeature) => {
    return () => {
      highlightLayer?.getSource()?.clear();
      highlightLayer?.getSource()?.addFeature(feature);
    };
  };

  /**
   * Renders content panel of related collapse element for each category and
   * its features.
   *
   * @param category The category to render
   * @param categoryIdx The idx of the category in the searchResults list.
   */
  const renderPanelForCategory = (category: Category, categoryIdx: number) => {
    const {
      features,
      title
    } = category;
    if (!features || _isEmpty(features)) {
      return;
    }

    const header = (
      <div className="search-result-panel-header">
        <span>{`${title} (${features.length})`}</span>
      </div>
    );

    const categoryKey =getCategoryKey(category, categoryIdx);
    return (
      <Panel
        header={header}
        key={categoryKey}
      >
        <List
          size="small"
          dataSource={features.map((feat, idx) => {
            let text: string = highlightSearchTerms(feat.get('title'));
            return {
              text,
              idx,
              feature: feat
            };
          })}
          renderItem={(item: any) => (
            <ListItem
              className="result-list-item"
              key={item.idx}
              onMouseOver={onMouseOver(item.feature)}
              onMouseOut={() => highlightLayer?.getSource()?.clear()}
              onClick={() => map.getView().fit(item.feature.getGeometry(), {
                nearest: true
              })}
              actions={actionsCreator(item)}
            >
              <div
                className="result-text"
                dangerouslySetInnerHTML={{ __html: item.text }}
              />
            </ListItem>
          )}
        />
      </Panel>
    );
  };

  /**
   * Create a category key that is based on the category title and its position in searchResults.
   *
   * @param category The category to create the key for.
   * @param idx The position of the category in searchResults.
   * @returns The created key for the category.
   */
  const getCategoryKey = (category: Category, idx: number): string => {
    return `${category.title}-${idx}`;
  };

  if (numTotal === 0) {
    return null;
  }

  return (
    <div className="search-result-div">
      <Collapse
        defaultActiveKey={searchResults[0] ? getCategoryKey(searchResults[0], 0) : undefined}
        {...passThroughProps}
      >
        {
          searchResults.map(renderPanelForCategory)
        }
      </Collapse>
    </div>
  );
};

export default SearchResultsPanel;
