import React from 'react';
import BackgroundLayerPreview from '../BackgroundLayerPreview/BackgroundLayerPreview';
import SimpleButton from '../Button/SimpleButton/SimpleButton';

type LayerCardProps = {
  layers: OlLayer[];
  selectedLayer: OlLayer | undefined;
  onLayerSelect: (layer: OlLayer) => void;
  backgroundLayerFilter: (layer: OlLayerBase) => boolean;
  zoom: number | undefined;
  center: number[] | undefined;
  allowEmptyBackground: boolean;
  noBackgroundTitle: string;
};

const LayerCard: React.FC<LayerCardProps> = ({
  layers,
  selectedLayer,
  onLayerSelect,
  backgroundLayerFilter,
  zoom,
  center,
  allowEmptyBackground,
  noBackgroundTitle,
}) => {
  return (
    <div className="layer-cards">
      {layers.map((layer) => (
        <BackgroundLayerPreview
          key={getUid(layer)}
          activeLayer={selectedLayer}
          onClick={(l) => onLayerSelect(l)}
          layer={layer}
          backgroundLayerFilter={backgroundLayerFilter}
          zoom={zoom}
          center={center}
        />
      ))}
      {allowEmptyBackground && (
        <SimpleButton
          onMouseOver={() => {
            selectedLayer?.setVisible(false);
          }}
          onClick={() => {
            selectedLayer?.setVisible(false);
            onLayerSelect(undefined);
          }}
          className="no-background"
        >
          {/* ... */}
        </SimpleButton>
      )}
    </div>
  );
};

export default LayerCard;