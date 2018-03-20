import PropTypes from 'prop-types';
import React from 'react';
import OlFormatGeoJSON from 'ol/format/geojson';
import OlLayerVector from 'ol/layer/vector';
import OlSourceVector from 'ol/source/vector';
import shp from 'shpjs';

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

    addGeojsonLayer = json => {
      const format = new OlFormatGeoJSON();
      const features = format.readFeatures(json);
      const layer = new OlLayerVector({
        source: new OlSourceVector({
          features: features
        })
      });

      this.props.map.addLayer(layer);
    }

    readGeojsonFile = file => {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.addEventListener('loadend', () => {
        const content = reader.result;
        this.addGeojsonLayer(content);
      });
    }

    readShpFile = file => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.addEventListener('loadend', () => {
        const blob = reader.result;
        shp(blob).then(this.addGeojsonLayer);
      });
    }

    onDrop = event => {
      event.preventDefault();
      const files = event.dataTransfer.files;
      if (files.length > 0) {
        for (let i = 0; i < files.length; ++i) {
          const file = files[i];
          if (file.name.match(/\.zip$/g)) {
            this.readShpFile(file);
          } else {
            this.readGeojsonFile(file);
          }
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
