import OlFeature from "ol/Feature";
import OlGeometry from "ol/geom/Geometry";

export type RgCommonGridProps<RowType> = {
  /**
   * The features to show in the grid and the map (if set).
   */
  features?: OlFeature<OlGeometry>[];
  /**
   */
  attributeBlacklist?: string[];
  /**
   * The default style to apply to the features.
   */
  featureStyle?: OlStyle | (() => OlStyle);
  /**
   * The highlight style to apply to the features.
   */
  highlightStyle?: OlStyle | (() => OlStyle);
  /**
   * The select style to apply to the features.
   */
  selectStyle?: OlStyle | (() => OlStyle);
  /**
   * The name of the vector layer presenting the features in the grid.
   */
  layerName?: string;
  /**
   * A Function that creates the row key from the given feature.
   * Receives the feature as property.
   * Default is: feature => feature.ol_uid
   */
  keyFunction?: (feature: OlFeature<OlGeometry>) => string;
  /**
   * Whether the map should center on the current feature's extent on init or
   * not.
   */
  zoomToExtent: boolean;
  /**
   * Whether rows and features should be selectable or not.
   */
  selectable: boolean;
  /**
   * A CSS class which should be added to the table.
   */
  className?: string;
  /**
   * A CSS class to add to each table row or a function that
   * is evaluated for each record.
   */
  rowClassName?: string | ((record: RowType) => string);
  /**
   * Callback function, that will be called on rowclick.
   */
  onRowClick?: (row: RowType, feature: OlFeature<OlGeometry>, additionalArgs?: any) => void;
  /**
   * Callback function, that will be called on rowmouseover.
   */
  onRowMouseOver?: (row: RowType, feature: OlFeature<OlGeometry>, additionalArgs?: any) => void;
  /**
   * Callback function, that will be called on rowmouseout.
   */
  onRowMouseOut?: (row: RowType, feature: OlFeature<OlGeometry>, additionalArgs?: any) => void;
};
