import './LayerSwitcher.less';

import OlLayerBase from 'ol/layer/Base';
import OlLayerGroup from 'ol/layer/Group';
import OlLayerTile from 'ol/layer/Tile';
import OlMap from 'ol/Map';
import OlTileSource from 'ol/source/Tile';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { CSS_PREFIX } from '../constants';
import MapComponent from '../Map/MapComponent/MapComponent';

/**
 * @export
 * @interface LayerSwitcherProps
 * @extends {React.HTMLAttributes<HTMLDivElement>}
 */
export interface OwnProps {
  /**
   * An optional CSS class which will be added to the wrapping div Element.
   */
  className?: string;
  /**
   * The layers to be available in the switcher.
   */
  layers: OlLayerBase[];
  /**
   * The main map the layers should be synced with.
   */
  map: OlMap;
  /**
   * The property that identifies the layer.
   */
  identifierProperty?: string;
  /**
   * The property that labels the layer.
   */
  labelProperty?: string;
}

export type LayerSwitcherProps = OwnProps & React.HTMLAttributes<HTMLDivElement>;

/**
 * A basic component to switch between the passed layers.
 * This is most likely to be used for the backgroundlayer.
 */
export const LayerSwitcher: React.FC<LayerSwitcherProps> = ({
  identifierProperty = 'name',
  labelProperty = 'name',
  map,
  layers,
  className: classNameProp,
  ...passThroughProps
}) => {

  const [switcherMap, setSwitcherMap] = useState<OlMap>();

  /**
   * The internal index of visible layer in provided layers array. If all passed
   * layers are initially invisible, the first layer in array will be taken as
   * default.
   */
  const visibleLayerIndexRef = useRef<number>(0);

  const [previewLayer, setPreviewLayer] = useState<OlLayerBase>();

  const className = `${CSS_PREFIX}layer-switcher`;

  /**
   * Sets the visiblity of the layers in the props.map and this._map.
   * Also sets the previewLayer in the state.
   */
  const updateLayerVisibility = useCallback(() => {
    layers.forEach((l, i) => {
      const visible = visibleLayerIndexRef.current === i;
      l.setVisible(visible);
      const clone = switcherMap?.getAllLayers()?.find(lc => lc.get(identifierProperty) === l.get(identifierProperty));
      if (clone) {
        clone.setVisible(visible);
        if (visible) {
          setPreviewLayer(clone);
        }
      }
    });
  }, [layers, identifierProperty, switcherMap]);

  const cloneLayer = useCallback((layer: OlLayerBase): OlLayerBase => {
    if (layer instanceof OlLayerGroup) {
      return new OlLayerGroup({
        layers: layer.getLayers().getArray().map(l => {
          if (!(l instanceof OlLayerTile) || !(l instanceof OlLayerGroup)) {
            throw new Error('Layer of layergroup is of unclonable type');
          }
          return cloneLayer(l);
        }),
        properties: {
          originalLayer: layer
        },
        ...layer.getProperties()
      });
    } else {
      const clone = new OlLayerTile({
        source: (layer as OlLayerTile<OlTileSource>).getSource() || undefined,
        properties: {
          originalLayer: layer
        },
        ...layer.getProperties()
      });
      // reset reference to the map instance of original layer
      clone.setMap(null);
      return clone;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (switcherMap) {
        switcherMap.getLayers().clear();
        switcherMap.setTarget(undefined);
        setSwitcherMap(undefined);
      }
    };
  }, [switcherMap]);

  useEffect(() => {
    const mapClone =  new OlMap({
      view: map.getView(),
      controls: []
    });

    setSwitcherMap(mapClone);
  }, [map]);

  useEffect(() => {
    if (switcherMap) {
      switcherMap.getLayers().clear();

      layers
        .map(cloneLayer)
        .forEach(layer => switcherMap.addLayer(layer));
    }

    updateLayerVisibility();
  }, [switcherMap, cloneLayer, layers, updateLayerVisibility]);

  const onSwitcherClick = (evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    evt.stopPropagation();

    layers.forEach((layer, index: number) => {
      if (layer.getVisible()) {
        if (layers.length - 1 === index) {
          visibleLayerIndexRef.current = 0;
        } else {
          visibleLayerIndexRef.current = index + 1;
        }
      }
    });

    updateLayerVisibility();
  };

  const finalClassName = classNameProp
    ? `${className} ${classNameProp}`
    : className;

  if (!switcherMap) {
    return null;
  }

  return (
    <div
      className={finalClassName}
      role="menu"
      {...passThroughProps}
    >
      <div
        className="clip"
        onClick={onSwitcherClick}
        role="button"
      >
        <MapComponent
          mapDivId="layer-switcher-map"
          map={switcherMap}
          role="presentation"
        />
        {
          previewLayer &&
          <span className="layer-title">
            {previewLayer?.get(labelProperty)}
          </span>
        }
      </div>
    </div>
  );
};

export default LayerSwitcher;
