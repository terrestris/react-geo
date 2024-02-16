import { DigitizeUtil } from '@terrestris/react-util/dist/Util/DigitizeUtil';
import { clickMap, mockForEachFeatureAtPixel, renderInMapContext } from '@terrestris/react-util/dist/Util/rtlTestUtils';
import { screen,  within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OlFeature from 'ol/Feature';
import OlPoint from 'ol/geom/Point';
import OlMap from 'ol/Map';
import OlView from 'ol/View';
import * as React from 'react';

import { DeleteButton } from './DeleteButton';

describe('<DeleteButton />', () => {

  const coord = [829729, 6708850];
  let map: OlMap;
  let feature: OlFeature<OlPoint>;

  beforeEach(() => {
    feature = new OlFeature<OlPoint>({
      geometry: new OlPoint(coord),
      someProp: 'test'
    });

    map = new OlMap({
      view: new OlView({
        center: coord,
        zoom: 10
      }),
      controls: [],
      layers: []
    });

    DigitizeUtil.getDigitizeLayer(map)
      .getSource()?.addFeature(feature);
  });

  describe('#Basics', () => {

    it('is defined', () => {
      expect(DeleteButton).not.toBeUndefined();
    });

    it('can be rendered', () => {
      const { container } = renderInMapContext(map, <DeleteButton />);

      const button = within(container).getByRole('button');
      expect(button).toBeVisible();
    });
  });

  describe('#Deleting', () => {
    xit('deletes the feature', async () => {
      const mock = mockForEachFeatureAtPixel(map, [200, 200], feature);

      const layer = DigitizeUtil.getDigitizeLayer(map);

      renderInMapContext(map, <DeleteButton />);

      const button = screen.getByRole('button');
      await userEvent.click(button);

      renderInMapContext(map, <DeleteButton pressed={true} />);

      expect(layer.getSource()?.getFeatures()).toHaveLength(1);

      clickMap(map, 200, 200);

      expect(layer.getSource()?.getFeatures()).toHaveLength(0);

      mock.mockRestore();
    });
  });
});
