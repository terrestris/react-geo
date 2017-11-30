import React from 'react';
import OlSourceOsm from 'ol/source/osm';
import OlSourceVector from 'ol/source/vector';
import OlLayerTile from 'ol/layer/tile';
import OlLayerVector from 'ol/layer/vector';
import OlFeature from 'ol/feature';
import OlGeomPoint from 'ol/geom/point';
import OlView from 'ol/view';
import OlMap from 'ol/map';
import OlStyleStyle from 'ol/style/style';
import OlStyleCircle from 'ol/style/circle';
import OlStyleFill from 'ol/style/fill';
import { render } from 'react-dom';
import {
  CircleMenu,
  SimpleButton,
  MapComponent,
  MapProvider,
  mappify
} from '../index.js';

let visibleButton = false;
let visibleMap = false;

/**
 * Setup
 */
const buttonCoords = [100, 100];
let mapMenuCoords;

// Prepare map
const mapPromise = new Promise((resolve) => {
  const osmLayer = new OlLayerTile({
    source: new OlSourceOsm()
  });
  const featureLayer = new OlLayerVector({
    source: new OlSourceVector({
      features: [new OlFeature({
        geometry: new OlGeomPoint([
          135.1691495,
          34.6565482
        ])
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

  const map = new OlMap({
    view: new OlView({
      center: [
        135.1691495,
        34.6565482
      ],
      projection: 'EPSG:4326',
      zoom: 16,
    }),
    layers: [osmLayer,featureLayer],
    interactions: []
  });

  // show menu when feature clicked
  map.on('singleclick', (evt) => {
    const mapEl = document.getElementById('map');
    const pixel = map.getPixelFromCoordinate([135.1691495, 34.6565482]);
    const evtPixel = map.getPixelFromCoordinate(evt.coordinate);
    if(map.hasFeatureAtPixel(evtPixel)) {
      visibleMap = true;
      mapMenuCoords = [
        pixel[0] + mapEl.offsetLeft,
        pixel[1] + mapEl.offsetTop,
      ];
    } else {
      visibleMap = false;
    }
    doRender();
  });

  resolve(map);
});
const Map = mappify(MapComponent);

/**
 * The wrapper is needed to reRender the DomTree. Don't worry about it.
 * You probably won't need it in your application.
 */
const doRender = () => {
  render(
    <div>
      <div className="example-block" style={{
        width: 500,
        height: 200
      }}>
        <div>CircleMenu with segment as submenu:</div>
        <SimpleButton
          id="segmentButton"
          shape="circle"
          icon="plus"
          style={{
            position: 'absolute',
            top: buttonCoords[0] + 'px',
            left: buttonCoords[1] + 'px'
          }}
          onClick={() => {
            // TODO replace with evt.target once it is given to the callback
            const button = document.getElementById('segmentButton');
            visibleButton = !visibleButton;
            if (visibleButton) {
              button.style.transform = 'rotate(45deg)';
            } else {
              button.style.transform = 'rotate(0deg)';
            }
            doRender();
          }}
        />
        {visibleButton ?
          <CircleMenu
            style={{
              position: 'absolute',
              background: 'none',
              border: 'none'
            }}
            position={[
              buttonCoords[0] + 14, // buttonX - buttonWidth/2
              buttonCoords[1] + 14 // buttonY - buttonHeight/2
            ]}
            diameter={80}
            animationDuration={500}
            segmentAngles={[0, 90]}
          >
            <SimpleButton icon="floppy-o" shape="circle" />
            <SimpleButton icon="trash-o" shape="circle" />
            <SimpleButton icon="pencil" shape="circle" />
          </CircleMenu>
          : null
        }
      </div>
      <div className="example-block">
        <span>CircleMenu in a Map (click the red feature)</span>
        <MapProvider map={mapPromise}>
          <Map style={{
            width: '512px',
            height: '512px'
          }} />
        </MapProvider>
        {visibleMap ?
          <CircleMenu
            position={mapMenuCoords}
            diameter={80}
            animationDuration={500}
          >
            <SimpleButton icon="pencil" shape="circle" />
            <SimpleButton icon="line-chart" shape="circle" />
            <SimpleButton icon="link" shape="circle" />
            <SimpleButton icon="thumbs-o-up" shape="circle" />
            <SimpleButton icon="bullhorn" shape="circle" />
          </CircleMenu>
          : null
        }
      </div>
    </div>,
    // Target
    document.getElementById('exampleContainer')
  );
};

doRender();
