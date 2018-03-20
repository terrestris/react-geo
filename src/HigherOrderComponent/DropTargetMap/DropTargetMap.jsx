import PropTypes from 'prop-types';
import React from 'react';
import OlFormatGeoJSON from 'ol/format/geojson';
import OlLayerVector from 'ol/layer/vector';
import OlSourceVector from 'ol/source/vector';

/**
 * HOC that adds layers to the map if GeoJSON files are dropped on it.
 * @param  {React.Component} WrappedComponent the map component
 * @return {React.Component} a time layer aware component
 */
export function onDropAware(WrappedComponent) {

  return class DropTargetMap extends React.Component {

    static propTypes = {
      /**
       * The openlayers map injected by mappify.
       * @type {ol.Map}
       */
      map: PropTypes.object
    }

    onDrop = event => {
      event.preventDefault();
      const files = event.dataTransfer.files;
      const format = new OlFormatGeoJSON();
      if (files.length > 0) {
        for (let i = 0; i < files.length; ++i) {
          const reader = new FileReader();
          reader.readAsText(files[i]);
          reader.addEventListener('loadend', () => {
            const content = reader.result;
            const features = format.readFeatures(content);
            const layer = new OlLayerVector({
              source: new OlSourceVector({
                features: features
              })
            });

            this.props.map.addLayer(layer);
          });
        }
      }
    }

    /**
     * Prevents default in order to prevent browser navigation/opening the file.
     * @param  {Object} event the dragover event
     */
    onDragOver = event => {
      event.preventDefault();
    }

    /**
     * Injects the onDrop and onDragOver properties.
     * @return {React.Component} the wrapped component
     */
    render = () => {
      return <WrappedComponent
        onDrop={this.onDrop}
        onDragOver={this.onDragOver}
        {...this.props}
      />;
    }

  };

}

export default onDropAware;
