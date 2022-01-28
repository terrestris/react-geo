import { within } from '@testing-library/react';
import * as React from 'react';

import OlView from 'ol/View';
import OlMap from 'ol/Map';
import OlPoint from 'ol/geom/Point';
import OlFeature from 'ol/Feature';

import { renderInMapContext } from '../../Util/rtlTestUtils';
import { DigitizeUtil } from '../../Util/DigitizeUtil';
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
      .getSource().addFeature(feature);
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
