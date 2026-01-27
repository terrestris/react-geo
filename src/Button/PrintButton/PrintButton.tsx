import React, {
  useState
} from 'react';

import useMap from '@terrestris/react-util/dist/Hooks/useMap/useMap';
import { PdfPrintSpec, PngPrintSpec, PrintSpec, PrintUtil } from '@terrestris/react-util/dist/Util/PrintUtil';

import SimpleButton, {
  SimpleButtonProps
} from '../SimpleButton/SimpleButton';

type BaseProps = Omit<PrintSpec, 'map'> & SimpleButtonProps;

type PngProps = Omit<PngPrintSpec, 'map' | 'format'> & {
  format?: 'png';
};

type PdfProps = Omit<PdfPrintSpec, 'map' | 'format' | 'pdfPrintFunc'> & {
  format: 'pdf';
  pdfPrintFunc: PdfPrintSpec['pdfPrintFunc'];
};

export type PrintButtonProps = BaseProps & (PngProps | PdfProps);

export const PrintButton: React.FC<PrintButtonProps> = (props) => {
  const {
    attributions = 'bottom-right',
    dpi = 120,
    extent,
    extentPadding,
    format, // please note: setting a default here breaks the typing
    legendTitle = 'Legend',
    mapSize,
    northArrow = 'top-right',
    onProgressChange,
    outputFileName = 'react-geo-image',
    scaleBar = {
      position: 'bottom-left',
      units: 'metric'
    },
    title = 'Print',
    ...passThroughProps
  } = props;

  const [loading, setLoading] = useState<boolean>(false);
  const map = useMap();

  const onPrintClick = async () => {
    if (!map) {
      return;
    }
    if (format === 'pdf') {
      const { pdfPrintFunc } = props;
      setLoading(true);
      const pdfPrintSpec: PdfPrintSpec = {
        dpi,
        extent,
        extentPadding,
        format,
        legendTitle,
        map,
        mapSize,
        northArrow,
        onProgressChange,
        outputFileName,
        pdfPrintFunc,
        scaleBar,
        title
      };
      await PrintUtil.printPdf(pdfPrintSpec);
      setLoading(false);
    } else {
      // format = "png" or undefined -> "png"
      setLoading(true);
      const pngPrintSpec: PngPrintSpec = {
        attributions,
        dpi,
        extent,
        extentPadding,
        format: 'png',
        map,
        mapSize,
        onProgressChange,
        outputFileName,
        scaleBar
      };
      await PrintUtil.printPng(pngPrintSpec);
      setLoading(false);
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
