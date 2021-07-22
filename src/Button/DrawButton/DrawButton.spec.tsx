import DrawButton from './DrawButton';
import { render, screen,  within } from '@testing-library/react';
import * as React from 'react';
import MapContext from '../../Context/MapContext/MapContext';
import userEvent from '@testing-library/user-event';

import MapUtil from '@terrestris/ol-util/dist/MapUtil/MapUtil';

import OlView from 'ol/View';
import OlMap from 'ol/Map';
import MapComponent from '../../Map/MapComponent/MapComponent';
import { clickMap, doubleClickMap } from '../../Util/rtlTestUtils';
import LineString from 'ol/geom/LineString';
import Polygon from 'ol/geom/Polygon';


describe('<DrawButton />', () => {

  let map;

  function renderInContext(buttons) {
    const result = render(
      <MapContext.Provider value={map}>
        <MapComponent map={map} />
        {buttons}
      </MapContext.Provider>
    );

    map.setSize([400, 400]);
    map.renderSync();

    return result;
  }

  beforeEach(() => {
    map = new OlMap({
      view: new OlView({
        center: [829729, 6708850],
        zoom: 10
      }),
      controls: []
    });
  });

  describe('#Basics', () => {

    it('is defined', () => {
      expect(DrawButton).not.toBeUndefined();
    });

    it('can be rendered', () => {
      const { container } = renderInContext(<DrawButton drawType={'Point'} />);

      const button = within(container).getByRole('button');
      expect(button).toBeVisible();
    });
  });

  describe('#Drawing', () => {
    it('draws points', () => {
      renderInContext(<DrawButton drawType={'Point'} />);

      const button = screen.getByRole('button');

      const digitizeLayer = MapUtil.getLayerByName(map, 'react-geo_digitize');

      userEvent.click(button);

      clickMap(map, 100, 100);

      expect(digitizeLayer.getSource().getFeatures()).toHaveLength(1);

      const feature = digitizeLayer.getSource().getFeatures()[0];

      expect(feature.getGeometry().getType()).toBe('Point');
    });

    it('draws lines', () => {
      renderInContext(<DrawButton drawType={'LineString'} />);

      const button = screen.getByRole('button');

      const digitizeLayer = MapUtil.getLayerByName(map, 'react-geo_digitize');

      userEvent.click(button);

      clickMap(map, 100, 100);

      doubleClickMap(map, 120, 100);

      expect(digitizeLayer.getSource().getFeatures()).toHaveLength(1);

      const feature = digitizeLayer.getSource().getFeatures()[0];

      expect(feature.getGeometry().getType()).toBe('LineString');

      expect((feature.getGeometry() as LineString).getCoordinates()).toHaveLength(2);
    });

    it('draws polygons', () => {
      renderInContext(<DrawButton drawType={'Polygon'} />);

      const button = screen.getByRole('button');

      const digitizeLayer = MapUtil.getLayerByName(map, 'react-geo_digitize');

      userEvent.click(button);

      clickMap(map, 100, 100);

      clickMap(map, 120, 100);

      clickMap(map, 120, 120);

      doubleClickMap(map, 100, 120);

      expect(digitizeLayer.getSource().getFeatures()).toHaveLength(1);

      const feature = digitizeLayer.getSource().getFeatures()[0];

      expect(feature.getGeometry().getType()).toBe('Polygon');

      const coordinates = (feature.getGeometry() as Polygon).getCoordinates();

      expect(coordinates).toHaveLength(1);
      expect(coordinates[0]).toHaveLength(5);
    });

    it('draws labels', async () => {
      renderInContext(<DrawButton drawType={'Text'} />);

      const button = screen.getByRole('button');

      const digitizeLayer = MapUtil.getLayerByName(map, 'react-geo_digitize');

      userEvent.click(button);

      clickMap(map, 100, 100);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeVisible();

      const input = screen.getByRole('textbox');

      userEvent.type(input, 'Label text.');

      const okButton = within(dialog).getByText('Ok');

      userEvent.click(okButton);

      expect(dialog).not.toBeVisible();

      expect(digitizeLayer.getSource().getFeatures()).toHaveLength(1);

      const feature = digitizeLayer.getSource().getFeatures()[0];

      expect(feature.getGeometry().getType()).toBe('Point');
      expect(feature.get('label')).toBe('Label text.');
    });

    it('aborts drawing labels', async () => {
      renderInContext(<DrawButton drawType={'Text'} />);

      const button = screen.getByRole('button');

      const digitizeLayer = MapUtil.getLayerByName(map, 'react-geo_digitize');

      userEvent.click(button);

      clickMap(map, 100, 100);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeVisible();

      const input = screen.getByRole('textbox');

      userEvent.type(input, 'Label text.');

      const cancelButton = within(dialog).getByText('Cancel');

      userEvent.click(cancelButton);

      expect(dialog).not.toBeVisible();

      expect(digitizeLayer.getSource().getFeatures()).toHaveLength(0);
    });

    it('draws circles', () => {
      renderInContext(<DrawButton drawType={'Circle'} />);

      const button = screen.getByRole('button');

      const digitizeLayer = MapUtil.getLayerByName(map, 'react-geo_digitize');

      userEvent.click(button);

      clickMap(map, 100, 100);

      clickMap(map, 120, 120);

      expect(digitizeLayer.getSource().getFeatures()).toHaveLength(1);

      const feature = digitizeLayer.getSource().getFeatures()[0];

      expect(feature.getGeometry().getType()).toBe('Circle');
    });

    it('draws rectangles', () => {
      renderInContext(<DrawButton drawType={'Rectangle'} />);

      const button = screen.getByRole('button');

      const digitizeLayer = MapUtil.getLayerByName(map, 'react-geo_digitize');

      userEvent.click(button);

      clickMap(map, 100, 100);

      clickMap(map, 120, 120);

      expect(digitizeLayer.getSource().getFeatures()).toHaveLength(1);

      const feature = digitizeLayer.getSource().getFeatures()[0];

      expect(feature.getGeometry().getType()).toBe('Polygon');

      const coordinates = (feature.getGeometry() as Polygon).getCoordinates();

      expect(coordinates).toHaveLength(1);
      expect(coordinates[0]).toHaveLength(5);
    });

    it('toggles off', () => {
      renderInContext(<DrawButton drawType={'Point'} />);

      const button = screen.getByRole('button');

      const digitizeLayer = MapUtil.getLayerByName(map, 'react-geo_digitize');

      expect(digitizeLayer.getSource().getFeatures()).toHaveLength(0);

      userEvent.click(button);

      clickMap(map, 100, 100);

      expect(digitizeLayer.getSource().getFeatures()).toHaveLength(1);

      userEvent.click(button);

      clickMap(map, 120, 100);

      expect(digitizeLayer.getSource().getFeatures()).toHaveLength(1);

      userEvent.click(button);

      clickMap(map, 120, 100);

      expect(digitizeLayer.getSource().getFeatures()).toHaveLength(2);
    });

    it('calls draw start and draw end listeners', () => {
      const startSpy = jest.fn();
      const endSpy = jest.fn();

      renderInContext(<DrawButton drawType={'Polygon'} onDrawStart={startSpy} onDrawEnd={endSpy}/>);

      map.setSize([400, 400]);
      map.renderSync();

      const button = screen.getByRole('button');

      userEvent.click(button);

      expect(startSpy).not.toBeCalled();
      expect(endSpy).not.toBeCalled();

      clickMap(map, 100, 100);

      expect(startSpy).toBeCalledTimes(1);
      expect(endSpy).not.toBeCalled();

      clickMap(map, 120, 100);

      clickMap(map, 120, 120);

      doubleClickMap(map, 100, 120);

      expect(startSpy).toBeCalledTimes(1);
      expect(endSpy).toBeCalledTimes(1);

      const drawEndEvent = endSpy.mock.calls[0][0];
      const geometry = drawEndEvent.feature.getGeometry();

      expect(geometry.getType()).toBe('Polygon');
      expect(geometry.getCoordinates()[0]).toHaveLength(5);
    });

    it('multiple draw buttons use the same digitize layer', () => {
      renderInContext(<>
        <DrawButton drawType={'Point'}>Point 1</DrawButton>
        <DrawButton drawType={'Point'}>Point 2</DrawButton>
      </>);

      map.setSize([400, 400]);
      map.renderSync();

      const button1 = screen.getByText('Point 1');
      const button2 = screen.getByText('Point 2');

      const digitizeLayer = MapUtil.getLayerByName(map, 'react-geo_digitize');

      userEvent.click(button1);

      clickMap(map, 100, 100);

      userEvent.click(button1);
      userEvent.click(button2);

      clickMap(map, 120, 120);

      expect(digitizeLayer.getSource().getFeatures()).toHaveLength(2);
    });
  });
});
