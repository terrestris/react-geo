/*eslint-env jest*/
import OlLayerImage from 'ol/layer/Image';
import { CapabilitiesUtil } from '../../index';

const layerTitle =  'OpenStreetMap WMS - by terrestris';
const capabilitiesObj = {
  version: '1.3.0',
  Service: {
    Name: 'OGC:WMS',
    Title: 'OpenStreetMap WMS',
    Abstract: 'OpenStreetMap WMS, bereitgestellt durch terrestris GmbH und Co. KG. Beschleunigt mit MapProxy (http://mapproxy.org/)',
    AccessConstraints: '(c) OpenStreetMap contributors (http://www.openstreetmap.org/copyright) (c) OpenStreetMap Data (http://openstreetmapdata.com) (c) Natural Earth Data (http://www.naturalearthdata.com) (c) ASTER GDEM 30m (https://asterweb.jpl.nasa.gov/gdem.asp) (c) SRTM 450m by ViewfinderPanoramas (http://viewfinderpanoramas.org/) (c) Great Lakes Bathymetry by NGDC (http://www.ngdc.noaa.gov/mgg/greatlakes/) (c) SRTM 30m by NASA EOSDIS Land Processes Distributed Active Archive Center (LP DAAC, https://lpdaac.usgs.gov/)'
  },
  Capability: {
    Request: {
      GetCapabilities: {
        Format: [
          'application/vnd.ogc.wms_xml'
        ],
        DCPType: [{
          HTTP: {
            Get: {
              OnlineResource: 'http://ows.terrestris.de/osm/service?'
            }
          }
        }]
      },
      GetMap: {
        Format: [
          'image/jpeg',
          'image/png'
        ],
        DCPType: [{
          HTTP: {
            Get: {
              OnlineResource: 'http://ows.terrestris.de/osm/service?'
            }
          }
        }]
      },
      GetFeatureInfo: {
        Format: [
          'text/plain',
          'text/html',
          'application/vnd.ogc.gml'
        ],
        DCPType: [{
          HTTP: {
            Get: {
              OnlineResource: 'http://ows.terrestris.de/osm/service?'
            }
          }
        }]
      }
    },
    Exception: [
      'application/vnd.ogc.se_xml',
      'application/vnd.ogc.se_inimage',
      'application/vnd.ogc.se_blank'
    ],
    Layer: {
      Layer: [{
        Name: 'OSM-WMS',
        Title: layerTitle,
        BoundingBox: [{
          crs: null,
          extent: [-20037508.3428, -25819498.5135,
            20037508.3428,
            25819498.5135
          ],
          res: [
            null,
            null
          ]
        },
        {
          crs: null,
          extent: [-180, -88,
            180,
            88
          ],
          res: [
            null,
            null
          ]
        },
        {
          crs: null,
          extent: [-20037508.3428, -25819498.5135,
            20037508.3428,
            25819498.5135
          ],
          res: [
            null,
            null
          ]
        }
        ],
        Style: [{
          Name: 'default',
          Title: 'default',
          LegendURL: [{
            Format: 'image/png',
            OnlineResource: 'http://ows.terrestris.de/osm/service?styles=&layer=OSM-WMS&service=WMS&format=image%2Fpng&sld_version=1.1.0&request=GetLegendGraphic&version=1.1.1',
            size: [
              155,
              344
            ]
          }]
        }],
        queryable: true,
        opaque: false,
        noSubsets: false
      }]
    }
  }
};

describe('CapabilitiesUtil', () => {

  it('is defined', () => {
    expect(CapabilitiesUtil).not.toBeUndefined();
  });

  describe('Static methods', () => {

    describe('parseWmsCapabilities', () => {
      it('isDefined', () => {
        expect(CapabilitiesUtil.parseWmsCapabilities).not.toBeUndefined();
      });

      it('creates a promise:', () => {
        const url = 'https://TO.BE/DEFINED';
        const resObj = CapabilitiesUtil.parseWmsCapabilities(url);
        expect(resObj).toBeInstanceOf(Promise);
      });
    });

    describe('getLayersFromWmsCapabilties', () => {
      it('isDefined', () => {
        expect(CapabilitiesUtil.getLayersFromWmsCapabilties).not.toBeUndefined();
      });

      it('creates layer objects from parsed WMS capabilities', () => {
        const parsedLayers = CapabilitiesUtil.getLayersFromWmsCapabilties(capabilitiesObj);
        expect(parsedLayers).toHaveLength(1);
        const layer = parsedLayers[0];
        expect(layer).toBeInstanceOf(OlLayerImage);
        expect(layer.get('title')).toBe(layerTitle);
      });
    });
  });
});
