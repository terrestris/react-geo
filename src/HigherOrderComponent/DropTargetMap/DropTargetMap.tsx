import * as React from 'react';

import FileUtil from '@terrestris/ol-util/dist/FileUtil/FileUtil';
import { MapComponentProps } from '../../Map/MapComponent/MapComponent';

/**
 * HOC that adds layers to the map if GeoJSON files or shapefile zip files are
 * dropped on it.
 * @param WrappedComponent The map component.
 * @return A time layer aware component.
 */
export function onDropAware(WrappedComponent: React.ComponentType<MapComponentProps>) {

  return class DropTargetMap extends React.Component<MapComponentProps> {

    /**
     * Calls an appropriate addLayer method depending on the fileending.
     * Currently expects shapefiles for '*.zip' and geojson for all other
     * endings.
     * @param event The drop event.
     */
    onDrop(event: React.DragEvent<HTMLDivElement>) {
      const {
        map
      } = this.props;

      event.preventDefault();

      if (!map) {
        return;
      }

      const files = event.dataTransfer?.files ?? [];
      if (files.length > 0) {
        for (let i = 0; i < files.length; ++i) {
          const file = files[i];
          if (file.name.match(/\.zip$/g)) {
            FileUtil.addShpLayerFromFile(file, map);
          } else {
            FileUtil.addGeojsonLayerFromFile(file, map);
          }
        }
      }
    }

    /**
     * Prevents default in order to prevent browser navigation/opening the file.
     * @param event The dragover event.
     */
    onDragOver(event: React.DragEvent<HTMLDivElement>) {
      event.preventDefault();
    }

    /**
     * Injects the onDrop and onDragOver properties.
     * @return The wrapped component.
     */
    render = () => {
      return <WrappedComponent
        onDrop={this.onDrop.bind(this)}
        onDragOver={this.onDragOver}
        {...this.props}
      />;
    };

  };

}

export default onDropAware;
