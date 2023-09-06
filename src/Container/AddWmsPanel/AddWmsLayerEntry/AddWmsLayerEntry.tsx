import './AddWmsLayerEntry.less';

import { faCopyright, faInfo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { WmsLayer } from '@terrestris/react-util/dist/Util/typeUtils';
import { Checkbox, Tooltip } from 'antd';
import { FrameState } from 'ol/Map';
import { Attribution as OlAttribution } from 'ol/source/Source';
import React, { useEffect, useState } from 'react';

export type AddWmsLayerEntryProps = {
  /**
   * Object containing layer information
   */
  wmsLayer: WmsLayer;
  /**
   * Function returning a span with the textual representation of this layer
   * Default: Title of the layer and its abstract (if available)
   */
  layerTextTemplateFn?: (layer: WmsLayer) => JSX.Element;
  /**
   * Optional text to be shown in Tooltip for a layer that can be queried
   */
  layerQueryableText?: string;
  /**
   * ARIA label for the icon which indicates that the layer has copyright / attribution
   * information. This label increases the accessibility of the generated HTML. If not
   * set explicitly, a generic English label will be added. Make sure to translate this
   * to the page language if needed.
   */
  ariaLabelCopyright?: string;
  /**
   * ARIA label for the icon which indicates that the layer is queryable. This label
   * increases the accessibility of the generated HTML. If not set explicitly, a generic
   * English label will be added. Make sure to translate this to the page language if
   * needed.
   */
  ariaLabelQueryable?: string;
};

/**
 * Class representing a layer parsed from capabilities document.
 * This component is used in AddWmsPanel
 *
 */
export const AddWmsLayerEntry: React.FC<AddWmsLayerEntryProps> = ({
  wmsLayer,
  layerQueryableText = 'Layer is queryable',
  ariaLabelCopyright = 'Icon indicating that attribution information for layer is available',
  ariaLabelQueryable = 'Icon indicating that the layer is queryable',
  layerTextTemplateFn = (layer: WmsLayer) => {
    const title = layer.get('title');
    const abstract = layer.get('abstract');
    return abstract ?
      <span>{`${title} - ${abstract}:`}</span> :
      <span>{`${title}`}</span>;
  }
}) => {

  const [copyright, setCopyright] = useState<string | null>(null);
  const [queryable, setQueryable] = useState<boolean>();

  useEffect(() => {
    if (wmsLayer) {
      if (wmsLayer.getSource()?.getAttributions()) {
        const attributionsFn = wmsLayer.getSource()?.getAttributions() as OlAttribution;
        const attributions = (attributionsFn({} as FrameState));
        if (attributions?.length > 0) {
          if (Array.isArray(attributions)) {
            setCopyright(attributions.join(', '));
          } else {
            setCopyright(attributions);
          }
        }
      }
      setQueryable(!!wmsLayer.get('queryable'));
    }
  }, [wmsLayer]);

  return (
    <Checkbox
      className="add-wms-layer-checkbox-line"
      value={wmsLayer.get('title')}
    >
      <div className="add-wms-layer-entry">
        {layerTextTemplateFn(wmsLayer)}
        {
          copyright && (
            <Tooltip title={copyright}>
              <FontAwesomeIcon
                className="add-wms-add-info-icon attribution-info"
                icon={faCopyright}
                aria-label={ariaLabelCopyright}
              />
            </Tooltip>
          )
        }
        {
          queryable && (
            <Tooltip title={layerQueryableText}>
              <FontAwesomeIcon
                className="add-wms-add-info-icon queryable-info"
                icon={faInfo}
                aria-label={ariaLabelQueryable}
              />
            </Tooltip>
          )
        }
      </div>
    </Checkbox >
  );
};

export default AddWmsLayerEntry;
