import * as React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import PrintButton from './PrintButton';
import { renderInMapContext } from '../../Util/rtlTestUtils';

import OlMap from 'ol/Map';
import OlView from 'ol/View';
import OlLayerTile from 'ol/layer/Tile';
import OlSourceOsm from 'ol/source/OSM';

describe('<PrintButton />', () => {

  const coordinates = [829729, 6708850];
  let map: OlMap;

  beforeEach(() => {
    map = new OlMap({
      layers: [
        new OlLayerTile({
          source: new OlSourceOsm()
        })
      ],
      view: new OlView({
        center: coordinates,
        zoom: 10
      })
    });
  });

  describe('#Basics', () => {

    it('is defined', () => {
      expect(PrintButton).not.toBeUndefined();
    });

    it('can be rendered', () => {
      const { container } = renderInMapContext(map, <PrintButton mapSize={[0, 0]}/>);
      expect(container).toBeVisible();
    });
  });

  describe('#Printing', () => {

    it('prints a png image', async () => {
      renderInMapContext(map, <PrintButton mapSize={[0, 0]}>Print test</PrintButton>);
      const button = screen.getByText('Print test');
      await userEvent.click(button);
    });

  });
});
