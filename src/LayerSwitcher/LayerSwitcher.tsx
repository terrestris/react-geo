import './LayerSwitcher.less';

import MapComponent from '@terrestris/react-util/dist/Components/MapComponent/MapComponent';
import OlLayerBase from 'ol/layer/Base';
import OlLayerGroup from 'ol/layer/Group';
import OlLayerTile from 'ol/layer/Tile';
import OlMap from 'ol/Map';
import OlTileSource from 'ol/source/Tile';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { CSS_PREFIX } from '../constants';

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
 * Class representing the LayerSwitcher.
 * A basic component to switch between the passed layers.
 * This is most likely to be used for the backgroundlayer.
 *
 * @class LayerSwitcher
 * @extends React.Component
 */
export const LayerSwitcher: React.FC<LayerSwitcherProps> = ({
  identifierProperty = 'name',
  labelProperty = 'name',
  map,
  layers,
  className: classNameProp,
  ...passThroughProps
}) => {

  /**
   * The internal map of the LayerSwitcher
   * @private
   */
  const [switcherMap, setSwitcherMap] = useState<OlMap>();

  /**
   * The internal index of visible layer in provided layers array. If all passed
   * layers are initially invisible, the first layer in array will be taken as
   * default.
   * @private
   */
  const visibleLayerIndexRef = useRef<number>(0);

  const [previewLayer, setPreviewLayer] = useState<OlLayerBase>();

  /**
   * The className added to this component.
   * @private
   */
  const className = `${CSS_PREFIX}layer-switcher`;

  /**
   * Sets the visiblity of the layers in the props.map and this._map.
   * Also sets the previewLayer in the state.
   *
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

  /**
   * Clones a layer
   *
   * @param layer The layer to clone.
   * @returns The cloned layer.
   */
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
    const mapClone =  new OlMap({
      view: map.getView(),
      controls: []
    });
    setSwitcherMap(mapClone);
    return () => {
      if (switcherMap) {
        switcherMap.getLayers().clear();
        switcherMap.setTarget(undefined);
        setSwitcherMap(undefined);
      }
    };
  }, [map, switcherMap]);

  useEffect(() => {
    if (switcherMap) {
      switcherMap.getLayers().clear();
      layers
        .map(cloneLayer)
        .forEach(layer => switcherMap.addLayer(layer));
    }
    updateLayerVisibility();
  }, [switcherMap, cloneLayer, layers, updateLayerVisibility]);

  /**
   * Clickhandler for the overview switch.
   *
   */
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

  /**
   * The render function.
   */
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
