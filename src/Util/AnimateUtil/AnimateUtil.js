import { unByKey } from 'ol/Observable';
import OlGeomPoint from 'ol/geom/Point';
import OlGeomLineString from 'ol/geom/LineString';

/**
 * This class provides some static methods which might be helpful when working
 * with digitize functions to animate features.
 *
 * @class AnimateUtil
 */
class AnimateUtil {

  /**
   * Moves / translates an `OlFeature` to the given `pixel` delta in
   * in the end with given `duration` in ms, using the given style.
   *
   * @param {OlMap} map An OlMap.
   * @param {OlFeature} featureToMove The feature to move.
   * @param {Number} duration The duration in ms for the moving to complete.
   * @param {Array<Number>} pixel Delta of pixels to move the feature.
   * @param {OlStyleStyle} style The style to use when moving the feature.
   *
   * @return {String} A listener key from a postcompose event.
   */
  static moveFeature(map, featureToMove, duration, pixel, style) {

    return new Promise(resolve => {
      let listenerKey;

      const geometry = featureToMove.getGeometry();
      const start = new Date().getTime();
      const resolution = map.getView().getResolution();
      const totalDisplacement = pixel * resolution;
      const expectedFrames = duration / 1000 * 60;
      let actualFrames = 0;
      const deltaX = totalDisplacement / expectedFrames;
      const deltaY = totalDisplacement / expectedFrames;

      /**
       * Moves the feature `pixel` right and `pixel` up.
       */
      const animate = (event) => {
        const vectorContext = event.vectorContext;
        const frameState = event.frameState;
        const elapsed = frameState.time - start;

        geometry.translate(deltaX, deltaY);

        if (vectorContext.setFillStrokeStyle && vectorContext.setImageStyle &&
            vectorContext.drawPointGeometry) {
          if (style) {
            vectorContext.setFillStrokeStyle(
              style.getFill(), style.getStroke());
            vectorContext.setImageStyle(style.getImage());
          }
          if (geometry instanceof OlGeomPoint) {
            vectorContext.drawPointGeometry(geometry, null);
          } else if (geometry instanceof OlGeomLineString) {
            vectorContext.drawLineStringGeometry(geometry, null);
          } else {
            vectorContext.drawPolygonGeometry(geometry, null);
          }
        } else {
          if (style) {
            vectorContext.setStyle(style);
          }
          vectorContext.drawGeometry(geometry);
        }

        if (elapsed > duration || actualFrames >= expectedFrames) {
          unByKey(listenerKey);
          resolve(featureToMove);
        }
        // tell OL3 to continue postcompose animation
        frameState.animate = true;

        actualFrames++;
      };

      listenerKey = map.on('postcompose', animate);
      map.render();
    });

  }

}

export default AnimateUtil;
