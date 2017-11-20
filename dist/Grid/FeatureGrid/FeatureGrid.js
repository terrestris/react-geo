'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _table = require('antd/lib/table');

var _table2 = _interopRequireDefault(_table);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('antd/lib/table/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _feature = require('ol/feature');

var _feature2 = _interopRequireDefault(_feature);

var _lodash = require('lodash');

require('./FeatureGrid.less');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Class representing a fature grid showing the attribute values of a simple feature.
 *
 * @class FeatureGrid
 * @extends React.Component
 */
var FeatureGrid = function (_React$Component) {
  _inherits(FeatureGrid, _React$Component);

  /**
   * The constructor.
   *
   * @param {Object} props The initial props.
   */


  /**
   * The prop types.
   * @type {Object}
   */
  function FeatureGrid(props) {
    _classCallCheck(this, FeatureGrid);

    var _this = _possibleConstructorReturn(this, (FeatureGrid.__proto__ || Object.getPrototypeOf(FeatureGrid)).call(this, props));

    _this.className = 'react-geo-featuregrid';


    _this.state = {
      dataSource: null,
      columns: []
    };
    return _this;
  }

  /**
   * The componentWillMount function
   */


  /**
   * The CSS-className added to this component.
   * @type {String}
   * @private
   */


  _createClass(FeatureGrid, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _props = this.props,
          feature = _props.feature,
          attributeFilter = _props.attributeFilter,
          attributeNames = _props.attributeNames,
          attributeNameColumnWidthInPercent = _props.attributeNameColumnWidthInPercent;


      this.generateFeatureGrid(feature, attributeFilter, attributeNames, attributeNameColumnWidthInPercent);
    }

    /**
    * generateFeatureGrid function
    * Initialize data store and column definitions of table
    *
    * @param {OlFeature} feature feature to display
    * @param {Array} attributeFilter Array of string values to filter the grid rows
    * @param {Object} attributeNames Object containing mapping of attribute names names in feature to custom ones
    * @param {Number} attributeNameColumnWidthInPercent Column width (in percent)
    */

  }, {
    key: 'generateFeatureGrid',
    value: function generateFeatureGrid(feature, attributeFilter, attributeNames, attributeNameColumnWidthInPercent) {
      if (!attributeFilter) {
        attributeFilter = feature.getKeys().filter(function (attrName) {
          return attrName !== 'geometry';
        });
      }

      var dataSource = attributeFilter.map(function (attr) {
        var rowObj = {
          attributeName: attributeNames && (0, _lodash.get)(attributeNames, attr) ? (0, _lodash.get)(attributeNames, attr) : attr,
          attributeValue: feature.get(attr),
          key: 'ATTR_' + attr + '_fid_' + feature.ol_uid
        };
        return rowObj;
      });

      var columns = [{
        title: this.props.attributeNameColumnTitle,
        dataIndex: 'attributeName',
        key: 'attributeName',
        width: attributeNameColumnWidthInPercent + '%'
      }, {
        title: this.props.attributeValueColumnTitle,
        dataIndex: 'attributeValue',
        key: 'attributeValue',
        width: 100 - attributeNameColumnWidthInPercent + '%'
      }];

      this.setState({
        dataSource: dataSource,
        columns: columns
      });
    }

    /**
     * The render function.
     *
     * @return {Element} The element.
     */

  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          className = _props2.className,
          feature = _props2.feature,
          passThroughProps = _objectWithoutProperties(_props2, ['className', 'feature']);

      var _state = this.state,
          columns = _state.columns,
          dataSource = _state.dataSource;


      var finalClassName = className ? className + ' ' + this.className : this.className;

      return _react2.default.createElement(_table2.default, _extends({
        className: finalClassName,
        rowKey: function rowKey(record) {
          return record.key;
        },
        dataSource: dataSource,
        columns: columns,
        pagination: false,
        useFixedHeader: true
      }, passThroughProps));
    }
  }]);

  return FeatureGrid;
}(_react2.default.Component);

FeatureGrid.propTypes = {
  /**
   * Optional title of the attribute name column
   * @type {String}
   */
  attributeNameColumnTitle: _propTypes2.default.string,

  /**
   * Optional value in percent representing the width of the attribute name column
   * The width of attribute value column wil be calculated depending in this
   * @type {String}
   */
  attributeNameColumnWidthInPercent: _propTypes2.default.number,

  /**
   * Optional title of the attribute value column
   * @type {String}
   */
  attributeValueColumnTitle: _propTypes2.default.string,

  /**
   * Optional array of attribute names to filter
   * @type {Array}
   */
  attributeFilter: _propTypes2.default.arrayOf(_propTypes2.default.string),

  /**
   * Optional object containing a mapping of attribute names in OL feature to custom ones
   *
   * @type {Object}
   */
  attributeNames: _propTypes2.default.object,

  /**
   * Optional CSS class
   * @type {String}
   */
  className: _propTypes2.default.string,

  /**
   * Feature for which the properties should be shown
   * @type {OlFeature}
   */
  feature: _propTypes2.default.instanceOf(_feature2.default).isRequired
};
FeatureGrid.defaultProps = {
  attributeNameColumnTitle: 'Attribute name',
  attributeValueColumnTitle: 'Attribute value',
  attributeNameColumnWidthInPercent: 50 };
exports.default = FeatureGrid;