import OlBaseLayer from 'ol/layer/Base';
import OlImageLayer from 'ol/layer/Image';
import OlLayer from 'ol/layer/Layer';
import OlTileLayer from 'ol/layer/Tile';
import OlImageWMS from 'ol/source/ImageWMS';
import OlTileWMS from 'ol/source/TileWMS';

export type WmsLayer = OlImageLayer<OlImageWMS> | OlTileLayer<OlTileWMS> | OlLayer<OlImageWMS | OlTileWMS>;

export function isWmsLayer(layer: OlBaseLayer): layer is WmsLayer {
  if (layer instanceof OlLayer) {
    const source = layer.getSource();
    return source instanceof OlImageWMS || source instanceof OlTileWMS;
  }
  return false;
}
