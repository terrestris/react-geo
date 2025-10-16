import React, {
  useState
} from 'react';

import useMap from '@terrestris/react-util/dist/Hooks/useMap/useMap';
import { PdfPrintSpec, PngPrintSpec, PrintSpec, PrintUtil } from '@terrestris/react-util/dist/Util/PrintUtil';

import SimpleButton, {
  SimpleButtonProps
} from '../SimpleButton/SimpleButton';

export type PrintButtonProps = Omit<PrintSpec, 'map'> & {
  format?: 'png' | 'pdf';
} & Partial<PdfPrintSpec> & Partial<PngPrintSpec> & SimpleButtonProps;

export const PrintButton: React.FC<PrintButtonProps> = ({
  attributions = 'bottom-right',
  dpi = 120,
  extent,
  extentPadding,
  format = 'png',
  legendTitle = 'Legend',
  mapSize,
  northArrow = 'top-right',
  onProgressChange,
  outputFileName = 'react-geo-image',
  pdfPrintFunc,
  scaleBar = {
    position: 'bottom-left',
    units: 'metric'
  },
  title = 'Print',
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
      const pngPrintSpec: PngPrintSpec = {
        attributions,
        dpi,
        extent,
        extentPadding,
        format,
        map,
        mapSize,
        onProgressChange,
        outputFileName,
        scaleBar
      };
      await PrintUtil.printPng(pngPrintSpec);
      setLoading(false);
    } else if (pdfPrintFunc && format === 'pdf') {
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
