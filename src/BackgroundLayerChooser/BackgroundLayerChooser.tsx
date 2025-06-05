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
    const activeLayerCand = layers.find(l => l.getVisible());

    if (!initiallySelectedLayer) {
      setSelectedLayer(activeLayerCand as OlLayer);
    }
  }, [initiallySelectedLayer, layers]);

  useEffect(() => {
    if (!selectedLayer || !map) {
      return undefined;
    }
    const selectedLayerSource = selectedLayer.getSource();

    let ovLayer: OlLayer | OlLayerGroup | null = null;

    if (selectedLayer instanceof OlLayerTile) {
      let newSource: OlSourceOSM | OlSourceTileWMS | OlSourceWMTS | null = null;

      if (selectedLayerSource instanceof OlSourceTileWMS) {
        newSource = new OlSourceTileWMS({
          url: selectedLayerSource.getUrls()?.[0],
          params: selectedLayerSource.getParams(),
          tileLoadFunction: selectedLayerSource.getTileLoadFunction()
        });
      } else if (selectedLayerSource instanceof OlSourceOSM) {
        newSource = new OlSourceOSM();
      } else if (selectedLayerSource instanceof OlSourceWMTS) {
        const newTileGrid = selectedLayerSource.getTileGrid() as OlTilegridWMTS | null;

        if (!newTileGrid) {
          return;
        }

        newSource = new OlSourceWMTS({
          url: selectedLayerSource.getUrls()?.[0],
          layer: selectedLayerSource.getLayer(),
          matrixSet: selectedLayerSource.getMatrixSet(),
          format: selectedLayerSource.getFormat(),
          tileGrid: newTileGrid,
          style: selectedLayerSource.getStyle(),
          requestEncoding: selectedLayerSource.getRequestEncoding(),
          version: selectedLayerSource.getVersion(),
          dimensions: selectedLayerSource.getDimensions(),
          wrapX: selectedLayerSource.getWrapX()
        });
      }

      if (newSource) {
        ovLayer = new OlLayerTile({
          source: newSource
        });
      }
    } else if (selectedLayer instanceof OlLayerImage) {
      let newSource: OlSourceImageWMS | null = null;

      if (selectedLayerSource instanceof OlSourceImageWMS) {
        newSource = new OlSourceImageWMS({
          url: selectedLayerSource.getUrl(),
          params: selectedLayerSource.getParams(),
          imageLoadFunction: selectedLayerSource.getImageLoadFunction()
        });
      }

      if (newSource) {
        ovLayer = new OlLayerImage({
          source: selectedLayer.getSource()
        });
      }
    } else if (selectedLayer instanceof OlLayerGroup) {
      if (selectedLayer.get('isVectorTile')) {
        ovLayer = new OlLayerGroup();
        applyMapboxStyle(ovLayer, selectedLayer.get('url'));
      } else {
        ovLayer = new OlLayerGroup({
          layers: selectedLayer.getLayers()
        });
      }
    }

    if (ovLayer && mapTarget.current) {
      const overViewControl = new OlOverviewMap({
        collapsible: false,
        target: mapTarget.current,
        className: 'ol-overviewmap react-geo-bg-layer-chooser-overviewmap',
        layers: [ovLayer],
        view: new OlView({
          projection: map.getView().getProjection()
        })
      });

      map.addControl(overViewControl);

      return () => {
        map.removeControl(overViewControl);
      };
    }

    return undefined;
  }, [selectedLayer, map]);

  const onLayerSelect = (layer: OlLayer) => {
    setLayerOptionsVisible(false);
    setSelectedLayer(layer);
    setIsBackgroundImage(false);
  };

  return (
    <div className="bg-layer-chooser">
      {
        layerOptionsVisible && (
          <div className="layer-cards">
            {
              layers.map(layer => (
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
                  className={`no-background${selectedLayer ? '' : ' selected'}`}
                  onMouseOver={() => {
                    selectedLayer?.setVisible(false);
                  }}
                  onMouseLeave={() => {
                    selectedLayer?.setVisible(true);
                  }}
                  onClick={() => {
                    selectedLayer?.setVisible(false);
                    setSelectedLayer(undefined);
                    setLayerOptionsVisible(false);
                    setIsBackgroundImage(true);
                  }}
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
