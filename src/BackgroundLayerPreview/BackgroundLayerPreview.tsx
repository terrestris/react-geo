import './BackgroundLayerPreview.less';

import React, {
  useEffect,
  useMemo,
  useState
} from 'react';

import { Spin } from 'antd';

import { Coordinate } from 'ol/coordinate';
import OlLayerBase from 'ol/layer/Base';
import OlLayerGroup from 'ol/layer/Group';
import OlLayerImage from 'ol/layer/Image';
import OlLayer from 'ol/layer/Layer';
import OlLayerTile from 'ol/layer/Tile';
import OlMap from 'ol/Map';
import { getUid } from 'ol/util';
import OlView from 'ol/View';

import { MapUtil } from '@terrestris/ol-util';

import useMap from '@terrestris/react-util/dist/Hooks/useMap/useMap';

import MapComponent from '../Map/MapComponent/MapComponent';

export interface BackgroundLayerPreviewProps {
  width?: number;
  height?: number;
  layer: OlLayer;
  activeLayer?: OlLayer;
  onClick: (l: OlLayer) => void;
  zoom?: number;
  center?: Coordinate;
  backgroundLayerFilter: (l: OlLayerBase) => boolean;
  titleRenderer?: (layer: OlLayer) => React.ReactNode;
}

export const BackgroundLayerPreview: React.FC<BackgroundLayerPreviewProps> = ({
  layer,
  activeLayer,
  width = 128,
  height = 128,
  onClick,
  zoom,
  center,
  backgroundLayerFilter,
  titleRenderer
}) => {

  const [loading, setLoading] = useState(false);

  const mainMap = useMap();

  const previewLayer = useMemo(() => {
    if (layer instanceof OlLayerTile) {
      return new OlLayerTile({
        source: layer.getSource()
      });
    } else if (layer instanceof OlLayerImage) {
      return new OlLayerImage({
        source: layer.getSource()
      });
    }
    return undefined;
  }, [layer]);

  const previewMap = useMemo(() => {
    return new OlMap({
      view: new OlView({
        projection: mainMap?.getView().getProjection(),
        resolutions: mainMap?.getView().getResolutions(),
        center: center,
        zoom: zoom
      }),
      controls: [],
      interactions: [],
      layers: previewLayer && [previewLayer]
    });
  }, [center, mainMap, previewLayer, zoom]);

  useEffect(() => {
    const setTrue = () => setLoading(true);
    const setFalse = () => setLoading(false);
    previewMap.on('loadstart', setTrue);
    previewMap.on('loadend', setFalse);

    return () => {
      previewMap.un('loadstart', setTrue);
      previewMap.un('loadend', setFalse);
    };
  }, [previewMap]);

  useEffect(() => {
    if (zoom) {
      previewMap.getView().setZoom(zoom);
    }
    if (center) {
      previewMap.getView().setCenter(center);
    }
  }, [zoom, center, previewMap]);

  const getBgLayersFromMap = (): OlLayer[] => {
    const collectBgLayers = (layerGroup: OlLayerGroup | undefined): OlLayer[] => {
      if (!layerGroup) {
        return [];
      }

      const layers: OlLayer[] = [];
      const layerArray = layerGroup.getLayers().getArray();

      for (const l of layerArray) {
        if (backgroundLayerFilter(l)) {
          layers.push(l as OlLayer);
        }

        if (l instanceof OlLayerGroup) {
          layers.push(...collectBgLayers(l));
        }
      }

      return layers;
    };

    const mainLayerGroup = mainMap?.getLayerGroup();
    return mainLayerGroup ? collectBgLayers(mainLayerGroup) : [];
  };

  const updateBgLayerVisibility = (evt: React.MouseEvent<HTMLDivElement>) => {
    const target = evt?.currentTarget;
    const layerId = target?.dataset?.uid;

    if (!layerId || !mainMap) {
      return;
    }

    const newBgLayer = MapUtil.getLayerByOlUid(mainMap, layerId);

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
    activeLayer?.setVisible(true);
  };

  let isActive = false;
  const uid = getUid(layer);
  if (activeLayer) {
    const activeUid = getUid(activeLayer);
    isActive = uid === activeUid;
  }

  return (
    <div
      className={`layer-preview${isActive ? ' selected' : ''}`}
      key={uid}
      data-uid={uid}
      onMouseOver={updateBgLayerVisibility}
      onMouseLeave={restoreBgLayerVisibility}
      onClick={updateBgLayerVisibility}
    >
      <Spin
        spinning={loading}
      >
        <MapComponent
          mapDivId={`previewmap-${uid}`}
          style={{
            height,
            width
          }}
          map={previewMap}
        />
        <span
          className="layer-title"
        >
          {titleRenderer ? titleRenderer(layer) : layer.get('name')}
        </span>
      </Spin>
    </div>
  );
};

export default BackgroundLayerPreview;
