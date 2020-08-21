import OlMap from 'ol/Map';
import React from 'react';

const MapContext = React.createContext<OlMap>(null);
export default MapContext;
