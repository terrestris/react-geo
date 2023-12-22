import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan } from '@fortawesome/free-solid-svg-icons';

type BackgroundPreviewProps = {
  isBackgroundImage: boolean;
  selectedLayer: OlLayer | undefined;
  noBackgroundTitle: string;
};

const BackgroundPreview: React.FC<BackgroundPreviewProps> = ({
  isBackgroundImage,
  selectedLayer,
  noBackgroundTitle,
}) => {
  return (
    <div className="bg-preview">
      <div className="overview-wrapper">
        {/* ... */}
        {selectedLayer ? (
          <span className="layer-title">{selectedLayer.get('name')}</span>
        ) : (
          <span className="layer-title-no-background">{noBackgroundTitle}</span>
        )}
      </div>
    </div>
  );
};

export default BackgroundPreview;