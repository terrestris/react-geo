import * as React from 'react';

import { Attribution as OlAttribution } from 'ol/source/Source';

import { Checkbox, Tooltip } from 'antd';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopyright, faInfo } from '@fortawesome/free-solid-svg-icons';

import { WmsLayer } from '../../../Util/typeUtils';

import './AddWmsLayerEntry.less';

interface AddWmsLayerEntryProps {
  /**
   * Function returning a span with the textual representation of this layer
   * Default: Title of the layer and its abstract (if available)
   */
  layerTextTemplateFn: (layer: WmsLayer) => React.ReactNode;
  /**
   * Optional text to be shown in Tooltip for a layer that can be queried
   */
  layerQueryableText: string;
  /**
   * Object containing layer information
   */
  wmsLayer: WmsLayer;
}

interface AddWmsLayerEntryState {
  copyright: OlAttribution | null;
  queryable: boolean;
}

/**
 * Class representing a layer parsed from capabilities document.
 * This componment is used in AddWmsPanel
 *
 * @class AddWmsLayerEntry
 * @extends React.Component
 */
export class AddWmsLayerEntry extends React.Component<AddWmsLayerEntryProps, AddWmsLayerEntryState> {

  /**
   * The defaultProps.
   */
  static defaultProps = {
    layerQueryableText: 'Layer is queryable',
    layerTextTemplateFn: (wmsLayer: WmsLayer) => {
      const title = wmsLayer.get('title');
      const abstract = wmsLayer.get('abstract');
      return abstract ?
        <span>{`${title} - ${abstract}:`}</span> :
        <span>{`${title}`}</span>;
    }
  };

  /**
   * Create the AddWmsLayerEntry.
   *
   * @constructs AddWmsLayerEntry
   */
  constructor(props: AddWmsLayerEntryProps) {
    super(props);
    // TODO: getAttributions is not @api and returns a function in v6.5
    this.state = {
      copyright: props.wmsLayer.getSource()?.getAttributions() || null,
      queryable: props.wmsLayer.get('queryable')
    };
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
          {
            copyright ? (
              <FontAwesomeIcon
                className="add-wms-add-info-icon attribution-info"
                icon={faCopyright}
              />
            )
              : null
          }
          {
            queryable ? (
              <Tooltip title={layerQueryableText}>
                <FontAwesomeIcon
                  className="add-wms-add-info-icon queryable-info"
                  icon={faInfo}
                />
              </Tooltip>
            )
              : null
          }
        </div>
      </Checkbox>
    );
  }
}

export default AddWmsLayerEntry;
