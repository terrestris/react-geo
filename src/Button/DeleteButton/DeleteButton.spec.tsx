import { screen, waitFor, within } from '@testing-library/react';
import * as React from 'react';

import OlView from 'ol/View';
import OlMap from 'ol/Map';
import OlPoint from 'ol/geom/Point';
import OlFeature from 'ol/Feature';

import { renderInMapContext } from '../../Util/rtlTestUtils';
import { DigitizeUtil } from '../../Util/DigitizeUtil';
import { DeleteButton } from './DeleteButton';
import { click, clickCenter, clickCoordinate } from '../../Util/electronTestUtils';

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
      .getSource().addFeature(feature);
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
    it('deletes the feature', async () => {
      const layer = DigitizeUtil.getDigitizeLayer(map);

      renderInMapContext(map, <DeleteButton />);

      const button = screen.getByRole('button');
      await click(button);

      expect(layer.getSource().getFeatures()).toHaveLength(1);

      await clickCenter(map.getViewport());

      await waitFor(() => {
        expect(layer.getSource().getFeatures()).toHaveLength(0);
      })
    });
  });
});
