import OlStyleCircle from 'ol/style/Circle';
import OlStyleFill from 'ol/style/Fill';
import OlStyleStroke from 'ol/style/Stroke';
import OlStyle from 'ol/style/Style';

export const defaultFeatureStyle = new OlStyle({
  fill: new OlStyleFill({
    color: 'rgba(255, 255, 255, 0.5)'
  }),
  stroke: new OlStyleStroke({
    color: 'rgba(73, 139, 170, 0.9)',
    width: 1
  }),
  image: new OlStyleCircle({
    radius: 6,
    fill: new OlStyleFill({
      color: 'rgba(255, 255, 255, 0.5)'
    }),
    stroke: new OlStyleStroke({
      color: 'rgba(73, 139, 170, 0.9)',
      width: 1
    })
  })
});

export const defaultHighlightStyle = new OlStyle({
  fill: new OlStyleFill({
    color: 'rgba(230, 247, 255, 0.8)'
  }),
  stroke: new OlStyleStroke({
    color: 'rgba(73, 139, 170, 0.9)',
    width: 1
  }),
  image: new OlStyleCircle({
    radius: 6,
    fill: new OlStyleFill({
      color: 'rgba(230, 247, 255, 0.8)'
    }),
    stroke: new OlStyleStroke({
      color: 'rgba(73, 139, 170, 0.9)',
      width: 1
    })
  })
});

export const defaultSelectStyle = new OlStyle({
  fill: new OlStyleFill({
    color: 'rgba(230, 247, 255, 0.8)'
  }),
  stroke: new OlStyleStroke({
    color: 'rgba(73, 139, 170, 0.9)',
    width: 2
  }),
  image: new OlStyleCircle({
    radius: 6,
    fill: new OlStyleFill({
      color: 'rgba(230, 247, 255, 0.8)'
    }),
    stroke: new OlStyleStroke({
      color: 'rgba(73, 139, 170, 0.9)',
      width: 2
    })
  })
});
