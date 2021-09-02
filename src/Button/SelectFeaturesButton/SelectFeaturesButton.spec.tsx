import * as React from 'react';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import OlMap from 'ol/Map';
import OlView from 'ol/View';
import OlFeature from 'ol/Feature';
import OlPoint from 'ol/geom/Point';
import OlVectorLayer from 'ol/layer/Vector';
import OlVectorSource from 'ol/source/Vector';
import { SelectEvent as OlSelectEvent } from 'ol/interaction/Select';

import DrawButton from '../DrawButton/DrawButton';
import { clickMap, renderInMapContext } from '../../Util/rtlTestUtils';
import SelectFeaturesButton from './SelectFeaturesButton';

describe('<SelectFeaturesButton />', () => {

  const coord = [829729, 6708850];
  let map: OlMap;
  let layer: OlVectorLayer<OlVectorSource<OlPoint>>;
  let feature: OlFeature<OlPoint>;

  beforeEach(() => {
    feature = new OlFeature(new OlPoint(coord));

    layer = new OlVectorLayer({
      source: new OlVectorSource({
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
      const event: OlSelectEvent = selectSpy.mock.calls[0][0];
      expect(event.selected).toEqual([feature]);

      mock.mockRestore();
    });
  });
});
