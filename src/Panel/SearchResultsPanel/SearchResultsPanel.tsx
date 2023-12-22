import React, { useEffect } from 'react';
import OlLayerVector from 'ol/layer/Vector';
import OlSourceVector from 'ol/source/Vector';
import OlMap from 'ol/Map';
import './SearchResultsPanel.less';
import useMap from '../../Hook/useMap';
import BaseLayer from 'ol/layer/Base';
import OlStyle from 'ol/style/Style';

import SearchResultsCategory from './SearchResultsCategory'; // Componente para renderizar uma categoria
import { Category } from './types'; // Importe os tipos necessários

interface SearchResultsPanelProps {
  searchResults: Category[];
  numTotal: number;
  searchTerms: string[];
  actionsCreator?: (item: any) => undefined | React.ReactNode[];
  listPrefixRenderer?: (item: any) => undefined | JSX.Element;
  layerStyle?: undefined | OlStyle;
}

const SearchResultsPanel: React.FC<SearchResultsPanelProps> = (props) => {
  const map = useMap() as OlMap;

  const {
    searchResults,
    numTotal,
    actionsCreator = () => undefined,
    listPrefixRenderer = () => undefined,
    layerStyle,
    ...passThroughProps
  } = props;

  useEffect(() => {
    const highlightLayer = new OlLayerVector({
      source: new OlSourceVector(),
    });

    if (layerStyle) {
      highlightLayer.setStyle(layerStyle);
    }

    map.addLayer(highlightLayer);

    return () => {
      map.removeLayer(highlightLayer as BaseLayer);
    };
  }, [map, layerStyle]);

  if (numTotal === 0) {
    return null;
  }

  const renderPanelForCategory = (category: Category, categoryIdx: number) => {
    return (
      <SearchResultsCategory
        key={`${category.title}-${categoryIdx}`}
        category={category}
        searchTerms={props.searchTerms}
        actionsCreator={props.actionsCreator}
        listPrefixRenderer={props.listPrefixRenderer}
        map={map}
      />
    );
  };

  return (
    <div className="search-result-div">
      <Collapse defaultActiveKey={searchResults[0] ? `${searchResults[0].title}-0` : undefined} {...passThroughProps}>
        {searchResults.map(renderPanelForCategory)}
      </Collapse>
    </div>
  );
};

export default SearchResultsPanel;
