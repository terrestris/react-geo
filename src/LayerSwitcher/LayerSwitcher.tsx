import React, { useEffect, useRef, useState } from 'react';
import OlMap from 'ol/Map';
import OlLayerBase from 'ol/layer/Base';
import OlLayerGroup from 'ol/layer/Group';
import OlLayerTile from 'ol/layer/Tile';
import OlTileSource from 'ol/source/Tile';
import MapComponent from '../Map/MapComponent/MapComponent';
import { CSS_PREFIX } from '../constants';
import './LayerSwitcher.less';

// Defina as interfaces no mesmo arquivo para melhor organização

interface LayerSwitcherProps {
  className?: string;
  layers: OlLayerBase[];
  map: OlMap;
  identifierProperty?: string;
  labelProperty?: string;
}

export const LayerSwitcher: React.FC<LayerSwitcherProps> = ({
  identifierProperty = 'name',
  labelProperty = 'name',
  map,
  layers,
  className: classNameProp,
  ...passThroughProps
}) => {
  const [switcherMap, setSwitcherMap] = useState<OlMap | null>(null);
  const visibleLayerIndexRef = useRef<number>(0);
  const [previewLayer, setPreviewLayer] = useState<OlLayerBase | null>(null);

  const className = `${CSS_PREFIX}layer-switcher`;

  useEffect(() => {
    const mapClone = new OlMap({
      view: map.getView(),
      controls: []
    });
    setSwitcherMap(mapClone);
    return () => {
      if (switcherMap) {
        switcherMap.getLayers().clear();
        switcherMap.setTarget(undefined);
      }
    };
  }, [map]);

  useEffect(() => {
    if (switcherMap) {
      switcherMap.getLayers().clear();
      layers.map(cloneLayer).forEach(layer => switcherMap.addLayer(layer));
    }
    updateLayerVisibility();
  }, [switcherMap]);

  function cloneLayer(layer: OlLayerBase): OlLayerBase {
    if (layer instanceof OlLayerGroup) {
      const clonedLayers = layer.getLayers().getArray().map(l => cloneLayer(l));
      return new OlLayerGroup({
        layers: clonedLayers,
        properties: {
          originalLayer: layer
        },
        ...layer.getProperties()
      });
    } else if (layer instanceof OlLayerTile) {
      const clone = new OlLayerTile({
        source: (layer as OlLayerTile<OlTileSource>).getSource() || undefined,
        properties: {
          originalLayer: layer
        },
        ...layer.getProperties()
      });
      clone.setMap(null);
      return clone;
    }
    throw new Error('Layer of unclonable type');
  }

  const updateLayerVisibility = () => {
    layers.forEach((l, i) => {
      const visible = visibleLayerIndexRef.current === i;
      l.setVisible(visible);
      const clone = switcherMap?.getLayers().getArray().find(lc => lc.get(identifierProperty) === l.get(identifierProperty));
      if (clone) {
        clone.setVisible(visible);
        if (visible) {
          setPreviewLayer(clone);
        }
      }
    });
  };

  const onSwitcherClick = (evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    evt.stopPropagation();
    layers.forEach((layer, index) => {
      if (layer.getVisible()) {
        visibleLayerIndexRef.current = (index + 1) % layers.length;
      }
    });
    updateLayerVisibility();
  };

  const finalClassName = classNameProp ? `${className} ${classNameProp}` : className;

  if (!switcherMap) {
    return null;
  }

  return (
    <div className={finalClassName} role="menu" {...passThroughProps}>
      <div className="clip" onClick={onSwitcherClick} role="button">
        <MapComponent mapDivId="layer-switcher-map" map={switcherMap} role="presentation" />
        {previewLayer && <span className="layer-title">{previewLayer.get(labelProperty)}</span>}
      </div>
    </div>
  );
};
