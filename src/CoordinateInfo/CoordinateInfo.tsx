import * as React from 'react';

import OlMap from 'ol/Map';
import OlLayer from 'ol/layer/Layer';
import OlFormatGML2 from 'ol/format/GML2';
import OlMapBrowserEvent from 'ol/MapBrowserEvent';
import OlFeature from 'ol/Feature';
import { Coordinate as OlCoordinate } from 'ol/coordinate';
import OlGeometry from 'ol/geom/Geometry';
import OlBaseLayer from 'ol/layer/Base';

import _cloneDeep from 'lodash/cloneDeep';
import _isString from 'lodash/isString';

import Logger from '@terrestris/base-util/dist/Logger';

import { WmsLayer } from '../Util/typeUtils';

import './CoordinateInfo.less';

const format = new OlFormatGML2();

export interface CoordinateInfoProps {
  /**
   * List of (WMS) layers that should be queried.
   */
  queryLayers: Array<WmsLayer>;

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
  /**
   * The ol map.
   */
  map: OlMap;
}

export interface CoordinateInfoState {
  clickCoordinate: OlCoordinate | null;
  features: {
    [layerName: string]: OlFeature[];
  };
  loading: boolean;
}

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
  static defaultProps = {
    queryLayers: [],
    featureCount: 1,
    drillDown: true,
    hitTolerance: 5,
    resultRenderer: () => {
      return (
        <div/>
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
      features: {},
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

    const promises: Promise<any>[] = [];

    map.forEachLayerAtPixel(pixel, (layer: OlLayer<any, any>) => {
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

      return !drillDown;
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
            const featureTypeName = _isString(id) ? id.split('.')[0] : id?.toString() ?? '';

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
      .catch((error: any) => {
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

    return (queryLayers as OlBaseLayer[]).includes(layerCandidate);
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
