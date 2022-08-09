import React, {
  useEffect,
  useState
} from 'react';

import _isEqual from 'lodash/isEqual';
import Logger from '@terrestris/base-util/dist/Logger';
import { ArrayTwoOrMore } from '@terrestris/base-util/dist/types';

import OlMap from 'ol/Map';
import OlLayerGroup from 'ol/layer/Group';
import OlLayer from 'ol/layer/Layer';
import OlLayerTile from 'ol/layer/Tile';
import OlLayerImage from 'ol/layer/Image';
import OlSourceImage from 'ol/source/Image';
import OlSourceTile from 'ol/source/Tile';
import OlSource from 'ol/source/Source';

import { CSS_PREFIX } from '../constants';

import useMap from '../Hook/useMap';
import MapComponent from '../Map/MapComponent/MapComponent';

import './LayerSwitcher.less';

export interface OwnProps {
  /**
   * An optional CSS class which will be added to the wrapping div Element.
   */
  className?: string;
  /**
   * The layers to be available in the switcher.
   */
  layers: ArrayTwoOrMore<OlLayer<OlSource> | OlLayerGroup>;
  /**
   * The main map the layers should be synced with.
   */
  map: OlMap;
}

export type LayerSwitcherProps = OwnProps & React.HTMLAttributes<HTMLDivElement>;

/**
 * A basic component to switch between the passed layers.
 * This is most likely used for background layers.
 *
 * @extends React.FC
 */
export const ProjectLayerSwitcher: React.FC<LayerSwitcherProps> = ({
  layers,
  className,
  ...passThroughProps
}): JSX.Element => {
  const map = useMap();

  const [previewLayer, setPreviewLayer] = useState<OlLayer<OlSource> | OlLayerGroup | null>();
  const [visibleLayerIndex, setVisibleLayerIndex] = useState<number>(0);
  const [layerClones, setLayerClones] = useState<Array<OlLayer<OlSource> | OlLayerGroup>>([]);

  const internalClassName = `${CSS_PREFIX}layer-switcher`;

  if (!map) {
    return <></>;
  }

  if (!layers || layers.length !== 2) {
    return <></>;
  }

  /**
   * Clones a layer.
   */
  const cloneLayer = (layer: OlLayer<OlSource> | OlLayerGroup): OlLayer<OlSource> | OlLayerGroup => {
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
    } else if (layer instanceof OlLayerTile) {
      const clone = new OlLayerTile({
        source: (layer as OlLayerTile<OlSourceTile>).getSource() || undefined,
        properties: {
          originalLayer: layer
        },
        ...layer.getProperties()
      });
      // reset reference to the map instance of original layer
      clone.setMap(null);
      return clone;
    } else if (layer instanceof OlLayerImage) {
      const clone = new OlLayerImage({
        source: (layer as OlLayerImage<OlSourceImage>).getSource() || undefined,
        properties: {
          originalLayer: layer
        },
        ...layer.getProperties()
      });
      // reset reference to the map instance of original layer
      clone.setMap(null);
      return clone;
    } else {
      throw new Error('Layertype not supported');
    }
  };

  /**
   * (Re-)adds the layers to the preview map and sets the visibleLayerIndex.
   */
  const setMapLayers = () => {
    if (layers.length < 2) {
      Logger.warn('LayerSwitcher requires two or more layers.');
    }
    map?.getLayers().clear();

    const clones = layers.map((layer, index) => {
      const layerClone = cloneLayer(layer);
      if (layerClone.getVisible()) {
        setVisibleLayerIndex(index);
      }
      map.addLayer(layerClone);
      return layerClone;
    });
    setLayerClones(clones);
  };

  /**
   * Sets the visiblity of the layers in the props.map and this._map.
   * Also sets the previewLayer in the state.
   */
  const updateLayerVisibility = () => {
    layers.forEach((l, i) => {
      const clone = layerClones.find(lc => lc.get('name') === l.get('name'));
      l.setVisible(visibleLayerIndex === i);
      if (clone) {
        clone.setVisible(visibleLayerIndex === i);
        if (visibleLayerIndex === i) {
          setPreviewLayer(clone);
        }
      }
    });
  };

  const onSwitcherClick = (evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    evt.stopPropagation();
    map?.getLayers().getArray().forEach((layer, index: number) => {
      if (layer.getVisible()) {
        if (layerClones.length - 1 === index) {
          setVisibleLayerIndex(0);
        } else {
          setVisibleLayerIndex(index + 1);
        }
      }
    });
    updateLayerVisibility();
  };

  useEffect(() => {
    setMapLayers();
    updateLayerVisibility();

    // return () => {
    //   // Destroy all map specific stuff when umounting the component.
    //   if (map) {
    //     map.getLayers().clear();
    //     map.setTarget(undefined);
    //   }
    // };
  }, [layers, map]);

  const finalClassName = className ? `${className} ${internalClassName}` : internalClassName;

  return (
    <div
      className={finalClassName}
      {...passThroughProps}
    >
      <div
        className="clip"
        onClick={onSwitcherClick}
        role="button"
      >
        <MapComponent
          mapDivId="layer-switcher-map"
          map={map}
          role="img"
        />
        {
          previewLayer && (
            <span className="layer-title">
              {previewLayer.get('name')}
            </span>
          )
        }
      </div>
    </div>
  );
};

export default ProjectLayerSwitcher;
