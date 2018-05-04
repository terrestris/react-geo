/*eslint-env jest*/
import OlLayerTile from 'ol/layer/Tile';
import OlSourceTileWMS from 'ol/source/TileWMS';
import AddWmsLayerEntry from './AddWmsLayerEntry';
import TestUtil from '../../../Util/TestUtil';

describe('<AddWmsLayerEntry />', () => {

  const testLayerName = 'OSM-WMS';
  const testLayerTitle = 'OSM-WMS - by terrestris';
  const testLayer = new OlLayerTile({
    visible: false,
    title: testLayerTitle,
    source: new OlSourceTileWMS({
      url: 'https://ows.terrestris.de/osm/service?',
      params: {
        'LAYERS': testLayerName,
        'TILED': true
      }
    })
  });

  it('is defined', () => {
    expect(AddWmsLayerEntry).not.toBeUndefined();
  });

  it('can be rendered', () => {
    const wrapper = TestUtil.mountComponent(AddWmsLayerEntry, {
      wmsLayer: testLayer
    });
    expect(wrapper).not.toBeUndefined();
  });

  it('adds queryable icon if prop wmsLayer has queryable set to true', () => {
    testLayer.set('queryable', true);

    const wrapper = TestUtil.mountComponent(AddWmsLayerEntry, {
      wmsLayer: testLayer
    });
    const icons = wrapper.find('span.add-wms-add-info-icon');
    expect(icons).toHaveLength(1);
    expect(icons.getElement().props.className).toContain('fa-info');

    testLayer.set('queryable', false);
  });

  it('doesn\'t add queryable icon if prop wmsLayer has queryable set to false', () => {
    const wrapper = TestUtil.mountComponent(AddWmsLayerEntry, {
      wmsLayer: testLayer
    });
    const icons = wrapper.find('fa fa-info add-wms-add-info-icon');
    expect(icons).toHaveLength(0);
  });

  it('adds copyright icon if prop wmsLayer has filled wmsAttribution', () => {
    const wmsAttribution = 'Test - attribution';
    testLayer.getSource().setAttributions(wmsAttribution);

    const wrapper = TestUtil.mountComponent(AddWmsLayerEntry, {
      wmsLayer: testLayer
    });
    const icons = wrapper.find('span.add-wms-add-info-icon');
    expect(icons).toHaveLength(1);
    expect(icons.getElement().props.className).toContain('fa-copyright');
  });

  it('doesn\'t add copyright icon if prop wmsLayer no has filled attribution', () => {
    const wrapper = TestUtil.mountComponent(AddWmsLayerEntry, {
      wmsLayer: testLayer
    });
    const icons = wrapper.find('fa fa-copyright add-wms-add-info-icon');
    expect(icons).toHaveLength(0);
  });

  it('includes abstract in description text if abstract property is set for layer', () => {
    const abstract = 'abstract';
    const expectedLine = `${testLayerTitle} - ${abstract}:`;

    testLayer.setProperties({
      abstract: abstract
    });

    const abstractProps  = {
      wmsLayer: testLayer
    };
    const wrapper = TestUtil.mountComponent(AddWmsLayerEntry, abstractProps);
    const icons = wrapper.find('div.add-wms-layer-entry');
    expect(icons.getElement().props.children[0].props.children).toBe(expectedLine);
  });

});
