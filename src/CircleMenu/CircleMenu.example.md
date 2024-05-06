This demonstrates the usage of the CircleMenu.

CircleMenu in a Map (click the red feature):

```jsx
import { faBullhorn,faChartLine, faLink, faPencil, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SimpleButton from '@terrestris/react-geo/dist/Button/SimpleButton/SimpleButton';
import CircleMenu from '@terrestris/react-geo/dist/CircleMenu/CircleMenu';
import MapComponent from '@terrestris/react-geo/dist/Map/MapComponent/MapComponent';
import OlFeature from 'ol/Feature';
import OlGeomPoint from 'ol/geom/Point';
import OlLayerTile from 'ol/layer/Tile';
import OlLayerVector from 'ol/layer/Vector';
import OlMap from 'ol/Map';
import { fromLonLat } from 'ol/proj';
import OlSourceOSM from 'ol/source/OSM';
import OlSourceVector from 'ol/source/Vector';
import OlStyleCircle from 'ol/style/Circle';
import OlStyleFill from 'ol/style/Fill';
import OlStyleStyle from 'ol/style/Style';
import OlView from 'ol/View';
import React, {
  useMemo,
  useState} from 'react';

const CircleMenuExample = () => {

  const [position, setPosition] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  const map = useMemo(() => {
    const osmLayer = new OlLayerTile({
      source: new OlSourceOSM()
    });

    const featureLayer = new OlLayerVector({
      source: new OlSourceVector({
        features: [new OlFeature({
          geometry: new OlGeomPoint(fromLonLat([8, 50]))
        })]
      }),
      style: new OlStyleStyle({
        image: new OlStyleCircle({
          radius: 10,
          fill: new OlStyleFill({
            color: '#C62148'
          })
        })
      })
    });

    const newMap = new OlMap({
      view: new OlView({
        center: fromLonLat([8, 50]),
        zoom: 4
      }),
      layers: [
        osmLayer,
        featureLayer
      ],
      interactions: [],
      controls: []
    });

    newMap.on('singleclick', evt => {
      const evtMap = evt.map;
      const mapEl = document.getElementById('map');
      const evtPixel = evtMap.getPixelFromCoordinate(evt.coordinate);

      if (evtMap.hasFeatureAtPixel(evtPixel)) {
        const feature = evtMap.getFeaturesAtPixel(evtPixel);
        const featurePixel = evtMap.getPixelFromCoordinate(feature[0].getGeometry().getCoordinates());

        setIsVisible(true);
        setPosition([
          featurePixel[0] + mapEl.offsetLeft,
          featurePixel[1] + mapEl.offsetTop,
        ]);
      } else {
        setIsVisible(false);
        setPosition([]);
      }
    });

    return newMap;
  }, []);

  return (
    <>
      <MapComponent
        map={map}
        style={{
          height: '400px'
        }}
      />
      {
        isVisible && (
          <CircleMenu
            position={position}
            diameter={80}
            animationDuration={500}
          >
            <SimpleButton
              icon={
                <FontAwesomeIcon
                  icon={faPencil}
                />
              }
              shape="circle"
            />
            <SimpleButton
              icon={
                <FontAwesomeIcon
                  icon={faChartLine}
                />
              }
              shape="circle"
            />
            <SimpleButton
              icon={
                <FontAwesomeIcon
                  icon={faLink}
                />
              }
              shape="circle"
            />
            <SimpleButton
              icon={
                <FontAwesomeIcon
                  icon={faThumbsUp}
                />
              }
              shape="circle"
            />
            <SimpleButton
              icon={
                <FontAwesomeIcon
                  icon={faBullhorn}
                />
              }
              shape="circle"
            />
          </CircleMenu>
        )
      }
    </>
  );
}

<CircleMenuExample />
```
