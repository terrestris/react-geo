import * as React from 'react';

import OlMap from 'ol/Map';
import OlLayer from 'ol/layer/Layer';
import OlFormatGML2 from 'ol/format/GML2';
import OlMapBrowserEvent from 'ol/MapBrowserEvent';
import OlFeature from 'ol/Feature';
import { Coordinate as OlCoordinate } from 'ol/coordinate';
import OlGeometry from 'ol/geom/Geometry';
import OlBaseLayer from 'ol/layer/Base';
import OlImageLayer from 'ol/layer/Image';
import OlTileLayer from 'ol/layer/Tile';

import _cloneDeep from 'lodash/cloneDeep';
import _isString from 'lodash/isString';

import Logger from '@terrestris/base-util/dist/Logger';

import { isImageOrTileLayer, isWmsLayer } from '../Util/typeUtils';

import './CoordinateInfo.less';

const format = new OlFormatGML2();

interface DefaultProps {
  /**
   * List of (WMS) layers that should be queried.
   */
  queryLayers: Array<OlImageLayer | OlTileLayer>;

  /**
   * The number of max. features that should be returned by the GFI request.
   */
  featureCount: number;

  /**
   * Whether the GFI control should requests all layers at a given coordinate
   * or just the uppermost one.
   */
  drillDown: boolean;

  /**
   * Hit-detection tolerance in pixels. Pixels inside the radius around the
   * given position will be checked for features.
   */
  hitTolerance: number;

  /**
   * The children component that should be rendered. The render prop function
   * receives the state of the component (this is the clicked coordinate, the
   * list of GFI features if any and the loading state).
   */
  resultRenderer: (childrenProps: CoordinateInfoState) => React.ReactNode;
}

interface BaseProps {
  /**
   * The ol map.
   */
  map: OlMap;
}

interface CoordinateInfoState {
  clickCoordinate: OlCoordinate | null;
  features: any;
  loading: boolean;
}

export type CoordinateInfoProps = BaseProps & Partial<DefaultProps>;

/**
 * Constructs a wrapper component for querying features from the clicked
 * coordinate. The returned features can be passed to a child component
 * to be visualized.
 *
 * @class The CoordinateInfo
 * @extends React.Component
 */
export class CoordinateInfo extends React.Component<CoordinateInfoProps, CoordinateInfoState> {
  /**
   * The defaultProps.
   */
  static defaultProps: DefaultProps = {
    queryLayers: [],
    featureCount: 1,
    drillDown: true,
    hitTolerance: 5,
    resultRenderer: () => {
      return (
        <div></div>
      );
    }
  };

  /**
   * Creates the CoordinateInfo component.
   * @constructs CoordinateInfo
   */
  constructor(props: CoordinateInfoProps) {
    super(props);

    this.state = {
      clickCoordinate: null,
      features: [],
      loading: false
    };

    this.onMapClick = this.onMapClick.bind(this);
    this.layerFilter = this.layerFilter.bind(this);
  }

  componentDidMount() {
    const {
      map
    } = this.props;

    map.on('click', this.onMapClick);
  }

  componentWillUnmount() {
    const {
      map
    } = this.props;

    map.un('click', this.onMapClick);
  }

  onMapClick(olEvt: OlMapBrowserEvent<MouseEvent>) {
    const {
      map,
      featureCount,
      drillDown,
      hitTolerance
    } = this.props;

    const mapView = map.getView();
    const viewResolution = mapView.getResolution();
    const viewProjection = mapView.getProjection();
    const pixel = map.getEventPixel(olEvt.originalEvent);
    const coordinate = olEvt.coordinate;

    const promises = [];

    map.forEachLayerAtPixel(pixel, (layer: OlLayer<any>) => {
      const layerSource = layer.getSource();
      const featureInfoUrl = layerSource.getFeatureInfoUrl(
        coordinate,
        viewResolution,
        viewProjection,
        {
          'INFO_FORMAT': 'application/vnd.ogc.gml',
          'FEATURE_COUNT': featureCount
        }
      );

      promises.push(fetch(featureInfoUrl));

      if (!drillDown) {
        return true;
      }

      return false;
    }, {
      layerFilter: this.layerFilter,
      hitTolerance: hitTolerance
    });

    map.getTargetElement().style.cursor = 'wait';

    this.setState({
      loading: true
    });

    Promise.all(promises)
      .then((responses: Response[]) => {
        this.setState({
          clickCoordinate: coordinate
        });
        const textResponses = responses.map(response => response.text());
        return Promise.all(textResponses);
      })
      .then((textResponses: string[]) => {
        const features = {};

        textResponses.forEach((featureCollection: string) => {
          const fc = format.readFeatures(featureCollection);
          fc.forEach((feature: OlFeature<OlGeometry>) => {
            const id = feature.getId();
            const featureTypeName = _isString(id) ? id.split('.')[0] : id;

            if (!features[featureTypeName]) {
              features[featureTypeName] = [];
            }

            features[featureTypeName].push(feature);
          });
        });
        this.setState({
          features: features
        });
      })
      .catch((error: Error) => {
        Logger.error(error);
      })
      .finally(() => {
        map.getTargetElement().style.cursor = '';

        this.setState({
          loading: false
        });
      });
  }

  layerFilter(layerCandidate: OlBaseLayer) {
    const {
      queryLayers
    } = this.props;

    return isWmsLayer(layerCandidate) && isImageOrTileLayer(layerCandidate) && queryLayers.includes(layerCandidate);
  }

  render () {
    const {
      resultRenderer
    } = this.props;

    return (
      <>
        {resultRenderer(_cloneDeep(this.state))}
      </>
    );
  }
}

export default CoordinateInfo;
