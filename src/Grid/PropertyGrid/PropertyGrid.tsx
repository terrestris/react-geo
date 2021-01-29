import * as React from 'react';

import { Table } from 'antd';
import { ColumnProps, TableProps } from 'antd/lib/table';

import OlFeature from 'ol/Feature';

const _get = require('lodash/get');

import { CSS_PREFIX } from '../../constants';

import './PropertyGrid.less';

type AttributeNames = {
  [key: string]: string;
};

interface DefaultProps {
  /**
   * Title of the attribute name column
   */
  attributeNameColumnTitle?: string;
  /**
   * Value in percent representing the width of the attribute name column
   * The width of attribute value column wil be calculated depending in this
   */
  attributeNameColumnWidthInPercent?: number;
  /**
   * Title of the attribute value column
   */
  attributeValueColumnTitle?: string;
}

export interface BaseProps {
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
   *
   */
  attributeNames?: AttributeNames;
  /**
   * Feature for which the properties should be shown
   */
  feature: OlFeature;
}

interface PropertyGridState {
  dataSource: any[];
  columns: ColumnProps<any>[];
}

export type PropertyGridProps = BaseProps & Partial<DefaultProps> & TableProps<any>;

/**
 * Class representing a feature grid showing the attribute values of a simple feature.
 *
 * @class PropertyGrid
 * @extends React.Component
 */
class PropertyGrid extends React.Component<PropertyGridProps, PropertyGridState> {

  /**
   * The CSS-className added to this component.
   * @private
   */
  className = `${CSS_PREFIX}propertygrid`;

  static defaultProps: DefaultProps = {
    attributeNameColumnTitle: 'Attribute name',
    attributeNameColumnWidthInPercent: 50,
    attributeValueColumnTitle: 'Attribute value',
  };

  /**
   * The constructor.
   *
   * @param props The initial props.
   */
  constructor(props: PropertyGridProps) {
    super(props);

    const {
      feature,
      attributeFilter,
      attributeNames,
      attributeNameColumnWidthInPercent
    } = props;

    const {
      dataSource,
      columns
    } = this.generatePropertyGrid({feature, attributeFilter, attributeNames,
      attributeNameColumnWidthInPercent});

    this.state = {
      dataSource,
      columns
    };
  }

  /**
   * Initialize data store and column definitions of table
   *
   * @param feature feature to display
   * @param attributeFilter Array of string values to filter the grid rows
   * @param attributeNames Object containing mapping of attribute names names in feature to custom ones
   * @param attributeNameColumnWidthInPercent Column width (in percent)
   */
  generatePropertyGrid({feature, attributeFilter, attributeNames, attributeNameColumnWidthInPercent}: {
    feature: OlFeature;
    attributeFilter: string[];
    attributeNames: AttributeNames;
    attributeNameColumnWidthInPercent: number;
  }): {
      dataSource: any;
      columns: ColumnProps<any>[];
    } {
    if (!attributeFilter) {
      attributeFilter = feature.getKeys().filter((attrName: string) => attrName !== 'geometry');
    }

    const dataSource = attributeFilter.map((attr: any) => {
      const rowObj = {
        attributeName: (attributeNames && _get(attributeNames, attr)) ? _get(attributeNames, attr) : attr,
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

    return {
      dataSource,
      columns
    };
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
        scroll={{
          y: 250
        }}
        {...passThroughProps}
      />
    );
  }
}

export default PropertyGrid;
