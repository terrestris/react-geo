import { DigitizeUtil } from '@terrestris/react-util/dist/Util/DigitizeUtil';
import { renderInMapContext } from '@terrestris/react-util/dist/Util/rtlTestUtils';
import { within } from '@testing-library/react';
import OlFeature from 'ol/Feature';
import OlPoint from 'ol/geom/Point';
import OlMap from 'ol/Map';
import OlView from 'ol/View';
import * as React from 'react';

import { ModifyButton } from './ModifyButton';

describe('<ModifyButton />', () => {

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
      expect(ModifyButton).not.toBeUndefined();
    });

    it('can be rendered', () => {
      const { container } = renderInMapContext(map, <ModifyButton />);

      const button = within(container).getByRole('button');
      expect(button).toBeVisible();
    });
  });
});
