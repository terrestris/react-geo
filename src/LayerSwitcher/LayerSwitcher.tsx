import * as React from 'react';
import _isEqual from 'lodash/isEqual';
import _isNumber from 'lodash/isNumber';
import Logger from '@terrestris/base-util/dist/Logger';
import { ArrayTwoOrMore } from '@terrestris/base-util/dist/types';

import OlMap from 'ol/Map';
import OlLayerGroup from 'ol/layer/Group';
import OlLayerTile from 'ol/layer/Tile';
import OlTileSource from 'ol/source/Tile';

import { CSS_PREFIX } from '../constants';
import MapComponent from '../Map/MapComponent/MapComponent';

import './LayerSwitcher.less';

/**
 * @export
 * @interface LayerSwitcherProps
 * @extends {React.HTMLAttributes<HTMLDivElement>}
 */
export interface OwnProps {
  /**
   * An optional CSS class which will be added to the wrapping div Element.
   */
  className?: string;
  /**
   * The layers to be available in the switcher.
   */
  layers: ArrayTwoOrMore<OlLayerTile<OlTileSource> | OlLayerGroup>;
  /**
   * The main map the layers should be synced with.
   */
  map: OlMap;
}

interface LayerSwitcherState {
  previewLayer: OlLayerTile<OlTileSource> | OlLayerGroup | null;
}

export type LayerSwitcherProps = OwnProps & React.HTMLAttributes<HTMLDivElement>;

/**
 * Class representing the LayerSwitcher.
 * A basic component to switch between the passed layers.
 * This is most likely to be used for the backgroundlayer.
 *
 * @class LayerSwitcher
 * @extends React.Component
 */
export class LayerSwitcher extends React.Component<LayerSwitcherProps, LayerSwitcherState> {

  /**
   * The internal map of the LayerSwitcher
   * @private
   */
  _map: OlMap | null = null;

  _visibleLayerIndex: number;

  _layerClones: Array<OlLayerTile<OlTileSource> | OlLayerGroup> = [];

  /**
   * The className added to this component.
   * @private
   */
  _className = `${CSS_PREFIX}layer-switcher`;

  /**
   * Creates the LayerSwitcher.
   *
   * @constructs LayerSwitcher
   */
  constructor(props: LayerSwitcherProps) {
    super(props);
    this._map = this.getMap();
    this.state = {
      previewLayer: null
    };
  }

  /**
   * A react lifecycle method called when the component did mount.
   */
  componentDidMount() {
    this.setMapLayers();
    this.updateLayerVisibility();
  }

  /**
   * Destroy all map specific stuff when umounting the component.
   *
   * @memberof LayerSwitcher
   */
  componentWillUnMount() {
    if (this._map) {
      this._map.getLayers().clear();
      this._map.setTarget(undefined);
      this._map = null;
    }
  }

  /**
   * Invoked immediately after updating occurs. This method is not called for
   * the initial render.
   *
   * @param prevProps The previous props.
   */
  componentDidUpdate(prevProps: LayerSwitcherProps) {
    if (!(_isEqual(this.props.layers, prevProps.layers))) {
      this.setMapLayers();
      this.updateLayerVisibility();
    }
  }

  /**
   * Clones a layer
   *
   * @param layer The layer to clone.
   * @returns The cloned layer.
   */
  cloneLayer(layer: OlLayerTile<OlTileSource> | OlLayerGroup): OlLayerTile<OlTileSource> | OlLayerGroup {
    if (layer instanceof OlLayerGroup) {
      return new OlLayerGroup({
        layers: layer.getLayers().getArray().map(this.cloneLayer),
        properties: {
          originalLayer: layer
        },
        ...layer.getProperties()
      });
    } else {
      return new OlLayerTile({
        source: (layer as OlLayerTile<OlTileSource>).getSource() || undefined,
        properties: {
          originalLayer: layer
        },
        ...layer.getProperties()
      });
    }
  };

  /**
   * (Re-)adds the layers to the preview map and sets the visibleLayerIndex.
   *
   */
  setMapLayers = () => {
    const {
      layers
    } = this.props;
    if (layers.length < 2) {
      Logger.warn('LayerSwitcher requires two or more layers.');
    }
    this._map?.getLayers().clear();
    this._layerClones = layers.map((layer, index) => {
      const layerClone = this.cloneLayer(layer);
      if (layerClone.getVisible()) {
        this._visibleLayerIndex = index;
      }
      this._map?.addLayer(layerClone);
      return layerClone;
    });
    if (!_isNumber(this._visibleLayerIndex)) {
      Logger.warn('The initial visibility of at least one layer used with LayerSwitcher should be set to true.');
    }
  };

  /**
   * Sets the visiblity of the layers in the props.map and this._map.
   * Also sets the previewLayer in the state.
   *
   */
  updateLayerVisibility = () => {
    const {
      layers
    } = this.props;
    layers.forEach((l, i) => {
      const clone = this._layerClones.find(lc => lc.get('name') === l.get('name'));
      l.setVisible(this._visibleLayerIndex === i);
      if (clone) {
        clone.setVisible(this._visibleLayerIndex === i);
        if (this._visibleLayerIndex === i) {
          this.setState({ previewLayer: clone });
        }
      }
    });
  };

  /**
   * Constructs this._map
   */
  getMap = (): OlMap => {
    const {
      map
    } = this.props;
    return new OlMap({
      view: map.getView(),
      controls: []
    });
  };

  /**
   * Clickhandler for the overview switch.
   *
   */
  onSwitcherClick = (evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    evt.stopPropagation();
    this._map?.getLayers().getArray().forEach((layer, index: number) => {
      if (layer.getVisible()) {
        if (this._layerClones.length - 1 === index) {
          this._visibleLayerIndex = 0;
        } else {
          this._visibleLayerIndex = index + 1;
        }
      }
    });
    this.updateLayerVisibility();
  };

  /**
   * The render function.
   */
  render() {
    const {
      className,
      ...passThroughProps
    } = this.props;

    const finalClassName = className
      ? `${className} ${this._className}`
      : this._className;

    if (!this._map) {
      return null;
    }

    return (
      <div
        className={finalClassName}
        {...passThroughProps}
      >
        <div
          className="clip"
          onClick={this.onSwitcherClick}
          role="button"
        >
          <MapComponent
            mapDivId="layer-switcher-map"
            map={this._map}
            role="img"
          />
          {
            this.state.previewLayer &&
            <span className="layer-title">
              {this.state.previewLayer.get('name')}
            </span>
          }
        </div>
      </div>
    );
  }
}

export default LayerSwitcher;
