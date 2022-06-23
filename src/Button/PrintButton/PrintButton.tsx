import React, {
  useState
} from 'react';

import { useMap } from '../../Hook/useMap';
import {
  downloadBlob,
  queuePrint,
  getJobStatus
} from '@camptocamp/inkmap';
import SimpleButton, {
  SimpleButtonProps
} from '../SimpleButton/SimpleButton';
import _isFinite from 'lodash/isFinite';

import Logger from '@terrestris/base-util/dist/Logger';
import MapUtil from '@terrestris/ol-util/dist/MapUtil/MapUtil';

import {
  InkmapPrintSpec
} from './InkmapTypes';

interface OwnProps {
  onProgressChange?: (val: number) => void;
  outputFileName?: string;
  dpi?: number;
  size?: InkmapPrintSpec['size'];
  northArrow?: InkmapPrintSpec['northArrow'];
  attributions?: InkmapPrintSpec['attributions'];
  scaleBar?: InkmapPrintSpec['scaleBar'];
}

export type PrintButtonProps = OwnProps & SimpleButtonProps;

const PrintButton: React.FC<PrintButtonProps> = ({
  attributions='bottom-right',
  northArrow='top-right',
  scaleBar={
    position: 'bottom-left',
    units: 'metric'
  },
  dpi = 120,
  onProgressChange,
  outputFileName = 'react-geo-image.png',
  size = [400, 240, 'mm'],
  ...passThroughProps
}) => {

  const [loading, setLoading] = useState<boolean>(false);
  const map = useMap();

  const onPrintClick = async (event: any) => {
    if (!map) {
      return;
    }
    setLoading(true);
    const printConfigByMap = await MapUtil.generatePrintConfig(map);
    const printConfig = {
      ...printConfigByMap,
      size: size,
      dpi: dpi,
      scaleBar: scaleBar,
      northArrow: northArrow,
      attributions: attributions
    };
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
          errorMessage = `${errorMessage} - ${element.url}`;
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
