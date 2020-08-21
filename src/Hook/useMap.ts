import { useContext } from 'react';
import OlMap from 'ol/Map';
import MapContext from '../Context/MapContext/MapContext';

export const useMap = (): OlMap => {
  return useContext(MapContext);
};
