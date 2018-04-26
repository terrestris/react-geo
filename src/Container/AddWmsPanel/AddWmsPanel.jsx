import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';
import OlLayerTile from 'ol/layer/Tile';
import OlLayerImage  from 'ol/layer/Image';
import OlMap from 'ol/Map';
import isFunction from 'lodash/isFunction.js';

import Panel from '../../Panel/Panel/Panel.jsx';
import Titlebar from '../../Panel/Titlebar/Titlebar.jsx';
import SimpleButton from '../../Button/SimpleButton/SimpleButton.jsx';
import Logger from '@terrestris/base-util/src/Logger';

import './AddWmsPanel.less';
import AddWmsLayerEntry from './AddWmsLayerEntry/AddWmsLayerEntry.jsx';

/**
 * Panel containing a (checkable) list of AddWmsLayerEntry instances.
 * This class can be used e.g with a result obtained by ol WMS capabilities
 * parser, in particular objects in `Capability.Layer.Layer`
 *
 * @class The AddWmsPanel
 * @extends React.Component
 */
export class AddWmsPanel extends React.Component {

  /**
   * The prop types.
   * @type {Object}
   */
  static propTypes = {
    /**
     * Array containing layers (e.g. `Capability.Layer.Layer` of ol capabilities
     * parser)
     * @type {Array} -- required
     */
    wmsLayers: PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.instanceOf(OlLayerTile),
      PropTypes.instanceOf(OlLayerImage)
    ])).isRequired,

    /**
     * Optional instance of OlMap which is used if onLayerAddToMap is not provided
     * @type {OlMap}
     */
    map: PropTypes.instanceOf(OlMap),

    /**
     * Optional function being called when onAddSelectedLayers or onAddAllLayers
     * is triggered
     * @type {Function}
     */
    onLayerAddToMap: PropTypes.func,

    /**
     * Optional function that is called if cancel button is clicked
     * @type {Function}
     */
    onCancel: PropTypes.func,

    /**
     * Optional function that is called if selection has changed.
     * @type {Function}
     */
    onSelectionChange: PropTypes.func,

    /**
     * Optional text to be shown in button to add all layers
     * @type {String}
     */
    addAllLayersText: PropTypes.string,

    /**
     * Optional text to be shown in button to add selected layers
     * @type {String}
     */
    addSelectedLayersText: PropTypes.string,

    /**
     * Optional text to be shown in cancel button
     * @type {String}
     */
    cancelText: PropTypes.string,

    /**
     * Optional text to be shown in panel title
     * @type {String}
     */
    titleText: PropTypes.string
  }

  /**
   * Create an AddWmsPanel.
   * @constructs AddWmsPanel
   */
  constructor(props) {
    super(props);

    this.state = {
      selectedWmsLayers: []
    };
  }

  /**
   * The defaultProps.
   * @type {Object}
   */
  static defaultProps = {
    addAllLayersText: 'Add all layers',
    addSelectedLayersText: 'Add selected layers',
    cancelText: 'Cancel',
    titleText: 'Add WMS layer'
  }

  /**
   * onSelectedLayersChange - set state for selectedWmsLayers
   *
   * @param {Array} selectedWmsLayers titles of selected WMS layers to set
   * in state
   */
  onSelectedLayersChange = (selectedWmsLayers) => {
    const {
      onSelectionChange
    } = this.props;

    if (isFunction(onSelectionChange)) {
      onSelectionChange(selectedWmsLayers);
    }

    this.setState({selectedWmsLayers});
  }

  /**
   * onAddSelectedLayers - function called if button with key useSelectedBtn is
   * clicked filters wmsLayers given in props by those in selectedWmsLayers of
   * state
   */
  onAddSelectedLayers = () => {
    const  {
      selectedWmsLayers
    } = this.state;

    const {
      onLayerAddToMap,
      map
    } = this.props;

    const filteredLayers = this.props.wmsLayers.filter(
      layer => selectedWmsLayers.includes(layer.get('title'))
    );

    if (onLayerAddToMap) {
      onLayerAddToMap(filteredLayers);
    } else if (map) {
      filteredLayers.forEach(layer => {
        // Add layer to map if it is not added yet
        if (!map.getLayers().getArray().includes(layer) ) {
          map.addLayer(layer);
        }
      });
    } else {
      Logger.warn('Neither map nor onLayerAddToMap given in props. Will do nothing.');
    }
  }

  /**
   * onAddAllLayers - pass all wmsLayers of props to onLayerAddToMap function
   */
  onAddAllLayers = () => {
    const {
      onLayerAddToMap,
      wmsLayers,
      map
    } = this.props;

    if (onLayerAddToMap) {
      onLayerAddToMap(wmsLayers);
    } else if (map) {
      wmsLayers.forEach(layer => {
        // Add layer to map if it is not added yet
        if (!map.getLayers().getArray().includes(layer) ) {
          map.addLayer(layer);
        }
      });
    } else {
      Logger.warn('Neither map nor onLayerAddToMap given in props. Will do nothing.');
    }
  }

  /**
   * The render function.
   */
  render () {
    const {
      wmsLayers,
      onCancel,
      titleText,
      cancelText,
      addAllLayersText,
      addSelectedLayersText,
      ...passThroughOpts
    } = this.props;

    const {
      selectedWmsLayers
    } =  this.state;

    return(
      wmsLayers && wmsLayers.length > 0  ?
        <Panel
          title={titleText}
          bounds="#main"
          className="add-wms-panel"
          {...passThroughOpts}
        >
          <Checkbox.Group onChange={this.onSelectedLayersChange}>
            {wmsLayers.map((layer, idx) =>
              <AddWmsLayerEntry
                wmsLayer={layer}
                key={idx} />
            )}
          </Checkbox.Group>
          <Titlebar tools={[
            <SimpleButton
              size='small'
              key="useSelectedBtn"
              disabled={selectedWmsLayers.length === 0}
              onClick={this.onAddSelectedLayers}
            >
              {addSelectedLayersText}
            </SimpleButton>,
            <SimpleButton
              size='small'
              key="useAllBtn"
              onClick={this.onAddAllLayers}
            >
              {addAllLayersText}
            </SimpleButton>,
            onCancel ?
              <SimpleButton
                size='small'
                key="cancelBtn"
                onClick={onCancel}
              >
                {cancelText}
              </SimpleButton> : null
          ]} />
        </Panel>
        : null
    );
  }
}

export default AddWmsPanel;
