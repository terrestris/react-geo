import './PropertyGrid.less';

import React, {
  useMemo
} from 'react';

import { Table } from 'antd';
import { TableProps } from 'antd/lib/table';
import _get from 'lodash/get';
import { getUid } from 'ol';
import OlFeature from 'ol/Feature';
import OlGeometry from 'ol/geom/Geometry';

import { CSS_PREFIX } from '../../constants';

type AttributeNames = Record<string, string>;

interface OwnProps {
  /**
   * Title of the attribute name column
   */
  attributeNameColumnTitle?: string;
  /**
   * Value in percent representing the width of the attribute name column
   * The width of the attribute value column will be calculated based on this
   */
  attributeNameColumnWidthInPercent?: number;
  /**
   * Title of the attribute value column
   */
  attributeValueColumnTitle?: string;
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

export type PropertyGridProps<T = any> = OwnProps & TableProps<T>;

const defaultClassName = `${CSS_PREFIX}propertygrid`;

/**
 * Component representing a feature grid showing the attribute values of a simple feature.
 */
const PropertyGrid: React.FC<PropertyGridProps> = ({
  attributeNameColumnTitle = 'Attribute name',
  attributeNameColumnWidthInPercent = 50,
  attributeValueColumnTitle = 'Attribute value',
  className,
  attributeFilter,
  attributeNames,
  feature,
  ...passThroughProps
}) => {

  const dataSource = useMemo(() => {
    let filter = attributeFilter;

    if (!filter) {
      filter = feature.getKeys().filter((attrName: string) => attrName !== 'geometry');
    }

    return filter.map((attr: any) => {
      const fid = getUid(feature);

      return {
        attributeName: (attributeNames && _get(attributeNames, attr)) ?
          _get(attributeNames, attr) :
          attr,
        attributeValue: feature.get(attr),
        key: `ATTR_${attr}_fid_${fid}`
      };
    });
  }, [attributeFilter, attributeNames, feature]);

  /**
   * Uses the WHATWG URL parser to validate candidate URLs and avoids
   * catastrophic backtracking from complex regexes. We intentionally take a
   * slightly more restrictive interpretation of "what counts as a URL" than
   * some permissive parsers. This keeps the UI from treating visually-broken
   * or odd inputs as links.
   *
   * Tightened checks applied (in addition to URL parsing):
   * - reject empty or whitespace-only values
   * - reject inputs with 3 or more leading slashes (e.g. "////weird")
   * - accept only http: and https: schemes (reject ftp:, mailto:, etc.)
   * - require a non-empty hostname
   * - reject hostnames that start or end with a dot (".com", "example.")
   * - reject hostnames containing consecutive dots ("example..com")
   *
   * Rationale: the WHATWG URL parser is safe and avoids regex backtracking
   * issues; the extra checks above encode our UX decision to avoid treating
   * malformed or surprising user input as clickable links. If you need a
   * different policy (e.g. accept single-label hosts like "localhost"),
   * extract this logic to a shared util and adjust the rules there.
   *
   * TODO: Extract this function into a shared utility package (e.g.
   * @terrestris/base-util) so other components can reuse the same logic and
   * we can add unit tests in isolation.
   *
   * @param {string} value - candidate string to test as URL
   * @return {boolean} true if value is an http(s) URL with a hostname
   */
  const isUrl = (value: string): boolean => {
    try {
      // quick reject: non-strings or empty/whitespace
      if (typeof value !== 'string' || value.trim() === '') {
        return false;
      }

      // Reject inputs with 3 or more leading slashes (////weird)
      // Allow exactly '//' (protocol-relative).
      if (/^\/{3,}/.test(value)) {
        return false;
      }

      // Support protocol-relative URLs like //example.com
      const candidate = value.startsWith('//') ? `https:${value}` : value;
      const u = new URL(candidate);

      // Accept only http(s) URLs
      if (u.protocol !== 'http:' && u.protocol !== 'https:') {
        return false;
      }

      // Basic host presence check
      const host = u.hostname || '';
      if (!host) {
        return false;
      }

      // Reject hostnames that start or end with a dot, or contain consecutive
      // dots (e.g. ".com", "example..com")
      if (host.startsWith('.') || host.endsWith('.') || host.includes('..')) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  };

  const columns = useMemo(() => {
    return [{
      title: attributeNameColumnTitle,
      dataIndex: 'attributeName',
      key: 'attributeName',
      width: `${attributeNameColumnWidthInPercent}%`
    }, {
      title: attributeValueColumnTitle,
      dataIndex: 'attributeValue',
      key: 'attributeValue',
      width: `${100 - attributeNameColumnWidthInPercent}%`,
      render: (value: any) => {
        if (isUrl(value)) {
          return <a href={value} target="_blank">{value}</a>;
        } else {
          return value;
        }
      }
    }];
  }, [attributeNameColumnTitle, attributeNameColumnWidthInPercent, attributeValueColumnTitle]);

  const finalClassName = className
    ? `${className} ${defaultClassName}`
    : defaultClassName;

  return (
    <Table
      className={finalClassName}
      rowKey={record => record.key}
      dataSource={dataSource}
      columns={columns}
      pagination={false}
      {...passThroughProps}
    />
  );
};

export default PropertyGrid;
