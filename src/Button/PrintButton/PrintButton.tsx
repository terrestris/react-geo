import React, {
  useState
} from 'react';

import { useMap } from '../../Hook/useMap';
import {
  downloadBlob,
  queuePrint,
  getJobStatus
} from '@camptocamp/inkmap';
import { Progress } from 'antd';
import SimpleButton from '../SimpleButton/SimpleButton';
import _isFinite from 'lodash/isFinite';

import OlLayer from 'ol/layer/Layer';
import {toLonLat} from 'ol/proj';
import OlMap from 'ol/Map';
import OSM from 'ol/source/OSM';
import WMTS from 'ol/source/WMTS';
import TileWMS from 'ol/source/TileWMS';
import ImageWMS from 'ol/source/ImageWMS';
import VectorSource from 'ol/source/Vector';

import MapUtil from '@terrestris/ol-util/dist/MapUtil/MapUtil';

interface OwnProps {}

export type PrintButtonProps = OwnProps;

export type InkmapLayer = {
  type: 'XYZ' | 'WMTS' | 'WMS' | 'WFS' | 'GeoJSON';
  url: string;
  opacity: number;
  attribution: string;
  layer?: string;
  tiled?: boolean;
}

export type ScaleBarSpec = {
  position: 'bottom-left' | 'bottom-right';
  units: string;
};

export type InkmapProjectionDefinition = {
  name: string;
  bbox: [number, number, number, number];
  proj4: string;
};

export type InkmapPrintSpec = {
  layers: InkmapLayer[];
  size: Array<string|number>; // todo: [number, number] | [number, number, string]
  center: [number, number];
  dpi: number;
  scale: number;
  scaleBar: boolean | ScaleBarSpec;
  northArrow: boolean | string;
  projection: string;
  projectionDefinitions?: InkmapProjectionDefinition[];
  attributions: boolean | 'top-left' | 'bottom-left' | 'bottom-right' | 'top-right';
};

const PrintButton: React.FC<PrintButtonProps> = ({
  ...passThroughProps
}) => {

  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [status, setStatus] = useState<string>('pending');

  const map = useMap();

  console.log('status', status);

  const mapOlLayerToInkmap = (olLayer: OlLayer): InkmapLayer | null => {
    const source = olLayer.getSource();
    if (source instanceof TileWMS) {
      return {
       type: 'WMS',
       url: source.getUrls()?.[0] ?? '',
       opacity: olLayer.getOpacity(), // todo: fix opacity
       attribution: source.getAttributions()?.toString() ?? '', // todo: ...
       layer: source.getParams()?.LAYERS,
       tiled: true
      };
    } else if (source instanceof ImageWMS) {
      return {
        type: 'WMS',
        url: source.getUrl() ?? '',
        opacity: olLayer.getOpacity(),
        attribution: source.getAttributions()?.toString() ?? '', // todo: ...
        layer: 'bla test q123',
        tiled: false
       };
    } else if (source instanceof WMTS) {
      return {
        type: 'WMS',
        url: source.getUrls()?.[0] ?? '',
        opacity: olLayer.getOpacity(),
        attribution: source.getAttributions()?.toString() ?? '', // todo: ...
        layer: 'bla test q123',
        tiled: true
        // todo!
       };
    } else if (source instanceof OSM) {
      return {
        type: 'XYZ',
        url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        opacity: olLayer.getOpacity(),
        attribution: "© OpenStreetMap (www.openstreetmap.org)",
        layer: 'bla test q123',
        tiled: true
       };
    } else if (source instanceof VectorSource) {
      // todo
      return null;
    } else {
      return null;
    }

  };

  const generatePrintConfig = (map: OlMap): InkmapPrintSpec => {
    const unit = map.getView().getProjection().getUnits();
    const resolution = map.getView().getResolution();
    const projection =  map.getView().getProjection().getCode();

    const scale = MapUtil.getScaleForResolution(resolution as number, unit);
    const center = map?.getView().getCenter();
    if (!unit || !center || !_isFinite(resolution)) {
      throw new Error('Can not determine unit / resolution from map');
    }
    const centerLonLat = toLonLat(center, projection) as [number, number];

    const layers: InkmapLayer[] = map.getAllLayers()
      .map(mapOlLayerToInkmap)
      .filter(l => l !== null) as InkmapLayer[]; // todo: remove cast

    console.log('layers', layers);
    const config: InkmapPrintSpec = {
      layers: layers,
      "size": [
        400,
        240,
        "mm"
      ],
      "center": centerLonLat,
      "dpi": 120,
      "scale": scale,
      "scaleBar": {
        "position": "bottom-left",
        "units": "metric"
      },
      "projection": "EPSG:3857",
      "northArrow": "top-right",
      "attributions": "bottom-right"
    };

    return config;
  }

  const onPrintClick = async (event: any) => {
    if (!map) {
      return;
    }
    setLoading(true);
    const printConfig = generatePrintConfig(map);
    const jobId = await queuePrint(printConfig);

    getJobStatus(jobId).subscribe((printStatus: any) => {
      // update the job progress
      setProgress(printStatus.progress * 100);
      setStatus(printStatus.status);

      // job is finished
      if (printStatus.progress === 1) {
        setLoading(false);
        downloadBlob(printStatus.imageBlob, 'react-geo-image.png');
      }

      // display errors
      if (printStatus.sourceLoadErrors.length > 0) {
        let errorMessage = '';
        printStatus.sourceLoadErrors.forEach((element: any) => {
          errorMessage = `${errorMessage} - ${element.url} `;
        });
        console.log('errorMessage', errorMessage);
        // todo: display errors?
      }
    });
  };

  if (!map) {
    return null;
  }

  return (
    <div>
      <SimpleButton
        loading={loading}
        onClick={onPrintClick}
        {...passThroughProps}
      />
      <Progress percent={progress} />
    </div>
  );

};

export default PrintButton;
