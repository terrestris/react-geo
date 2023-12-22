import React, { useState, useEffect, useRef } from 'react';
import OlOverviewMap from 'ol/control/OverviewMap';
import OlLayerBase from 'ol/layer/Base';
import OlLayer from 'ol/layer/Layer';
import OlLayerTile from 'ol/layer/Tile';
import OlLayerImage from 'ol/layer/Image';
import { ObjectEvent } from 'ol/Object';
import { getUid } from 'ol/util';
import useMap from '../Hook/useMap';
import LayerCard from './LayerCard';
import ToggleButton from './ToggleButton';
import BackgroundPreview from './BackgroundPreview';
import './BackgroundLayerChooser.less';

export type BackgroundLayerChooserProps = {
  // ...props
};

const BackgroundLayerChooser: React.FC<BackgroundLayerChooserProps> = ({ /* ...props */ }) => {
  // State and useEffects
  // ...

  return (
    <div className={'bg-layer-chooser'}>
      {/* LayerCard component */}
      {/* ... */}
      <LayerCard
        layers={layers}
        selectedLayer={selectedLayer}
        onLayerSelect={onLayerSelect}
        backgroundLayerFilter={backgroundLayerFilter}
        zoom={zoom}
        center={center}
        allowEmptyBackground={allowEmptyBackground}
        noBackgroundTitle={noBackgroundTitle}
      />
      
      {/* ToggleButton component */}
      {/* ... */}
      <ToggleButton
        layerOptionsVisible={layerOptionsVisible}
        setLayerOptionsVisible={setLayerOptionsVisible}
        buttonTooltip={buttonTooltip}
        onClick={() => setLayerOptionsVisible(!layerOptionsVisible)}
      />

      {/* BackgroundPreview component */}
      {/* ... */}
      <BackgroundPreview
        isBackgroundImage={isBackgroundImage}
        selectedLayer={selectedLayer}
        noBackgroundTitle={noBackgroundTitle}
      />
    </div>
  );
};

export default BackgroundLayerChooser;