import { useContext } from 'react';
import OlMap from 'ol/Map';
import MapContext from '../Context/MapContext/MapContext';

export const useMap = (): OlMap|null => {
  return useContext(MapContext);
};

export default useMap;
