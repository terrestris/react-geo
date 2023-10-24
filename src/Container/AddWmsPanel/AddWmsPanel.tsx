import './AddWmsPanel.less';

import Logger from '@terrestris/base-util/dist/Logger';
import useMap from '@terrestris/react-util/dist/Hooks/useMap/useMap';
import { WmsLayer } from '@terrestris/react-util/dist/Util/typeUtils';
import { Checkbox } from 'antd';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import _isFunction from 'lodash/isFunction';
import React, { useState } from 'react';

import SimpleButton from '../../Button/SimpleButton/SimpleButton';
import AddWmsLayerEntry from './AddWmsLayerEntry/AddWmsLayerEntry';

export type AddWmsPanelProps = {
  /**
   * Array containing layers (e.g. `Capability.Layer.Layer` of ol capabilities
   * parser)
   */
  wmsLayers: WmsLayer[];
  /**
   * Optional text to be shown in button to add all layers
   */
  addAllLayersText?: string;
  /**
   * Optional text to be shown in button to add selected layers
   */
  addSelectedLayersText?: string;
  /**
   * Optional text to be shown in cancel button
   */
  cancelText?: string;
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
};

/**
 * Panel containing a (checkable) list of AddWmsLayerEntry instances.
 * This class can be used e.g with a result obtained by ol WMS capabilities
 * parser, in particular objects in `Capability.Layer.Layer`
 *
 */
export const AddWmsPanel: React.FC<AddWmsPanelProps> = ({
  addAllLayersText = 'Add all layers',
  addSelectedLayersText = 'Add selected layers',
  cancelText = 'Cancel',
  onCancel = undefined,
  onLayerAddToMap,
  onSelectionChange = () => { },
  wmsLayers = []
}) => {

  const [selectedWmsLayers, setSelectedWmsLayers] = useState<string[]>([]);

  const map = useMap();

  const onSelectedLayersChange = (selection: CheckboxValueType[]) => {
    const newSelection = selection.map(s => s as string);
    onSelectionChange(newSelection);
    setSelectedWmsLayers(newSelection);
  };

  const onAddSelectedLayers = () => {
    const filteredLayers = wmsLayers.filter(
      layer => selectedWmsLayers.includes(layer.get('title'))
    );
    if (onLayerAddToMap) {
      onLayerAddToMap(filteredLayers);
    } else if (map) {
      addLayers(filteredLayers);
    } else {
      Logger.warn('Neither map nor onLayerAddToMap provided. Will do nothing.');
    }
  };

  const onAddAllLayers = () => {
    if (onLayerAddToMap) {
      onLayerAddToMap(wmsLayers);
    } else if (map) {
      addLayers(wmsLayers);
    } else {
      Logger.warn('Neither map nor onLayerAddToMap provided. Will do nothing.');
    }
  };

  const addLayers = (layersToAdd: WmsLayer[]) => {
    if (!map) {
      return;
    }
    layersToAdd.forEach(layer => {
      // add layer to map if it is not added yet
      if (!map.getLayers().getArray().includes(layer)) {
        map.addLayer(layer);
      }
    });
  };

  if (wmsLayers.length < 1) {
    return <></>;
  }

  return (
    <div
      className="add-wms-panel"
      role="dialog"
    >
      <div role="list" >
        <Checkbox.Group
          onChange={onSelectedLayersChange}
        >
          {
            wmsLayers.map((layer, idx) =>
              <div role="listitem" key={idx}>
                <AddWmsLayerEntry
                  wmsLayer={layer}
                  map={map}
                />
              </div>
            )
          }
        </Checkbox.Group>
      </div>
      <div className="buttons">
        <SimpleButton
          size="small"
          disabled={selectedWmsLayers.length === 0}
          onClick={onAddSelectedLayers}
        >
          {addSelectedLayersText}
        </SimpleButton>
        <SimpleButton
          size="small"
          onClick={onAddAllLayers}
        >
          {addAllLayersText}
        </SimpleButton>
        {
          onCancel &&
          <SimpleButton
            size="small"
            onClick={onCancel}
          >
            {cancelText}
          </SimpleButton>
        }
      </div>
    </div>
  );
};
export default AddWmsPanel;
