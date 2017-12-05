/*eslint-env jest*/
import AddWmsLayerEntry from './AddWmsLayerEntry';
import TestUtil from '../../../Util/TestUtil';

describe('<AddWmsLayerEntry />', () => {

  const defaultProps = {
    wmsLayer: {
      wmsAttribution: undefined,
      queryable: false,
      Abstract: undefined,
      Title: 'TestLayer'
    },
    layerQueryableText: ''
  };

  it('is defined', () => {
    expect(AddWmsLayerEntry).not.toBeUndefined();
  });

  it('can be rendered', () => {
    const wrapper = TestUtil.mountComponent(AddWmsLayerEntry, defaultProps);
    expect(wrapper).not.toBeUndefined();
  });

  it('adds copyright icon if prop wmsLayer has filled wmsAttribution', () => {
    const wmsAttribution = 'Test - attribution';
    const wmsAttributionProps = {
      wmsLayer: {
        wmsAttribution: wmsAttribution,
        queryable: false
      }
    };

    const wrapper = TestUtil.mountComponent(AddWmsLayerEntry, wmsAttributionProps);
    const icons = wrapper.find('span.add-wms-add-info-icon');
    expect(icons).toHaveLength(1);
    expect(icons.getElement().props.className).toContain('fa-copyright');
  });

  it('doesnt add copyright icon if prop wmsLayer no has filled attribution', () => {
    const wrapper = TestUtil.mountComponent(AddWmsLayerEntry, defaultProps);
    const icons = wrapper.find('fa fa-copyright add-wms-add-info-icon');
    expect(icons).toHaveLength(0);
  });

  it('adds queryable icon if prop wmsLayer has queryable set to true', () => {
    const queryableProps  = {
      wmsLayer: {
        queryable: true
      }
    };

    const wrapper = TestUtil.mountComponent(AddWmsLayerEntry, queryableProps);
    const icons = wrapper.find('span.add-wms-add-info-icon');
    expect(icons).toHaveLength(1);
    expect(icons.getElement().props.className).toContain('fa-info');
  });

  it('doesnt add queryable icon if prop wmsLayer has queryable set to false', () => {
    const wrapper = TestUtil.mountComponent(AddWmsLayerEntry, defaultProps);
    const icons = wrapper.find('fa fa-info add-wms-add-info-icon');
    expect(icons).toHaveLength(0);
  });

  it('includes abstract in description text if Abstract property is set', () => {
    const title = 'title';
    const abstract = 'abstract';
    const expectedLine = `${title} - ${abstract}:`;

    const abstractProps  = {
      wmsLayer: {
        Title: title,
        Abstract: abstract
      }
    };
    const wrapper = TestUtil.mountComponent(AddWmsLayerEntry, abstractProps);
    const icons = wrapper.find('div.add-wms-layer-entry');
    expect(icons.getElement().props.children[0].props.children).toBe(expectedLine);
  });

});
