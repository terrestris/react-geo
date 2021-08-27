import OlMap from 'ol/Map';
import OlView from 'ol/View';
import DrawButton from '../DrawButton/DrawButton';
import { clickMap, renderInMapContext } from '../../Util/rtlTestUtils';
import { screen, within } from '@testing-library/react';
import * as React from 'react';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import SelectFeaturesButton from './SelectFeaturesButton';
import userEvent from '@testing-library/user-event';
import { SelectEvent } from 'ol/interaction/Select';

describe('<SelectFeaturesButton />', () => {

  const coord = [829729, 6708850];
  let map: OlMap;
  let layer: VectorLayer<VectorSource<Point>>;
  let feature: Feature<Point>;

  beforeEach(() => {


    feature = new Feature(new Point(coord));

    layer = new VectorLayer({
      source: new VectorSource({
        features: [feature]
      })
    });

    map = new OlMap({
      view: new OlView({
        center: coord,
        zoom: 10
      }),
      controls: [],
      layers: [
        layer
      ]
    });
  });

  describe('#Basics', () => {

    it('is defined', () => {
      expect(DrawButton).not.toBeUndefined();
    });

    it('can be rendered', () => {
      const { container } = renderInMapContext(map, <SelectFeaturesButton layers={[layer]} />);

      const button = within(container).getByRole('button');
      expect(button).toBeVisible();
    });
  });

  describe('#Selection', () => {
    it('calls the listener', async () => {
      const selectSpy = jest.fn();

      renderInMapContext(map, <SelectFeaturesButton layers={[layer]} onFeatureSelect={selectSpy} />);

      map.renderSync();

      const button = screen.getByRole('button');
      userEvent.click(button);

      const mock = jest.spyOn(map, 'forEachFeatureAtPixel').mockImplementation((pixel, callback) => {
        if (pixel[0] === 200 && pixel[1] === 200) {
          callback(feature, layer, null);
        }
      });

      await clickMap(map, 200, 200);

      expect(selectSpy).toBeCalled();
      const event: SelectEvent = selectSpy.mock.calls[0][0];
      expect(event.selected).toEqual([feature]);

      mock.mockRestore();
    });
  });
});
