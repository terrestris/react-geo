import OlMap from 'ol/Map';
// import MapUtil from '@terrestris/ol-util/dist/MapUtil/MapUtil';
// import {
//   downloadBlob,
//   getJobStatus,
//   queuePrint
// } from '@camptocamp/inkmap';
import {
  InkmapPrintSpec
} from './InkmapTypes';
import { jsPDF } from 'jspdf';
import _isString from 'lodash/isString';
// import Logger from '@terrestris/base-util/dist/Logger';

export class PrintUtil {

  /**
   * The default values for printouts, if not given
   */
  static PRINT_DEFAULTS = {
    attributions: 'bottom-right',
    northArrow: 'top-right',
    scaleBar: {
      position: 'bottom-left',
      units: 'metric'
    },
    dpi: 120,
    outputFileName: 'react-geo-image',
    format: 'png',
    title: 'Print',
    legendTitle: 'Legend'
  };

  /**
   * Method used to create printouts in png format.
   * Does not contain e.g. legends, titles etc.
   */
  static async printPng(
    map: OlMap,
    mapSize: InkmapPrintSpec['size'],
    onProgressChange?: (val: number) => void,
    format?: 'png' | 'pdf',
    outputFileName?: string,
    dpi?: number,
    northArrow?: InkmapPrintSpec['northArrow'],
    attributions?: InkmapPrintSpec['attributions'],
    scaleBar?: InkmapPrintSpec['scaleBar']
  ) {
    // const printConfigByMap = await MapUtil.generatePrintConfig(map);
    // const printConfig = {
    //   ...printConfigByMap,
    //   outputFileName: outputFileName || PrintUtil.PRINT_DEFAULTS.outputFileName,
    //   size: mapSize,
    //   dpi: dpi || PrintUtil.PRINT_DEFAULTS.dpi,
    //   format: format || PrintUtil.PRINT_DEFAULTS.format,
    //   scaleBar: scaleBar === false ? false : scaleBar || PrintUtil.PRINT_DEFAULTS.scaleBar,
    //   northArrow: northArrow === false ? false : northArrow || PrintUtil.PRINT_DEFAULTS.northArrow,
    //   attributions: attributions === false ? false : attributions || PrintUtil.PRINT_DEFAULTS.attributions
    // };
    // const jobId = await queuePrint(printConfig);

    // getJobStatus(jobId).subscribe((printStatus: any) => {
    //   // update the job progress
    //   const progressPercent = Math.round(printStatus.progress * 100);
    //   if (onProgressChange) {
    //     onProgressChange(progressPercent);
    //   }

    //   if (printStatus.progress === 1) {
    //     // job is finished
    //     const name = outputFileName || PrintUtil.PRINT_DEFAULTS.outputFileName;
    //     const suffix = format || PrintUtil.PRINT_DEFAULTS.format;
    //     downloadBlob(printStatus.imageBlob, `${name}.${suffix}`);
    //   }

    //   if (printStatus.sourceLoadErrors.length > 0) {
    //     // display errors
    //     let errorMessage = '';
    //     printStatus.sourceLoadErrors.forEach((element: any) => {
    //       errorMessage = `${errorMessage} - ${element.url}`;
    //     });
    //     Logger.error('Inkmap error: ', errorMessage);
    //   }
    // });
  };

  /**
   * Method used for printouts in pdf format.
   * Applies a kind of template through the `pdfPrintFunc`
   * which is used to layout the final PDF.
   */
  static async printPdf(
    map: OlMap,
    mapSize: InkmapPrintSpec['size'],
    pdfPrintFunc: (
      mapImgUrl: string,
      thePdfSpec: any,
      mapTitle: string,
      theLegendTitle: string
    ) => Promise<jsPDF>,
    onProgressChange?: (val: number) => void,
    format?: 'png' | 'pdf',
    outputFileName?: string,
    dpi?: number,
    northArrow?: InkmapPrintSpec['northArrow'],
    scaleBar?: InkmapPrintSpec['scaleBar'],
    title?: string,
    legendTitle?: string
  ) {
    // const printConfigByMap = await MapUtil.generatePrintConfig(map);
    // const pdfSpec: any = {
    //   ...printConfigByMap,
    //   size: mapSize,
    //   dpi: dpi || PrintUtil.PRINT_DEFAULTS.dpi,
    //   scaleBar: scaleBar === false ? false : scaleBar || PrintUtil.PRINT_DEFAULTS.scaleBar,
    //   northArrow: northArrow === false ? false : northArrow || PrintUtil.PRINT_DEFAULTS.northArrow,
    //   attributions: false
    // };
    // create a job, get a promise that resolves when the job is finished
    // const jobId = await queuePrint(pdfSpec);

    // getJobStatus(jobId).subscribe(async (printStatus: any) => {
    //   // update the job progress
    //   const progressPercent = Math.round(printStatus.progress * 100);
    //   if (onProgressChange) {
    //     onProgressChange(progressPercent);
    //   }

    //   if (printStatus.progress === 1) {
    //     // create an Object URL from the map image blob
    //     const mapImgUrl = URL.createObjectURL(printStatus.imageBlob);
    //     pdfSpec.scaleBar = scaleBar === false ? false :
    //       scaleBar || PrintUtil.PRINT_DEFAULTS.scaleBar;
    //     const doc = await pdfPrintFunc(
    //       mapImgUrl,
    //       pdfSpec,
    //       title || PrintUtil.PRINT_DEFAULTS.title,
    //       legendTitle || PrintUtil.PRINT_DEFAULTS.legendTitle
    //     );
    //     // download the result
    //     if (doc) {
    //       const name = outputFileName || PrintUtil.PRINT_DEFAULTS.outputFileName;
    //       const suffix = format || PrintUtil.PRINT_DEFAULTS.format;
    //       doc.save(`${name}.${suffix}`);
    //     }
    //   }

    //   if (printStatus.sourceLoadErrors.length > 0) {
    //     // display errors
    //     let errorMessage = '';
    //     printStatus.sourceLoadErrors.forEach((element: any) => {
    //       errorMessage = `${errorMessage} - ${element.url}`;
    //     });
    //     Logger.error('Inkmap error: ', errorMessage);
    //   }
    // });
  };
}
