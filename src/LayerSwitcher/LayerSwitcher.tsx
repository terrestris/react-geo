import './LayerSwitcher.less';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import OlLayerBase from 'ol/layer/Base';

import OlLayerGroup from 'ol/layer/Group';
import OlLayerTile from 'ol/layer/Tile';
import OlMap from 'ol/Map';
import OlTileSource from 'ol/source/Tile';
import View from 'ol/View';

import useMap from '@terrestris/react-util/dist/Hooks/useMap/useMap';


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
  layers,
  className: classNameProp,
  ...passThroughProps
}) => {
  const map = useMap();

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
   * Sets the visibility of the layers in the map and the switcherMap.
   * Also sets the previewLayer in the state.
   */
  const updateLayerVisibility = useCallback(() => {
    layers.forEach((layer, i) => {
      layer.setVisible(visibleLayerIndexRef.current === i);

      const clone = switcherMap?.getAllLayers()
        ?.find(lc => lc.get(identifierProperty) === layer.get(identifierProperty));

      if (!clone) {
        return;
      }

      if ((visibleLayerIndexRef.current + 1) % layers.length === i) {
        clone.setVisible(true);
        setPreviewLayer(clone);
      } else {
        clone.setVisible(false);
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
        switcherMap.setTarget();
        setSwitcherMap(undefined);
      }
    };
  }, [switcherMap]);

  useEffect(() => {
    if (!map) {
      return;
    }

    const mainView = map.getView();
    const projection = mainView.getProjection();
    if (!projection) {
      return;
    }

    // clone view properties so preview map has the same view as the main map
    // but is separated from the main view to prevent event errors
    const viewProps = {
      projection,
      center: mainView.getCenter(),
      zoom: mainView.getZoom(),
      rotation: mainView.getRotation(),
      minZoom: mainView.getMinZoom(),
      maxZoom: mainView.getMaxZoom(),
      minResolution: mainView.getMinResolution(),
      maxResolution: mainView.getMaxResolution(),
      extent: mainView.get('extent')
    };

    const mapClone = new OlMap({
      view: new View(viewProps),
      controls: []
    });

    setSwitcherMap(mapClone);
  }, [map]);

  useEffect(() => {
    if (!map || !switcherMap) {
      return;
    }

    const mainView = map.getView();
    const previewView = switcherMap.getView();

    const synchronizeViews = () => {
      previewView.setCenter(mainView.getCenter());
      previewView.setZoom(mainView.getZoom() ?? 0);
    };

    synchronizeViews();

    mainView.on('change:center', synchronizeViews);
    mainView.on('change:resolution', synchronizeViews);

    return () => {
      mainView.un('change:center', synchronizeViews);
      mainView.un('change:resolution', synchronizeViews);
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

  const cycle = () => {
    const index = layers.findIndex(layer => layer.getVisible());
    visibleLayerIndexRef.current = (index + 1) % layers.length;
    updateLayerVisibility();
  }

  const onSwitcherClick = (evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    evt.stopPropagation();
    cycle();
  };

  const onSwitcherKeyDown = (evt: React.KeyboardEvent<HTMLDivElement>) => {
    if (evt.key === 'Enter' || evt.key === ' ') {
      evt.preventDefault();
      cycle();
    }
  }

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
        onKeyDown={onSwitcherKeyDown}
        tabIndex={0}
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
