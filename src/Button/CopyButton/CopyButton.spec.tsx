import { DigitizeUtil } from '@terrestris/react-util/dist/Util/DigitizeUtil';
import { clickMap, mockForEachFeatureAtPixel, renderInMapContext } from '@terrestris/react-util/dist/Util/rtlTestUtils';
import { screen,  within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OlFeature from 'ol/Feature';
import OlPoint from 'ol/geom/Point';
import OlMap from 'ol/Map';
import OlStyleFill from 'ol/style/Fill';
import OlStyleStroke from 'ol/style/Stroke';
import OlStyleStyle from 'ol/style/Style';
import OlView from 'ol/View';
import * as React from 'react';

import CopyButton from './CopyButton';

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

    (DigitizeUtil.getDigitizeLayer(map))
      .getSource()?.addFeature(feature);
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
    xit('copies the feature', async () => {
      const mock = mockForEachFeatureAtPixel(map, [200, 200], feature);

      const layer = DigitizeUtil.getDigitizeLayer(map);
      layer.setStyle(style);

      renderInMapContext(map, <CopyButton />);

      const button = screen.getByRole('button');
      await userEvent.click(button);

      renderInMapContext(map, <CopyButton pressed={true} />);

      expect(layer.getSource()?.getFeatures()).toHaveLength(1);

      clickMap(map, 200, 200);

      expect(layer.getSource()?.getFeatures()).toHaveLength(2);

      const [feat1, feat2] = layer.getSource()?.getFeatures() as any[];

      expect(feat2.get('someProp')).toEqual('test');

      expect(feat1.getGeometry().getType()).toEqual(feat2.getGeometry().getType());

      mock.mockRestore();
    });
  });
});
