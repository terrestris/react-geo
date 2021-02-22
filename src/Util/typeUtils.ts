import OlBaseLayer from '@hanreev/types-ol/ol/layer/Base';
import OlLayerGroup from '@hanreev/types-ol/ol/layer/Group';
import OlLayer from 'ol/layer/Layer';
import OlImageWMS from 'ol/source/ImageWMS';
import OlTileWMS from 'ol/source/TileWMS';
import ImageLayer from 'ol/layer/Image';
import TileLayer from 'ol/layer/Tile';

export function isLayerGroup(layer: OlBaseLayer): layer is OlLayerGroup {
  return 'getLayers' in layer;
}

export function isWmsLayer(layer: OlBaseLayer): layer is OlLayer<OlImageWMS | OlTileWMS> {
  if (layer instanceof OlLayer) {
    const source = layer.getSource();
    return source instanceof OlImageWMS || source instanceof OlTileWMS;
  }
  return false;
}

export function isImageOrTileLayer(layer: OlBaseLayer): layer is ImageLayer | TileLayer {
  return layer instanceof ImageLayer || layer instanceof TileLayer;
}
