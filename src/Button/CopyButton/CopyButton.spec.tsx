import { screen, waitFor, within } from '@testing-library/react';
import * as React from 'react';

import OlView from 'ol/View';
import OlMap from 'ol/Map';
import OlPoint from 'ol/geom/Point';
import OlFeature from 'ol/Feature';
import OlStyleStyle from 'ol/style/Style';
import OlStyleStroke from 'ol/style/Stroke';
import OlStyleFill from 'ol/style/Fill';

import { renderInMapContext } from '../../Util/rtlTestUtils';
import { DigitizeUtil } from '../../Util/DigitizeUtil';
import CopyButton from './CopyButton';
import { click, clickCenter } from '../../Util/electronTestUtils';
import OlStyleCircle from 'ol/style/Circle';

describe('<CopyButton />', () => {

  const coord = [829729, 6708850];
  let map: OlMap;
  let feature: OlFeature<OlPoint>;
  let style: OlStyleStyle;

  beforeEach(() => {
    style = new OlStyleStyle({
      stroke: new OlStyleStroke({
        color: 'red',
        width: 2
      }),
      fill: new OlStyleFill({
        color: 'green'
      }),
      image: new OlStyleCircle({
        radius: 5,
        stroke: new OlStyleStroke({
          color: 'red',
          width: 2
        }),
        fill: new OlStyleFill({
          color: 'green'
        })
      })
    });
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
      expect(CopyButton).not.toBeUndefined();
    });

    it('can be rendered', () => {
      const { container } = renderInMapContext(map, <CopyButton />);

      const button = within(container).getByRole('button');
      expect(button).toBeVisible();
    });
  });

  describe('#Copying', () => {
    it('copies the feature', async () => {
      const layer = DigitizeUtil.getDigitizeLayer(map);
      layer.setStyle(style);

      renderInMapContext(map, <CopyButton />);

      const button = screen.getByRole('button');
      await click(button);

      expect(layer.getSource().getFeatures()).toHaveLength(1);

      await clickCenter(map.getViewport());

      await waitFor(() => {
        expect(layer.getSource().getFeatures()).toHaveLength(2);
      });

      const [feat1, feat2] = layer.getSource()?.getFeatures();

      expect(feat2.get('someProp')).toEqual('test');

      expect(feat1.getGeometry()?.getType()).toEqual(feat2.getGeometry()?.getType());
    });
  });
});
