import React, {
  useEffect,
  useRef,
  useState
} from 'react';

import {
  faBan,
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import OlOverviewMap from 'ol/control/OverviewMap';
import OlLayerBase from 'ol/layer/Base';
import OlLayerGroup from 'ol/layer/Group';
import OlLayerImage from 'ol/layer/Image';
import OlLayer from 'ol/layer/Layer';
import OlLayerTile from 'ol/layer/Tile';
import OlMap from 'ol/Map';
import { ObjectEvent } from 'ol/Object';
import OlSourceImageWMS from 'ol/source/ImageWMS';
import OlSourceOSM from 'ol/source/OSM';
import OlSourceTileWMS from 'ol/source/TileWMS';
import OlSourceWMTS from 'ol/source/WMTS';
import OlTilegridWMTS from 'ol/tilegrid/WMTS';
import { getUid } from 'ol/util';
import OlView from 'ol/View';

import { apply as applyMapboxStyle } from 'ol-mapbox-style';

import useMap from '@terrestris/react-util/dist/Hooks/useMap/useMap';

import BackgroundLayerPreview from '../BackgroundLayerPreview/BackgroundLayerPreview';
import SimpleButton from '../Button/SimpleButton/SimpleButton';

import './BackgroundLayerChooser.less';

/**
 * Clone tile-based sources (OSM, TileWMS, WMTS).
 *
 * @param {OlSourceOSM | OlSourceTileWMS | OlSourceWMTS | null} source
 *   The source to clone.
 *
 * @returns {OlSourceOSM | OlSourceTileWMS | OlSourceWMTS | null}
 *   A cloned source instance, or null if cloning is not possible.
 */
const cloneTileSource = (
  source: OlSourceOSM | OlSourceTileWMS | OlSourceWMTS | null
): OlSourceOSM | OlSourceTileWMS | OlSourceWMTS | null => {
  if (source instanceof OlSourceTileWMS) {
    return new OlSourceTileWMS({
      url: source.getUrls()?.[0],
      params: source.getParams(),
      tileLoadFunction: source.getTileLoadFunction()
    });
  }

  if (source instanceof OlSourceOSM) {
    return new OlSourceOSM();
  }

  if (source instanceof OlSourceWMTS) {
    const newTileGrid = source.getTileGrid() as OlTilegridWMTS | null;

    if (!newTileGrid) {
      return null;
    }

    return new OlSourceWMTS({
      url: source.getUrls()?.[0],
      layer: source.getLayer(),
      matrixSet: source.getMatrixSet(),
      format: source.getFormat(),
      tileGrid: newTileGrid,
      style: source.getStyle(),
      requestEncoding: source.getRequestEncoding(),
      version: source.getVersion(),
      dimensions: source.getDimensions(),
      wrapX: source.getWrapX()
    });
  }

  return null;
};

/**
 * Create an overview layer for a Tile layer.
 *
 * @param {OlLayerTile} layer
 *   The selected tile layer to clone for the overview map.
 *
 * @returns {OlLayerTile | null}
 *   A new tile layer instance for the overview, or null if cloning fails.
 */
const createOverviewLayerForTileLayer = (
  layer: OlLayerTile
): OlLayerTile | null => {
  const newSource = cloneTileSource(layer.getSource() as any);

  if (!newSource) {
    return null;
  }

  return new OlLayerTile({
    source: newSource
  });
};

/**
 * Create an overview layer for an ImageWMS layer.
 *
 * @param {OlLayerImage<OlSourceImageWMS>} layer
 *   The selected image layer to replicate for the overview map.
 *
 * @returns {OlLayerImage<OlSourceImageWMS> | null}
 *   A new image layer instance for the overview, or null if unsupported.
 */
const createOverviewLayerForImageLayer = (
  layer: OlLayerImage<OlSourceImageWMS>
): OlLayerImage<OlSourceImageWMS> | null => {
  const selectedLayerSource = layer.getSource();

  if (!(selectedLayerSource instanceof OlSourceImageWMS)) {
    return null;
  }

  return new OlLayerImage<OlSourceImageWMS>({
    source: selectedLayerSource
  });
};

/**
 * Create an overview layer for a group layer, including vector tile groups.
 *
 * @param {OlLayerGroup} layer
 *   The selected group layer to replicate for the overview map.
 *
 * @returns {OlLayerGroup | null}
 *   A new group layer instance for the overview, or null if unsupported.
 */
const createOverviewLayerForGroupLayer = (
  layer: OlLayerGroup
): OlLayerGroup | null => {
  if (layer.get('isVectorTile')) {
    const ovLayer = new OlLayerGroup();
    applyMapboxStyle(ovLayer, layer.get('url'));
    return ovLayer;
  }

  return new OlLayerGroup({
    layers: layer.getLayers()
  });
};

/**
 * Determine the correct overview layer type for the provided selected layer.
 *
 * @param {OlLayer} selectedLayer
 *   The layer chosen by the user as the base layer.
 *
 * @returns {OlLayer | OlLayerGroup | null}
 *   A cloned overview layer, or null if the layer type is unsupported.
 */
const createOverviewLayer = (
  selectedLayer: OlLayer
): OlLayer | OlLayerGroup | null => {
  if (selectedLayer instanceof OlLayerTile) {
    return createOverviewLayerForTileLayer(selectedLayer);
  }

  if (selectedLayer instanceof OlLayerImage) {
    return createOverviewLayerForImageLayer(selectedLayer as any);
  }

  if (selectedLayer instanceof OlLayerGroup) {
    return createOverviewLayerForGroupLayer(selectedLayer);
  }

  return null;
};

/**
 * Create the OpenLayers OverviewMap control containing a single overview layer.
 *
 * @param {OlMap} map
 *   The main map instance to attach the control to.
 *
 * @param {HTMLElement} target
 *   The DOM element to render the overview map into.
 *
 * @param {OlLayer | OlLayerGroup} overviewLayer
 *   The layer to display inside the overview map.
 *
 * @returns {OlOverviewMap}
 *   A fully constructed OverviewMap control.
 */
const createOverviewControl = (
  map: OlMap,
  target: HTMLElement,
  overviewLayer: OlLayer | OlLayerGroup
): OlOverviewMap => {
  return new OlOverviewMap({
    collapsible: false,
    target,
    className: 'ol-overviewmap react-geo-bg-layer-chooser-overviewmap',
    layers: [overviewLayer],
    view: new OlView({
      projection: map.getView().getProjection()
    })
  });
};

export interface BackgroundLayerChooserProps {
  /**
   * Array of layers to be displayed in the BackgroundLayerChooser.
   */
  layers: OlLayer[];
  /**
   * Adds a button that clears the backgroundlayer.
   */
  allowEmptyBackground?: boolean;
  /**
   * Filters the backgroundlayers by a function.
   */
  backgroundLayerFilter?: (layer: OlLayerBase) => boolean;
  /**
   * Select a Layer that should be active initially.
   */
  initiallySelectedLayer?: OlLayer;
  /**
   * Customize the tooltip.
   */
  buttonTooltip?: string;
  /**
   * Sets the title of the No-Background Button
   */
  noBackgroundTitle?: string;
  /**
   * A function that renders the title of the layer.
   * If not provided, the layer's name will be used.
   */
  titleRenderer?: (layer: OlLayer) => React.ReactNode;
}

/**
 * This component supports TileWMS and ImageWMS layers. Besides that, mapbox vector tile layers are
 * also supported in a limited way:
 *
 * * you'll need to render the vector tile layer inside of a group layer
 * * the group layer needs to have a property isVectorTile set to true
 * * the group layer needs to have a property url pointing to the json description
 */
export const BackgroundLayerChooser: React.FC<BackgroundLayerChooserProps> = ({
  layers,
  allowEmptyBackground = false,
  buttonTooltip = 'Change background layer',
  initiallySelectedLayer,
  noBackgroundTitle = 'No Background',
  backgroundLayerFilter = (l: OlLayerBase) => !!l.get('isBackgroundLayer'),
  titleRenderer
}) => {
  const map = useMap();

  const [zoom, setZoom] = useState(map?.getView()?.getZoom());
  const [center, setCenter] = useState(map?.getView()?.getCenter());
  const [layerOptionsVisible, setLayerOptionsVisible] = useState<boolean>(false);
  const [selectedLayer, setSelectedLayer] = useState<OlLayer>();
  const [isBackgroundImage, setIsBackgroundImage] = useState<boolean>(false);

  const mapTarget = useRef(null);

  useEffect(() => {
    if (map && layerOptionsVisible) {
      setCenter(map.getView().getCenter());
      setZoom(map.getView().getZoom());
      const centerListener = (evt: ObjectEvent) => {
        setCenter(evt.target.getCenter());
      };
      const resolutionListener = (evt: ObjectEvent) => {
        setZoom(evt.target.getZoom());
      };
      map.getView().on('change:center', centerListener);
      map.getView().on('change:resolution', resolutionListener);
      return () => {
        map.getView().un('change:center', centerListener);
        map.getView().un('change:resolution', resolutionListener);
      };
    }
    return undefined;
  }, [map, layerOptionsVisible]);

  useEffect(() => {
    if (initiallySelectedLayer) {
      setSelectedLayer(initiallySelectedLayer);
    } else {
      const activeLayerCand = layers.find(l => l.getVisible());
      setSelectedLayer(activeLayerCand as OlLayer);
    }
  }, [initiallySelectedLayer, layers]);

  useEffect(() => {
    if (!selectedLayer || !map) {
      return undefined;
    }

    const overviewLayer = createOverviewLayer(selectedLayer);

    if (!overviewLayer || !mapTarget.current) {
      return undefined;
    }

    const overviewControl = createOverviewControl(
      map as OlMap,
      mapTarget.current,
      overviewLayer
    );

    map.addControl(overviewControl);

    return () => {
      map.removeControl(overviewControl);
    };
  }, [selectedLayer, map]);

  const onLayerSelect = (layer: OlLayer) => {
    setLayerOptionsVisible(false);
    setSelectedLayer(layer);
    setIsBackgroundImage(false);
  };

  const emptyBackgroundWasFocusedRef = useRef(false);
  const handleEmptyBgClick = () => {
    selectedLayer?.setVisible(false);
    setSelectedLayer(undefined);
    // I am unsure why we do hide the layer options,
    // it is different to what we do for the other layer cards
    setLayerOptionsVisible(false);
    setIsBackgroundImage(true);
  };

  return (
    <div className="bg-layer-chooser">
      {
        layerOptionsVisible && (
          <div className="layer-cards">
            {
              layers.filter(backgroundLayerFilter).map(layer => (
                <BackgroundLayerPreview
                  key={getUid(layer)}
                  activeLayer={selectedLayer}
                  onClick={l => onLayerSelect(l)}
                  layer={layer}
                  backgroundLayerFilter={backgroundLayerFilter}
                  zoom={zoom}
                  center={center}
                  titleRenderer={titleRenderer}
                />
              ))
            }
            {
              allowEmptyBackground &&
                <div
                  role="button"
                  tabIndex={0}
                  className={`no-background${selectedLayer ? '' : ' selected'}`}
                  onMouseOver={() => {
                    selectedLayer?.setVisible(false);
                  }}
                  onMouseLeave={() => {
                    selectedLayer?.setVisible(true);
                  }}
                  onFocus={() => {
                    emptyBackgroundWasFocusedRef.current = true;
                  }}
                  onBlur={() => {
                    emptyBackgroundWasFocusedRef.current = false;
                  }}
                  onKeyDown={(e) => {
                    const isEnter = e.key === 'Enter' || e.code === 'Enter';
                    const isSpace = e.key === ' ' || e.key === 'Spacebar' || e.code === 'Space';
                    if (isEnter || isSpace) {
                      if (isSpace) {
                        e.preventDefault();
                      }
                      if (emptyBackgroundWasFocusedRef.current) {
                        handleEmptyBgClick();
                      }
                    }
                  }}
                  onClick={handleEmptyBgClick}
                >
                  <div
                    className="no-background-preview"
                  >
                    <FontAwesomeIcon
                      icon={faBan}
                    />
                  </div>
                  <span
                    className="layer-title"
                  >
                    {noBackgroundTitle}
                  </span>
                </div>
            }
          </div>
        )
      }
      <SimpleButton
        className={`change-bg-btn${layerOptionsVisible ? ' toggled' : ''}`}
        size="small"
        tooltip={buttonTooltip}
        aria-expanded={layerOptionsVisible}
        icon={layerOptionsVisible ?
          <FontAwesomeIcon
            icon={faChevronRight}
          /> :
          <FontAwesomeIcon
            icon={faChevronLeft}
          />
        }
        onClick={() => setLayerOptionsVisible(!layerOptionsVisible)}
      />
      <div
        className="bg-preview"
      >
        {
          !isBackgroundImage ?
            <div
              id="overview-map"
              ref={mapTarget}
            /> :
            <div
              className="no-background-preview"
            >
              <FontAwesomeIcon
                icon={faBan}
              />
            </div>
        }
        {
          selectedLayer ?
            <span
              className="layer-title"
            >
              {titleRenderer ? titleRenderer(selectedLayer) : selectedLayer.get('name')}
            </span> :
            <span
              className="layer-title"
            >
              {noBackgroundTitle}
            </span>
        }
      </div>
    </div>
  );
};

export default BackgroundLayerChooser;
