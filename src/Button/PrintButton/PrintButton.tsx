import Logger from '@terrestris/base-util/dist/Logger';
import { InkmapPrintSpec } from '@terrestris/ol-util/dist/LayerUtil/InkmapTypes';
import useMap from '@terrestris/react-util/dist/Hooks/useMap/useMap';
import { PrintUtil } from '@terrestris/react-util/dist/Util/PrintUtil';
import { jsPDF } from 'jspdf';
import _isFinite from 'lodash/isFinite';
import _isString from 'lodash/isString';
import React, {
  useState
} from 'react';

import SimpleButton, {
  SimpleButtonProps
} from '../SimpleButton/SimpleButton';

interface OwnProps {
  onProgressChange?: (val: number) => void;
  outputFileName?: string;
  format?: 'png' | 'pdf';
  dpi?: number;
  mapSize: InkmapPrintSpec['size'];
  northArrow?: InkmapPrintSpec['northArrow'];
  attributions?: InkmapPrintSpec['attributions'];
  scaleBar?: InkmapPrintSpec['scaleBar'];
  title?: string;
  legendTitle?: string;
  pdfPrintFunc?: (mapImgUrl: string, pdfSpec: any, title: string, legendTitle: string) => Promise<jsPDF>;
}

export type PrintButtonProps = OwnProps & SimpleButtonProps;

const PrintButton: React.FC<PrintButtonProps> = ({
  attributions = 'bottom-right',
  northArrow = 'top-right',
  scaleBar = {
    position: 'bottom-left',
    units: 'metric'
  },
  dpi = 120,
  onProgressChange,
  outputFileName = 'react-geo-image',
  mapSize,
  format = 'png',
  title = 'Print',
  legendTitle = 'Legend',
  pdfPrintFunc = undefined,
  ...passThroughProps
}) => {

  const [loading, setLoading] = useState<boolean>(false);
  const map = useMap();

  const onPrintClick = async () => {
    if (!map) {
      return;
    }
    if (format === 'png') {
      setLoading(true);
      await PrintUtil.printPng(
        map,
        mapSize,
        onProgressChange,
        format,
        outputFileName,
        dpi,
        format,
        attributions,
        scaleBar
      );
      setLoading(false);
    } else if (pdfPrintFunc) {
      setLoading(true);
      await PrintUtil.printPdf(
        map,
        mapSize,
        pdfPrintFunc,
        onProgressChange,
        format,
        outputFileName,
        dpi,
        northArrow,
        scaleBar,
        title,
        legendTitle
      );
      setLoading(false);
    } else {
      Logger.error('Error while creating the printout, missing `pdfPrintFunc` property');
    }
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
