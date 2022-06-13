import React, {
  useState
} from 'react';

import { useMap } from '../../Hook/useMap';
import { print, downloadBlob } from '@camptocamp/inkmap';
import SimpleButton from '../SimpleButton/SimpleButton';

interface OwnProps {
}

export type PrintButtonProps = OwnProps;

const PrintButton: React.FC<PrintButtonProps> = ({
  ...passThroughProps
}) => {

  const [loading, setLoading] = useState<boolean>(false);

  const map = useMap();

  const onPrintClick = (event: any) => {
    setLoading(true);
    // todo: get layer from map and map to configuration object
    // const layers = map?.getAllLayers().map((l: OlLayerTile<OlSourceOsm>) => ({
    //   type: 'WMS',
    //   url: l.getSource()?.getUrls()[0]
    // }));
    const printConfig = {
      ... baseConfig,
      // layers: layers
    };
    print(printConfig)
      .then(downloadBlob)
      .then(setLoading(false));
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

  return <SimpleButton
    loading={loading}
    onClick={onPrintClick}
    {...passThroughProps}
  />;

};

export default PrintButton;
