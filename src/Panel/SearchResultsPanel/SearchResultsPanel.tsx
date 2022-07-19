import React, { useEffect, useState } from 'react';
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

interface SearchResultsPanelProps extends Partial<CollapseProps>{
  features: {
    [title: string]: OlFeature[];
  };
  numTotal: number;
  searchTerms: string[];
}

const SearchResultsPanel = (props: SearchResultsPanelProps) => {
  const [highlightLayer, setHighlightLayer] = useState<OlLayerVector<OlSourceVector> | null>(null);
  const map = useMap() as OlMap;
  const {
    features,
    numTotal,
    searchTerms,
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
   * Renders content panel of related collapse element for each feature type and
   * its features.
   *
   * @param title Title of the group
   * @param list The list of features
   */
  const renderPanelForFeatureType = (title: string, list: OlFeature[]) => {
    if (!list || _isEmpty(list)) {
      return;
    }

    const header = (
      <div className="search-result-panel-header">
        <span>{`${title} (${list.length})`}</span>
      </div>
    );

    return (
      <Panel
        header={header}
        key={title}
      >
        <List
          size="small"
          dataSource={list.map((feat, idx) => {
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

  if (numTotal === 0) {
    return null;
  }

  return (
    <div className="search-result-div">
      <Collapse
        defaultActiveKey={Object.keys(features)[0]}
        {...passThroughProps}
      >
        {
          Object.keys(features).map((title: string) => {
            return renderPanelForFeatureType(title, features[title]);
          })
        }
      </Collapse>
    </div>
  );
};

export default SearchResultsPanel;
