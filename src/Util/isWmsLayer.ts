import OlLayer from 'ol/layer/Layer';
import OlSource from 'ol/source/Source';
import OlBaseTileLayer from 'ol/layer/BaseTile';
import OlBaseImageLayer from 'ol/layer/BaseImage';
import OlSourceImageWMS from 'ol/source/ImageWMS';
import OlSourceTileWMS from 'ol/source/TileWMS';

export function isWmsLayer(layer: OlLayer<OlSource>): layer is (OlBaseTileLayer|OlBaseImageLayer) {
  const source = layer.getSource();
  return source instanceof OlSourceImageWMS || source instanceof OlSourceTileWMS;
}
