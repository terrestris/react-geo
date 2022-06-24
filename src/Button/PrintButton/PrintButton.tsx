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
  }

  const printPdf = async () => {
    setLoading(true);
    const printConfigByMap = await MapUtil.generatePrintConfig(map);
    const mapWidth = 277; // mm
    const mapHeight = 170; // mm

    // Force map size to fit the PDF document
    const pdfSpec: InkmapPrintSpec = {
      ...printConfigByMap,
      size: [mapWidth, mapHeight, 'mm'],
      dpi,
      scaleBar: scaleBar,
      northArrow: northArrow,
      attributions: false
    };

    // create a job, get a promise that resolves when the job is finished
    const jobId = await queuePrint(pdfSpec);

    getJobStatus(jobId).subscribe((printStatus: any) => {
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


        if (pdfSpec.layers.some(l => l.legendUrl && l.legendUrl.length > 0)) {
          // second page for legends
          doc.addPage('a4', 'l');

          pdfSpec.layers.forEach((layer, idx) => {
            const legendUrl = layer.legendUrl;
            const name = layer.layerName;
            const xPosition = 20 + (60 * idx); // todo: dynamic size
            if (legendUrl && name) {
              // todo: use actual legend image size
              doc.setFont('arial', 'bold');
              doc.setFontSize(12);
              doc.text(name, xPosition, 17, { align: 'left' });
              doc.addImage(legendUrl, 'PNG', xPosition, 20, 60, 60);
            }
          });

          // add a title
          doc.setFont('arial', 'bold');
          doc.setFontSize(20);
          doc.text(legendTitle, 148.5, 13, { align: 'center' });
        }

        // job is finished
        setLoading(false);

        // download the result
        // todo: only one pdf
        doc.save(`${outputFileName}.${format}`);
        // legendsDoc.save(`${outputFileName}-legend.${format}`);
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
  }

  const onPrintClick = async () => {
    if (!map) {
      return;
    }
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
