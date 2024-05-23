// import {
//   getAttributionsText
// } from '@camptocamp/inkmap';
import Logger from '@terrestris/base-util/dist/Logger';
import { jsPDF } from 'jspdf';
import _isString from 'lodash/isString';

const pdfPrintFunc = async (
  mapImgUrl: string,
  pdfSpec: any,
  title: string,
  legendTitle: string) => {

  // initializes the PDF document
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a3',
    putOnlyUsedFonts: true
  });

  const mapWidth = pdfSpec.size[0];
  const mapHeight = pdfSpec.size[1];

  // add the map
  doc.addImage(mapImgUrl, 'PNG', 10, 17, mapWidth, mapHeight);

  // add a title
  doc.setFont('arial', 'bold');
  doc.setFontSize(20);
  doc.text(title, doc.internal.pageSize.width / 2, 13, { align: 'center' });

  // add attribution
  doc.setFont('arial', 'normal');
  doc.setFontSize(9);
  // doc.text(getAttributionsText(pdfSpec), doc.internal.pageSize.width - 10, 275, { align: 'right' });

  if (pdfSpec.layers?.some((l: any) => l.legendUrl && l.legendUrl.length > 0)) {
    // add second page for legends
    doc.addPage('a3', 'l');

    // add a legend title
    doc.setFont('arial', 'bold');
    doc.setFontSize(20);
    doc.text(legendTitle, doc.internal.pageSize.width / 2, 13, { align: 'center' });

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
          doc.text(name, xPosition, 20, { align: 'left' });
          const widthMm = img.width * 25.4 / pdfSpec.dpi;
          const heightMm = img.height * 25.4 / pdfSpec.dpi;
          doc.addImage(legendUrl, 'PNG', xPosition, 23, widthMm, heightMm);
          xPosition += widthMm + 20;
        } catch (error) {
          Logger.error(error);
        }
      }
    }
  }
  return doc;
};
export default pdfPrintFunc;
