import React from 'react';
import PropTypes from 'prop-types';

import Logger from '../Util/Logger';
import MapUtil from '../Util/MapUtil/MapUtil';
import { isEqual } from 'lodash';

/**
 * Class representing the Legend.
 *
 * @class Legend
 * @extends React.Component
 */
export class Legend extends React.Component {


  /**
   * The className added to this component.
   * @type {String}
   * @private
   */
  className = 'react-geo-legend'

  /**
   * The properties.
   * @type {Object}
   */
  static propTypes = {
    /**
     * The className which should be added.
     * @type {String}
     */
    className: PropTypes.string,

    /**
     * The layer you want to display the legend of.
     * @type {ol.layer.Layer}
     */
    layer: PropTypes.object.isRequired,

    /**
     * An object containing additional request params like "{HEIGHT: 400}" will
     * be transformed to "&HEIGHT=400" an added to the GetLegendGraphic request.
     * @type {Object}
     */
    extraParams: PropTypes.object
  }

  /**
   * Create the Legend.
   *
   * @constructs Legend
   */
  constructor(props) {
    super(props);

    this.state = {
      legendUrl: null
    };
  }

  /**
   * Calls getLegendUrl.
   */
  componentWillMount() {
    let layer = this.props.layer;
    let extraParams = this.props.extraParams;
    this.getLegendUrl(layer, extraParams);
  }

  /**
   * Calls getLegendUrl for dynamic extraParams like scale
   */
  componentWillReceiveProps(nextProps) {
    if(nextProps.extraParams &&
      !(isEqual(this.props.extraParams, nextProps.extraParams))) {
      this.getLegendUrl(nextProps.layer, nextProps.extraParams);
    }
  }

  /**
   * Get the corresponding legendGraphic of a layer. If layer is configured with
   * "legendUrl" this will be used. Otherwise a getLegendGraphic requestString
   * will be created by the MapUtil.
   *
   */
  getLegendUrl(layer, extraParams) {
    let legendUrl;
    if (layer.get('legendUrl')) {
      legendUrl = layer.get('legendUrl');
    } else {
      legendUrl = MapUtil.getLegendGraphicUrl(layer, extraParams);
    }
    this.setState({legendUrl});
  }

  /**
   * onError handler for the rendered img.
   */
  onError() {
    Logger.warn(`Image error for legend of "${this.props.layer.get('name')}".`);
  }

  /**
   * The render function.
   */
  render() {
    let {
      className,
      layer,
      extraParams,
      ...passThroughProps
    } = this.props;

    const finalClassName = className
      ? `${className} ${this.className}`
      : this.className;

    const alt = layer.get('name')
      ? layer.get('name') + ' legend'
      : 'layer legend';

    return (
      <div
        className={finalClassName}
        {...passThroughProps}
      >
        <img
          src={this.state.legendUrl}
          alt={alt}
          onError={this.onError.bind(this)}
        />
      </div>
    );
  }
}

export default Legend;
