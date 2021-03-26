import * as React from 'react';
import { Checkbox } from 'antd';
import OlLayerTile from 'ol/layer/Tile';
import OlLayerImage  from 'ol/layer/Image';
import OlMap from 'ol/Map';

import _isFunction from 'lodash/isFunction';

import Panel, { PanelProps } from '../../Panel/Panel/Panel';
import Titlebar from '../../Panel/Titlebar/Titlebar';
import SimpleButton from '../../Button/SimpleButton/SimpleButton';
import Logger from '@terrestris/base-util/dist/Logger';

import AddWmsLayerEntry from './AddWmsLayerEntry/AddWmsLayerEntry';

import './AddWmsPanel.less';

interface DefaultProps {
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
   * Optional text to be shown in panel title
   */
  titleText: string;
  /**
   * Array containing layers (e.g. `Capability.Layer.Layer` of ol capabilities
   * parser)
   */
  wmsLayers: Array<OlLayerTile | OlLayerImage>;
}

interface BaseProps {
  /**
   * Optional instance of OlMap which is used if onLayerAddToMap is not provided
   */
  map: OlMap;
  /**
   * Optional function being called when onAddSelectedLayers or onAddAllLayers
   * is triggered
   */
  onLayerAddToMap?: (layers: Array<OlLayerTile | OlLayerImage>) => void;
  /**
   * Optional function that is called if cancel button is clicked
   */
  onCancel?: () => void;
  /**
   * Optional function that is called if selection has changed.
   */
  onSelectionChange?: (selection: any[]) => void;
}

interface AddWmsLayerState {
  selectedWmsLayers: Array<OlLayerTile | OlLayerImage>;
}

export type AddWmsPanelProps = BaseProps & Partial<DefaultProps> & PanelProps;

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
  static defaultProps: DefaultProps = {
    wmsLayers: [],
    addAllLayersText: 'Add all layers',
    addSelectedLayersText: 'Add selected layers',
    cancelText: 'Cancel',
    titleText: 'Add WMS layer'
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
  onSelectedLayersChange = (selectedWmsLayers) => {
    const {
      onSelectionChange
    } = this.props;

    if (_isFunction(onSelectionChange)) {
      onSelectionChange(selectedWmsLayers);
    }

    this.setState({selectedWmsLayers});
  };

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
        if (!map.getLayers().getArray().includes(layer) ) {
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
  render () {
    const {
      wmsLayers,
      onCancel,
      titleText,
      cancelText,
      addAllLayersText,
      addSelectedLayersText,
      ...passThroughProps
    } = this.props;

    const {
      selectedWmsLayers
    } =  this.state;

    return (
      wmsLayers && wmsLayers.length > 0  ?
        <Panel
          title={titleText}
          bounds="#main"
          className="add-wms-panel"
          {...passThroughProps}
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
              size="small"
              key="useSelectedBtn"
              disabled={selectedWmsLayers.length === 0}
              onClick={this.onAddSelectedLayers}
            >
              {addSelectedLayersText}
            </SimpleButton>,
            <SimpleButton
              size="small"
              key="useAllBtn"
              onClick={this.onAddAllLayers}
            >
              {addAllLayersText}
            </SimpleButton>,
            onCancel ?
              <SimpleButton
                size="small"
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
