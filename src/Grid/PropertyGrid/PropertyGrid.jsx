import React from 'react';
import PropTypes from 'prop-types';
import {
  Table
} from 'antd';
import OlFeature from 'ol/Feature';
import { get } from 'lodash';

import { CSS_PREFIX } from '../../constants';

import './PropertyGrid.less';

/**
 * Class representing a fature grid showing the attribute values of a simple feature.
 *
 * @class PropertyGrid
 * @extends React.Component
 */
class PropertyGrid extends React.Component {

  /**
   * The CSS-className added to this component.
   * @type {String}
   * @private
   */
  className = `${CSS_PREFIX}propertygrid`

  /**
   * The prop types.
   * @type {Object}
   */
  static propTypes = {
    /**
     * An optional CSS class which should be added.
     * @type {String}
     */
    className: PropTypes.string,

    /**
     * Optional title of the attribute name column
     * @type {String}
     */
    attributeNameColumnTitle: PropTypes.string,

    /**
     * Optional value in percent representing the width of the attribute name column
     * The width of attribute value column wil be calculated depending in this
     * @type {String}
     */
    attributeNameColumnWidthInPercent: PropTypes.number,

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
     * Optional object containing a mapping of attribute names in OL feature to custom ones
     *
     * @type {Object}
     */
    attributeNames: PropTypes.object,

    /**
     * Feature for which the properties should be shown
     * @type {OlFeature}
     */
    feature: PropTypes.instanceOf(OlFeature).isRequired
  }

  static defaultProps = {
    attributeNameColumnTitle: 'Attribute name',
    attributeValueColumnTitle: 'Attribute value',
    attributeNameColumnWidthInPercent: 50
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
      attributeFilter,
      attributeNames,
      attributeNameColumnWidthInPercent
    } = this.props;

    this.generatePropertyGrid(feature, attributeFilter, attributeNames, attributeNameColumnWidthInPercent);
  }

  /**
  * generatePropertyGrid function
  * Initialize data store and column definitions of table
  *
  * @param {OlFeature} feature feature to display
  * @param {Array} attributeFilter Array of string values to filter the grid rows
  * @param {Object} attributeNames Object containing mapping of attribute names names in feature to custom ones
  * @param {Number} attributeNameColumnWidthInPercent Column width (in percent)
  */
  generatePropertyGrid(feature, attributeFilter, attributeNames, attributeNameColumnWidthInPercent) {
    if (!attributeFilter) {
      attributeFilter = feature.getKeys().filter((attrName) => attrName !== 'geometry');
    }

    const dataSource = attributeFilter.map((attr) => {
      const rowObj = {
        attributeName: (attributeNames && get(attributeNames, attr)) ? get(attributeNames, attr) : attr,
        attributeValue: feature.get(attr),
        key: `ATTR_${attr}_fid_${feature.ol_uid}`
      };
      return rowObj;
    });

    const columns = [{
      title: this.props.attributeNameColumnTitle,
      dataIndex: 'attributeName',
      key: 'attributeName',
      width: `${attributeNameColumnWidthInPercent}%`
    }, {
      title: this.props.attributeValueColumnTitle,
      dataIndex: 'attributeValue',
      key: 'attributeValue',
      width: `${100 - attributeNameColumnWidthInPercent}%`
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

export default PropertyGrid;
