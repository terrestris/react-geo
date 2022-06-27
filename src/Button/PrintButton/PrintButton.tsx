import React, {
  useState
} from 'react';

import { jsPDF } from 'jspdf';

import { useMap } from '../../Hook/useMap';
import {
  downloadBlob,
  getAttributionsText,
  getJobStatus,
  queuePrint
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
  format?: 'png' | 'pdf';
  dpi?: number;
  size?: InkmapPrintSpec['size'];
  northArrow?: InkmapPrintSpec['northArrow'];
  attributions?: InkmapPrintSpec['attributions'];
  scaleBar?: InkmapPrintSpec['scaleBar'];
  title?: string;
  legendTitle?: string;
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
  outputFileName = 'react-geo-image',
  size = [400, 240, 'mm'],
  format = 'png',
  title = 'Print',
  legendTitle= 'Legend',
  ...passThroughProps
}) => {

  const [loading, setLoading] = useState<boolean>(false);
  const map = useMap();

  const printPng = async () => {
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
        downloadBlob(printStatus.imageBlob, `${outputFileName}.${format}`);
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

  const printPdf = async () => {
    if (!map) {
      return;
    }
    setLoading(true);
    const printConfigByMap = await MapUtil.generatePrintConfig(map);
    const mapWidth = 277; // mm
    const mapHeight = 170; // mm

    // Force map size to fit the PDF document
    const pdfSpec = {
      ...printConfigByMap,
      size: [mapWidth, mapHeight, 'mm'],
      dpi,
      scaleBar: scaleBar,
      northArrow: northArrow,
      attributions: false
    };

    // create a job, get a promise that resolves when the job is finished
    const jobId = await queuePrint(pdfSpec);

    getJobStatus(jobId).subscribe(async (printStatus: any) => {
      // update the job progress
      const progressPercent = Math.round(printStatus.progress * 100);
      if (onProgressChange) {
        onProgressChange(progressPercent);
      }

      if (printStatus.progress === 1) {
        // initializes the PDF document
        const doc = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: 'a4', // 210 by 297mm
          putOnlyUsedFonts: true
        });

        // create an Object URL from the map image blob and add it to the PDF
        const imgUrl = URL.createObjectURL(printStatus.imageBlob);
        doc.addImage(imgUrl, 'PNG', 10, 17, mapWidth, mapHeight);

        // add a title
        doc.setFont('arial', 'bold');
        doc.setFontSize(20);
        doc.text(title, 148.5, 13, { align: 'center' });

        // add attribution
        doc.setFont('arial', 'normal');
        doc.setFontSize(10);
        doc.text(getAttributionsText(pdfSpec), 287, 200, { align: 'right' });

        if (!pdfSpec) {
          return;
        }

        if (pdfSpec?.layers?.some(l => l.legendUrl && l.legendUrl.length > 0)) {
          // second page for legends
          doc.addPage('a4', 'l');

          // add a legend title
          doc.setFont('arial', 'bold');
          doc.setFontSize(20);
          doc.text(legendTitle, 148.5, 13, { align: 'center' });

          let xPosition = 20;

          for (let i = 0; i < pdfSpec.layers?.length; i++) {
            const layer: any = pdfSpec.layers?.[i];
            const legendUrl = layer.legendUrl;
            const name = layer.layerName;

            if (legendUrl && name) {
              try {
                // determine legend image dimensions
                const response = await fetch(legendUrl);
                const blob = await response.blob();
                const base64 = URL.createObjectURL(blob);
                let img: HTMLImageElement = new Image();
                img.src = base64.toString();
                await img.decode();

                doc.setFont('arial', 'bold');
                doc.setFontSize(12);
                doc.text(name, xPosition, 17, { align: 'left' });
                const widthMm = img.width * 25.4 / dpi;
                const heightMm = img.height * 25.4 / dpi;
                doc.addImage(legendUrl, 'PNG', xPosition, 20, widthMm, heightMm);
                xPosition += widthMm + 20;
              } catch (error) {
                Logger.error(error);
              }
            }
          }
        }

        // job is finished
        setLoading(false);

        // download the result
        doc.save(`${outputFileName}.${format}`);
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

  const onPrintClick = async () => {
    if (format === 'png') {
      await printPng();
    } else {
      await printPdf();
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
