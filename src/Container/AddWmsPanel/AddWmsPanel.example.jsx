import React from 'react';
import { render } from 'react-dom';
import { AddWmsPanel, SimpleButton } from '../../index.js';

import OlMap from 'ol/map';
import OlView from 'ol/view';
import OlLayerTile from 'ol/layer/tile';
import OlLayerImage from 'ol/layer/image';
import OlSourceOsm from 'ol/source/osm';
import OlSourceImageWms from 'ol/source/imagewms';
import OlProjection from 'ol/proj';
import OlWMSCapabilities from 'ol/format/wmscapabilities';

import { get } from 'lodash';

//
// ***************************** SETUP *****************************************
//
const defaultView = new OlView({
  center: OlProjection.fromLonLat([7.40570, 53.81566]),
  zoom: 4
});
const map = new OlMap({
  layers: [
    new OlLayerTile({
      name: 'OSM',
      source: new OlSourceOsm()
    })
  ],
  view: defaultView
});

//
// ***************************** SETUP END *************************************
//

/**
 * function that creates an OpenLayers image layer for each provided item in
 * selectedWmsLayers
 */
const onLayerAddToMap = (selectedWmsLayers) => {
  selectedWmsLayers.map((wmsLayerObj) => {
    const getMapUrl = get(wmsLayerObj,'wmsGetMapConfig.DCPType[0].HTTP.Get.OnlineResource');
    const tileLayer = new OlLayerImage({
      opacity: 1,
      title: get(wmsLayerObj, 'Name'),
      source: new OlSourceImageWms({
        url: getMapUrl,
        params: {
          'LAYERS': get(wmsLayerObj, 'Name')
        }
      })
    });
    map.addLayer(tileLayer);
  });
};

// Please note: CORS headers must be set on server providing capabilities document. Otherwise proxy needed.
const WMS_CAPABILITIES_URL = 'http://ows.terrestris.de/osm/service?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetCapabilities';

/**
 * fetch capabilities document onClick and re-render on success
 */
const onClick = () => {
  fetch(WMS_CAPABILITIES_URL)
    .then((response) => response.text())
    .then((data) => {

      const wmsCapabilitiesParser = new OlWMSCapabilities();
      const caps = wmsCapabilitiesParser.read(data);
      const wmsVersion = get(caps,'version');
      const wmsAttribution = get(caps,'Service.AccessConstraints');
      const wmsGetMapConfig = get(caps, 'Capability.Request.GetMap');
      const wmsGetFeatureInfoConfig = get(caps, 'Capability.Request.GetFeatureInfo');

      return get(caps,'Capability.Layer.Layer').map(layer => Object.assign(layer,  {wmsVersion, wmsAttribution, wmsGetMapConfig, wmsGetFeatureInfoConfig}) );
    }).then((wmsLayers) => {
      doRender(wmsLayers);
    });
};

/**
 * wrapper function for render
 */
const doRender = (wmsLayers) => {
  render(
    <div style={{
      height: '500px'
    }}>
      <div id="map" style={{
        width: '400px',
        height: '400px',
        right: '100px',
        position: 'absolute'
      }} />
      <div className="example-block">
        <SimpleButton
          onClick={onClick}
        >
          Fetch capabilities of OWS terrestris
        </SimpleButton>
        <AddWmsPanel
          key="1"
          wmsLayers={wmsLayers}
          onLayerAddToMap={onLayerAddToMap}
          draggable={false}
          t={t => t}
          width={500}
          height={400}
          x={0}
          y={100}
        />
      </div>
    </div>,

    // Target element
    document.getElementById('exampleContainer'),

    // Callback
    () => {
      map.setTarget('map');
    }
  );
};

doRender([]);
