import './AddWmsPanel.less';
import './AddWmsPanel.less';

import Logger from '@terrestris/base-util/dist/Logger';
import { WmsLayer } from '@terrestris/react-util/dist/Util/typeUtils';
import { Checkbox } from 'antd';
import _isFunction from 'lodash/isFunction';
import OlMap from 'ol/Map';
import * as React from 'react';

import SimpleButton from '../../Button/SimpleButton/SimpleButton';
import AddWmsLayerEntry from './AddWmsLayerEntry/AddWmsLayerEntry';

interface OwnProps {
  /**
   * Optional text to be shown in button to add all layers
   */
  addAllLayersText: string;
  /**
   * Optional text to be shown in button to add selected layers
   */
  addSelectedLayersText: string;
  /**
   * Optional text to be shown in cancel button
   */
  cancelText: string;
  /**
   * Array containing layers (e.g. `Capability.Layer.Layer` of ol capabilities
   * parser)
   */
  wmsLayers: Array<WmsLayer>;
  /**
   * Optional instance of OlMap which is used if onLayerAddToMap is not provided
   */
  map?: OlMap;
  /**
   * Optional function being called when onAddSelectedLayers or onAddAllLayers
   * is triggered
   */
  onLayerAddToMap?: (layers: Array<WmsLayer>) => void;
  /**
   * Optional function that is called if cancel button is clicked
   */
  onCancel?: () => void;
  /**
   * Optional function that is called if selection has changed.
   */
  onSelectionChange?: (selection: string[]) => void;
}

interface AddWmsLayerState {
  selectedWmsLayers: string[];
}

export type AddWmsPanelProps = OwnProps;

/**
 * Panel containing a (checkable) list of AddWmsLayerEntry instances.
 * This class can be used e.g with a result obtained by ol WMS capabilities
 * parser, in particular objects in `Capability.Layer.Layer`
 *
 * @class The AddWmsPanel
 * @extends React.Component
 */
export class AddWmsPanel extends React.Component<AddWmsPanelProps, AddWmsLayerState> {

  /**
   * The defaultProps.
   */
  static defaultProps = {
    wmsLayers: [],
    addAllLayersText: 'Add all layers',
    addSelectedLayersText: 'Add selected layers',
    cancelText: 'Cancel',
  };

  /**
   * Create an AddWmsPanel.
   * @constructs AddWmsPanel
   */
  constructor(props: AddWmsPanelProps) {
    super(props);

    this.state = {
      selectedWmsLayers: []
    };
  }

  /**
   * onSelectedLayersChange - set state for selectedWmsLayers
   *
   * @param selectedWmsLayers titles of selected WMS layers to set
   * in state
   */
  onSelectedLayersChange = (selectedWmsLayers: string[]) => {
    const {
      onSelectionChange
    } = this.props;

    if (_isFunction(onSelectionChange)) {
      onSelectionChange(selectedWmsLayers);
    }

    this.setState({ selectedWmsLayers });
  };

  /**
   * onAddSelectedLayers - function called if button with key useSelectedBtn is
   * clicked filters wmsLayers given in props by those in selectedWmsLayers of
   * state
   */
  onAddSelectedLayers = () => {
    const {
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
        if (!map.getLayers().getArray().includes(layer)) {
          map.addLayer(layer);
        }
      });
    } else {
      Logger.warn('Neither map nor onLayerAddToMap given in props. Will do nothing.');
    }
  };

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
        if (!map.getLayers().getArray().includes(layer)) {
          map.addLayer(layer);
        }
      });
    } else {
      Logger.warn('Neither map nor onLayerAddToMap given in props. Will do nothing.');
    }
  };

  /**
   * The render function.
   */
  render() {
    const {
      wmsLayers,
      onCancel,
      cancelText,
      addAllLayersText,
      addSelectedLayersText
    } = this.props;

    const {
      selectedWmsLayers
    } = this.state;

    return (
      wmsLayers && wmsLayers.length > 0 &&
      <div
        className="add-wms-panel"
        role="dialog"
      >
        <div role="list" >
          <Checkbox.Group onChange={value => this.onSelectedLayersChange(value.map(v => v as string))}>
            {wmsLayers.map((layer, idx) =>
              <div role="listitem" key={idx}>
                <AddWmsLayerEntry
                  wmsLayer={layer}
                />
              </div>
            )}
          </Checkbox.Group>
        </div>
        <div className="buttons">
          <SimpleButton
            size="small"
            key="useSelectedBtn"
            disabled={selectedWmsLayers.length === 0}
            onClick={this.onAddSelectedLayers}
          >
            {addSelectedLayersText}
          </SimpleButton>
          <SimpleButton
            size="small"
            key="useAllBtn"
            onClick={this.onAddAllLayers}
          >
            {addAllLayersText}
          </SimpleButton>
          {
            onCancel &&
            <SimpleButton
              size="small"
              key="cancelBtn"
              onClick={onCancel}
            >
              {cancelText}
            </SimpleButton>
          }
        </div>
      </div>
    );
  }
}

export default AddWmsPanel;
