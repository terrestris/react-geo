import React, { useState, useEffect } from 'react';

import OlLayerBase from 'ol/layer/Base';
import OlLayer from 'ol/layer/Layer';
import OlMap from 'ol/Map';
import OlView from 'ol/View';
import OlLayerTile from 'ol/layer/Tile';
import OlLayerImage from 'ol/layer/Image';
import { getUid } from 'ol/util';

import { Spin } from 'antd';

import './BackgroundLayerPreview.less';
import { Coordinate } from 'ol/coordinate';
import useMap from '../Hook/useMap';
import MapComponent from '../Map/MapComponent/MapComponent';

export type BackgroundLayerPreviewProps = {
  width?: number;
  height?: number;
  layer: OlLayer;
  activeLayer: OlLayer;
  onClick: (l: OlLayer) => void;
  zoom?: number;
  center?: Coordinate;
  backgroundLayerFilter: (l: OlLayerBase) => boolean;
};

export const BackgroundLayerPreview: React.FC<BackgroundLayerPreviewProps> = ({
  layer,
  activeLayer,
  width = 128,
  height = 128,
  onClick,
  zoom,
  center,
  backgroundLayerFilter
}) => {

  let previewLayer;

  if (layer instanceof OlLayerTile) {
    previewLayer = new OlLayerTile({
      source: layer.getSource()
    });
  } else if (layer instanceof OlLayerImage){
    previewLayer = new OlLayerImage({
      source: layer.getSource()
    });
  }

  const mainMap = useMap();
  const [previewMap] = useState(new OlMap({
    view: new OlView({
      projection: mainMap?.getView().getProjection(),
      resolutions: mainMap?.getView().getResolutions(),
      center: center,
      zoom: zoom
    }),
    controls: [],
    interactions: [],
    layers: previewLayer && [previewLayer]
  }));

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // @ts-ignore
    previewMap.on('loadstart', () => setLoading(true));
    // @ts-ignore
    previewMap.on('loadend', () => setLoading(false));
  }, [previewMap]);

  useEffect(() => {
    if (zoom ) {
      previewMap.getView().setZoom(zoom);
    }
    if (center) {
      previewMap.getView().setCenter(center);
    }
  }, [zoom, center]);

  const getBgLayersFromMap = (): OlLayer[] => {
    return mainMap?.getLayerGroup().getLayers()
      .getArray().filter(backgroundLayerFilter) as OlLayer[] || [];
  };

  const updateBgLayerVisibility = (evt: React.MouseEvent<HTMLDivElement>) => {
    const target = evt?.currentTarget;
    const layerId = target.dataset.uid;

    if (!layerId) {
      return;
    }

    const newBgLayer = mainMap?.getLayerGroup().getLayers().getArray()
      .find(l => getUid(l) === layerId);

    if (!newBgLayer) {
      return;
    }

    getBgLayersFromMap().forEach(l => l.setVisible(false));
    newBgLayer.setVisible(true);

    if (evt.type === 'click') {
      onClick(newBgLayer as OlLayer);
    }

  };

  const restoreBgLayerVisibility = () => {
    getBgLayersFromMap().forEach(l => l.setVisible(false));
    activeLayer.setVisible(true);
  };

  const uid = getUid(layer);
  const activeUid = getUid(activeLayer);
  const isActive = uid === activeUid;

  return (
    <div
      className={`layer-preview${isActive ? ' selected' : ''}`}
      key={uid}
      data-uid={uid}
      onMouseOver={updateBgLayerVisibility}
      onMouseLeave={restoreBgLayerVisibility}
      onClick={updateBgLayerVisibility}
    >
      <Spin spinning={loading}>
        <MapComponent
          mapDivId={'previewmap-' + uid}
          style={{
            height,
            width
          }}
          map={previewMap}
        />
        <span className="layer-title">
          {layer.get('name')}
        </span>
      </Spin>
    </div>
  );
};
export default BackgroundLayerPreview;
