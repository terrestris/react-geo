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

import {toLonLat} from 'ol/proj';
import ImageWMS from 'ol/source/ImageWMS';
import OlLayer from 'ol/layer/Layer';
import OlMap from 'ol/Map';
import OSM from 'ol/source/OSM';
import TileWMS from 'ol/source/TileWMS';
import VectorSource from 'ol/source/Vector';
import WMTS from 'ol/source/WMTS';

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
  projection?: string;
  matrixSet?: string;
  tileGrid?: any;
  style?: string;
  format?: string;
  requestEncoding?: string;
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
    const opacity = olLayer.getOpacity();
    console.log('opacity', opacity);
    console.log('typeof opacity', typeof opacity);
    if (source instanceof TileWMS) {
      return {
       type: 'WMS',
       url: source.getUrls()?.[0] ?? '',
       opacity: opacity,
       attribution: source.getAttributions()?.toString() ?? '', // todo: ...
       layer: source.getParams()?.LAYERS,
       tiled: true
      };
    } else if (source instanceof ImageWMS) {
      return {
        type: 'WMS',
        url: source.getUrl() ?? '',
        opacity: opacity,
        attribution: source.getAttributions()?.toString() ?? '', // todo: ...
        layer: source.getParams()?.LAYERS,
        tiled: false
       };
    } else if (source instanceof WMTS) {
      const olTileGrid = source.getTileGrid();
      const resolutions = olTileGrid?.getResolutions();
      const matrixIds = resolutions?.map((res, idx) => idx);

      const tileGrid = {
        resolutions: olTileGrid?.getResolutions(),
        extent: olTileGrid?.getExtent(),
        matrixIds: matrixIds
      }

      return {
        type: 'WMTS',
        requestEncoding: source.getRequestEncoding(),
        url: source.getUrls()?.[0] ?? '',
        layer: source.getLayer(),
        projection: source.getProjection().getCode(),
        matrixSet: source.getMatrixSet(),
        tileGrid: tileGrid,
        format: source.getFormat(),
        opacity: opacity,
        attribution: source.getAttributions()?.toString() ?? '', // todo: ...
       };
    } else if (source instanceof OSM) {
      return {
        type: 'XYZ',
        url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        opacity: opacity,
        attribution: "© OpenStreetMap (www.openstreetmap.org)",
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

    console.log('configuredlayers', layers);
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
        console.error('errorMessage', errorMessage);
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
