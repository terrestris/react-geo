import './PropertyGrid.less';

import { Table } from 'antd';
import { TableProps } from 'antd/lib/table';
import _get from 'lodash/get';
import { getUid } from 'ol';
import OlFeature from 'ol/Feature';
import OlGeometry from 'ol/geom/Geometry';
import * as React from 'react';

import { CSS_PREFIX } from '../../constants';

type AttributeNames = {
  [key: string]: string;
};

interface OwnProps {
  /**
   * Title of the attribute name column
   */
  attributeNameColumnTitle: string;
  /**
   * Value in percent representing the width of the attribute name column
   * The width of attribute value column wil be calculated depending in this
   */
  attributeNameColumnWidthInPercent: number;
  /**
   * Title of the attribute value column
   */
  attributeValueColumnTitle: string;
  /**
   * A CSS class which should be added.
   */
  className?: string;
  /**
   * Array of attribute names to filter
   */
  attributeFilter?: string[];
  /**
   * Object containing a mapping of attribute names in OL feature to custom ones
   */
  attributeNames?: AttributeNames;
  /**
   * Feature for which the properties should be shown
   */
  feature: OlFeature<OlGeometry>;
}

export type PropertyGridProps = OwnProps & TableProps<any>;

/**
 * Class representing a feature grid showing the attribute values of a simple feature.
 *
 * @class PropertyGrid
 * @extends React.Component
 */
class PropertyGrid extends React.Component<PropertyGridProps> {

  static defaultProps = {
    attributeNameColumnTitle: 'Attribute name',
    attributeNameColumnWidthInPercent: 50,
    attributeValueColumnTitle: 'Attribute value'
  };

  /**
   * The CSS-className added to this component.
   * @private
   */
  className = `${CSS_PREFIX}propertygrid`;

  /**
   * Generates the datasource out of the given feature.
   */
  getDataSource() {
    let attributeFilter = this.props.attributeFilter;

    if (!attributeFilter) {
      attributeFilter = this.props.feature.getKeys().filter((attrName: string) => attrName !== 'geometry');
    }

    const dataSource = attributeFilter.map((attr: any) => {
      const fid = getUid(this.props.feature);

      return {
        attributeName: (this.props.attributeNames && _get(this.props.attributeNames, attr)) ?
          _get(this.props.attributeNames, attr) :
          attr,
        attributeValue: this.props.feature.get(attr),
        key: `ATTR_${attr}_fid_${fid}`
      };
    });

    return dataSource;
  }

  /**
   * Generates the column definition for the given feature.
   */
  getColumns() {
    const columns = [{
      title: this.props.attributeNameColumnTitle,
      dataIndex: 'attributeName',
      key: 'attributeName',
      width: `${this.props.attributeNameColumnWidthInPercent}%`
    }, {
      title: this.props.attributeValueColumnTitle,
      dataIndex: 'attributeValue',
      key: 'attributeValue',
      width: `${100 - this.props.attributeNameColumnWidthInPercent}%`
    }];

    return columns;
  }

  /**
   * The render function.
   *
   * @return The element.
   */
  render() {
    const {
      className,
      feature,
      ...passThroughProps
    } = this.props;

    const finalClassName = className
      ? `${className} ${this.className}`
      : this.className;

    return (
      <Table
        className={finalClassName}
        rowKey={record => record.key}
        dataSource={this.getDataSource()}
        columns={this.getColumns()}
        pagination={false}
        {...passThroughProps}
      />
    );
  }
}

export default PropertyGrid;
