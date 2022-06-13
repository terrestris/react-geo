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
// import OlLayer from 'ol/layer/Layer';

interface OwnProps {
}

export type PrintButtonProps = OwnProps;

const PrintButton: React.FC<PrintButtonProps> = ({
  ...passThroughProps
}) => {

  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [status, setStatus] = useState<string>('pending');

  const map = useMap();

  console.log('status', status);

  const onPrintClick = async (event: any) => {
    setLoading(true);
    // todo: get layer from map and map to configuration object
    // const layerSources = map?.getAllLayers().map((l: OlLayer) => l.getSource());
    const printConfig = {
      ... baseConfig
      // layers: layerSources
    };
    const jobId = await queuePrint(printConfig);

    getJobStatus(jobId).subscribe((printStatus: any) => {
      // update the job progress
      setProgress(printStatus.progress * 100);
      setStatus(printStatus.status);
      console.log('printStatus.status', printStatus.status);

      // job is finished
      if (printStatus.progress === 1) {
        setLoading(false);
        downloadBlob(printStatus.imageBlob, 'react-geo-image.png');
      }
    });
  };

  if (!map) {
    return null;
  }

  const baseConfig = {
    "layers": [
      {
        "type": "XYZ",
        "url": "https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        "layer": "OSM",
        "tiled": true,
        "attribution": "© OpenStreetMap (www.openstreetmap.org), Terrestris GmbH"
      }
    ],
    "size": [
      400,
      240,
      "mm"
    ],
    "center": [
      12,
      56
    ],
    "dpi": 120,
    "scale": 20000000,
    "scaleBar": {
      "position": "bottom-left",
      "units": "metric"
    },
    "projection": "EPSG:3857",
    "northArrow": "top-right",
    "attributions": "bottom-right"
  };

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
