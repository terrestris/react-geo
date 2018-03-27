import PropTypes from 'prop-types';
import React from 'react';

import { FileUtil } from '../../index';

/**
 * HOC that adds layers to the map if GeoJSON files or shapefile zip files are
 * dropped on it.
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
      if (files.length > 0) {
        for (let i = 0; i < files.length; ++i) {
          const file = files[i];
          if (file.name.match(/\.zip$/g)) {
            FileUtil.addShpLayerFromFile(file, this.props.map);
          } else {
            FileUtil.addGeojsonLayerFromFile(file, this.props.map);
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
