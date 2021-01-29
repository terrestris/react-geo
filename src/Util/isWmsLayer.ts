import Layer from 'ol/layer/Layer';
import Source from 'ol/source/Source';
import BaseTileLayer from 'ol/layer/BaseTile';
import BaseImageLayer from 'ol/layer/BaseImage';
import OlSourceImageWMS from 'ol/source/ImageWMS';
import OlSourceTileWMS from 'ol/source/TileWMS';

export function isWmsLayer(layer: Layer<Source>): layer is (BaseTileLayer|BaseImageLayer) {
  const source = layer.getSource();
  return source instanceof OlSourceImageWMS || source instanceof OlSourceTileWMS;
}
