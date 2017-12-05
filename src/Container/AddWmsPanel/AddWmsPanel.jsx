import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';

import { Panel, SimpleButton, Titlebar } from '../../index';

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
    wmsLayers: PropTypes.arrayOf(PropTypes.object).isRequired,

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
    onLayerAddToMap: () => {},
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

    const filteredLayers = this.props.wmsLayers.filter(
      layer => selectedWmsLayers.includes(layer.Title)
    );
    this.props.onLayerAddToMap(filteredLayers);
  }

  /**
   * onAddAllLayers - pass all wmsLayers of props to onLayerAddToMap function
   */
  onAddAllLayers = () => {
    this.props.onLayerAddToMap(this.props.wmsLayers);
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
      wmsLayers ?
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
                onClick={this.props.onCancel}
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
