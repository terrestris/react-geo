import OlBaseLayer from 'ol/layer/Base';
import OlLayer from 'ol/layer/Layer';
import OlImageWMS from 'ol/source/ImageWMS';
import OlTileWMS from 'ol/source/TileWMS';
import OlImageLayer from 'ol/layer/Image';
import OlTileLayer from 'ol/layer/Tile';

export type WmsLayer = OlImageLayer<OlImageWMS> | OlTileLayer<OlTileWMS> | OlLayer<OlImageWMS | OlTileWMS>;

export function isWmsLayer(layer: OlBaseLayer): layer is WmsLayer {
  if (layer instanceof OlLayer) {
    const source = layer.getSource();
    return source instanceof OlImageWMS || source instanceof OlTileWMS;
  }
  return false;
}
