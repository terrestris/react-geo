// LayerPreviewContainer.tsx
import React, { useEffect } from 'react';
import OlLayerBase from 'ol/layer/Base';
import OlLayer from 'ol/layer/Layer';
import OlMap from 'ol/Map';
import OlView from 'ol/View';
import OlLayerTile from 'ol/layer/Tile';
import OlLayerImage from 'ol/layer/Image';
import { getUid } from 'ol/util';
import BackgroundLayerMapComponent from './BackgroundLayerMapComponent';
import LayerTitleComponent from './LayerTitleComponent';
import LoadingSpinComponent from './LoadingSpinComponent';
import { Coordinate } from 'ol/coordinate';
import useMap from '../Hook/useMap';

type LayerPreviewProps = {
  layer: OlLayer;
  activeLayer: OlLayer | undefined;
  onClick: (layer: OlLayer) => void;
  zoom?: number;
  center?: Coordinate;
  backgroundLayerFilter: (layer: OlLayerBase) => boolean;
  width?: number;
  height?: number;
};

const LayerPreviewContainer: React.FC<LayerPreviewProps> = ({
  layer,
  activeLayer,
  onClick,
  zoom,
  center,
  backgroundLayerFilter,
  width = 128,
  height = 128,
}) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const mainMap = useMap();
  const previewMap = createPreviewMap(layer, mainMap, zoom, center);

  useEffect(() => {
    const setTrue = () => setLoading(true);
    const setFalse = () => setLoading(false);

    if (previewMap) {
      previewMap.on('loadstart', setTrue);
      previewMap.on('loadend', setFalse);

      return () => {
        previewMap.un('loadstart', setTrue);
        previewMap.un('loadend', setFalse);
      };
    }
  }, [previewMap]);

  useEffect(() => {
    if (previewMap && zoom) {
      previewMap.getView().setZoom(zoom);
    }
    if (previewMap && center) {
      previewMap.getView().setCenter(center);
    }
  }, [previewMap, zoom, center]);

  const isActive = activeLayer ? getUid(layer) === getUid(activeLayer) : false;
  const uid = getUid(layer);

  const handleVisibility = (evt: React.MouseEvent<HTMLDivElement>) => {
    // Update visibility logic here
  };

  return (
    <div
      className={`layer-preview${isActive ? ' selected' : ''}`}
      key={uid}
      data-uid={uid}
      onMouseOver={handleVisibility}
      onMouseLeave={handleVisibility}
      onClick={handleVisibility}
    >
      <LoadingSpinComponent loading={loading} />
      <BackgroundLayerMapComponent
        mapDivId={`previewmap-${uid}`}
        height={height}
        width={width}
        map={previewMap}
      />
      <LayerTitleComponent title={layer.get('name')} />
    </div>
  );
};

const createPreviewMap = (
  layer: OlLayer,
  mainMap: OlMap | null,
  zoom?: number,
  center?: Coordinate
): OlMap | null => {
  if (!mainMap) return null;

  let previewLayer;
  if (layer instanceof OlLayerTile) {
    previewLayer = new OlLayerTile({ source: layer.getSource() });
  } else if (layer instanceof OlLayerImage) {
    previewLayer = new OlLayerImage({ source: layer.getSource() });
  }

  return new OlMap({
    view: new OlView({
      projection: mainMap?.getView().getProjection(),
      resolutions: mainMap?.getView().getResolutions(),
      center,
      zoom
    }),
    controls: [],
    interactions: [],
    layers: previewLayer ? [previewLayer] : undefined
  });
};

export default LayerPreviewContainer;
