import expect from 'expect.js';
import MapBuilder from '../../src/Map/MapBuilder';
import Map from 'ol/map';

describe('MapBuilder', () => {
  let div;

  beforeEach(() => {
    div = document.createElement('div');
    document.body.appendChild(div);
    div.setAttribute('id', 'map');
  });

  afterEach(() => {
    div.parentNode.removeChild(div);
    div = null;
  });

  it('is defined', () => {
    expect(MapBuilder).not.to.be(undefined);
  });
  it('can be created', () => {
    let builder = new MapBuilder();
    expect(builder).not.to.be(undefined);
  });
  describe('#createMap', () => {
    it('is defined', () => {
      let builder = new MapBuilder();
      expect(builder.createMap).not.to.be(undefined);
    });
    it('returns an ol map', () => {
      let builder = new MapBuilder();
      let map = builder.createMap();

      expect(map).to.be.an(Map);
    });
    it('creates an ol map in a predefined div', () => {
      let builder = new MapBuilder();
      builder.createMap();

      let canvas = div.getElementsByTagName('canvas');

      expect(canvas).to.have.length(1);
    });
  });
});
