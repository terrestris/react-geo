import { renderInMapContext } from '@terrestris/react-util/dist/Util/rtlTestUtils';
import { within } from '@testing-library/react';
import OlLayerTile from 'ol/layer/Tile';
import OlMap from 'ol/Map';
import OlSourceOsm from 'ol/source/OSM';
import OlView from 'ol/View';
import * as React from 'react';

import RotationButton from './RotationButton';

describe('<RotationButton />', () => {

  const coord = [829729, 6708850];
  let map: OlMap;
  let layer: OlLayerTile<OlSourceOsm>;

  beforeEach(() => {

    layer = new OlLayerTile({
      source: new OlSourceOsm()
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
      expect(RotationButton).not.toBeUndefined();
    });

    it('can be rendered', () => {
      const { container } = renderInMapContext(map, <RotationButton />);

      const button = within(container).getByRole('button');
      expect(button).toBeVisible();
    });
  });
});
