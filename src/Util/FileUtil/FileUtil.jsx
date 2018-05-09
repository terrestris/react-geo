import OlFormatGeoJSON from 'ol/format/geojson';
import OlLayerVector from 'ol/layer/vector';
import OlSourceVector from 'ol/source/vector';
import shp from 'shpjs';

/**
 * Helper Class for adding layers from various file formats.
 *
 * @class
 */
export class FileUtil {

  /**
   * Adds a new vector layer from a geojson file.
   * @param {File} file the file to read the geojson from
   * @param {ol.Map} map the map to add the layer to
   */
  static addGeojsonLayerFromFile = (file, map) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.addEventListener('loadend', () => {
      const content = reader.result;
      FileUtil.addGeojsonLayer(content, map);
    });
  }

  /**
   * Adds a new vector layer from a shape file (zip).
   * @param {File} file the file to read the geojson from
   * @param {ol.Map} map the map to add the layer to
   */
  static addShpLayerFromFile = (file, map) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.addEventListener('loadend', () => {
      const blob = reader.result;
      shp(blob).then(json => {
        FileUtil.addGeojsonLayer(json, map);
      });
    });
  }

  /**
   * Adds a new vector layer from a geojson string.
   * @param {String} json the geojson string
   * @param {ol.Map} map the map to add the layer to
   */
  static addGeojsonLayer = (json, map) => {
    const format = new OlFormatGeoJSON();
    const features = format.readFeatures(json);
    const layer = new OlLayerVector({
      source: new OlSourceVector({
        features: features
      })
    });
    map.addLayer(layer);
  }

}

export default FileUtil;
