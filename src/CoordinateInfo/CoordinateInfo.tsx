import Logger from '@terrestris/base-util/dist/Logger';
import { isWmsLayer, WmsLayer } from '@terrestris/react-util/dist/Util/typeUtils';
import _cloneDeep from 'lodash/cloneDeep';
import _isString from 'lodash/isString';
import { getUid } from 'ol';
import { Coordinate as OlCoordinate } from 'ol/coordinate';
import OlFeature from 'ol/Feature';
import OlFormatGML2 from 'ol/format/GML2';
import OlGeometry from 'ol/geom/Geometry';
import OlBaseLayer from 'ol/layer/Base';
import OlMap from 'ol/Map';
import OlMapBrowserEvent from 'ol/MapBrowserEvent';
import * as React from 'react';

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
   * The children component that should be rendered. The render prop function
   * receives the state of the component (this is the clicked coordinate, the
   * list of GFI features if any and the loading state).
   */
  resultRenderer: (childrenProps: CoordinateInfoState) => React.ReactNode;
  /**
   * The ol map.
   */
  map: OlMap;
  /**
   * Optional request options to apply (separated by each query layer, identified
   * by its internal ol id or a callback function).
   */
  fetchOpts:
    | {
        [uid: string]: RequestInit;
      }
    | ((layer: WmsLayer) => RequestInit);
  /**
   * Callback function that gets called if all features are fetched successfully
   * via GetFeatureInfo.
   */
  onSuccess: (features: CoordinateInfoState) => void;
  /**
   * Callback function that gets called if an error occured while fetching the
   * features via GetFeatureInfo.
   */
  onError: (error: any) => void;
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
    resultRenderer: () => {
      return (
        <div />
      );
    },
    fetchOpts: {},
    onSuccess: () => { },
    onError: () => { }
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
      fetchOpts,
      onSuccess,
      onError
    } = this.props;

    const mapView = map.getView();
    const viewResolution = mapView.getResolution();
    const viewProjection = mapView.getProjection();
    const pixel = map.getEventPixel(olEvt.originalEvent);
    const coordinate = olEvt.coordinate;

    const promises: Promise<any>[] = [];

    const mapLayers =
      map.getAllLayers()
        .filter(this.layerFilter)
        .filter(l => l.getData && l.getData(pixel) && isWmsLayer(l));
    mapLayers.forEach(l => {
      const layerSource = (l as WmsLayer).getSource();
      if (!layerSource) {
        return;
      }
      const featureInfoUrl = layerSource.getFeatureInfoUrl(
        coordinate,
        viewResolution!,
        viewProjection,
        {
          INFO_FORMAT: 'application/vnd.ogc.gml',
          FEATURE_COUNT: featureCount
        }
      );
      if (featureInfoUrl) {
        let opts;
        if (fetchOpts instanceof Function) {
          opts = fetchOpts(l as WmsLayer);
        } else {
          opts = fetchOpts[getUid(l)];
        }
        promises.push(fetch(featureInfoUrl, opts));
      }

      return !drillDown;
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
        const features: {[index: string]: OlFeature[]} = {};

        textResponses.forEach((featureCollection: string, idx: number) => {
          const fc = format.readFeatures(featureCollection);
          fc.forEach((feature: OlFeature<OlGeometry>) => {
            const id = feature.getId();
            const featureTypeName = _isString(id) ? id.split('.')[0] : id?.toString() ?? `UNKNOWN-${idx}`;

            if (!features[featureTypeName]) {
              features[featureTypeName] = [];
            }

            features[featureTypeName].push(feature);
          });
        });

        this.setState({
          features: features
        }, () => {
          onSuccess(this.getCoordinateInfoState());
        });
      })
      .catch((error: any) => {
        Logger.error(error);

        onError(error);
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

  getCoordinateInfoState(): CoordinateInfoState {
    // We're cloning the click coordinate and features to
    // not pass the internal state reference to the parent component.
    // Also note that we explicitly don't use feature.clone() to
    // keep all feature properties (in particular the id) intact.
    const coordinateInfoState: CoordinateInfoState = {
      clickCoordinate: this.state.clickCoordinate ?
        _cloneDeep(this.state.clickCoordinate) :
        null,
      loading: this.state.loading,
      features: _cloneDeep(this.state.features)
    };

    return coordinateInfoState;
  };

  render() {
    const {
      resultRenderer
    } = this.props;

    return (
      <>
        {resultRenderer(this.getCoordinateInfoState())}
      </>
    );
  }
}

export default CoordinateInfo;
