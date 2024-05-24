import './SearchResultsPanel.less';

import useMap from '@terrestris/react-util/dist/Hooks/useMap/useMap';
import {
  Avatar,
  Collapse,
  CollapseProps,
  List
} from 'antd';
import _isEmpty from 'lodash/isEmpty';
import OlFeature from 'ol/Feature';
import BaseLayer from 'ol/layer/Base';
import OlLayerVector from 'ol/layer/Vector';
import OlSourceVector from 'ol/source/Vector';
import OlStyle from 'ol/style/Style';
import React, { ReactNode, useEffect, useState } from 'react';

const Panel = Collapse.Panel;
const ListItem = List.Item;

export interface Category {
  title: string;
  /** Each feature is expected to have at least the properties `title` and `geometry` */
  features: OlFeature[];
  icon?: React.ReactNode | string;
}

interface SearchResultsPanelProps extends Partial<CollapseProps> {
  searchResults: Category[];
  numTotal: number;
  searchTerms: string[];
  /** Creator function that creates actions for each item */
  actionsCreator?: (item: any) => undefined | ReactNode[];
  /** A renderer function returning a prefix component for each list item */
  listPrefixRenderer?: (item: any) => undefined | JSX.Element;
  layerStyle?: undefined | OlStyle;
  onClick?: (item: any) => void;
}

const SearchResultsPanel = (props: SearchResultsPanelProps) => {
  const [highlightLayer, setHighlightLayer] = useState<OlLayerVector<OlFeature> | null>(null);
  const map = useMap();

  const {
    searchResults,
    numTotal,
    searchTerms,
    actionsCreator = () => undefined,
    listPrefixRenderer = () => undefined,
    layerStyle,
    onClick = item =>
      map?.getView().fit(item.feature.getGeometry(), { size: map.getSize() }),
    ...passThroughProps
  } = props;

  useEffect(() => {
    if (!map) {
      return;
    }

    const layer = new OlLayerVector({
      source: new OlSourceVector()
    });

    if (layerStyle) {
      layer.setStyle(layerStyle);
    }

    setHighlightLayer(layer);
    map.addLayer(layer);
  }, [layerStyle, map]);

  useEffect(() => {
    return () => {
      if (!map) {
        return;
      }

      map.removeLayer(highlightLayer as BaseLayer);
    };
  }, [highlightLayer, map]);

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
      title,
      icon
    } = category;

    if (!map) {
      return <></>;
    }

    if (!features || _isEmpty(features)) {
      return;
    }

    const header = (
      <div className="search-result-panel-header">
        <span>{`${title} (${features.length})`}</span>
        {
          icon &&
          <Avatar
            className="search-option-avatar"
            src={icon}
          />
        }
      </div>
    );

    const categoryKey = getCategoryKey(category, categoryIdx);

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
              onClick={() => onClick(item)}
              actions={actionsCreator(item)}
            >
              <div
                className="result-prefix"
              >
                {
                  listPrefixRenderer(item)
                }
              </div>
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
