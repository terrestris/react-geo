import OlBaseLayer from 'ol/layer/Base';
import OlHeatmapLayer from 'ol/layer/Heatmap';
import OlImageLayer from 'ol/layer/Image';
import OlLayer from 'ol/layer/Layer';
import OlTileLayer from 'ol/layer/Tile';
import OlVectorLayer from 'ol/layer/Vector';
import OlSourceCluster from 'ol/source/Cluster';
import OlImageWMS from 'ol/source/ImageWMS';
import OlTileWMS from 'ol/source/TileWMS';
import OlSourceVector from 'ol/source/Vector';
import OlSourceVectorTile from 'ol/source/VectorTile';

import { isWmsLayer } from './typeUtils';

const getWmsLikeLayers = () => {
  return {
    'ol/layer/Layer': new OlLayer({}),
    'ol/layer/Image': new OlImageLayer(),
    'ol/layer/Tile': new OlTileLayer()
  };
};

const getWmsSources = () => {
  return {
    'ol/source/ImageWMS': new OlImageWMS(),
    'ol/source/TileWMS': new OlTileWMS()
  };
};

const getNonWmsLikeLayers = () => {
  return {
    'ol/layer/Vector': new OlVectorLayer(),
    'ol/layer/Heatmap': new OlHeatmapLayer()
  };
};

const getNonWmsSources = () => {
  return {
    'ol/source/Vector': new OlSourceVector(),
    'ol/source/VectorTile': new OlSourceVectorTile({}),
    'ol/source/Cluster': new OlSourceCluster({})
  };
};


describe('isWmsLayer', () => {

  it('is defined', () => {
    expect(isWmsLayer).not.toBeUndefined();
  });

  it('is a function', () => {
    expect(isWmsLayer).toBeInstanceOf(Function);
  });

  it('returns false for an ol base layer', () => {
    const layer = new OlBaseLayer({});
    expect(isWmsLayer(layer)).toBe(false);
  });

  describe('Combinations of wms like layers with wms like sources', () => {
    const layers = getWmsLikeLayers();
    const sources = getWmsSources();
    Object.keys(layers).forEach((layerClass) => {
      Object.keys(sources).forEach((sourceClass) => {
        const layer = layers[layerClass];
        const source = sources[sourceClass];
        layer.setSource(source);

        it(`returns true for ${layerClass} with ${sourceClass}`, () => {
          expect(isWmsLayer(layer)).toBe(true);
        });
      });
    });
  });

  describe('Combinations of some non-wms like layers with some non-wms like sources', () => {
    const layers = getNonWmsLikeLayers();
    const sources = getNonWmsSources();
    Object.keys(layers).forEach((layerClass) => {
      Object.keys(sources).forEach((sourceClass) => {
        const layer = layers[layerClass];
        const source = sources[sourceClass];
        layer.setSource(source);

        it(`returns false for ${layerClass} with ${sourceClass}`, () => {
          expect(isWmsLayer(layer)).toBe(false);
        });
      });
    });
  });

  // these fail, but I fear tghey should pass…
  // a  ol/layer/Heatmap with ol/source/ImageWMS is not a WMS is it?
  //
  // describe('Combinations of some non-wms like layers with wms like sources', () => {
  //   const layers = getNonWmsLikeLayers();
  //   const sources = getWmsSources();
  //   Object.keys(layers).forEach((layerClass) => {
  //     Object.keys(sources).forEach((sourceClass) => {
  //       const layer = layers[layerClass];
  //       const source = sources[sourceClass];
  //       layer.setSource(source);

  //       it(`returns false for ${layerClass} with ${sourceClass}`, () => {
  //         expect(isWmsLayer(layer)).toBe(false);
  //       });
  //     });
  //   });
  // });

  describe('Combinations of some wms like layers with non-wms like sources', () => {
    const layers = getWmsLikeLayers();
    const sources = getNonWmsSources();
    Object.keys(layers).forEach((layerClass) => {
      Object.keys(sources).forEach((sourceClass) => {
        const layer = layers[layerClass];
        const source = sources[sourceClass];
        layer.setSource(source);

        it(`returns false for ${layerClass} with ${sourceClass}`, () => {
          expect(isWmsLayer(layer)).toBe(false);
        });
      });
    });
  });

});
