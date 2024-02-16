import _get from 'lodash/get';
import _isNil from 'lodash/isNil';
import OlFeature from 'ol/Feature';
import OlGeomPoint from 'ol/geom/Point';

import TestUtil from '../../Util/TestUtil';
import PropertyGrid from './PropertyGrid';

describe('<PropertyGrid />', () => {

  const testFeature = new OlFeature({
    geometry: new OlGeomPoint([19.09, 1.09]),
  });

  const attributeObject = {
    foo: 'bar',
    bvb: 'yarmolenko',
    mip: 'map',
    name: 'Point'
  };

  testFeature.setProperties(attributeObject);
  testFeature.setId(1909);

  it('is defined', () => {
    expect(PropertyGrid).not.toBe(undefined);
  });

  it('can be rendered', () => {
    const wrapper = TestUtil.mountComponent(PropertyGrid, {
      feature: testFeature
    });

    expect(wrapper).not.toBe(undefined);
  });

  it('passes style prop', () => {
    const props = {
      style: {
        backgroundColor: 'yellow'
      },
      feature: testFeature
    };
    const wrapper = TestUtil.mountComponent(PropertyGrid, props);
    expect(wrapper.getDOMNode()).toHaveStyle('backgroundColor: yellow');
  });

  it('generates dataSource and column definition for unfiltered attribute list', () => {
    const props = {
      feature: testFeature
    };
    const wrapper = TestUtil.mountComponent(PropertyGrid, props);
    const instance = wrapper.instance() as PropertyGrid;

    const dataSource = instance.getDataSource();
    const columns = instance.getColumns();

    // check dataSource
    expect(dataSource).toBeInstanceOf(Array);
    expect(dataSource).toHaveLength(Object.keys(attributeObject).length);
    dataSource.forEach((dataSourceElement) => {
      const attributeName = dataSourceElement.attributeName;
      // @ts-ignore
      const key = `ATTR_${attributeName}_fid_${testFeature.ol_uid}`;
      expect(_get(attributeObject,attributeName)).toBe(dataSourceElement.attributeValue);
      expect(key).toBe(dataSourceElement.key);
    });

    // check column
    expect(columns).toBeInstanceOf(Array);
    expect(columns).toHaveLength(2);
    expect(columns[0].dataIndex).toBe('attributeName');
    expect(columns[1].dataIndex).toBe('attributeValue');
  });

  it('generates dataSource and column definition for filtered attribute list', () => {
    const attributeFilter = ['bvb', 'name'];

    const props = {
      feature: testFeature,
      attributeFilter
    };
    const wrapper = TestUtil.mountComponent(PropertyGrid, props);
    const instance = wrapper.instance() as PropertyGrid;

    // check dataSource
    const dataSource = instance.getDataSource();
    expect(dataSource).toBeInstanceOf(Array);
    expect(dataSource).toHaveLength(attributeFilter.length);
    dataSource.forEach((dataSourceElement) => {
      const attributeName = dataSourceElement.attributeName;
      expect(attributeFilter.includes(attributeName)).toBe(true);
    });
  });

  it('applies custom column width for attribute name column', () => {
    const attributeNameColumnWidthInPercent = 19;
    const props = {
      feature: testFeature,
      attributeNameColumnWidthInPercent
    };
    const wrapper = TestUtil.mountComponent(PropertyGrid, props);
    const instance = wrapper.instance() as PropertyGrid;

    const columns = instance.getColumns();

    expect(columns).toBeInstanceOf(Array);
    expect(columns).toHaveLength(2);
    expect(columns[0].width).toBe(`${attributeNameColumnWidthInPercent}%`);
    expect(columns[1].width).toBe(`${100 - attributeNameColumnWidthInPercent}%`);
  });

  it('uses attribute name mapping', () => {
    const attributeNames = {
      foo: 'Hallo',
      bvb: 'Andrej'
    };
    const props = {
      feature: testFeature,
      attributeNames
    };
    const wrapper = TestUtil.mountComponent(PropertyGrid, props);
    const instance = wrapper.instance() as PropertyGrid;

    // check dataSource
    const dataSource = instance.getDataSource();
    expect(dataSource).toBeInstanceOf(Array);
    dataSource.forEach((dataSourceElement) => {
      const key = dataSourceElement.key;
      const orignalAttributeName = key.split('_')[1];
      if (!_isNil(_get(attributeNames, orignalAttributeName))) {
        const mappedAttributeNameInDataSource = dataSourceElement.attributeName;
        expect(mappedAttributeNameInDataSource).toEqual(_get(attributeNames, orignalAttributeName));
      }
    });
  });
});
