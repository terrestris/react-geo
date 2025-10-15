import { DigitizeUtil } from '@terrestris/react-util/dist/Util/DigitizeUtil';
import { clickMap, doubleClickMap, renderInMapContext } from '@terrestris/react-util/dist/Util/rtlTestUtils';
import { screen,  within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LineString from 'ol/geom/LineString';
import Polygon from 'ol/geom/Polygon';
import VectorLayer from 'ol/layer/Vector';
import OlMap from 'ol/Map';
import VectorSource from 'ol/source/Vector';
import OlView from 'ol/View';
import * as React from 'react';

import DrawButton from './DrawButton';

describe('<DrawButton />', () => {

  let map: OlMap;

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
      const { container } = renderInMapContext(map, <DrawButton drawType={'Point'} />);

      const button = within(container).getByRole('button');
      expect(button).toBeVisible();
    });
  });

  describe('#Drawing', () => {
    xit('draws points', async () => {
      renderInMapContext(map, <DrawButton pressed={true} drawType={'Point'} />);

      const digitizeLayer = DigitizeUtil.getDigitizeLayer(map);

      clickMap(map, 100, 100);

      expect(digitizeLayer.getSource()?.getFeatures()).toHaveLength(1);

      const feature = digitizeLayer.getSource()?.getFeatures()[0];

      expect(feature?.getGeometry()?.getType()).toBe('Point');
    });

    xit('draws lines', async () => {
      renderInMapContext(map, <DrawButton pressed={true} drawType={'LineString'} />);

      const digitizeLayer = DigitizeUtil.getDigitizeLayer(map);

      clickMap(map, 100, 100);

      doubleClickMap(map, 120, 100);

      expect(digitizeLayer.getSource()?.getFeatures()).toHaveLength(1);

      const feature = digitizeLayer.getSource()?.getFeatures()[0];

      expect(feature?.getGeometry()?.getType()).toBe('LineString');

      expect((feature?.getGeometry() as LineString).getCoordinates()).toHaveLength(2);
    });

    xit('draws polygons', async () => {
      renderInMapContext(map, <DrawButton pressed={true} drawType={'Polygon'} />);

      const digitizeLayer = DigitizeUtil.getDigitizeLayer(map);

      clickMap(map, 100, 100);

      clickMap(map, 120, 100);

      clickMap(map, 120, 120);

      doubleClickMap(map, 100, 120);

      expect(digitizeLayer.getSource()?.getFeatures()).toHaveLength(1);

      const feature = digitizeLayer.getSource()?.getFeatures()[0];

      expect(feature?.getGeometry()?.getType()).toBe('Polygon');

      const coordinates = (feature?.getGeometry() as Polygon).getCoordinates();

      expect(coordinates).toHaveLength(1);
      expect(coordinates[0]).toHaveLength(5);
    });

    xit('draws labels', async () => {
      renderInMapContext(map, <DrawButton pressed={true} drawType={'Text'} />);

      const digitizeLayer = DigitizeUtil.getDigitizeLayer(map);

      clickMap(map, 100, 100);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeVisible();

      const input = screen.getByRole('textbox');

      await userEvent.type(input, 'Label text.');

      const okButton = within(dialog).getByText('Ok');

      await userEvent.click(okButton);

      expect(dialog).not.toBeVisible();

      expect(digitizeLayer.getSource()?.getFeatures()).toHaveLength(1);

      const feature = digitizeLayer.getSource()?.getFeatures()[0];

      expect(feature?.getGeometry()?.getType()).toBe('Point');
      expect(feature?.get('label')).toBe('Label text.');
    });

    xit('aborts drawing labels', async () => {
      renderInMapContext(map, <DrawButton pressed={true} drawType={'Text'} />);

      const digitizeLayer = DigitizeUtil.getDigitizeLayer(map);

      clickMap(map, 100, 100);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeVisible();

      const input = screen.getByRole('textbox');

      await userEvent.type(input, 'Label text.');

      const cancelButton = within(dialog).getByText('Cancel');

      await userEvent.click(cancelButton);

      expect(dialog).not.toBeVisible();

      expect(digitizeLayer.getSource()?.getFeatures()).toHaveLength(0);
    });

    xit('draws circles', async () => {
      renderInMapContext(map, <DrawButton pressed={true} drawType={'Circle'} />);

      const digitizeLayer = DigitizeUtil.getDigitizeLayer(map);

      clickMap(map, 100, 100);

      clickMap(map, 120, 120);

      expect(digitizeLayer.getSource()?.getFeatures()).toHaveLength(1);

      const feature = digitizeLayer.getSource()?.getFeatures()[0];

      expect(feature?.getGeometry()?.getType()).toBe('Circle');
    });

    xit('draws rectangles', async () => {
      renderInMapContext(map, <DrawButton pressed={true} drawType={'Rectangle'} />);

      const digitizeLayer = DigitizeUtil.getDigitizeLayer(map);

      clickMap(map, 100, 100);

      clickMap(map, 120, 120);

      expect(digitizeLayer.getSource()?.getFeatures()).toHaveLength(1);

      const feature = digitizeLayer.getSource()?.getFeatures()[0];

      expect(feature?.getGeometry()?.getType()).toBe('Polygon');

      const coordinates = (feature?.getGeometry() as Polygon).getCoordinates();

      expect(coordinates).toHaveLength(1);
      expect(coordinates[0]).toHaveLength(5);
    });

    xit('toggles off', async () => {
      const { rerenderInMapContext } = renderInMapContext(map, <DrawButton pressed={false} drawType={'Point'} />);

      const digitizeLayer = DigitizeUtil.getDigitizeLayer(map);

      expect(digitizeLayer.getSource()?.getFeatures()).toHaveLength(0);

      rerenderInMapContext(<DrawButton pressed={true} drawType={'Point'} />);

      clickMap(map, 100, 100);

      expect(digitizeLayer.getSource()?.getFeatures()).toHaveLength(1);

      rerenderInMapContext(<DrawButton pressed={false} drawType={'Point'} />);

      clickMap(map, 120, 100);

      expect(digitizeLayer.getSource()?.getFeatures()).toHaveLength(1);

      rerenderInMapContext(<DrawButton pressed={true} drawType={'Point'} />);

      clickMap(map, 120, 100);

      expect(digitizeLayer.getSource()?.getFeatures()).toHaveLength(2);
    });

    xit('calls draw start and draw end listeners', async () => {
      const startSpy = jest.fn();
      const endSpy = jest.fn();

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

    xit('multiple draw buttons use the same digitize layer', async () => {
      const { rerenderInMapContext } = renderInMapContext(map, (
        <>
          <DrawButton pressed={true} drawType={'Point'}>Point 1</DrawButton>
          <DrawButton drawType={'Point'}>Point 2</DrawButton>
        </>
      ));

      const digitizeLayer = DigitizeUtil.getDigitizeLayer(map);

      clickMap(map, 100, 100);

      rerenderInMapContext(
        <>
          <DrawButton drawType={'Point'}>Point 1</DrawButton>
          <DrawButton pressed={true} drawType={'Point'}>Point 2</DrawButton>
        </>
      );

      clickMap(map, 120, 120);

      expect(digitizeLayer.getSource()?.getFeatures()).toHaveLength(2);
    });

    xit('can use a custom layer', async () => {
      const layer = new VectorLayer({
        source: new VectorSource()
      });

      map.addLayer(layer);

      renderInMapContext(map, <DrawButton pressed={true} drawType={'Point'} digitizeLayer={layer} />);

      clickMap(map, 100, 100);

      expect(layer.getSource()?.getFeatures()).toHaveLength(1);

      const defaultDigitizeLayer = DigitizeUtil.getDigitizeLayer(map);

      expect(defaultDigitizeLayer.getSource()?.getFeatures()).toHaveLength(0);
    });

    xit('can change the type', async () => {
      const { rerenderInMapContext } = renderInMapContext(map, <DrawButton pressed={true} drawType={'Point'} />);

      clickMap(map, 100, 100);

      const digitizeLayer = DigitizeUtil.getDigitizeLayer(map);

      expect(digitizeLayer.getSource()?.getFeatures()).toHaveLength(1);
      expect(digitizeLayer.getSource()?.getFeatures()[0].getGeometry()?.getType()).toBe('Point');

      rerenderInMapContext(<DrawButton pressed={true} drawType={'LineString'} />);

      clickMap(map, 120, 120);
      doubleClickMap(map, 140, 140);

      expect(digitizeLayer.getSource()?.getFeatures()).toHaveLength(2);
      expect(digitizeLayer.getSource()?.getFeatures()[1].getGeometry()?.getType()).toBe('LineString');
    });
  });
});
