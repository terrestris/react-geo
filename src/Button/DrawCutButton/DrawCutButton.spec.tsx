import * as React from 'react';
import { renderInMapContext } from '@terrestris/react-util/dist/Util/rtlTestUtils';
import { within } from '@testing-library/react';
import OlMap from 'ol/Map';
import OlView from 'ol/View';
import OlVectorLayer from 'ol/layer/Vector';
import OlVectorSource from 'ol/source/Vector';
import OlFeature from 'ol/Feature';
import OlPoint from 'ol/geom/Point';

import DrawCutButton from './DrawCutButton';

describe('<DrawCutButton />', () => {
  let map: OlMap;
  let digitizeLayer: OlVectorLayer<OlVectorSource>;
  let feature: OlFeature<OlPoint>;
  const coord = [829729, 6708850];

  beforeEach(() => {
    digitizeLayer = new OlVectorLayer({
      source: new OlVectorSource()
    });
    map = new OlMap({
      view: new OlView({
        center: coord,
        zoom: 10
      }),
      controls: [],
      layers: [digitizeLayer]
    });
    feature = new OlFeature({
      geometry: new OlPoint(coord),
      someProp: 'test'
    });
    digitizeLayer.getSource()?.addFeature(feature);
  });

  describe('#Basics', () => {
    it('is defined', () => {
      expect(DrawCutButton).toBeDefined();
    });

    it('can be rendered', () => {
      const { container } = renderInMapContext(map, <DrawCutButton />);
      const button = within(container).getByRole('button');
      expect(button).toBeVisible();
    });

    it('applies custom className', () => {
      const { container } = renderInMapContext(map, <DrawCutButton className="my-class" />);
      expect(container.querySelector('.my-class')).toBeInTheDocument();
    });
  });

});
