// LayerTitleComponent.tsx
import React from 'react';

type LayerTitleProps = {
  title: string;
};

const LayerTitleComponent: React.FC<LayerTitleProps> = ({ title }) => {
  return <span className="layer-title">{title}</span>;
};

export default LayerTitleComponent;
