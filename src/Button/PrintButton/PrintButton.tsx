import React, {
  useState
} from 'react';

import { useMap } from '../../Hook/useMap';
import {
  downloadBlob,
  queuePrint,
  getJobStatus
} from '@camptocamp/inkmap';
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
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';

import OpenLayersParser from 'geostyler-openlayers-parser';

import MapUtil from '@terrestris/ol-util/dist/MapUtil/MapUtil';
import Logger from '@terrestris/base-util/dist/Logger';

import {
  WmsLayer,
  WmtsLayer,
  OsmLayer,
  GeoJsonLayer,
  InkmapLayer,
  InkmapPrintSpec
} from './InkmapTypes';

interface OwnProps {
  onProgressChange?: (val: number) => void;
  outputFileName?: string;
  dpi?: number;
  size?: InkmapPrintSpec['size'];
}

export type PrintButtonProps = OwnProps;

const PrintButton: React.FC<PrintButtonProps> = ({
  dpi = 120,
  onProgressChange,
  outputFileName = 'react-geo-image.png',
  size = [400, 240, 'mm'],
  ...passThroughProps
}) => {

  const [loading, setLoading] = useState<boolean>(false);
  const map = useMap();

  const mapOlLayerToInkmap = async (olLayer: OlLayer): Promise<InkmapLayer | null> => {
    const source = olLayer.getSource();
    const opacity = olLayer.getOpacity();

    if (source instanceof TileWMS) {
      const tileWmsLayer: WmsLayer = {
        type: 'WMS',
        url: source.getUrls()?.[0] ?? '',
        opacity: opacity,
        attribution: '', // todo: get attributions from source
        layer: source.getParams()?.LAYERS,
        tiled: true
      };
      return tileWmsLayer;
    } else if (source instanceof ImageWMS) {
      const imageWmsLayer: WmsLayer = {
        type: 'WMS',
        url: source.getUrl() ?? '',
        opacity: opacity,
        attribution: '', // todo: get attributions from source
        layer: source.getParams()?.LAYERS,
        tiled: false
      };
      return imageWmsLayer;
    } else if (source instanceof WMTS) {
      const olTileGrid = source.getTileGrid();
      const resolutions = olTileGrid?.getResolutions();
      const matrixIds = resolutions?.map((res, idx) => idx);

      const tileGrid = {
        resolutions: olTileGrid?.getResolutions(),
        extent: olTileGrid?.getExtent(),
        matrixIds: matrixIds
      };

      const wmtsLayer: WmtsLayer = {
        type: 'WMTS',
        requestEncoding: source.getRequestEncoding(),
        url: source.getUrls()?.[0] ?? '',
        layer: source.getLayer(),
        projection: source.getProjection().getCode(),
        matrixSet: source.getMatrixSet(),
        tileGrid: tileGrid,
        format: source.getFormat(),
        opacity: opacity,
        attribution: '', // todo: get attributions from source
      };
      return wmtsLayer;
    } else if (source instanceof OSM) {
      const osmLayer: OsmLayer = {
        type: 'XYZ',
        url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        opacity: opacity,
        attribution: '© OpenStreetMap (www.openstreetmap.org)',
        tiled: true
      };
      return osmLayer;
    } else if (source instanceof VectorSource) {
      const geojson = new GeoJSON().writeFeaturesObject(source.getFeatures()) as any;
      const parser = new OpenLayersParser();
      const config: GeoJsonLayer = {
        type: 'GeoJSON',
        geojson: geojson,
        style: undefined,
        attribution: ''
      };

      let olStyle = null;

      if (olLayer instanceof VectorLayer) {
        olStyle = olLayer.getStyle();
      }

      // todo: support stylefunction / different styles per feature
      // const styles = source.getFeatures()?.map(f => f.getStyle());

      if (olStyle) {
        // todo: gs-ol-parser does not support style with both fill and stroke defined
        const gsStyle = await parser.readStyle(olStyle);
        if (gsStyle.errors) {
          Logger.error('Geostyler errors: ', gsStyle.errors);
        }
        if (gsStyle.warnings) {
          Logger.warn('Geostyler warnings: ', gsStyle.warnings);
        }
        if (gsStyle.unsupportedProperties) {
          Logger.warn('Detected unsupported style properties: ', gsStyle.unsupportedProperties);
        }
        config.style = gsStyle.output;
      }
      return config;
    }
    return null;
  };

  const generatePrintConfig = async (olMap: OlMap): Promise<InkmapPrintSpec | null> => {
    const unit = olMap.getView().getProjection().getUnits();
    const resolution = olMap.getView().getResolution();
    const projection =  olMap.getView().getProjection().getCode();

    const scale = MapUtil.getScaleForResolution(resolution as number, unit);
    const center = olMap?.getView().getCenter();
    if (!unit || !center || !_isFinite(resolution)) {
      throw new Error('Can not determine unit / resolution from map');
    }
    const centerLonLat = toLonLat(center, projection) as [number, number];

    const layerPromises = olMap.getAllLayers()
      .map(mapOlLayerToInkmap);

    return Promise.all(layerPromises)
      .then((responses) => {
        const layers: InkmapLayer[] = responses.filter(l => l !== null) as InkmapLayer[];
        const config: InkmapPrintSpec = {
          layers: layers,
          size: size,
          center: centerLonLat,
          dpi: dpi,
          scale: scale,
          scaleBar: { // todo: make configurable
            position: 'bottom-left',
            units: 'metric'
          },
          projection: projection,
          northArrow: 'top-right', // todo: make configurable
          attributions: 'bottom-right' // todo: make configurable
        };
        return Promise.resolve(config);
      })
      .catch((error: any) => {
        Logger.error(error);
        return Promise.reject();
      });
  };

  const onPrintClick = async (event: any) => {
    if (!map) {
      return;
    }
    setLoading(true);
    const printConfig = await generatePrintConfig(map);
    const jobId = await queuePrint(printConfig);

    getJobStatus(jobId).subscribe((printStatus: any) => {
      // update the job progress
      const progressPercent = Math.round(printStatus.progress * 100);
      if (onProgressChange) {
        onProgressChange(progressPercent);
      }

      if (printStatus.progress === 1) {
        // job is finished
        setLoading(false);
        downloadBlob(printStatus.imageBlob, outputFileName);
      }

      if (printStatus.sourceLoadErrors.length > 0) {
        // display errors
        let errorMessage = '';
        printStatus.sourceLoadErrors.forEach((element: any) => {
          errorMessage = `${errorMessage} - ${element.url} `;
        });
        Logger.error('Inkmap error: ', errorMessage);
      }
    });
  };

  if (!map) {
    return null;
  }

  return (
    <SimpleButton
      loading={loading}
      onClick={onPrintClick}
      {...passThroughProps}
    />
  );

};

export default PrintButton;
