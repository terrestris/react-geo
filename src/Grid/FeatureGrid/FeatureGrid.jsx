import React from 'react';
import PropTypes from 'prop-types';
import {
  Table
} from 'antd';
import OlFeature from 'ol/feature';

import './FeatureGrid.less';

/**
 * Class representing a fature grid showing the attribute values of a simple feature.
 *
 * @class FeatureGrid
 * @extends React.Component
 */
class FeatureGrid extends React.Component {

  /**
   * The CSS-className added to this component.
   * @type {String}
   * @private
   */
  className = 'react-geo-featuregrid'

  /**
   * The prop types.
   * @type {Object}
   */
  static propTypes = {
    /**
     * Optional title of the attribute name column
     * @type {String}
     */
    attributeNameColumnTitle: PropTypes.string,

    /**
     * Optional title of the attribute value column
     * @type {String}
     */
    attributeValueColumnTitle: PropTypes.string,

    /**
     * Optional array of attribute names to filter
     * @type {Array}
     */
    attributeFilter: PropTypes.arrayOf(PropTypes.string),

    /**
     * Optional CSS class
     * @type {String}
     */
    className: PropTypes.string,

    /**
    * Feature for which the properties should be shown
     * @type {OlFeature}
     */
    feature: PropTypes.instanceOf(OlFeature).isRequired
  }

  static defaultProps = {
    attributeNameColumnTitle: 'Attribute name',
    attributeValueColumnTitle: 'Attribute value'
  }

  /**
   * The constructor.
   *
   * @param {Object} props The initial props.
   */
  constructor(props) {
    super(props);

    this.state = {
      dataSource: null,
      columns: []
    };
  }

  /**
   * The componentWillMount function
   */
  componentWillMount() {
    const {
      feature,
      attributeFilter
    } = this.props;

    this.generateFeatureGrid(feature, attributeFilter);
  }

  /**
  * generateFeatureGrid function
  * Initialize data store and column definitions of table
  *
  * @param {OlFeature} feature feature to display
  * @param {Array} attributeFilter Array of string values to filter the grid rows
  */
  generateFeatureGrid(feature, attributeFilter) {
    if (!attributeFilter) {
      attributeFilter = feature.getKeys().filter((attrName) => attrName !== 'geometry');
    }

    const dataSource = attributeFilter.map((attr) => {
      const rowObj = {
        attributeName: attr,
        attributeValue: feature.get(attr),
        key: `ATTR_${attr}_fid_${feature.ol_uid}`
      };
      return rowObj;
    });

    const columns = [{
      title: this.props.attributeNameColumnTitle,
      dataIndex: 'attributeName',
      key: 'attributeName',
      width: '50%'
    }, {
      title: this.props.attributeValueColumnTitle,
      dataIndex: 'attributeValue',
      key: 'attributeValue',
      width: '50%'
    }];

    this.setState({
      dataSource,
      columns
    });
  }

  /**
   * The render function.
   *
   * @return {Element} The element.
   */
  render() {
    const {
      className,
      feature,
      ...passThroughProps
    } = this.props;

    const {
      columns,
      dataSource
    } = this.state;

    const finalClassName = className
      ? `${className} ${this.className}`
      : this.className;

    return(
      <Table
        className={finalClassName}
        rowKey={record => record.key}
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        useFixedHeader
        {...passThroughProps}
      />
    );
  }
}

export default FeatureGrid;
