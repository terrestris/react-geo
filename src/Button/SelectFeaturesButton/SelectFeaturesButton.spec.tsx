import { clickMap, mockForEachFeatureAtPixel, renderInMapContext } from '@terrestris/react-util/dist/Util/rtlTestUtils';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OlFeature from 'ol/Feature';
import OlPoint from 'ol/geom/Point';
import { SelectEvent as OlSelectEvent } from 'ol/interaction/Select';
import OlVectorLayer from 'ol/layer/Vector';
import OlMap from 'ol/Map';
import OlVectorSource from 'ol/source/Vector';
import OlView from 'ol/View';
import * as React from 'react';

import DrawButton from '../DrawButton/DrawButton';
import SelectFeaturesButton from './SelectFeaturesButton';

describe('<SelectFeaturesButton />', () => {

  const coord = [829729, 6708850];
  let map: OlMap;
  let layer: OlVectorLayer<OlVectorSource>;
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
    xit('calls the listener', async () => {
      const mock = mockForEachFeatureAtPixel(map, [200, 200], feature);

      const selectSpy = jest.fn();

      renderInMapContext(map, <SelectFeaturesButton layers={[layer]} onFeatureSelect={selectSpy} />);

      const button = screen.getByRole('button');
      await userEvent.click(button);

      clickMap(map, 200, 200);

      expect(selectSpy).toBeCalled();
      const event: OlSelectEvent = selectSpy.mock.calls[0][0];
      expect(event.selected).toEqual([feature]);

      mock.mockRestore();
    });
  });
});
