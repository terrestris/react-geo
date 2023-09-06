import './BackgroundLayerChooser.less';

import {
  faChevronLeft,
  faChevronRight,
  faBan
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import OlOverviewMap from 'ol/control/OverviewMap';
import OlLayerBase from 'ol/layer/Base';
import OlLayerImage from 'ol/layer/Image';
import OlLayer from 'ol/layer/Layer';
import OlLayerTile from 'ol/layer/Tile';
import { ObjectEvent } from 'ol/Object';
import { getUid } from 'ol/util';
import OlView from 'ol/View';
import React, {
  useEffect,
  useRef,
  useState} from 'react';

import BackgroundLayerPreview from '../BackgroundLayerPreview/BackgroundLayerPreview';
import SimpleButton from '../Button/SimpleButton/SimpleButton';
import useMap from '../Hook/useMap';

export type BackgroundLayerChooserProps = {
  /**
   * Array of layers to be displayed in the BackgroundLayerChooser.
   */
  layers: OlLayer[];
  /**
   * Adds a button that clears the backgroundlayer.
   */
  allowEmptyBackground?: boolean;
  /**
   * Customize the tooltip.
   */
  buttonTooltip?: string;
  /**
   * Filters the backgroundlayers by a function.
   */
  backgroundLayerFilter?: (layer: OlLayerBase) => boolean;
  /**
   * Select a Layer that should be active initially.
   */
  initiallySelectedLayer?: OlLayer;
  /**
   * Sets the title of the No-Background Button
   */
  noBackgroundTitle?: string;
};

export const BackgroundLayerChooser: React.FC<BackgroundLayerChooserProps> = ({
  layers,
  allowEmptyBackground = false,
  buttonTooltip = 'Change background layer',
  initiallySelectedLayer,
  noBackgroundTitle = 'No Background',
  backgroundLayerFilter = (l: OlLayerBase) => !!l.get('isBackgroundLayer')
}) => {

  const map = useMap();
  const mapTarget = useRef(null);
  const [zoom, setZoom] = useState(map?.getView()?.getZoom());
  const [center, setCenter] = useState(map?.getView()?.getCenter());
  const [layerOptionsVisible, setLayerOptionsVisible] = useState<boolean>(false);
  const [selectedLayer, setSelectedLayer] = useState<OlLayer | undefined>(initiallySelectedLayer);
  const [isBackgroundImage, setIsBackgroundImage] = useState<boolean>(false);

  useEffect(() => {
    if (map) {
      const centerListener = (evt: ObjectEvent) => {
        if (layerOptionsVisible) {
          setCenter(evt.target.getCenter());
        }
      };
      const resolutionListener = (evt: ObjectEvent) => {
        if (layerOptionsVisible) {
          setZoom(evt.target.getZoom());
        }
      };
      map.getView().on('change:center', centerListener);
      map.getView().on('change:resolution', resolutionListener);
      return () => {
        map.getView().un('change:center', centerListener);
        map.getView().un('change:resolution', resolutionListener);
      };
    }
    return;
  }, [map, layerOptionsVisible]);

  useEffect(() => {
    const activeLayerCand = layers.find(l => l.getVisible());

    if (!initiallySelectedLayer) {
      setSelectedLayer(activeLayerCand as OlLayer);
    }
  }, [layers]);

  useEffect(() => {
    if (selectedLayer && map) {
      const existingControl = map.getControls().getArray()
        .find(c => c instanceof OlOverviewMap);
      if (existingControl) {
        map.removeControl(existingControl);
      }
      let ovLayer;
      if (selectedLayer instanceof OlLayerTile) {
        ovLayer = new OlLayerTile({
          source: selectedLayer.getSource()
        });
      } else if (selectedLayer instanceof OlLayerImage) {
        ovLayer = new OlLayerImage({
          source: selectedLayer.getSource()
        });
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
      }
    }
  }, [selectedLayer]);

  const onLayerSelect = (layer: OlLayer) => {
    setLayerOptionsVisible(false);
    setSelectedLayer(layer);
    setIsBackgroundImage(false);
  };

  return (
    <div className={'bg-layer-chooser'}>
      {
        <div
          className="layer-cards"
          style={{
            maxWidth: layerOptionsVisible ? '100vw' : 0,
            opacity: layerOptionsVisible ? 1 : 0,
            visibility: layerOptionsVisible ? 'visible' : 'hidden'
          }}
        >
          {layers.map(layer => {
            return (
              <BackgroundLayerPreview
                key={getUid(layer)}
                activeLayer={selectedLayer}
                onClick={l => onLayerSelect(l)}
                layer={layer}
                backgroundLayerFilter={backgroundLayerFilter}
                zoom={zoom}
                center={center}
              />
            );
          })
          }
          {allowEmptyBackground &&
            <SimpleButton
              onMouseOver={() => {
                selectedLayer?.setVisible(false);
              }}
              onClick={() => {
                selectedLayer?.setVisible(false);
                setSelectedLayer(undefined);
                setLayerOptionsVisible(false);
                setIsBackgroundImage(true);
              }}
              className='no-background'
            >
              <FontAwesomeIcon icon={faBan} size='5x' />
              <br></br>
              <span className="layer-title">{noBackgroundTitle}</span>
            </SimpleButton>
          }
        </div>
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
      <div className="bg-preview">
        <div className='overview-wrapper'>
          {!isBackgroundImage ?
            <div id="overview-map" ref={mapTarget}
            /> :
            <FontAwesomeIcon className='no-background-preview' icon={faBan} size='5x' />
          }
          {selectedLayer ?
            <span className="layer-title">{selectedLayer.get('name')}</span> :
            <span className="layer-title-no-background">{noBackgroundTitle}</span>
          }
        </div>
      </div>
    </div>
  );
};

export default BackgroundLayerChooser;
