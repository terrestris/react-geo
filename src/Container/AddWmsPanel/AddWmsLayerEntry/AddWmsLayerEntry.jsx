import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Tooltip } from 'antd';
import { Icon } from 'react-fa';

import './AddWmsLayerEntry.less';

/**
 * Class representating a layer parsed from capabilities document.
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
    wmsLayer: PropTypes.shape({
      wmsAttribution: PropTypes.string,
      queryable: PropTypes.boolean,
      Abstract: PropTypes.string,
      Title: PropTypes.string
    }).isRequired,

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
      copyright: props.wmsLayer.wmsAttribution,
      queryable: props.wmsLayer.queryable
    };
  }

  /**
   * The defaultProps.
   * @type {Object}
   */
  static defaultProps = {
    layerQueryableText: 'Layer is queryable'
  }

  /**
   * The render function
   */
  render() {
    const {
      wmsLayer,
      layerQueryableText
    } = this.props;

    const {
      copyright,
      queryable
    } = this.state;

    const abstractTextSpan = wmsLayer.Abstract ?
      <span>{`${wmsLayer.Title} - ${wmsLayer.Abstract}:`}</span> :
      <span>{`${wmsLayer.Title}`}</span>;

    return (
      <Checkbox value={wmsLayer.Title} className="add-wms-layer-checkbox-line">
        <div className="add-wms-layer-entry">
          {abstractTextSpan}
          { copyright ? <Icon className="add-wms-add-info-icon" name="copyright" /> : null }
          { queryable ? <Tooltip title={layerQueryableText}><Icon className="add-wms-add-info-icon" name="info" /></Tooltip> : null }
        </div>
      </Checkbox>
    );
  }
}

export default AddWmsLayerEntry;
