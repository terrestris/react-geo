import React from 'react';
import PropTypes from 'prop-types';
import OlLayerTile from 'ol/layer/Tile';
import OlLayerImage from 'ol/layer/Image';
import { Checkbox, Tooltip } from 'antd';

import { Icon } from 'react-fa';

import './AddWmsLayerEntry.less';

/**
 * Class representing a layer parsed from capabilities document.
 * This componment is used in AddWmsPanel
 *
 * @class AddWmsLayerEntry
 * @extends React.Component
 */
export class AddWmsLayerEntry extends React.Component {

  /**
   * The prop types.
   * @type {Object}
   */
  static propTypes = {
    /**
     * Object containing layer information
     * @type {Object}
     */
    wmsLayer: PropTypes.oneOfType([
      PropTypes.instanceOf(OlLayerTile),
      PropTypes.instanceOf(OlLayerImage)]
    ).isRequired,

    /**
     * Function returning a span with the textual representation of this layer
     * Default: Title of the layer and its abstract (if available)
     * @type {Function}
     */
    layerTextTemplateFn: PropTypes.func,

    /**
     * Optional text to be shown in Tooltip for a layer that can be queried
     * @type {Object}
     */
    layerQueryableText: PropTypes.string
  }

  /**
   * Create the AddWmsLayerEntry.
   *
   * @constructs AddWmsLayerEntry
   */
  constructor(props) {
    super(props);
    this.state = {
      copyright: props.wmsLayer.getSource().getAttributions(),
      queryable: props.wmsLayer.get('queryable')
    };
  }

  /**
   * The defaultProps.
   * @type {Object}
   */
  static defaultProps = {
    layerQueryableText: 'Layer is queryable',
    layerTextTemplateFn: (wmsLayer) => {
      const title = wmsLayer.get('title');
      const abstract = wmsLayer.get('abstract');
      const abstractTextSpan = abstract ?
        <span>{`${title} - ${abstract}:`}</span> :
        <span>{`${title}`}</span>;
      return abstractTextSpan;
    }
  }

  /**
   * The render function
   */
  render() {
    const {
      wmsLayer,
      layerTextTemplateFn,
      layerQueryableText
    } = this.props;

    const {
      copyright,
      queryable
    } = this.state;

    const title = wmsLayer.get('title');
    const layerTextSpan = layerTextTemplateFn(wmsLayer);

    return (
      <Checkbox value={title} className="add-wms-layer-checkbox-line">
        <div className="add-wms-layer-entry">
          {layerTextSpan}
          { copyright ? <Icon className="add-wms-add-info-icon" name="copyright" /> : null }
          { queryable ? <Tooltip title={layerQueryableText}><Icon className="add-wms-add-info-icon" name="info" /></Tooltip> : null }
        </div>
      </Checkbox>
    );
  }
}

export default AddWmsLayerEntry;
