import OlBaseLayer from '@hanreev/types-ol/ol/layer/Base';
import OlLayerGroup from '@hanreev/types-ol/ol/layer/Group';
import OlLayer from 'ol/layer/Layer';
import OlSource from 'ol/source/Source';
import OlBaseTileLayer from 'ol/layer/BaseTile';
import OlBaseImageLayer from 'ol/layer/BaseImage';
import OlSourceImageWMS from 'ol/source/ImageWMS';
import OlSourceTileWMS from 'ol/source/TileWMS';

export type ArrayTwoOrMore<T> = [T, T] & T[];

export function isArrayTwoOrMore<T>(value: T[]): value is ArrayTwoOrMore<T> {
  return value?.length > 1;
}

export function isLayerGroup(layer: OlBaseLayer): layer is OlLayerGroup {
  return 'getLayers' in layer;
}

export function isWmsLayer(layer: OlLayer<OlSource>): layer is (OlBaseTileLayer|OlBaseImageLayer) {
  const source = layer.getSource();
  return source instanceof OlSourceImageWMS || source instanceof OlSourceTileWMS;
}
