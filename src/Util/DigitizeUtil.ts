import OlVectorLayer from 'ol/layer/Vector';
import OlStyleStyle, { StyleLike as OlStyleLike } from 'ol/style/Style';
import OlStyleCircle from 'ol/style/Circle';
import OlStyleFill from 'ol/style/Fill';
import OlStyleStroke from 'ol/style/Stroke';
import OlStyleText from 'ol/style/Text';
import OlStyle from 'ol/style/Style';
import OlLayerVector from 'ol/layer/Vector';
import OlSourceVector from 'ol/source/Vector';
import OlCollection from 'ol/Collection';
import OlMap from 'ol/Map';
import MapUtil from '@terrestris/ol-util/dist/MapUtil/MapUtil';
import OlFeature from 'ol/Feature';
import OlGeometry from 'ol/geom/Geometry';
import Geometry from 'ol/geom/Geometry';

export class DigitizeUtil {
  /**
   * Default fill color used in style object of drawn features.
   */
  static DEFAULT_FILL_COLOR = 'rgba(0, 183, 43, 0.5)';

  /**
   * Default stroke color used in style object of drawn features.
   */
  static DEFAULT_STROKE_COLOR = 'rgba(0, 183, 43, 0.8)';

  /**
   * Default style for digitized points.
   */
  static DEFAULT_POINT_STYLE = new OlStyleStyle({
    image: new OlStyleCircle({
      radius: 7,
      fill: new OlStyleFill({
        color: DigitizeUtil.DEFAULT_FILL_COLOR
      }),
      stroke: new OlStyleStroke({
        color: DigitizeUtil.DEFAULT_STROKE_COLOR
      })
    })
  });

  /**
   * Default style for digitized lines.
   */
  static DEFAULT_LINESTRING_STYLE = new OlStyleStyle({
    stroke: new OlStyleStroke({
      color: DigitizeUtil.DEFAULT_STROKE_COLOR,
      width: 2
    })
  });

  /**
   * Default style for digitized polygons or circles.
   */
  static DEFAULT_POLYGON_STYLE = new OlStyleStyle({
    fill: new OlStyleFill({
      color: DigitizeUtil.DEFAULT_FILL_COLOR
    }),
    stroke: new OlStyleStroke({
      color: DigitizeUtil.DEFAULT_STROKE_COLOR,
      width: 2
    })
  });

  /**
   * Default style for digitized labels.
   */
  static DEFAULT_TEXT_STYLE = new OlStyleStyle({
    text: new OlStyleText({
      text: '',
      offsetX: 5,
      offsetY: 5,
      font: '12px sans-serif',
      fill: new OlStyleFill({
        color: DigitizeUtil.DEFAULT_FILL_COLOR
      }),
      stroke: new OlStyleStroke({
        color: DigitizeUtil.DEFAULT_STROKE_COLOR
      })
    })
  });

  static DIGITIZE_LAYER_NAME = 'react-geo_digitize';

  static DEFAULT_SELECT_STYLE = DigitizeUtil.selectStyleFunction('rgba(154, 26, 56, 0.5)', 'rgba(154, 26, 56, 0.8)');

  /**
   * This function gets the standard react geo digitize layer and creates it if it does not exist.
   * If another layer should be used, the layer property of the respective button should be used.
   * By default the digitize layer is styled via {@link DigitizeUtil.defaultDigitizeStyleFunction},
   * if another style is desired either use another layer or set the style of the digitize layer
   * via `setStyle`.
   *
   * @param map
   */
  static getDigitizeLayer(map: OlMap): OlVectorLayer<OlSourceVector<Geometry>> {
    let digitizeLayer = MapUtil.getLayerByName(map, DigitizeUtil.DIGITIZE_LAYER_NAME);

    if (!digitizeLayer) {
      digitizeLayer = new OlLayerVector({
        source: new OlSourceVector({
          features: new OlCollection()
        }),
        properties: {
          name: DigitizeUtil.DIGITIZE_LAYER_NAME
        }
      });
      digitizeLayer.setStyle(DigitizeUtil.defaultDigitizeStyleFunction);
      map.addLayer(digitizeLayer);
    }

    return digitizeLayer;
  }

  /**
   * The styling function for the digitize vector layer, which considers
   * different geometry types of drawn features.
   *
   * @param feature The feature which is being styled.
   * @return The style to use.
   */
  static defaultDigitizeStyleFunction(feature: OlFeature<OlGeometry>): OlStyle | undefined {
    const geom = feature.getGeometry();

    if (!geom) {
      return undefined;
    }

    switch (geom.getType()) {
      case 'MultiPoint':
      case 'Point': {
        if (!feature.get('isLabel')) {
          return new OlStyleStyle({
            image: new OlStyleCircle({
              radius: 7,
              fill: new OlStyleFill({
                color: DigitizeUtil.DEFAULT_FILL_COLOR
              }),
              stroke: new OlStyleStroke({
                color: DigitizeUtil.DEFAULT_STROKE_COLOR
              })
            })
          });
        } else {
          return new OlStyleStyle({
            text: new OlStyleText({
              text: feature.get('label'),
              offsetX: 5,
              offsetY: 5,
              font: '12px sans-serif',
              fill: new OlStyleFill({
                color: DigitizeUtil.DEFAULT_FILL_COLOR
              }),
              stroke: new OlStyleStroke({
                color: DigitizeUtil.DEFAULT_STROKE_COLOR
              })
            })
          });
        }
      }
      case 'MultiLineString':
      case 'LineString': {
        return new OlStyleStyle({
          stroke: new OlStyleStroke({
            color: DigitizeUtil.DEFAULT_STROKE_COLOR,
            width: 2
          })
        });
      }
      case 'MultiPolygon':
      case 'Polygon':
      case 'Circle': {
        return new OlStyleStyle({
          fill: new OlStyleFill({
            color: DigitizeUtil.DEFAULT_FILL_COLOR
          }),
          stroke: new OlStyleStroke({
            color: DigitizeUtil.DEFAULT_STROKE_COLOR,
            width: 2
          })
        });
      }
      default:
        return undefined;
    }
  }

  /**
   * This functions creates a select style with some default values from fill and stroke colors.
   * This can be used as a style function for an OpenLayers layer or feature.
   *
   * @param selectFillColor
   * @param selectStrokeColor
   */
  static selectStyleFunction (selectFillColor: string, selectStrokeColor: string): OlStyleLike {
    return (feature: OlFeature<OlGeometry>) => {
      const text = feature.get('label') ?? '';

      return new OlStyleStyle({
        image: new OlStyleCircle({
          radius: 7,
          fill: new OlStyleFill({
            color: selectFillColor
          }),
          stroke: new OlStyleStroke({
            color: selectStrokeColor
          })
        }),
        text: new OlStyleText({
          text: text,
          offsetX: 5,
          offsetY: 5,
          font: '12px sans-serif',
          fill: new OlStyleFill({
            color: selectFillColor
          }),
          stroke: new OlStyleStroke({
            color: selectStrokeColor
          })
        }),
        stroke: new OlStyleStroke({
          color: selectStrokeColor,
          width: 2
        }),
        fill: new OlStyleFill({
          color: selectFillColor
        })
      });
    };
  }
}

